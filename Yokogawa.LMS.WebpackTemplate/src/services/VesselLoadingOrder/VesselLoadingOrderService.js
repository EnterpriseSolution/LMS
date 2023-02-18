import { AppConfig, eworkspace, utils } from '../../global'

function getVesselLoadingOrderList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize:10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/VesselLoadingOrder/VesselLoadingOrders',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            json.Items = json.Items.map(function (item) {
                item.Eta = new Date(item.Eta);
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

function getVesselLoadingOrderDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/VesselLoadingOrder/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            json.UomList = MasteData.UomList.map(function (uom) {
                return { text: uom.text, value: uom.value };
            });
            json.StatusList = VesselOrder.OrderStatus.map(function (status) {
                return { text: status.text, value: status.value };
            });
            json.Eta = new Date(json.Eta);
            getMasterDataList(json, callback, failCallback);
          
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function getMasterDataList(data, callback, failCallback) {
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/VesselLoadingOrder/GetMasterData',
        dataType: 'json',
        contentType: 'application/json' ,
        global: false,
        success: function (json) {
            data.CustomerList = json.CustomerList;
            data.ProductList = json.ProductList;
            data.JettyList = json.JettyList;
            data.VesselList = json.VesselList;

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

function deleteVesselLoadingOrder(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/VesselLoadingOrder/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete VesselLoadingOrder):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveVesselLoadingOrder(VesselLoadingOrder, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/VesselLoadingOrder/SaveVesselLoadingOrder',
        data: JSON.stringify(VesselLoadingOrder),
        success: function (json) {
            utils.showProcessbar(false);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(save VesselLoadingOrder):' + xhr.responseText);
            utils.showProcessbar(false);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}


export { getVesselLoadingOrderList, getVesselLoadingOrderDetails, saveVesselLoadingOrder, deleteVesselLoadingOrder }