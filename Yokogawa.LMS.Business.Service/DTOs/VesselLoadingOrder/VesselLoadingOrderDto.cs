using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs.VesselLoadingOrder;

namespace Yokogawa.LMS.Business.Service.DTOs.VesselLoadingOrder
{
    public class VesselLoadingOrderDto : AuditableDto, IVesselLoadingOrderDto
    {
        public string VesselLoadingOrderId { get; set; }
        public string OrderNo { get; set; }
        public string ShipmentNo { get; set; }
    
        public int OperationType { get; set; }
        public DateTime Eta { get; set; }
        public int SourceType { get; set; }
   
        public decimal OrderQty { get; set; }
        public decimal? LoadedQty { get; set; }
        public int Uom { get; set; }
        public string Destination { get; set; }
    
        public int Status { get; set; }
        public string Remarks { get; set; }
        public Guid Id { get; set; }

        public Guid VesselId { get; set; }
        public string St_VesselId { get; set; }
        public string VesselName { get; set; }

        public Guid ProductId { get; set; }
        public string St_ProductId { get; set; }
         public string ProductName { get; set; }

        public Guid? JettyId { get; set; }
        public string St_JettyId { get; set; }
        public string JettyNo { get; set; }

        public Guid? CustomerId { get; set; }
        public string St_CustomerId { get; set; }
        public string CustomerName { get; set; }
    }
    public class VesselLoadingOrderMasterData
    {
        public VesselLoadingOrderMasterData()
        {
            CustomerList = new List<VesselLoadingOrderMasterDataItem>();
            ProductList = new List<VesselLoadingOrderMasterDataItem>();
            VesselList = new List<VesselLoadingOrderMasterDataItem>();
            JettyList = new List<VesselLoadingOrderMasterDataItem>();
            
        }

        public List<VesselLoadingOrderMasterDataItem> VesselList { get; set; }

        public List<VesselLoadingOrderMasterDataItem> ProductList { get; set; }

        public List<VesselLoadingOrderMasterDataItem> JettyList { get; set; }

        public List<VesselLoadingOrderMasterDataItem> CustomerList { get; set; }


    }

    public class VesselLoadingOrderMasterDataItem
    {
        public string text { get; set; }

        public string value { get; set; }
    }
}
