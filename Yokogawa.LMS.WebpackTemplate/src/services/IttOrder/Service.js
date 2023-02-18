import { getIttOrderList, getIttOrderDetails, saveIttOrder, deleteIttOrder } from "./IttOrderService";
export default function () {
    return {
        getIttOrderList, getIttOrderDetails, saveIttOrder, deleteIttOrder
    };
};