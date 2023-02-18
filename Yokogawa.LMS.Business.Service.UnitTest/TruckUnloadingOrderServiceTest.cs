using System;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using NSubstitute;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.LMS.Business.Data.Commands;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Data.Enums;
using Yokogawa.LMS.Business.Service.DTOs;
using Yokogawa.LMS.Business.Service.DTOs.TruckUnloading;
using Yokogawa.LMS.Business.Service.Projections;
using Yokogawa.LMS.Business.Service.Services.TruckLoading;
using Yokogawa.LMS.Business.Services;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Exceptions;

namespace Yokogawa.LMS.Business.Service.UnitTest
{
    [TestClass]
    public class TruckUnloadingOrderServiceTest : BaseServiceTest
    {
        private ILogger<TruckUnloadingOrderService> _logger;

        [TestInitialize]
        public virtual void Initialize()
        {
            _logger = Mock.Of<ILogger<TruckUnloadingOrderService>>();
        }

        [TestMethod]
        public void GetOdTruckUnLoadingOrdersTest()
        {
            TruckUnloadingOrderService truckUnloadingOrderService = new TruckUnloadingOrderService(DbContext, _logger);

            BaseFilter filter = new BaseFilter();
            var tanks= truckUnloadingOrderService.GetOdTruckUnLoadingOrders(filter);
            Assert.IsTrue(tanks.Result.RowCount > 0);
        }

        [TestMethod]
        public void GetOdTruckUnLoadingOrderTest()
        {
            TruckUnloadingOrderService truckUnloadingOrderService = new TruckUnloadingOrderService(DbContext, _logger);
            Guid id = Guid.Empty;

            var tank=truckUnloadingOrderService.GetOdTruckUnLoadingOrder(id);
            Assert.AreEqual(tank.Result.Id, id);

            id = Guid.Parse("EAFA370D-5FD1-44CF-A43E-B6E9F98F7D9B");
            tank=truckUnloadingOrderService.GetOdTruckUnLoadingOrder(id);
            Assert.IsNotNull(tank.Result.OrderNo);
        }

        [TestMethod]
        public void CheckOrderExistTest()
        {
            TruckUnloadingOrderService truckUnloadingOrderService = new TruckUnloadingOrderService(DbContext, _logger);
            bool exist  = truckUnloadingOrderService.CheckOrderExist("TU_20211111_01");
            bool notexist = truckUnloadingOrderService.CheckOrderExist("TU_20211111_999");
            Assert.IsTrue(notexist && !exist);
        }

        [TestMethod]
        public void SaveOdTruckUnLoadingOrderTest()
        {
            TruckUnloadingOrderService truckUnloadingOrderService = new TruckUnloadingOrderService(DbContext, _logger);
            OdTruckUnloadingOrderDto odTruckUnloadingOrderDto = new OdTruckUnloadingOrderDto()
            {
                OrderNo = "TU_20211111_01", 
                SourceType= (int)TankType.RoofTank
            };
            Task<OdTruckUnloadingOrderDto> task = truckUnloadingOrderService.SaveOdTruckUnLoadingOrder(odTruckUnloadingOrderDto, User);
            Assert.IsNotNull(task);
        }

        [TestMethod]
        public void DeleteOdTruckUnLoadingOrderTest()
        {
            TruckUnloadingOrderService tankService = new TruckUnloadingOrderService(DbContext, _logger);
            Guid id =Guid.Parse("b582013c-ec47-4455-a8a7-06c321bae087");
            var result=tankService.DeleteOdTruckUnLoadingOrder(id, User);
            Assert.IsTrue(result.Id > 0);
        }
    }
}
