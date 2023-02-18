using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Data.Infrastructure.Entities.Base;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.Extensions;

namespace Yokogawa.Data.Infrastructure.QueryObjects
{
    public static class GenericQuery
    {
        public static IQueryable<T> ExcludeDeletion<T>(this IQueryable<T> query) where T : ISoftDeleteEntity
        {
            return query.Where(p => p.IsDeleted == false);
        }

        public static IQueryable<T> OrderBy<T>(this IQueryable<T> query, string orderByExpressions)
        {
            if (string.IsNullOrEmpty(orderByExpressions))
                return query;

            string propertyName, orderByMethod;
            string[] expressions = orderByExpressions.Split(',');
            int index = 0;
            foreach (var orderByExpression in expressions) {
                string[] strs = orderByExpression.Split(' ');
                propertyName = strs[0];
                orderByMethod = index > 0 ? "ThenBy" : "OrderBy";
                if (strs.Length > 1)
                    orderByMethod += (strs[1].Equals("DESC", StringComparison.OrdinalIgnoreCase) ? "Descending" : "");

                ParameterExpression pe = Expression.Parameter(query.ElementType);
                MemberExpression me = Expression.Property(pe, propertyName);

                MethodCallExpression orderByCall = Expression.Call(typeof(Queryable), orderByMethod, new Type[] { query.ElementType, me.Type }, query.Expression
                    , Expression.Quote(Expression.Lambda(me, pe)));

                index++;
                query = query.Provider.CreateQuery(orderByCall) as IQueryable<T>;
            }

            return query;
        }
        public static IQueryable<T> GetQuery<T>(this IQueryable<T> query, IFilter filter) where T : class
        {
            Specification<T> specification = new Specification<T>(filter);
            return query.GetQuery<T>(specification);
        }
        public static IQueryable<T> GetQuery<T>(this IQueryable<T> query, ISpecification<T> specification) where T : class
        {
            // modify the IQueryable using the specification's criteria expression
            if (specification.Criteria.Count > 0)
            {
                foreach (Expression<Func<T, bool>> criteria in specification.Criteria)
                {
                    query = query.Where(criteria);
                }
            }

            // Includes all expression-based includes
            query = specification.Includes.Aggregate(query,
                                    (current, include) => current.Include(include));

            // Include any string-based include statements
            query = specification.IncludeStrings.Aggregate(query,
                                    (current, include) => current.Include(include));

            // Apply ordering if expressions are set
            if (specification.OrderBy != null)
            {
                query = query.OrderBy(specification.OrderBy);
            }
            else if (specification.OrderByDescending != null)
            {
                query = query.OrderByDescending(specification.OrderByDescending);
            }
            else if (!string.IsNullOrEmpty(specification.OrderByStringExpression)) {
                query = query.OrderBy(specification.OrderByStringExpression);
                
            }
            

            return query;
        }

        public static IQueryable<T> GetById<T>(this IQueryable<T> query, long id) where T : Entity<long>
        {
            return query.Where(o => o.Id == id);

        }

        public static IQueryable<T> GetById<T>(this IQueryable<T> query, int id) where T : Entity<int>
        {
            return query.Where(o => o.Id == id);

        }

        public static IQueryable<T> GetById<T>(this IQueryable<T> query, string id) where T : Entity<string>
        {
            return query.Where(o => o.Id == id);

        }

        public static IQueryable<T> GetById<T>(this IQueryable<T> query, Guid id) where T : Entity<Guid>
        {
            return query.Where(o => o.Id == id);

        }
    }
}
