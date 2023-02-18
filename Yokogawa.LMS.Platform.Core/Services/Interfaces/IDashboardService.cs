using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yokogawa.LMS.Platform.Core.DTOs;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.DTOs;
using Yokogawa.Data.Infrastructure.DTOs.Base;

namespace Yokogawa.LMS.Platform.Core.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<IEnumerable<DashboardDto>> GetDashboards(Guid websiteId, IUserProfile user);
        Task<DashboardDto> GetDashboard(Guid id, Guid websiteId, IUserProfile user);
        Task<DashboardDto> SaveDashboard(DashboardDto dashboardDto, IUserProfile user);
        Task DeleteDashboard(Guid id, IUserProfile user);

        Task<IEnumerable<ViewDto>> GetViews(Guid websiteId, IUserProfile user);
        Task<ViewDto> GetView(Guid id, Guid websiteId, IUserProfile user);
        Task<ViewDto> SaveView(ViewDto view, IUserProfile user);
        Task DeleteView(Guid id, IUserProfile user);
        Task<bool> PublicDashboard(Guid id, IUserProfile user);
    }
}
