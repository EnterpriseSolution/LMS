using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.WebAPI
{
    [AllowAnonymous]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RFIDCardController : ControllerBase
    {
        IRFIDCardService _cardService;
        IUserProfile Identity => this.HttpContext.User.GetUserAccount();
        public RFIDCardController(IRFIDCardService cardService)
        {
            _cardService = cardService;
        }

        [HttpPost]
        [Route("rfidcards")]
        public async Task<PagedCollection<RFIDCardDto>> GetRFIDCards(BaseFilter filter)
        {           
            return await _cardService.GetRFIDCards(filter);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetRFIDCard(Guid id)
        {
            var card = await _cardService.GetRFIDCard(id);          
            card.AllowEdit = id.Equals(Guid.Empty);
            return Ok(card);
        }

        [HttpGet]
        [Route("[action]/{cardNo}")]
        public bool Check(string cardNo)
        {
            return _cardService.CheckCard(cardNo);
        }

        [HttpPost]
        [Route("SaveRFIDCard")]
        public async Task<RFIDCardDto> SaveRFIDCard(RFIDCardDto rFIDCardDto)
        {
            return await _cardService.SaveRFIDCard(rFIDCardDto, Identity);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteRFIDCard(Guid id)
        {
            string result = "Deleted";
            try
            {
                await _cardService.DeleteRFIDCard(id, Identity);
            }
            catch (Exception e)
            {
                result = e.Message;
            }

            return Ok(result);
        }
    }
}
