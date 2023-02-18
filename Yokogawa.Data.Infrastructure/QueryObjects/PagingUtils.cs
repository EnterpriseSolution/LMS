using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.Common.Entities;
using AutoMapper;
using Yokogawa.Common.QueryObjects;
using Yokogawa.Common.DTOs;
using Yokogawa.Common.DTOs.Base;
using Yokogawa.Common.Entities.Base;


namespace Yokogawa.Common.QueryObjects
{
    public static class PagingUtils<TDto,TFilter> where TDto : BaseDto<long> where TFilter : BaseFilter
    {
        public static async Task<PagedCollectionDto<TDto>> ToPagedCollectionDtoAsync(IQueryable<TDto> query, TFilter filter) 
        {
            PagedCollectionDto<TDto> result = new PagedCollectionDto<TDto>();
            result.CurrentPageIndex = filter.CurrentPageIndex;
            result.PageSize = filter.PageSize;
            result.PageCount = filter.TotalPages;
            result.RowCount = filter.RowCount;
            result.Items = await query.ToListAsync<TDto>();
            return result;
        }
    }
}
