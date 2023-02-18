using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.Data.Infrastructure.DTOs
{
    public class PagedCollection<T> where T : class
    {
        public void SetPagedCollection(IFilter filter)
        {
            PageCount = filter.TotalPages;
            CurrentPageIndex = filter.CurrentPageIndex;
            RowCount = filter.RowCount;
            PageSize = filter.PageSize;
        }

        public List<T> Items { get; set; } = new List<T>();
        public int PageCount { get; set; }
        public int CurrentPageIndex { get; set; }
        public int PageSize { get; set; }
        public int RowCount { get; set; }

    }
}
