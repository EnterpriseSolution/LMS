import { AppConfig, eworkspace, utils } from '../../global'

function getDriverList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Driver/drivers',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            json.Items = json.Items.map(function (item) {
                convertDatetime(item);
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

function getDriverDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Driver/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            getCarriers(json, callback, failCallback);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function deleteDriver(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/Driver/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete Driver):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveDriver(Driver, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Driver/SaveDriver',
        data: JSON.stringify(Driver),
        success: function (json) {
            utils.showProcessbar(false);
            convertDatetime(json);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(save Driver):' + xhr.responseText);
            utils.showProcessbar(false);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}

function getCarriers(data, callback, failCallback) {
    var options = { criterias: [], CurrentPageIndex: 0, PageSize: 100000 }

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
            data.Carriers = json.Items.map(function (item) {
                return { CarrierName: item.CarrierName, CarrierId: item.CarrierId };
            });
            getCards(data, callback, failCallback);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function getCards(data, callback, failCallback) {
    var options = { criterias: [], CurrentPageIndex: 0, PageSize: 100000 }

    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };


    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/RFIDCard/rfidcards',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Cards = json.Items.map(function (item) {
                return { CardNo: item.CardNo, CardId: item.CardId };
            });
            convertDatetime(data);
            if ($.isFunction(callback))
                callback(data);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };
    eworkspace.Services.callApi(apiOption);
}

function convertDatetime(Driver) {
    Driver.ReTrainingDate = new Date(Driver.ReTrainingDate);
    Driver.ValidDate = new Date(Driver.ValidDate);
}




export { getDriverList, getDriverDetails, saveDriver, deleteDriver }