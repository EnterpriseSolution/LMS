using System;
using System.Linq.Expressions;
using Yokogawa.Data.Infrastructure.Extensions;
using Yokogawa.LMS.Business.Data.Entities;
using Yokogawa.LMS.Business.Service.DTOs;

namespace Yokogawa.LMS.Business.Service.Projections
{
    public class CustomerProjection
    {
        public static Expression<Func<Customer, CustomerDto>> CustomerDto
        {
            get
            {
                return (m) => new CustomerDto()
                {
                    Id = m.Id,
                    CustomerName=m.CustomerName,
                    CustomerId = m.Id.ToString(),
                    CustomerCode = m.CustomerCode,
                    CustomerAlias = m.CustomerAlias,
                    CustomerCRNo = m.CustomerCRNo,
                    Address = m.Address,
                    Country = m.Country,
                    PersonInCharge = m.PersonInCharge,
                    Mobile = m.Mobile,
                    PhoneO = m.PhoneO,
                    PhoneR = m.PhoneR,
                    Fax = m.Fax,
                    BillingAddress = m.BillingAddress,
                    BillingCountry = m.BillingCountry,
                    BillTelephone = m.BillTelephone,
                    Status = m.Status,
                    Remarks = m.Remarks
                }.GetAudit<CustomerDto>(m);
            }
        }
    }
}
