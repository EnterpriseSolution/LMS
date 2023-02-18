using System;
using System.Collections.Generic;
using System.Text;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.Data.Infrastructure.Extensions
{
    public class Specification<T> : ISpecification<T>
    {
        public Specification(Expression<Func<T, bool>> criteria)
        {
            AddCriteria(criteria);
        }

        public Specification(IFilter f)
        {
           
            if (f != null)
            {
                var resultType = typeof(T);
                if (f.Criterias != null && f.Criterias.Count > 0)
                {
                    Expression<Func<T, bool>> predicate = f.Criterias.Count > 1 ? PredicateBuilder.False<T>() : null;
                    foreach (FilterCriteria criteria in f.Criterias)
                    {
                        var parameter = Expression.Parameter(resultType, "o");
                        var expression = ExpressionHelper.GetExpressionGroup(criteria, resultType, parameter);//ExpressionHelper.GetExpression(criteria,resultType,parameter);

                        var temp =expression!=null? Expression.Lambda<Func<T, bool>>(expression, new[] { parameter }): PredicateBuilder.True<T>();

                        if (predicate == null)
                        {
                            AddCriteria(temp);
                            break;
                        }

                        if (!string.IsNullOrEmpty(criteria.JoinOperator) && criteria.JoinOperator.ToUpper() == "AND")
                            predicate = predicate.And<T>(temp);
                        else
                            predicate = predicate.Or<T>(temp);
                        

                    }

                    if (predicate !=null)
                      AddCriteria(predicate);
                }

                if (!string.IsNullOrEmpty(f.OrderBy))
                {
                    if (f.OrderByMultipleCols)
                    {
                        OrderByStringExpression = f.OrderBy;
                    }
                    else {
                        var parameter = Expression.Parameter(resultType);
                        var property = Expression.Property(parameter, f.OrderBy);
                        var propAsObject = Expression.Convert(property, typeof(object));
                        Expression<Func<T, object>> orderByExp = Expression.Lambda<Func<T, object>>(propAsObject, parameter);

                        if (f.IsAscending)
                        {
                            OrderBy = orderByExp;
                        }
                        else
                        {
                            OrderByDescending = orderByExp;
                        }
                    }
                  
                }

            }
        }

        public List<Expression<Func<T, bool>>> Criteria { get; private set; } = new List<Expression<Func<T, bool>>>();
        public List<Expression<Func<T, object>>> Includes { get; } = new List<Expression<Func<T, object>>>();
        public List<string> IncludeStrings { get; } = new List<string>();
        public Expression<Func<T, object>> OrderBy { get; private set; }
        public Expression<Func<T, object>> OrderByDescending { get; private set; }
        public string OrderByStringExpression { get; private set; }
        public void AddCriteria(Expression<Func<T, bool>> criteria)
        {
            Criteria.Add(criteria);
        }
        public void AddInclude(Expression<Func<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }
        public void AddInclude(string includeString)
        {
            IncludeStrings.Add(includeString);
        }

      
        public void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
        {
            OrderBy = orderByExpression;
        }
        public void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression)
        {
            OrderByDescending = orderByDescendingExpression;
        }
    }
}
