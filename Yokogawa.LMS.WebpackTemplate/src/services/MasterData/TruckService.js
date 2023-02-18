import { AppConfig, eworkspace, utils } from '../../global'


function getTruckList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Truck/Trucks',
        data: JSON.stringify(parameter),
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
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function getTruckDetails(id, callback, failCallback) {
    id = id == null || id.length == 0 ? utils.getEmptyGUID() : id;
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/Truck/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            if (json.TruckId != null) {
                convertDatetime(json);
            }
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

function deleteTruck(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/Truck/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete Truck):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveTruck(Truck, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Truck/SaveTruck',
        data: JSON.stringify(Truck),
        success: function (json) {
            utils.showProcessbar(false);
            convertDatetime(json);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(save Truck):' + xhr.responseText);
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



function convertDatetime(truck) {
    var data = new Date(truck.YearBuilt);
    truck.St_YearBuilt = truck.YearBuilt == null ? null : data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + data.getDate();
    truck.LastInspectionDate = truck.LastInspectionDate ==null? null: new Date(truck.LastInspectionDate);
    truck.InspectionDueDate = truck.InspectionDueDate == null ? null :  new Date(truck.InspectionDueDate);
    truck.ValidDate = truck.ValidDate == null ? null :  new Date(truck.ValidDate);

}


export { getTruckList, getTruckDetails, saveTruck, deleteTruck, getCarriers }