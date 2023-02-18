import { getVesselScheduleList, getVesselScheduleMasterData, getTankListLOV } from "./vesselscheduleservice";
import { getWorkflowInfo, getStatusSummary } from "./VesselOrderService";

export default function () {
    return { getTankListLOV,getVesselScheduleMasterData, getVesselScheduleList, getWorkflowInfo, getStatusSummary };
};

  