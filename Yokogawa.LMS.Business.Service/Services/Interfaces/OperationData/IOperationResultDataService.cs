using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Business.Service.DTOs.OperationData;

namespace Yokogawa.LMS.Business.Service.Services.Interfaces.OperationData
{
    public interface IOperationResultDataService
    {
        bool SaveTruckLoadingResultData(TruckLoadingResultData truckLoadingResultData);
        bool SaveTruckUnloadingResultData(TruckUnloadingResultData truckUnloadingResultData);
        bool SaveVesselLoadingResultData(VesselLoadingResultData vesselLoadingResultData);
        bool SaveVesselDischargeResultData(VesselDischargeResultData vesselDischargeResultData);
        bool SavePipelineResultData(PipelineResultData pipelineResultData);
        bool SaveITTResultData(ITTResultData iTTResultData);

    }
}
