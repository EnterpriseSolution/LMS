using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class AgentProjection
    {
        public static Expression<Func<Agent, AgentDto>> AgentDto
        {
            get
            {
                return (m) => new AgentDto()
                {
                    Id = m.Id,
                    AgentId = m.Id.ToString(),
                    AgentName = m.AgentName,
                    AgentCode = m.AgentCode,
                    AgentCRNo = m.AgentCRNo,
                    Address = m.Address,
                    Country = m.Country,
                    PersonInCharge = m.PersonInCharge,
                    Mobile = m.Mobile,
                    PhoneO = m.PhoneO,
                    BillingAddress = m.BillingAddress,
                    BillingCountry = m.BillingCountry,
                    BillTelephone = m.BillTelephone,
                    Status = m.Status,
                    Remarks = m.Remarks
                }.GetAudit<AgentDto>(m);
            }
        }
    }
}
