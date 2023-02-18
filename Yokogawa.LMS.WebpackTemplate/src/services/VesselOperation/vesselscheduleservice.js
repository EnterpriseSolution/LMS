import { AppConfig, eworkspace, utils } from '../../global'
import { UOMList } from '../../viewmodels/VesselOperation/models'
function getStartDay() {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var firstday = new Date(curr.setDate(first));
    return new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDay())
};

function getVesselScheduleList(options, callback,failCallback) {
    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    let parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    utils.setProcessbarhandler(true);
    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/shipment/list',
        data: JSON.stringify(parameter),
        global: false,
        success: function (json) {
            utils.setProcessbarhandler(false);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            utils.showProcessbar(false);
            if ($.isFunction(failCallback))
                failCallback();
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }

    eworkspace.Services.callApi(apiOption);

};

function getVesselScheduleDetail(id, callback,failCallback) {
    $.ajax({
        type: "GET",
        url: AppConfig.serviceUrl  + '/shipment/vesselschedule?id=' + id,
        global: false,
        success: function (json) {
            var result = json;

            json.BOLList.forEach(function (bol, index) {
                bol.Index = index + 1;
            });

            if (json.PlannedArrivalTime)
                result.PlannedArrivalTime = new Date(json.PlannedArrivalTime);
            if (json.PlannedDepartureTime)
                result.PlannedDepartureTime = new Date(json.PlannedDepartureTime);
            if (json.ActualDepartureTime)
                result.ActualDepartureTime = new Date(json.ActualDepartureTime);
            if (json.ActualArrivalTime)
                result.ActualArrivalTime = new Date(json.ActualArrivalTime);

            if (json.Timesheet) {
                if (json.Timesheet.FirstLineAshore)
                    result.Timesheet.FirstLineAshore = new Date(json.Timesheet.FirstLineAshore);

                if (json.Timesheet.VesselAllClear)
                    result.Timesheet.VesselAllClear = new Date(result.Timesheet.VesselAllClear);

                if (json.Timesheet.ArrvialAtPilotStation)
                    result.Timesheet.ArrvialAtPilotStation = new Date(json.Timesheet.ArrvialAtPilotStation);
                if (json.Timesheet.HealthImmCleared)
                    result.Timesheet.HealthImmCleared = new Date(json.Timesheet.HealthImmCleared);
                if (json.Timesheet.PilotBerthing)
                    result.Timesheet.PilotBerthing = new Date(json.Timesheet.PilotBerthing);

                if (json.Timesheet.FirstLineAshore)
                    result.Timesheet.FirstLineAshore = new Date(json.Timesheet.FirstLineAshore);
                if (json.Timesheet.MooringCompleted)
                    result.Timesheet.MooringCompleted = new Date(json.Timesheet.MooringCompleted);
                if (json.Timesheet.StartedDeballasting)
                    result.Timesheet.StartedDeballasting = new Date(json.Timesheet.StartedDeballasting);

                if (json.Timesheet.FinishedDeballasting)
                    result.Timesheet.FinishedDeballasting = new Date(json.Timesheet.FinishedDeballasting);
                if (json.Timesheet.StartedUllagingSampling)
                    result.Timesheet.StartedUllagingSampling = new Date(json.Timesheet.StartedUllagingSampling);
                if (json.Timesheet.FinishedUllagingSampling)
                    result.Timesheet.FinishedUllagingSampling = new Date(json.Timesheet.FinishedUllagingSampling);
                if (json.Timesheet.NoticeTendered)
                    result.Timesheet.NoticeTendered = new Date(json.Timesheet.NoticeTendered);
                if (json.Timesheet.NoticeAccepted)
                    result.Timesheet.NoticeAccepted = new Date(json.Timesheet.NoticeAccepted);

                if (json.Timesheet.StartedBallasting)
                    result.Timesheet.StartedBallasting = new Date(json.Timesheet.StartedBallasting);
                if (json.Timesheet.FinishedBallasting)
                    result.Timesheet.FinishedBallasting = new Date(json.Timesheet.FinishedBallasting);
                if (json.Timesheet.DocumentOnBoard)
                    result.Timesheet.DocumentOnBoard = new Date(json.Timesheet.DocumentOnBoard);

                if (json.Timesheet.PilotSailing)
                    result.Timesheet.PilotSailing = new Date(json.Timesheet.PilotSailing);
                if (json.Timesheet.StartUnmooring)
                    result.Timesheet.StartUnmooring = new Date(json.Timesheet.StartUnmooring);
                if (json.Timesheet.VesselAllClear)
                    result.Timesheet.VesselAllClear = new Date(json.Timesheet.VesselAllClear);

                if (json.Timesheet.BookingPilot)
                    result.Timesheet.BookingPilot = new Date(json.Timesheet.BookingPilot);
                if (json.Timesheet.BookingUnberthingPilot)
                    result.Timesheet.BookingUnberthingPilot = new Date(json.Timesheet.BookingUnberthingPilot);
            }

            json.LastModifiedOn = utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss");

            if (json.PlannedArrivalTime && json.PlannedDepartureTime)
                result.PlannedHours = Math.abs(new Date(json.PlannedDepartureTime) - new Date(json.PlannedArrivalTime)) / 36e5;
            if (json.ActualArrivalTime && json.ActualDepartureTime)
                result.AlongsideHours = Math.abs(new Date(json.ActualDepartureTime) - new Date(json.ActualArrivalTime)) / 36e5;

            getVesselScheduleMasterData(function (masterData) {
                result.JettyList = masterData.JettyList.map(function (jetty) {
                    return { text: jetty.JettyName, value: jetty.Id };
                });

                result.VesselList = masterData.VesselList.map(function (vessel) {
                    return { text: vessel.VesselName, value: vessel.Id, dwt: vessel.DWT };
                });

                result.ShipAgentList = masterData.ShipAgentList.map(function (agent) {
                    return { text: agent.Name, value: agent.Id };
                });

                var customerList = masterData.CustomerList.map(function (customer) {
                    return { text: customer.Name, value: customer.Id };
                });

                result.CustomerList = customerList;

                json.BOLList.forEach(function (bol, index) {
                    bol.CustomerList = customerList;
                    bol.UOMList = UOMList.map(function (uom) {
                        return { text: uom.Name, value: uom.Id };
                    });
                });

                console.log("bol", json.BOLList);

                if ($.isFunction(callback))
                    callback(result);
            },
                function () {
                    utils.showProcessbar(false);
                    if ($.isFunction(callback))
                        callback(result);
                });
        },
        error: function (xhr) {
            utils.showProcessbar(false);
            if ($.isFunction(failCallback))
                failCallback();
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    });
};

function getVesselScheduleMasterData(callback, failCallback) {
    $.ajax({
        type: "GET",
        url: AppConfig.serviceUrl  + '/MasterData/vesselschedule',
        global: false,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            utils.showProcessbar(false);
            if ($.isFunction(failCallback))
                failCallback();

        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    });
};

function getTankListLOV(callback, failCallback) {
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Tank/TanksLOV',
        global: false,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            utils.showProcessbar(false);
            alert('Service Error(get tanks master data):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    };
    eworkspace.Services.callApi(apiOption);

};
export { getStartDay, getVesselScheduleList, getVesselScheduleDetail, getVesselScheduleMasterData, getTankListLOV}