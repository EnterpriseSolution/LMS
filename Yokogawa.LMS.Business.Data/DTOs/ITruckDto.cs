using System;
using System.Collections.Generic;
using Yokogawa.Data.Infrastructure.DTOs.Base;


namespace Yokogawa.LMS.Business.Data.DTOs
{
	public interface ITruckDto : IDto<Guid>, IAuditableDto
	{
		string TruckId { get; set; }
		string TruckCode { get; set; }
		string Maker { get; set; }
		DateTime? YearBuilt { get; set; }
		decimal? RegisteredTareWeight { get; set; }
		decimal? RegisteredGrossWeight { get; set; }
		DateTime? LastInspectionDate { get; set; }
		DateTime? InspectionDueDate { get; set; }
		DateTime? ValidDate { get; set; }
		Guid? CarrierId { get; set; }
		String St_CarrierId { get; set; }
		bool Status { get; set; }
		string Remarks { get; set; }
		

	}
}
