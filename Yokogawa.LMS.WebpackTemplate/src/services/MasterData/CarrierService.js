import { AppConfig, eworkspace, utils } from '../../global'
function getCarrierList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Carrier/Carriers',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            json.Items = json.Items.map(function (item) {
                item.ValidDate = new Date(item.ValidDate);
                return item;
            });
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

function getCarrierDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Carrier/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            json.ValidDate = new Date(json.ValidDate);
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

function deleteCarrier(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/Carrier/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete Carrier):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveCarrier(Carrier, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Carrier/SaveCarrier',
        data: JSON.stringify(Carrier),
        success: function (json) {
            utils.showProcessbar(false);
            json.ValidDate = new Date(json.ValidDate);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(save Carrier):' + xhr.responseText);
            utils.showProcessbar(false);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}


export { getCarrierList, getCarrierDetails, saveCarrier, deleteCarrier }
