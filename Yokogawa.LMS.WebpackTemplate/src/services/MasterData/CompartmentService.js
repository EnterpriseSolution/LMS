import { AppConfig, eworkspace, utils } from '../../global'
function getCompartmentList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Compartment/Compartments',
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

function getCompartmentDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Compartment/' + id,
         success: function (json) {
             json.CommissionDate = new Date(json.CommissionDate);
             getProducts(json, callback, failCallback);
            
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function deleteCompartment(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/Compartment/' + id,
        global: false,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete Compartment):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveCompartment(Compartment, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Compartment/SaveCompartment',
        data: JSON.stringify(Compartment),
        success: function (json) {
            utils.showProcessbar(false);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(save Compartment):' + xhr.responseText);
            utils.showProcessbar(false);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}

function getProducts(data, callback, failCallback) {
    var parameter = {
        Criterias: [],
        CurrentPageIndex: 0,
        PageSize: 100000
    };
    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/product/products',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Products = json.Items.map(function (product) {
                return { ProductName: product.ProductName, ProductId: product.ProductId };
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



export { getCompartmentList, getCompartmentDetails, saveCompartment, deleteCompartment, getProducts }
