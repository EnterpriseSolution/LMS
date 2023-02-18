using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace Yokogawa.Data.Infrastructure.DTOs.Base
{
    public interface IFilterPagingOption
    {
        int CurrentPageIndex { get; set; } 
        int PageSize { get; set; }
        int TotalPages { get; set; }
        int RowCount { get; set; }
        Task SetupPageInfoAsync<T>(IQueryable<T> query);
    }

    public interface IFilter
    {
        int CurrentPageIndex { get; set; }
        int PageSize { get; set; }
        int TotalPages { get; set; }
        int RowCount { get; set; }
        string OrderBy { get; set; }
        bool IsAscending { get; set; }
        bool OrderByMultipleCols { get; }
        List<FilterCriteria> Criterias { get; set; }
        Task SetupPageInfoAsync<T>(IQueryable<T> query);
        void SetupPageInfo<T>(IQueryable<T> query);

    }
}
