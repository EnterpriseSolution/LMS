using System;
using System.Text;
using System.Linq;
using Yokogawa.Data.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Yokogawa.LMS.Business.Data.DTOs;
using Yokogawa.Data.Infrastructure.QueryObjects;
using Yokogawa.Data.Infrastructure.Entities;
using Yokogawa.LMS.Exceptions;
using Yokogawa.Security.OAuth.Interfaces;
using Yokogawa.LMS.Business.Data.Entities;

namespace Yokogawa.LMS.Business.Data.Commands
{
    public static class VesselCommands
    {
        public static async Task<Vessel> ValidatePermissionAsync(this DbSet<Vessel> dbSet, Guid id)
        {
            Vessel entity = await dbSet.GetById(id).FirstOrDefaultAsync();

            return entity;
        }

        public static async Task ValidateAsync(this DbSet<Vessel> dbSet, IVesselDto dto)
        {
            StringBuilder sb = new StringBuilder();

            bool isDuplicated = await dbSet.ExcludeDeletion().AsNoTracking().Where(o => o.Id != dto.Id && dto.Id != Guid.Empty).CountAsync() > 0;
            if (isDuplicated)
                sb.AppendLine("Duplicate Record");

            if (sb.Length > 0)
                throw new ConflictException(sb.ToString());
        }

        public static async Task<Vessel> CreateOrUpdateAsync(this DbSet<Vessel> dbSet, IVesselDto dto, IUserProfile profile)
        {
            dto.SetAudit(profile.UserId, profile.UserName);
            var vessel = await dbSet.ValidatePermissionAsync(dto.Id);
            bool isCreate = vessel == null;

            if (isCreate)
            {
                vessel = new Vessel();
                vessel.Id = Guid.NewGuid();
                dbSet.Add(vessel);
            }
            //await dbSet.ValidateAsync(dto);

            vessel.CarrierId = dto.CarrierId;
            vessel.VesselName = dto.VesselName;
            vessel.VesselFlag = dto.VesselFlag;
            vessel.MaxLoadableWeight = dto.MaxLoadableWeight;
            vessel.MaxLoadableVolume = dto.MaxLoadableVolume;
            vessel.DWT = dto.DWT;
            vessel.VesselLength = dto.VesselLength;
            vessel.MaxtargetFlowRate = dto.MaxtargetFlowRate;
            vessel.DateDryDockDue = dto.DateDryDockDue;
            vessel.CaptainName = dto.CaptainName;
            vessel.NetTonnage = dto.NetTonnage;
            vessel.DateBuilt = dto.DateBuilt;
            vessel.DateLastInspected = dto.DateLastInspected;
            vessel.ComparmentNumber = dto.ComparmentNumber;
            vessel.VesselPreviousName = dto.VesselPreviousName;
            vessel.PortOfRegistry = dto.PortOfRegistry;
            vessel.ClassificationSociety = dto.ClassificationSociety;
            vessel.TotalCubicCapacityOfTank = dto.TotalCubicCapacityOfTank;
            vessel.SlopTankCapacity = dto.SlopTankCapacity;
            vessel.MaxLoadingRate = dto.MaxLoadingRate;
            vessel.NoOfCargoConnections = dto.NoOfCargoConnections;
            vessel.SizeOfCargoConnections = dto.SizeOfCargoConnections;
            vessel.DistanceBetweenCargoManifoldCentres = dto.DistanceBetweenCargoManifoldCentres;
            vessel.DistanceShipsRailToManifold = dto.DistanceShipsRailToManifold;
            vessel.DistanceMainDeckToCentreManifold = dto.DistanceMainDeckToCentreManifold;
            vessel.HeightOfManifoldConnectionsLoaded = dto.HeightOfManifoldConnectionsLoaded;
            vessel.HeightOfManifoldConnectionsNormal = dto.HeightOfManifoldConnectionsNormal;
            vessel.Draught = dto.Draught;
            vessel.ParallelBodyLength = dto.ParallelBodyLength;
            vessel.Displacement = dto.Displacement;
            vessel.Status = dto.Status;
            vessel.SetAudit(dto, isCreate, true);

            return vessel;
        }

        public static async Task<Vessel> DeleteAsync(this DbSet<Vessel> dbSet, Guid id, IUserProfile profile)
        {
            var vessel = await dbSet.ValidatePermissionAsync(id);
            bool isDeleted = vessel != null;
            if (isDeleted)
                vessel.LogicDelete(profile.UserId, profile.UserName, true);

            return vessel;
        }
    }
}
