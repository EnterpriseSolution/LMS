import { getVesselDischargeOrderList, getVesselDischargeOrderDetails, saveVesselDischargeOrder, deleteVesselDischargeOrder, checkVesselDischargeOrderExist } from "./VesselDischargeOrderService";

export default function () {     
    return {             
        getVesselDischargeOrderList, getVesselDischargeOrderDetails, saveVesselDischargeOrder, deleteVesselDischargeOrder, checkVesselDischargeOrderExist
    };
};

  