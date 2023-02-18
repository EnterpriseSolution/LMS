import { AppConfig, eworkspace, utils } from '../../global'

function getIttOrderList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/IttOrder/IttOrders',
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

function getIttOrderDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/IttOrder/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            json.StatusList = VesselOrder.OrderStatus.map(function (status) {
                return { text: status.text, value: status.value };
            });
            json.UomList = MasteData.UomList.map(function (uom) {
                return { text: uom.text, value: uom.value };
            });
           
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
        url: AppConfig.serviceUrl + '/IttOrder/GetMasterData',
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.CustomerList = json.CustomerList;
            data.ProductList = json.ProductList;
            data.TankList = json.TankList;


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

function deleteIttOrder(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/IttOrder/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete IttOrder):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveIttOrder(IttOrder, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/IttOrder/SaveIttOrder',
        data: JSON.stringify(IttOrder),
        success: function (json) {
            utils.showProcessbar(false);
            convertDatetime(json);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(save IttOrder):' + xhr.responseText);
            utils.showProcessbar(false);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}



function convertDatetime(IttOrder) {
    IttOrder.ReTrainingDate = new Date(IttOrder.ReTrainingDate);
    IttOrder.ValidDate = new Date(IttOrder.ValidDate);
}




export { getIttOrderList, getIttOrderDetails, saveIttOrder, deleteIttOrder }