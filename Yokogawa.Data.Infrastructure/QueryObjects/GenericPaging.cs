using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.DTOs;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.Data.Infrastructure.QueryObjects
{
    public static class GenericPaging
    {
        public static IQueryable<T> Page<T>(
             this IQueryable<T> query,
             int pageIndex, int pageSize, IFilter filter)
        {
            if (pageSize == 0)
                return query;

            if (pageIndex > 1)
                query = query.Skip((pageIndex - 1) * pageSize);

            return query.Take(pageSize);
        }

        public static IQueryable<T> GetPerPage<T>(
             this IQueryable<T> query,
             int pageIndex, int pageSize)
        {
            if (pageSize == 0)
                return query;

            if (pageIndex > 1)
                query = query.Skip((pageIndex - 1) * pageSize);

            return query.Take(pageSize);
        }

        public static IQueryable<T> Page<T>(
           this IQueryable<T> query, IFilter filter)
        {
            filter.SetupPageInfo<T>(query);
            return query.GetPerPage<T>(filter.CurrentPageIndex, filter.PageSize);
        }

        public static async Task<IQueryable<T>> PageAsync<T>(
           this IQueryable<T> query, IFilter filter)
        {
            await filter.SetupPageInfoAsync<T>(query);
            return query.GetPerPage<T>(filter.CurrentPageIndex, filter.PageSize);

        }


        public static PagedCollection<T> ToPagedCollection<T>(this IQueryable<T> query, IFilter filter) where T : class
        {
            PagedCollection<T> result = new PagedCollection<T>();
            query.Page<T>(filter);
            result.SetPagedCollection(filter);
            result.Items = query.ToList<T>();
            return result;
        }

        public static PagedCollection<E> ToPagedCollection<T, E>(this IQueryable<T> query, IFilter filter, Expression<Func<T, E>> selector) where T : class where E : class
        {
            PagedCollection<E> result = new PagedCollection<E>();
            var list = query.Page<T>(filter).Select(selector);
            result.SetPagedCollection(filter);
            result.Items = list.ToList();
            return result;
        }

        public static async Task<PagedCollection<T>> ToPagedCollectionAsync<T>(this IQueryable<T> query, IFilter filter) where T : class
        {
            PagedCollection<T> result = new PagedCollection<T>();
            query = await query.PageAsync<T>(filter);
            result.SetPagedCollection(filter);
            result.Items = await query.ToListAsync<T>();
            return result;
        }

        public static async Task<PagedCollection<E>> ToPagedCollectionAsync<T, E>(this IQueryable<T> query, IFilter filter, Expression<Func<T, E>> selector) where E : class
        {
            PagedCollection<E> result = new PagedCollection<E>();
            query = await query.PageAsync<T>(filter);
            result.SetPagedCollection(filter);
            result.Items = await query.Select(selector).ToListAsync();
            return result;
        }
    }
   
}
