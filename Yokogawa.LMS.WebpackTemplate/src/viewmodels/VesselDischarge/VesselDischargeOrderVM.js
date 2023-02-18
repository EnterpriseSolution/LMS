import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/VesselDischarge/VesselDischargeOrderService';
import uiModels from './VesselDischargeOrderModels';
import { CommonGridEditors } from '../../common/CommonGridEditor';
import { StringBuilder } from '../../common/Shared';

function VesselDischargeOrderList(id, selector) {
    var model = uiModels.getVesselDischargeOrderModelList();

    var list = new eworkspace.framework.ListPage(id, model, selector);
    list.setLoadDataHandler(uiServices.getVesselDischargeOrderList);

    list.setEventHandler(function () {
        var gridSelect = function (e) {
            var selectedRows = this.select();
            var dataItem = this.dataItem(selectedRows[0]);
            list.setButtonVisible(4, dataItem.Id != 1);
        };
        var grid = list._getGrid();
        grid.bind("change", gridSelect);

    });

    list.onButtonClickById('view', function (page) {
        if (page == null) {
            console.error("fails to load vessel discharge detail page");
            return;
        }
                      
        var data = list.getSelectedRow();
        if (data != null) {           
            page.navigate('id=' + data.Id)
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            list.show();
        }

    });

    list.onFilter(0, function (e) {
        var value = this.value();

        list.addfilter(value);
        list.readGridData();
    });
   
    return list;
}

function VesselDischargeOrderDetails(id, selector) {
    var model = uiModels.getVesselDischargeOrderModel();
    var details = new eworkspace.framework.WorkflowPage(id, model, selector);
    details.setLoadDataHandler(uiServices.getVesselDischargeOrderDetails);
    details.setLoadCompletedHandler(function (data) {
        var allowEdit = data.Status === 1;    
        details.setButtonVisibleById("save", allowEdit);
        details.setButtonVisibleById("delete", allowEdit);    
    });

    details.onToolBarItemClickById('new', function () {
        details.display("");
    });

    details.onToolBarItemClickById('save', function () {
        var pageSchedule = details.getNavigationPageById('schedule');      
        pageSchedule.save(function (data) {

            var id = data.Id;
            if (id === utils.getEmptyGUID()) {
                uiServices.checkVesselDischargeOrderExist(data.VesselDischargeOrderNo,
                    function (json) {
                        if (json === true) {
                            uiServices.saveVesselDischargeOrder(data,
                                function () {
                                    eworkspace.ViewModel.info('Save VesselDischargeOrder successfully');                                     
                                },
                                function (error) {
                                    eworkspace.ViewModel.info('Save VesselDischargeOrder error<br/>' + error.responseText);                                      
                                });
                        }

                        if (json === false) {
                            eworkspace.ViewModel.info('VesselDischargeOrder already exists');
                            return;
                        }
                    });
            } else {
                uiServices.saveVesselDischargeOrder(data, function () {
                    eworkspace.ViewModel.info('Save VesselDischargeOrder successfully');                    
                },
                    function (error) {
                        eworkspace.ViewModel.info('Save VesselDischargeOrder error<br/>' + error.responseText);                         
                    });
            }

        });
    });

    details.onToolBarItemClickById('close', function () {         
        details.parent.navigate();           
    });

    details.onToolBarItemClickById('delete', function () {
        var dialog = new eworkspace.framework.ConfirmationDialog();
        dialog.show("Delete Record", "Are you sure to delete the record?",
            function () {
                var pageSchedule = details.getNavigationPageById('schedule');
                var id = pageSchedule.model.data.Id;                
                uiServices.deleteVesselDischargeOrder(id, function (json) {
                    if (json === "Deleted") {
                        eworkspace.ViewModel.info('Successfully delete the VesselDischargeOrder');
                        details.parent.navigate();
                    } else {
                        eworkspace.ViewModel.info('VesselDischargeOrder delete error <br/>' + json);
                        return;
                    }
                });
            }); 
    });

    return details;
};

function VesselDischargeOrderForm(id, selector) {
    var template = { Id: 'VesselDischargeOrderForm', url: "src/view/VesselDischarge.html" }
    var model = { data: null };    
    var form = new eworkspace.framework.Form(id, model, template, selector);
    form.setLoadCompletedHandler(function (data) {        
    });        

    form.save = function (callback) {
        if (form.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = form.getData();
        
        var sbMsg = new StringBuilder();
        var msgArray = new Array();       

        if (!data.OrderNo) {
            msgArray.pushSet("Order No. is required.");
        } 

        var customerToFind = $.grep(data.CustomerList, function (item) { return item.value === data.CustomerId; })[0];
        if (customerToFind == null) {
            msgArray.pushSet("Customer is required.");
        }
        var productToFind = $.grep(data.ProductList, function (item) { return item.value === data.ProductId; })[0];
        if (productToFind == null) {
            msgArray.pushSet("Product is required.");
        }
        var uomToFind = $.grep(data.UomList, function (item) { return item.value === data.UOM; })[0];
        if (uomToFind == null) {
            msgArray.pushSet("UOM is required.");
        }
        var truckToFind = $.grep(data.TruckList, function (item) { return item.value === data.TruckId; })[0];
        if (truckToFind == null) {
            msgArray.pushSet("Truck is required.");
        }

        if (data.CarrierId) {
            var carrierToFind = $.grep(data.CarrierList, function (item) { return item.value === data.CarrierId; })[0];
            if (carrierToFind == null) {
                msgArray.pushSet("Carrier is invalid.");
            }
        }         

        if (data.CardId) {
            var cardToFind = $.grep(data.CardList, function (item) { return item.value === data.CardId; })[0];
            if (cardToFind == null) {
                msgArray.pushSet("Card is invalid.");
            }
        }

        if (data.DriverId) {
            var driverToFind = $.grep(data.DriverList, function (item) { return item.value === data.DriverId; })[0];
            if (driverToFind == null) {
                msgArray.pushSet("Driver is invalid.");
            }
        }       

        if (data.OrderQty <= 0 ) {
            msgArray.pushSet("Order quantity is required.");
        }

        if (msgArray.length > 0) {
            for (var i = 0; i < msgArray.length; i++) {
                sbMsg.Append(msgArray[i]);
                sbMsg.Append("<br/>");
            }
        }

        var msgResult = sbMsg.ToString();
        if (msgResult.length > 0) {
            eworkspace.ViewModel.warning(msgResult);
            return;
        }

        if ($.isFunction(callback))
            callback(data);      
    }

    return form;
}

export { VesselDischargeOrderList, VesselDischargeOrderDetails,VesselDischargeOrderForm }
