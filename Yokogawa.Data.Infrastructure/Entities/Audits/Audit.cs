using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yokogawa.Data.Infrastructure.Entities
{
    public class Audit: Entity<Guid>
    {
        [Required]
        [StringLength(200)]
        public string TableName { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        [Required]
        [StringLength(50)]
        public string KeyValues { get; set; }
        [Required]
        public string Info { get; set; }

        [Required]
        [StringLength(50)]
        public string UserId { get; set; }

        [StringLength(150)]
        public string UserName { get; set; }

        [Required]
        [StringLength (50)]
        public string Action { get; set; }

    }
}
