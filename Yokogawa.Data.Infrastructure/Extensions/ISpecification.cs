using System;
using System.Collections.Generic;
using System.Text;
using System.Linq.Expressions;

namespace Yokogawa.Data.Infrastructure.Extensions
{
    public interface ISpecification<T>
    {
        List<Expression<Func<T, bool>>> Criteria { get; }
        List<Expression<Func<T, object>>> Includes { get; }
        List<string> IncludeStrings { get; }
        Expression<Func<T, object>> OrderBy { get; }
        Expression<Func<T, object>> OrderByDescending { get; }
        string OrderByStringExpression { get; }

    }
}
