using System.ComponentModel;

namespace Yokogawa.LMS.Business.Data.Enums
{
    public enum EnumOrderSourceTypeStatus
    {
        [Description("Manual")]
        Manual = 1,

        [Description("SAP")]
        SAP = 2
    }

    public enum EnumLMSOrderStatus
    {
        Cancelled = 0,
        Defined = 1,
        InProgress = 2,
        Completed = 3
    }
    public enum EnumTruckLoadingOrderStatus
    {
        Cancelled = 0,
        Defined = 1,
        Registered = 2,
        TareWeighted =3,
        Verified = 4,
        Loading = 5,
        LoadingCompleted = 6,
        GrossWeighted = 7,
        Completed = 8
    }
    public enum EnumTruckLoadingJobStatus
    {
        Defined = 1,
        Active = 2,
        LoadingEnd = 3
    }

    public enum EnumTruckUnloadingOrderStatus
    {
        [Description("Cancelled")]
        Cancelled = 0,

        [Description("Defined")]
        Defined = 1,

        [Description("Registered")]
        Registered = 2,

        [Description("Tare Weighted")]
        TareWeighted = 3,

        [Description("Verified")]
        Verified = 4,

        [Description("Unloading")]
        Unloading = 5,

        [Description("Gross Weighted")]
        GrossWeighted = 6,

        [Description("Completed")]
        Completed = 7
    }

    public enum EnumVesselDischargeOrderStatus
    {
        [Description("Cancelled")]
        Cancelled = 0,

        [Description("Defined")]
        Defined = 1,

        [Description("Registered")]
        Registered = 2,

        [Description("Tare Weighted")]
        TareWeighted = 3,

        [Description("Verified")]
        Verified = 4,

        [Description("Unloading")]
        Unloading = 5,

        [Description("Gross Weighted")]
        GrossWeighted = 6,

        [Description("Completed")]
        Completed = 7
    }
}
