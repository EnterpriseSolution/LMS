using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using System.Reflection;
using Yokogawa.Data.Infrastructure;
using Yokogawa.Data.Infrastructure.Utils;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.Data.Infrastructure.Extensions
{
    public static class ExpressionHelper
    {        
        private static readonly MethodInfo ContainsMethod = typeof(DbFunctionsExtensions).GetMethod("Like",
            BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic,
            null,
            new[] { typeof(DbFunctions), typeof(string), typeof(string)},
            null);
        private static readonly MethodInfo StartsWithMethod = typeof(string).GetMethod("StartsWith", new[] { typeof(string) });
        private static readonly MethodInfo EndsWithMethod = typeof(string).GetMethod("EndsWith", new[] { typeof(string) });

        public static MemberExpression NestedExpressionProperty(Expression expression, string propertyName)
        {
            string[] parts = propertyName.Split('.');
            int partsL = parts.Length;

            return (partsL > 1)?
                Expression.Property(
                    NestedExpressionProperty(
                        expression,
                        parts.Take(partsL - 1)
                            .Aggregate((a, i) => a + "." + i)
                    ),
                    parts[partsL - 1])
                :Expression.Property(expression, propertyName);
        }

        public static Expression GetExpression(FilterCriteria criteria,Type type,ParameterExpression parameter)
        {
            Expression expression = null;
            try
            {
                if (string.IsNullOrEmpty(criteria.Field))
                    return expression;

                var property = NestedExpressionProperty(parameter, criteria.Field);//Expression.Property(parameter, criteria.Field);

               var isNullableProperty = property.Type.IsGenericType && property.Type.GetGenericTypeDefinition() == typeof(Nullable<>);
                MemberExpression hasValueExpression = isNullableProperty ? Expression.Property(property, "HasValue") : null;
                var targetValue = MapToType(property.Type, criteria.Value, criteria.Operator, criteria.UTCFlag);

                if (isNullableProperty)
                    property = Expression.Property(property, "Value");

                switch (criteria.Operator)
                {
                    case "isnull":
                    case "isempty":
                    case "eq":
                    case "==":
                        expression = Expression.Equal(property, targetValue);
                        break;
                    case "gt":
                    case ">":
                        expression = Expression.GreaterThan(property, targetValue);
                        break;
                    case "lt":
                    case "<":
                        expression =Expression.LessThan(property, targetValue);
                        break;
                    case "gte":
                    case ">=":
                        expression = Expression.GreaterThanOrEqual(property, targetValue);
                        break;
                    case "lte":
                    case "<=":
                        expression = Expression.LessThanOrEqual(property, targetValue);
                        break;
                    case "like":
                    case "contains":
                        expression = Expression.Call(ContainsMethod, Expression.Property(null, typeof(EF), nameof(EF.Functions)), property, targetValue);
                        break;
                    case "startswith":
                        expression = Expression.Call(property, StartsWithMethod, new[] { targetValue });
                        break;
                    case "doesnotstartswith":
                        expression = Expression.Call(property, StartsWithMethod, new[] { targetValue });
                        expression = Expression.IsFalse(expression);
                        break;
                    case "endswith":
                        expression = Expression.Call(property, EndsWithMethod, new[] { targetValue });
                        break;
                    case "doesnotendswith":
                        expression = Expression.Call(property, EndsWithMethod, new[] { targetValue });
                        expression = Expression.IsFalse(expression);
                        break;
                    case "isnotnull":
                    case "isnotempty":
                    case "neq":
                    case "!=":
                        expression = Expression.NotEqual(property, targetValue);
                        break;
                    default:
                        expression = null;
                        break;
                }

                if (isNullableProperty)
                    expression= Expression.AndAlso(hasValueExpression, expression);
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }
            
            

            return expression;

        }

        public static Expression GetExpressionGroup(FilterCriteria criteria, Type type, ParameterExpression parameter)
        {
            Expression leftExpression = null;
            try
            {
                if (criteria.Criterias.Count == 0)
                    return GetExpression(criteria, type, parameter);

                foreach (FilterCriteria item in criteria.Criterias)
                {
                    var temp = GetExpressionGroup(item, type, parameter);

                    if (temp!=null &&!string.IsNullOrEmpty(item.JoinOperator) && (item.JoinOperator.ToUpper() == "AND" || item.JoinOperator=="&&") && leftExpression != null)
                        leftExpression = Expression.AndAlso(leftExpression, temp);
                    else
                    if (temp != null && !string.IsNullOrEmpty(item.JoinOperator) && (item.JoinOperator.ToUpper() == "OR" || item.JoinOperator == "||") && leftExpression != null)
                        leftExpression = Expression.OrElse(leftExpression, temp);
                    else 
                        leftExpression = temp;
                }
                
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }



            return leftExpression;

        }

        public static ConstantExpression MapToType(Type valueType,object value,string filterOperator, bool utcFlag)
        {
            object targetValue = null;
            if (valueType.Name.ToLower() == "datetime")
            {
                targetValue = MappingUtil.ConvertStringToDateTime(value.ToString(), utcFlag);
            }
            else {
                switch (filterOperator.ToLower())
                {
                    case "like":
                    case "contains":
                        string searchedValue = value != null ? value.ToString() : string.Empty;
                        value = String.IsNullOrEmpty(searchedValue) ? "%" : ("%" + searchedValue + "%");
                        break;
                    case "isnotempty":
                    case "isempty":
                        value = valueType.Name.ToLower() == "string" ? string.Empty : null;
                        break;
                    case "isnotnull":
                    case "isnull":
                        value = null;
                        break;
                    default:
                        break;
                }

                targetValue = Convert.ChangeType(value, valueType);
            }
         

            return Expression.Constant(targetValue, valueType);
        }

    }
}
