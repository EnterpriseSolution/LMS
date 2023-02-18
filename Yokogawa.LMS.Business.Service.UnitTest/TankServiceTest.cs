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
using Yokogawa.LMS.Business.Service.Projections;
using Yokogawa.LMS.Business.Services;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Exceptions;

namespace Yokogawa.LMS.Business.Service.UnitTest
{
    [TestClass]
    public class TankServiceTest: BaseServiceTest
    {
        private ILogger<TankService> _logger;

        [TestInitialize]
        public virtual void Initialize()
        {
            _logger = Mock.Of<ILogger<TankService>>();
        }

        [TestMethod]
        public void GetTanksTest()
        {
            TankService tankService = new TankService(DbContext, _logger);

            BaseFilter filter = new BaseFilter();
            var tanks= tankService.GetTanks(filter);
            Assert.IsTrue(tanks.Result.RowCount > 0);
        }

        [TestMethod]
        public void GetTankTest()
        {
            TankService tankService = new TankService(DbContext, _logger);
            Guid id = Guid.Empty;

            var tank=tankService.GetTank(id);
            Assert.AreEqual(tank.Result.Id, id);

            id = Guid.Parse("EAFA370D-5FD1-44CF-A43E-B6E9F98F7D9B");
            tank=tankService.GetTank(id);
            Assert.IsNotNull(tank.Result.TankNo);
        }

        [TestMethod]
        public void CheckTankTest()
        {
            TankService tankService = new TankService(DbContext, _logger);
            bool exist  = tankService.CheckTank("TK555");
            bool notexist = tankService.CheckTank("TK555X");
            Assert.IsTrue(notexist && !exist);
        }

        [TestMethod]
        public void SaveTankTest()
        {
            TankService tankService = new TankService(DbContext, _logger);
            TankDto tankDto = new TankDto()
            {
                TankNo = "TK1020",
                TankType = (int)TankType.RoofTank,
                Status = true
            };
            Task<TankDto> task = tankService.SaveTank(tankDto, User);
            Assert.IsNotNull(task);
        }

        [TestMethod]
        public void DeleteTankTest()
        {
            TankService tankService = new TankService(DbContext, _logger);
            Guid id =Guid.Parse("b582013c-ec47-4455-a8a7-06c321bae087");
            var result=tankService.DeleteTank(id, User);
            Assert.IsTrue(result.Id > 0);
        }
    }
}
