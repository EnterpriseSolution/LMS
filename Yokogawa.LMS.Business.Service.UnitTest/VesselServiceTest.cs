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
    public class VesselServiceTest : BaseServiceTest
    {
        private ILogger<VesselService> _logger;

        [TestInitialize]
        public virtual void Initialize()
        {
            _logger = Mock.Of<ILogger<VesselService>>();
        }

        [TestMethod]
        public void GetVesselsTest()
        {
            VesselService vesselService = new VesselService(DbContext, _logger);
            BaseFilter filter = new BaseFilter();
            var tanks= vesselService.GetVessels(filter);
            Assert.IsTrue(tanks.Result.RowCount > 0);
        }

        [TestMethod]
        public void GetVesselTest()
        {
            VesselService vesselService = new VesselService(DbContext, _logger);
            Guid id = Guid.Empty;

            var vessel=vesselService.GetVessel(id);
            Assert.AreEqual(vessel.Id, id);

            id = Guid.Parse("b582013c-ec47-4455-a8a7-06c321bae087");
            vessel=vesselService.GetVessel(id);
            Assert.IsNotNull(vessel.Result.VesselName);
        }

        [TestMethod]
        public void CheckVesselTest()
        {
            VesselService vesselService = new VesselService(DbContext, _logger);
            bool notexist = vesselService.CheckVessel("TK555");
            bool exist = vesselService.CheckVessel("TK5554");
            Assert.IsTrue(notexist && !exist);
        }

        [TestMethod]
        public void SaveVesselTest()
        {
            VesselService vesselService = new VesselService(DbContext, _logger);
            VesselDto tankDto = new VesselDto()
            {
                VesselName = "FLX",
                VesselFlag = "Tiger",
                Status = true
            };
            var vessel= vesselService.SaveVessel(tankDto, User);
            Assert.IsNotNull(vessel);
        }

        [TestMethod]
        public void DeleteVesselTest()
        {
            VesselService vesselService = new VesselService(DbContext, _logger);
            Guid id =Guid.Parse("b582013c-ec47-4455-a8a7-06c321bae087");
            var vessel=vesselService.DeleteVessel(id, User);
            Assert.IsTrue(vessel.Id>0);
        }
    }
}
