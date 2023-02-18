using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Service.DTOs.OperationData;
using Yokogawa.LMS.Business.Service.Services.Interfaces.OperationData;
using System.Linq;

namespace Yokogawa.LMS.Business.Service.Services.OperationData
{
    public class OperationResultDataService : IOperationResultDataService
    {
        private LMSDBContext _dbContext;
        private readonly ILogger<OperationResultDataService> _logger;

        public OperationResultDataService(LMSDBContext dbContext, ILogger<OperationResultDataService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public bool SaveTruckLoadingResultData(TruckLoadingResultData truckLoadingResultData)
        {
            var truckLoadingJob = _dbContext.OdTruckLoadingJobs.FirstOrDefault(en => en.JobNo == truckLoadingResultData.JobNo);
            if (truckLoadingJob == null)
                return false;

            if (!ValidateStatus(truckLoadingJob.Status))
                return false;

            truckLoadingJob.LoadedQty = truckLoadingResultData.ActualQty;
            truckLoadingJob.UpdatedOn = truckLoadingResultData.OperationTime;

            _dbContext.SaveChangesAsync();

            return true;
        }

        public bool SaveTruckUnloadingResultData(TruckUnloadingResultData truckUnloadingResultData)
        {
            var truckUnLoadingOrder = _dbContext.OdTruckUnloadingOrders.FirstOrDefault(en => en.OrderNo == truckUnloadingResultData.OrderNo);
            if (truckUnLoadingOrder == null)
                return false;

            if (!ValidateStatus(truckUnLoadingOrder.Status))
                return false;

            truckUnLoadingOrder.UnloadingQty = truckUnloadingResultData.ActualQty;
            truckUnLoadingOrder.UpdatedOn = truckUnloadingResultData.OperationTime;

            _dbContext.SaveChangesAsync();

            return true;
        }

        public bool SaveVesselLoadingResultData(VesselLoadingResultData vesselLoadingResultData)
        {
            var vesselLoadingOrder = _dbContext.OdVesselLoadingOrders.FirstOrDefault(en => en.OrderNo == vesselLoadingResultData.OrderNo);
            if (vesselLoadingOrder == null)
                return false;

            if (!ValidateStatus(vesselLoadingOrder.Status))
                return false;

            vesselLoadingOrder.LoadedQty = vesselLoadingResultData.ActualQty;
            vesselLoadingOrder.UpdatedOn = vesselLoadingResultData.OperationTime;

            _dbContext.SaveChangesAsync();

            return true;
        }

        public bool SaveVesselDischargeResultData(VesselDischargeResultData vesselDischargeResultData)
        {
            var vesselDischargeOrder = _dbContext.OdVesselDischargeOrders.FirstOrDefault(en => en.OrderNo == vesselDischargeResultData.OrderNo);
            if (vesselDischargeOrder == null)
                return false;

            if (!ValidateStatus(vesselDischargeOrder.Status))
                return false;

            vesselDischargeOrder.LoadedQty = vesselDischargeResultData.ActualQty;
            vesselDischargeOrder.UpdatedOn = vesselDischargeResultData.OperationTime;

            _dbContext.SaveChangesAsync();

            return true;
        }

        public bool SavePipelineResultData(PipelineResultData pipelineResultData)
        {
            //var vesselDischargeOrder = _dbContext.OdVesselDischargeOrders.FirstOrDefault(en => en.OrderNo == vesselDischargeResultData.OrderNo);
            //if (vesselDischargeOrder == null)
            //    return false;

            //if (!ValidateStatus(vesselDischargeOrder.Status))
            //    return false;

            //vesselDischargeOrder.LoadedQty = vesselDischargeResultData.ActualQty;
            //vesselDischargeOrder.UpdatedOn = vesselDischargeResultData.OperationTime;

            //_dbContext.SaveChangesAsync();

            return true;
        }

        public bool SaveITTResultData(ITTResultData iTTResultData)
        {
            //var vesselDischargeOrder = _dbContext.OdVesselDischargeOrders.FirstOrDefault(en => en.OrderNo == vesselDischargeResultData.OrderNo);
            //if (vesselDischargeOrder == null)
            //    return false;

            //if (!ValidateStatus(vesselDischargeOrder.Status))
            //    return false;

            //vesselDischargeOrder.LoadedQty = vesselDischargeResultData.ActualQty;
            //vesselDischargeOrder.UpdatedOn = vesselDischargeResultData.OperationTime;

            //_dbContext.SaveChangesAsync();

            return true;
        }
        #region Validation
        private bool ValidateStatus(int currentStauts)
        {
            return true;
        }
        #endregion
    }
}
