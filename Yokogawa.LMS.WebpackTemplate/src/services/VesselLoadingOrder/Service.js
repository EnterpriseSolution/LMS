import { getVesselLoadingOrderList, getVesselLoadingOrderDetails, saveVesselLoadingOrder, deleteVesselLoadingOrder } from "./VesselLoadingOrderService";
export default function () {
    return {
        getVesselLoadingOrderList, getVesselLoadingOrderDetails, saveVesselLoadingOrder, deleteVesselLoadingOrder
    };
};