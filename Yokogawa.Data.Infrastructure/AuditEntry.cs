using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.Data.Infrastructure.Entities.Base;

namespace Yokogawa.Data.Infrastructure
{
    public class AuditEntry
    {
        public AuditEntry(EntityEntry entry)
        {

            Entry = entry;
        }

        public List<AuditEntry> childEntries { get; set; }
        public EntityEntry Entry { get; }
        public string TableName { get; set; }
        public string KeyValues { get; set; }
        private string _tenantId { get; set; }
        public Dictionary<string, object> OldValues { get; } = new Dictionary<string, object>();
        public Dictionary<string, object> NewValues { get; } = new Dictionary<string, object>();
        public List<PropertyEntry> TemporaryProperties { get; } = new List<PropertyEntry>();
        public EnumActions Action { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }

        public DateTime UpdatedOn { get; set; }
        public bool HasTemporaryProperties => TemporaryProperties.Any();

        private List<string> _tenantFields = new List<string>();

        public void setTenantFields(List<string> tenantFields) {
            _tenantFields = tenantFields;
        }

        public void getTenantId(PropertyEntry property) {
            if (_tenantFields.Count() == 0)
                return;

            if (string.IsNullOrEmpty(_tenantId) && _tenantFields.Contains(property.Metadata.Name))
                _tenantId = property.CurrentValue!=null? property.CurrentValue.ToString():"";  
        }

        public Audit ToAudit()
        {
            var audit = new Audit();
            audit.TableName = TableName;
            audit.Timestamp = UpdatedOn;
            audit.Action = Action.ToString();
            audit.UserId = UserId;
            audit.UserName = UserName;
            audit.KeyValues = KeyValues;
            audit.Info = ToInfo();

            if (_tenantFields.Count() > 0) {
                if (string.IsNullOrEmpty(_tenantId))
                {
                    foreach (string fieldname in _tenantFields)
                    {
                        if (NewValues.ContainsKey(fieldname))
                        {
                            _tenantId = NewValues[fieldname].ToString();
                            break;
                        }
                    }

                    _tenantId = string.IsNullOrEmpty(_tenantId) ? Guid.Empty.ToString() : _tenantId;
                }

                audit.TableName += "_" + _tenantId;
            }
      

            return audit;
        }

        public string ToInfo()
        {
            switch (Action)
            {
                case EnumActions.Added:
                    {
                        StringBuilder sb = new StringBuilder();
                        sb.AppendLine(ToJsonString(NewValues));
                        if (childEntries != null)
                        {
                            foreach (var child in childEntries)
                            {
                                sb.AppendLine(child.ToChildInfo());
                            }
                        }
                        sb.Append(" Added");
                        return sb.ToString();
                    }
                case EnumActions.Modified:
                    {
                        StringBuilder sb = new StringBuilder();
                     
                        foreach (string key in OldValues.Keys)
                        {
                            sb.AppendLine(string.Format("[{0}] updated from {1} to {2}", key, ToJsonString(OldValues[key]), ToJsonString(NewValues[key])));
                        }
                       
                        if (childEntries != null)
                        {
                            foreach (var child in childEntries)
                            {
                                sb.AppendLine(child.ToChildInfo());
                            }
                        }

                        if(string.IsNullOrEmpty(sb.ToString().Trim()))
                        {
                            return string.Format("{0}#{1}: {2}", TableName, KeyValues, "No Changes");
                        }

                        return string.Format("{0}#{1}: {2}", TableName, KeyValues, sb.ToString());
                    }
                case EnumActions.Deleted:
                    {
                        StringBuilder sb = new StringBuilder();
                        
                        sb.AppendLine(string.Format("{0}#{1}: {2} has been deleted", TableName, KeyValues, ToJsonString(OldValues)));
                        return sb.ToString();
                    }
                case EnumActions.SoftDeleted:
                    {
                        StringBuilder sb = new StringBuilder();

                        sb.AppendLine(string.Format("{0}#{1} has been deleted", TableName, KeyValues));
                        return sb.ToString();
                    }
                default:
                    {
                        return string.Empty;
                    }
            }
        }

        private string ToJsonString(object obj)
        {
            string str = string.Empty;

            if (obj != null)
            {
                JsonConvert.DefaultSettings = () => new JsonSerializerSettings
                {
                    Formatting = Formatting.Indented,
                };

                str = JsonConvert.SerializeObject(obj);
            }
            else
            {
                str = "null";
            }

            return str;
        }
        public string ToChildInfo()
        {
            switch (Action)
            {
                case EnumActions.Added:
                    {
                        StringBuilder sb = new StringBuilder();
                     
                        sb.AppendLine(string.Format("/---{0} #New {1} added---/", TableName, ToJsonString(NewValues)));
                        
                        return sb.ToString(); 
                    }
                case EnumActions.Modified:
                    {
                        StringBuilder sb = new StringBuilder();

                        foreach (string key in OldValues.Keys)
                        {
                            sb.AppendLine(string.Format("[{0}] updated from {1} to {2}", key, ToJsonString(OldValues[key]), ToJsonString(NewValues[key])));
                        }

                        if (childEntries != null)
                        {
                            foreach (var child in childEntries)
                            {
                                sb.AppendLine(child.ToChildInfo());
                            }
                        }

                        if(!string.IsNullOrEmpty(sb.ToString().Trim()))
                        {
                            return string.Format("/---{0}#{1}: {2}---/", TableName, KeyValues, sb.ToString());
                        }

                        return sb.ToString();
                    }
                case EnumActions.Deleted:
                    {
                        StringBuilder sb = new StringBuilder();
                        //sb.AppendLine(string.Format("{0} with id {1} has been deleted", TableName, KeyValues));
                        sb.AppendLine(string.Format("/---{0}#{1}: {2} has been deleted---/", TableName, KeyValues, ToJsonString(OldValues)));
                        return sb.ToString();
                    }
                case EnumActions.SoftDeleted:
                    {
                        StringBuilder sb = new StringBuilder();

                        sb.AppendLine(string.Format("/---{0}#{1} has been deleted---/", TableName, KeyValues));
                        return sb.ToString();
                    }
                default:
                    {
                        return string.Empty;
                    }
            }
        }
    }
}
