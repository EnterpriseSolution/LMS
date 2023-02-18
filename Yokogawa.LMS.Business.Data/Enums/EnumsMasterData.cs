using System.ComponentModel;

namespace Yokogawa.LMS.Business.Data.Enums
{
    public enum TankType
    {
        [Description("Roof Tank")]
        RoofTank = 0,

        [Description("Sphere Tank")]
        SphereTank = 1
    }

    public enum TankStatus
    {
        [Description("Invalid")]
        Invalid = 0,

        [Description("Valid")]
        Valid = 1
    }

    public enum CardType
    {
        [Description("User Card")]
        User = 0,

        [Description("Company Card")]
        Company = 1,

        [Description("Credit Card")]
        Credit = 2
    }

    public enum CardStatus
    {
        [Description("Invalid")]
        Invalid = 0,

        [Description("Valid")]
        Valid = 1
    }

    public enum UOM
    {
        [Description("M³@15℃")]
        M3 = 1,

        [Description("M³@Obs.Temp")]
        M3Temp = 2,

        [Description("Litres@15℃")]
        L = 3,

        [Description("Litres@Obs.Temp")]
        LTemp = 4,

        [Description("MT")]
        MT = 5,

        [Description("Long Tons")]
        LT =6,

        [Description("US BBLs@60℉")]
        BBL = 7
    }  
}
