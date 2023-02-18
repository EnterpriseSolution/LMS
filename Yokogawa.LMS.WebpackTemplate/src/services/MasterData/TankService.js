import { AppConfig, eworkspace, utils } from '../../global'
import { CommonGridEditors } from '../../common/Enum';

function getTankList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Tank/tanks',
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

function getTankDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Tank/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {            
            json.TankTypeList = MasteData.TankType.map(function (tanktype) {
                return { text: tanktype.text, value: tanktype.value };
            });
            json.TankStatusList = MasteData.TankStatus.map(function (tankStatus) {
                return { text: tankStatus.text, value: tankStatus.value };
            });
            
            getTankDetailsProductList(json, callback, failCallback);            
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function checkTankExist(tankNo, callback) {    
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Tank/Check/' + tankNo,
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

function getTankDetailsProductList(data,callback, failCallback) {    
    var parameter = {
        Criterias: [],
        CurrentPageIndex: 0,
        PageSize: 99999
    };
    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/product/products',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.ProductList = json.Items.map(function (product) {
                return { text: product.ProductName, value: product.ProductId };
            });

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

function deleteTank(id, callback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/Tank/'+id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        }
    };

    eworkspace.Services.callApi(apiOption);
}


function saveTank(Tank, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Tank/SaveTank',
        data: JSON.stringify(Tank),
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


export { getTankList, getTankDetails, getTankDetailsProductList, saveTank, deleteTank, checkTankExist }