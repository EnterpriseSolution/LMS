import { AppConfig, eworkspace, utils } from '../../global'

function getVesselList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Vessel/vessels',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function getVesselDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Vessel/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            json.CommissionDate = new Date(json.CommissionDate);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function deleteVessel(id, callback) {  
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/Vessel/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        }
    };

    eworkspace.Services.callApi(apiOption);
}

function checkVesselExist(vesselName, callback) {
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Vessel/Check/' + vesselName,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function saveVessel(Vessel, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Vessel/SaveVessel',
        data: JSON.stringify(Vessel),
        success: function (json) {
            utils.showProcessbar(false);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {            
            utils.showProcessbar(false);
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}


export { getVesselList, getVesselDetails, saveVessel, deleteVessel, checkVesselExist }