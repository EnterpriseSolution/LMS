using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Yokogawa.Data.Infrastructure.Entities.Base
{
    public class SoftDeleteEntity<TId> : Entity<TId>, ISoftDeleteEntity
    {
        public bool IsDeleted { set; get; }
    }
}
