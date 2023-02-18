import { getOdTruckLoadingOrderList, getOdTruckLoadingOrderDetails, saveOdTruckLoadingOrder, deleteOdTruckLoadingOrder} from "./OdTruckLoadingOrderService";

import { getOdTruckLoadingJobList, getOdTruckLoadingJobDetails, saveOdTruckLoadingJob, deleteOdTruckLoadingJob } from "./OdTruckLoadingJobService";
export default function () {
    return {
        getOdTruckLoadingOrderList, getOdTruckLoadingOrderDetails, saveOdTruckLoadingOrder, deleteOdTruckLoadingOrder,
        getOdTruckLoadingJobList, getOdTruckLoadingJobDetails, saveOdTruckLoadingJob, deleteOdTruckLoadingJob
    };
};