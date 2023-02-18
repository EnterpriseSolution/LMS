import { AppConfig, eworkspace, utils } from '../../global'

function getJettyList(options,callback, failCallback) {
    
    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption= {
        type: "POST",
        url: AppConfig.serviceUrl + '/Jetty/list',
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
                failCallback(xhr) ;
        },
       
        processData: false
    };
   
    eworkspace.Services.callApi(apiOption);
};

function getJettyDetails(id, callback, failCallback) {
    id = id == null||id.length==0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Jetty/'+id,
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

function deleteJetty(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/Jetty/' + id,
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete Jetty):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveJetty(jetty, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Jetty/SaveJetty',
        data: JSON.stringify(jetty),
        success: function (json) {
            utils.showProcessbar(false);
            if ($.isFunction(callback))
                callback(json) ;
        },
        error: function (xhr) {
            alert('Service Error(save Jetty):' + xhr.responseText);
            utils.showProcessbar(false);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}


export { getJettyList, getJettyDetails, saveJetty, deleteJetty }