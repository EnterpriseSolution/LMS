using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Yokogawa.Data.Infrastructure.Entities.Base;
using Microsoft.EntityFrameworkCore;

namespace Yokogawa.Data.Infrastructure.Entities
{
    public abstract class AuditableEntity<TId> : Entity<TId>, IAuditable
    {
        private string _createdBy ;
        private DateTime _createdOn = DateTime.MinValue;

        [Required]
        public string CreatedBy {
            get { return _createdBy; } 
            set {
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
                   _createdOn  = value;
                }
            }  
        }

        public string UpdatedBy { set; get; }

        public DateTime? UpdatedOn { set; get; }
        public virtual void GetValuesForAudit(AuditEntry entry, DbContext dbContext = null)
        {
            
        }
    
    }
}
