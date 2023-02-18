using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.Data.Infrastructure.Entities.Audits
{
    public abstract class AuditableExtensionEntity<TId> : Entity<TId>, IAuditableExtension
    {
        private string _createdBy;
        private DateTime _createdOn = DateTime.MinValue;

        [Required]
        public string CreatedBy
        {
            get { return _createdBy; }
            set
            {
                //Set one time only
                if (string.IsNullOrEmpty(CreatedBy))
                {
                    _createdBy = value;
                }
            }
        }
        [Required]
        public DateTime CreatedOn
        {
            get { return _createdOn; }
            set
            {
                //Set one time only
                if (_createdOn == DateTime.MinValue)
                {
                    _createdOn = value;
                }
            }
        }

        public string CreatedByName { set; get; }

        public string UpdatedBy { set; get; }

        public string UpdatedByName { set; get; }

        public DateTime? UpdatedOn { set; get; }
        public void GetValuesForAudit(AuditEntry entry, DbContext dbContext = null) { 

        }
    }
}
