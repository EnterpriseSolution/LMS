import { getTruckUnloadingOrderList, getTruckUnloadingOrderDetails, saveTruckUnloadingOrder, deleteTruckUnloadingOrder, checkTruckUnloadingOrderExist } from "./TruckUnLoadingOrderService";

export default function () {     
    return {             
        getTruckUnloadingOrderList, getTruckUnloadingOrderDetails, saveTruckUnloadingOrder, deleteTruckUnloadingOrder, checkTruckUnloadingOrderExist
    };
};

  