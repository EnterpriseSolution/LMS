using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.LMS.Platform.Data.DTOs;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IWidgetService
    {
        //Task<IEnumerable<WidgetDto>> GetWidgets(Guid websiteId, IUserProfile user);
        Task<IEnumerable<WidgetDto>> GetWidgetList(IUserProfile user, Guid websiteId);
        Task<WidgetDto> GetWidget(Guid id, Guid websiteId, IUserProfile user);
        Task<WidgetDto> SaveWidget(WidgetDto widget, IUserProfile user);
        Task DeleteWidget(Guid id, IUserProfile user);
        Task<WidgetDto> GetWidgetByName(string name, Guid websiteId, IUserProfile user);

    }
}
