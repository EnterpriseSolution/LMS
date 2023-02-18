using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs.TruckUnloading;

namespace Yokogawa.LMS.Business.Service.DTOs.TruckUnloading
{   
    public class OdTruckUnloadingOrderDto : AuditableDto, IOdTruckUnloadingOrder 
    {
        public Guid Id { get; set; }
        public string OrderNo { get; set; }
        public string UnloadingDate { get; set; }
        public int SourceType { get; set; }
        public string CustomerId { get; set; }
        public string ProductId { get; set; }
        public decimal OrderQty { get; set; }
        public decimal? UnloadingQty { get; set; }
        public int UOM { get; set; }
        public string CarrierId { get; set; }
        public string TruckId { get; set; }
        public string FrontLicense { get; set; }
        public string RearLicense { get; set; }
        public string CardId { get; set; }
        public string DriverId { get; set; }
        public string BayNo { get; set; }
        public int Status { get; set; }
        public string Remarks { get; set; }
        public bool IsDeleted { get; set; }

        public string SourceTypeDescription { get; set; }   

        public string UOMDescription { get; set; }

        public string StatusDescription { get; set; }

        public string CustomerName { get; set; }

        public string ProductName { get; set; }

        public bool AllowEdit { get; set; }
    }

    public class TruckUnloadingOrderMasterData
    {
        public TruckUnloadingOrderMasterData()
        {
            CustomerList = new List<TruckUnloadingOrderMasterDataItem>();
            ProductList = new List<TruckUnloadingOrderMasterDataItem>();
            CarrierList = new List<TruckUnloadingOrderMasterDataItem>();
            TruckList = new List<TruckUnloadingOrderMasterDataItem>();
            CardList = new List<TruckUnloadingOrderMasterDataItem>();
            DriverList = new List<TruckUnloadingOrderMasterDataItem>();
        }

        public List<TruckUnloadingOrderMasterDataItem> CustomerList { get; set; }

        public List<TruckUnloadingOrderMasterDataItem> ProductList { get; set; }

        public List<TruckUnloadingOrderMasterDataItem> CarrierList { get; set; }

        public List<TruckUnloadingOrderMasterDataItem> TruckList { get; set; }

        public List<TruckUnloadingOrderMasterDataItem> CardList { get; set; }

        public List<TruckUnloadingOrderMasterDataItem> DriverList { get; set; }
    }

    public class TruckUnloadingOrderMasterDataItem
    {
        public string text { get; set; }

        public string value { get; set; }
    }
}
