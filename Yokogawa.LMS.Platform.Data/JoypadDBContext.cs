using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Yokogawa.Data.Infrastructure;
using Yokogawa.LMS.Platform.Data.Entities;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Platform.Data.Configuration;
using System.Threading.Tasks;

namespace Yokogawa.LMS.Platform.Data
{
    public class JoypadDBContext: GenericDbContext
    {
        public JoypadDBContext(DbContextOptions options) : base(options)
        {
             _tenantFields.AddRange(new string[] { "DefaultWebsiteId","WebsiteId" });
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ADUser> ADUsers { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Dashboard> Dashboards { get; set; }
        public DbSet<DashboardView> DashboardViews { get; set; }
        public DbSet<DashboardSharing> DashboardSharings { get; set; }
        public DbSet<DashboardSharedUser> DashboardSharedUsers { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<ModulePermission> ModulePermissions { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RoleWidgetSetting> RoleWidgetSettings { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserOTPSetting> UserOTPSettings { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<ResourceFile> ResourceFiles { get; set; }

        public DbSet<SFAProvider> SFAProviders { get; set; }
        public DbSet<SFASetting> SFASettings { get; set; }
        public DbSet<TrustDomain> TrustDomains { get; set; }

        public DbSet<View> Views { get; set; }
        public DbSet<ViewRole> ViewRoles { get; set; }

        public DbSet<V_ActiveUser> V_ActiveUsers { get; set; }
        public DbSet<V_Parent> V_Parents{ get; set; }
        public DbSet<V_UserDashboard> V_UserDashboards { get; set; }
        public DbSet<V_UserDashboardPage> V_UserDashboardPages { get; set; }
        public DbSet<V_UserPage> V_UserPages { get; set; }
        public DbSet<V_UserPortal> V_UserPortals { get; set; }
        public DbSet<V_UserWidget> V_UserWidgets { get; set; }
        public DbSet<V_UserSFASetting> V_UserSFASettings { get; set; }
        public DbSet<V_RoleWebsite> V_RoleWebsites { get; set; }
        public DbSet<V_RoleWebsiteWidgetSetting> V_RoleWebsiteWidgetSettings { get; set; }
        public DbSet<V_WebsiteMenu> V_WebsiteMenus { get; set; }
        public DbSet<Website> Websites { get; set; }
        public DbSet<Widget> Widgets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Audit>(new AuditConfiguration().Configure);
            modelBuilder.Entity<User>(new UserConfiguration().Configure);
            modelBuilder.Entity<ADUser>(new ADUserConfiguration().Configure);
            modelBuilder.Entity<UserRole>(new UserRoleConfiguration().Configure);
            modelBuilder.Entity<UserOTPSetting>(new UserOTPSettingConfiguration().Configure);
            modelBuilder.Entity<Client>(new ClientConfiguration().Configure);
            modelBuilder.Entity<Contact>(new ContactConfiguration().Configure);
            modelBuilder.Entity<Dashboard>(new DashboardConfiguration().Configure);
            modelBuilder.Entity<DashboardView>(new DashboardViewConfiguration().Configure);
            modelBuilder.Entity<DashboardSharing>(new DashboardSharingConfiguration().Configure);
            modelBuilder.Entity<DashboardSharedUser>(new DashboardSharedUserConfiguration().Configure);
            modelBuilder.Entity<Menu>(new MenuConfiguration().Configure);
            modelBuilder.Entity<Page>(new PageConfiguration().Configure);
            modelBuilder.Entity<Permission>(new PermissionConfiguration().Configure);
            modelBuilder.Entity<ModulePermission>(new ModulePermissionConfiguration().Configure);
            modelBuilder.Entity<RefreshToken>(new RefreshTokenConfiguration().Configure);
            modelBuilder.Entity<ResourceFile>(new ResourceFileConfiguration().Configure);
            modelBuilder.Entity<Role>(new RoleConfiguration().Configure);
            modelBuilder.Entity<RoleWidgetSetting>(new RoleWidgetSettingConfiguration().Configure);
            modelBuilder.Entity<SFAProvider>(new SFAProviderConfiguration().Configure);
            modelBuilder.Entity<SFASetting>(new SFASettingConfiguration().Configure);
            modelBuilder.Entity<TrustDomain>(new TrustDomainConfiguration().Configure);
            modelBuilder.Entity<View>(new ViewConfiguration().Configure);
            modelBuilder.Entity<ViewRole>(new ViewRoleConfiguration().Configure);
            modelBuilder.Entity<V_Parent>(eb => eb.HasNoKey().ToView("V_Parent"));
            modelBuilder.Entity<V_UserSFASetting>(eb => eb.HasNoKey().ToView("V_UserSFASetting"));
            modelBuilder.Entity<V_UserPortal>(eb => eb.HasNoKey().ToView("V_UserPortal"));
            modelBuilder.Entity<V_UserPage>(eb => eb.HasNoKey().ToView("V_UserPage"));
            modelBuilder.Entity<V_UserDashboardPage>(eb => eb.HasNoKey().ToView("V_UserDashboardPage"));
            modelBuilder.Entity<V_UserDashboard>(eb => eb.HasNoKey().ToView("V_UserDashboard"));
            modelBuilder.Entity<V_UserWidget>(eb => eb.HasNoKey().ToView("V_UserWidget"));
            modelBuilder.Entity<V_ActiveUser>(eb => eb.HasNoKey().ToView("V_ActiveUser"));
            modelBuilder.Entity<V_RoleWebsite>(eb => eb.HasNoKey().ToView("V_RoleWebsite"));
            modelBuilder.Entity<V_RoleWebsiteWidgetSetting>(eb => eb.HasNoKey().ToView("V_RoleWebsiteWidgetSetting"));
            modelBuilder.Entity<V_WebsiteMenu>(eb => eb.HasNoKey().ToView("V_WebsiteMenu"));
            modelBuilder.Entity<Website>(new WebsiteConfiguration().Configure);
            modelBuilder.Entity<Widget>(new WidgetConfiguration().Configure);
        }
    }
}
