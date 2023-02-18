using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.Data.Infrastructure.DTOs.Base
{
    public class FilterCriteria
    {
        [JsonProperty(PropertyName = "field")]
        public string Field { get; set; }
        [JsonProperty(PropertyName = "operator")]
        public string Operator { get; set; }
        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
        //[JsonProperty(PropertyName = "valueType")]
        //public string ValueType { get; set; }
        [JsonProperty(PropertyName = "joinoperator")]
        public string JoinOperator { get; set; }
        [JsonProperty(PropertyName = "utc")]
        public bool UTCFlag { get; set; } = true;
        [JsonProperty(PropertyName = "criterias")]
        public List<FilterCriteria> Criterias { get; set; } = new List<FilterCriteria>();
    }

    public class BaseFilter:IFilter
    {
        public long? Id { set; get; }
        public string QuickSearch { set; get; }
        public List<FilterCriteria> Criterias { get; set; } = new List<FilterCriteria>();
        public int CurrentPageIndex { get; set; } = 0;
        public int PageSize { get; set; } = 0;
        public int TotalPages { get; set; } = 0;
        public int RowCount { get; set; } = 0;
        public string OrderBy { get; set; }
        public bool IsAscending { get; set; }
        public bool OrderByMultipleCols { 
            get {
                return OrderBy.Split(',').Length > 1;
            } 
        }
        public object Clone()
        {
            var jsonString = JsonConvert.SerializeObject(this);
            return JsonConvert.DeserializeObject(jsonString, this.GetType());
        }

        protected void computePageInfo()
        {
            PageSize = PageSize == 0 ? (RowCount == 0 ? 1 : RowCount) : PageSize;

            TotalPages = (int)Math.Ceiling(
                (double)(RowCount) / PageSize);
            CurrentPageIndex = Math.Min(
                Math.Max(1, CurrentPageIndex), TotalPages);
        }

        public async Task SetupPageInfoAsync<T>(IQueryable<T> query)
        {
            RowCount = await query.CountAsync();
            computePageInfo();

        }

        public void SetupPageInfo<T>(IQueryable<T> query)
        {
            RowCount = query.Count();
            computePageInfo();
        }



    }
}
