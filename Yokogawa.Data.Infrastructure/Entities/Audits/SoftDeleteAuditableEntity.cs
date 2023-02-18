using System;
using System.Collections.Generic;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.Data.Infrastructure.Entities
{
    public class SoftDeleteAuditableEntity<TId> : AuditableEntity<TId>, ISoftDeleteEntity
    {
        public bool IsDeleted { set; get; }
    }
}
