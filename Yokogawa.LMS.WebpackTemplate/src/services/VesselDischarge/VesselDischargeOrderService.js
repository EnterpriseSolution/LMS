import { AppConfig, eworkspace, utils } from '../../global'
import { Enums } from '../../common/Enum';

function getVesselDischargeOrderList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/VesselDischarge/vesseldischargeorders',
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

function getVesselDischargeOrderDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/VesselDischarge/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {            
            json.UomList = MasteData.UomList.map(function (uom) {
                return { text: uom.text, value: uom.value };
            });
            
            if ($.isFunction(callback))
                callback(json);
            //getMasterDataList(json, callback, failCallback);          
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

//function getMasterDataList(data,callback, failCallback) {      
//    var apiOption = {
//        type: "GET",
//        url: AppConfig.serviceUrl + '/VesselDischarge/GetMasterData',
//        dataType: 'json',
//        contentType: 'application/json',
//        global: false,
//        success: function (json) {
//            data.CustomerList = json.CustomerList;
//            data.ProductList = json.ProductList;
//            data.CarrierList = json.CarrierList;
//            data.TruckList = json.TruckList;
//            data.CardList = json.CardList;
//            data.DriverList = json.DriverList;         

//            if ($.isFunction(callback))
//                callback(data);
//        },
//        error: function (xhr) {
//            if ($.isFunction(failCallback))
//                failCallback(xhr);
//        },

//        processData: false
//    };

//    eworkspace.Services.callApi(apiOption);     
//}

function checkVesselDischargeOrderExist(orderNo, callback) {
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/VesselDischarge/Check/' + orderNo,
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


function deleteVesselDischargeOrder(id, callback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/VesselDischarge/'+id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        }
    };

    eworkspace.Services.callApi(apiOption);
}


function saveVesselDischargeOrder(TruckUnloadingOrder, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/VesselDischarge/SaveVesselDischargeOrder',
        data: JSON.stringify(TruckUnloadingOrder),
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


export { getVesselDischargeOrderList, getVesselDischargeOrderDetails, saveVesselDischargeOrder, deleteVesselDischargeOrder, checkVesselDischargeOrderExist }