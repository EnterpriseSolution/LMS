import { AppConfig, eworkspace, utils } from '../../global'
import { CommonGridEditors } from '../../common/CommonGridEditor';
import { JobStatus, JobUom } from '../../common/TruckLoadingOrderStatus';

function getOdTruckLoadingJobList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/OdTruckLoadingJob/OdTruckLoadingJobs',
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

function getOdTruckLoadingJobDetails(params, callback, failCallback) {
    var id = utils.getEmptyGUID();
    if (params != null) {
        if (params.id != null && params.id.length != 0) {
            id = params.id;

        }
    }
   
 var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/OdTruckLoadingJob/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            json.JobStatusList = JobStatus.map(function (JobStatus) {
                return { text: JobStatus.text, value: JobStatus.value };
            });
            json.UomList = JobUom.map(function (Uom) {
                return { text: Uom.text, value: Uom.value };
            });
            
            getCompartments(json, params.TruckId, callback, failCallback);
            
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function deleteOdTruckLoadingJob(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/OdTruckLoadingJob/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete OdTruckLoadingJob):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveOdTruckLoadingJob(OdTruckLoadingJob, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/OdTruckLoadingJob/SaveOdTruckLoadingJob',
        data: JSON.stringify(OdTruckLoadingJob),
        success: function (json) {
            utils.showProcessbar(false);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(save OdTruckLoadingJob):' + xhr.responseText);
            utils.showProcessbar(false);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}

function getCompartments(data, truckId, callback, failCallback) {
      var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Compartment/GetCompartmentsByTruckId/' + truckId,
      
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Compartments = json.map(function (item) {
               return { CompartmentNo: item.CompartmentNo, CompartmentId: item.CompartmentId };
            });
            getTanks(data, callback, failCallback);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function getTanks(data, callback, failCallback) {
    var parameter = { criterias: [], CurrentPageIndex: 0, PageSize: 100000 };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Tank/Tanks',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Tanks = json.Items.map(function (item) {
                return { TankNo: item.TankNo, TankId: item.TankId };
            });
            getProducts(data, callback, failCallback);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);

}
function getProducts(data, callback, failCallback) {

    var parameter = { criterias: [], CurrentPageIndex: 0, PageSize: 100000 };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Product/Products',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Products = json.Items.map(function (item) {
                return { ProductName: item.ProductName, ProductId: item.ProductId };
            });
            getCustomers(data, callback, failCallback);

        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}
function getCustomers(data, callback, failCallback) {
    var parameter = { criterias: [], CurrentPageIndex: 0, PageSize: 100000 };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Customer/Customers',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Customers = json.Items.map(function (item) {
                return { CustomerName: item.CustomerName, CustomerId: item.CustomerId };
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






export { getOdTruckLoadingJobList, getOdTruckLoadingJobDetails, saveOdTruckLoadingJob, deleteOdTruckLoadingJob }