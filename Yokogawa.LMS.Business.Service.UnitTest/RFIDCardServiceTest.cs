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
    public class RFIDCardServiceTest : BaseServiceTest
    {
        private ILogger<RFIDCardService> _logger;

        [TestInitialize]
        public virtual void Initialize()
        {
            _logger = Mock.Of<ILogger<RFIDCardService>>();
        }

        [TestMethod]
        public void GetRFIDCardsTest()
        {
            RFIDCardService rfidCardService = new RFIDCardService(DbContext, _logger);
            BaseFilter filter = new BaseFilter();
            var rfidCards= rfidCardService.GetRFIDCards(filter);
            Assert.IsTrue(rfidCards.Result.RowCount > 0);
        }

        [TestMethod]
        public void GetRFIDCardTest()
        {
            RFIDCardService rfidCardService = new RFIDCardService(DbContext, _logger);
            Guid id = Guid.Empty;

            var rfidCard= rfidCardService.GetRFIDCard(id);
            Assert.AreEqual(rfidCard.Id, id);

            id = Guid.Parse("b582013c-ec47-4455-a8a7-06c321bae087");
            rfidCard= rfidCardService.GetRFIDCard(id);
            Assert.IsNotNull(rfidCard.Result.CardNo);
        }

        [TestMethod]
        public void CheckRFIDCardTest()
        {
            RFIDCardService rfidCardService = new RFIDCardService(DbContext, _logger);
            bool notexist = rfidCardService.CheckCard("TK555");
            bool exist = rfidCardService.CheckCard("TK5554");
            Assert.IsTrue(notexist && !exist);
        }

        [TestMethod]
        public void SaveRFIDCardTest()
        {
            RFIDCardService rfidCardService = new RFIDCardService(DbContext, _logger);
            RFIDCardDto rfidCardDto = new RFIDCardDto()
            {
                CardNo = "TK1020",
                CardType = (int)CardType.Credit,
                Status = true
            };
            var rfidCard = rfidCardService.SaveRFIDCard(rfidCardDto, User);
            Assert.IsNotNull(rfidCard);
        }

        [TestMethod]
        public void DeleteRFIDCardTest()
        {
            RFIDCardService rfidCardService = new RFIDCardService(DbContext, _logger);
            Guid id =Guid.Parse("b582013c-ec47-4455-a8a7-06c321bae087");
            var card=rfidCardService.DeleteRFIDCard(id, User);
            Assert.IsTrue(card.Id > 0);
        }
    }
}
