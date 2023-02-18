import { AppConfig, eworkspace, utils } from '../../global'
//import { CommonGridEditors } from '../../common/Enum';

function getOdTruckLoadingOrderList(options, callback, failCallback) {

    options = options == null ? { criterias: [], CurrentPageIndex: 0, PageSize: 10 } : options;
    var parameter = {
        Criterias: options.criterias == null ? [] : options.criterias,
        CurrentPageIndex: options.page,
        PageSize: options.pageSize
    };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/OdTruckLoadingOrder/OdTruckLoadingOrders',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            json.Items = json.Items.map(function (item) {
                item.DeliveryDate = item.DeliveryDate != null ? new Date(item.DeliveryDate) : null;
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

function getOdTruckLoadingOrderDetails(id, callback, failCallback) {
  id= id == null || id.length == 0 ? utils.getEmptyGUID() : id;
   
    var apiOption = {
        type: "GET",
        url: AppConfig.serviceUrl + '/OdTruckLoadingOrder/' + id,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            json.DeliveryDate = json.DeliveryDate != null ? new Date(json.DeliveryDate): null;
            json.SourceTypeList = Order.OrderSourceType.map(function (OrderSourceType) {
                return { text: OrderSourceType.text, value: OrderSourceType.value } ;
            });
            json.OrderStatusList = Order.OrderStatus.map(function (orderStatus) {
                return { text: orderStatus.text, value: orderStatus.value };
            });
            getCards(json, callback, failCallback);

        },
        //
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },
        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}

function deleteOdTruckLoadingOrder(id, callback, failCallback) {
    var apiOption = {
        type: "DELETE",
        url: AppConfig.serviceUrl + '/OdTruckLoadingOrder/' + id,
        success: function (json) {
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(delete OdTruckLoadingOrder):' + xhr.responseText);
            if ($.isFunction(failCallback))
                failCallback();
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}


function saveOdTruckLoadingOrder(OdTruckLoadingOrder, callback, failCallback) {
    utils.showProcessbar(true);
    var options = {
        type: "POST",
        url: AppConfig.serviceUrl + '/OdTruckLoadingOrder/SaveOdTruckLoadingOrder',
        data: JSON.stringify(OdTruckLoadingOrder),
        success: function (json) {
            utils.showProcessbar(false);
            if ($.isFunction(callback))
                callback(json);
        },
        error: function (xhr) {
            alert('Service Error(save OdTruckLoadingOrder):' + xhr.responseText);
            utils.showProcessbar(false);
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false
    }
    eworkspace.Services.callApi(options);
}

function getCards(data, callback, failCallback) {
    var parameter = { criterias: [], CurrentPageIndex: 0, PageSize: 100000 };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/RFIDCard/rfidcards',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Cards = json.Items.map(function (item) {
                return { CardIdName: item.CardNo, CardId: item.CardId };
            });
            getCarriers(data, callback, failCallback);
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);

}
function getCarriers(data, callback, failCallback) {
  
    var parameter = { criterias: [], CurrentPageIndex: 0, PageSize: 100000};

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
            getDrivers(data, callback, failCallback);
            
        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}
function getDrivers(data, callback, failCallback) {
    var parameter = { criterias: [], CurrentPageIndex: 0, PageSize: 100000 };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Driver/Drivers',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Drivers = json.Items.map(function (item) {
                return { DriverName: item.DriverName, DriverId: item.DriverId };
            });
            getTrucks(data, callback, failCallback);

        },
        error: function (xhr) {
            if ($.isFunction(failCallback))
                failCallback(xhr);
        },

        processData: false
    };

    eworkspace.Services.callApi(apiOption);
}
function getTrucks(data, callback, failCallback) {
    var parameter = { criterias: [], CurrentPageIndex: 0, PageSize: 100000 };

    var apiOption = {
        type: "POST",
        url: AppConfig.serviceUrl + '/Truck/Trucks',
        data: JSON.stringify(parameter),
        dataType: 'json',
        contentType: 'application/json',
        global: false,
        success: function (json) {
            data.Trucks = json.Items.map(function (item) {
                return { TruckName: item.TruckCode, TruckId: item.TruckId };
            });
            data.Compartments=
            json.Items.map(function (item) {
                var compartmentList = new Array();
                item.Compartments.map(function (compartment) {
                    var compartmentAarry = new Array();
                    compartmentAarry.push(compartment.CompartmentNo, compartment.CompartmentId);
                    compartmentList.push(compartmentAarry);
                });
                return { TruckId: item.TruckId, Compartments: compartmentList };
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





export { getOdTruckLoadingOrderList, getOdTruckLoadingOrderDetails, saveOdTruckLoadingOrder, deleteOdTruckLoadingOrder }