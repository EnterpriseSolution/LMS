using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Data.DTOs.IttOrder;
namespace Yokogawa.LMS.Business.Service.DTOs.IttOrder
{
    public class IttOrderDto : AuditableDto, IIttOrderDto
    {
        public string OrderNo {get;set;}
        public Guid FromCustomerId {get;set;}
        public string St_FromCustomerId { get; set; }
        public string FromCustomerName { get; set; }
        public Guid FromTankId {get;set;}
        public string St_FromTankId {get;set;}
        public string FromTankNo { get; set; }
        public Guid ToCustomerId {get;set;}
        public string St_ToCustomerId {get;set;}
        public string ToCustomerName { get; set; }
        public Guid ToTankId {get;set;}
        public string St_ToTankId {get;set;}
        public string ToTankNo { get; set; }
        public Guid FinalProductId {get;set;}
        public string St_FinalProductId {get;set;}
        public string FinalProductName { get; set; }
        public DateTime DeliveryDate {get;set;}
        public int SourceType {get;set;}
        public int Status {get;set;}
        public decimal OrderQty {get;set;}
        public decimal? TransferredQty {get;set;}
        public int Uom {get;set;}
        public string Remarks {get;set;}
        public Guid Id {get;set;}
   }
    public class IttOrderMasterData
    {
        public IttOrderMasterData()
        {
            CustomerList = new List<IttOrderMasterDataItem>();
            ProductList = new List<IttOrderMasterDataItem>();
            TankList = new List<IttOrderMasterDataItem>();

        }

       

        public List<IttOrderMasterDataItem> ProductList { get; set; }

        public List<IttOrderMasterDataItem> TankList { get; set; }

        public List<IttOrderMasterDataItem> CustomerList { get; set; }


    }

    public class IttOrderMasterDataItem
    {
        public string text { get; set; }

        public string value { get; set; }
    }
}
