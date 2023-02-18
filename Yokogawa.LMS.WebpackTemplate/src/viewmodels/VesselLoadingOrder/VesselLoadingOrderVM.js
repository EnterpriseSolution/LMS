import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/VesselLoadingOrder/VesselLoadingOrderService';
import  uiModels from './VesselLoadingOrderModels';

import { CommonGridEditors } from '../../common/CommonGridEditor';


function VesselLoadingOrderList(id, selector) {
    var model = uiModels.getVesselLoadingOrderModel();

    var VesselLoadingOrderPage = new eworkspace.framework.ListPage(id, model, selector);
    VesselLoadingOrderPage.setLoadDataHandler(uiServices.getVesselLoadingOrderList);

    //create
    VesselLoadingOrderPage.onButtonClickById("new", function (page) {
        page.navigate("id=null") ;
    });

    VesselLoadingOrderPage.onButtonClickById("edit", function (page) {

        var data = VesselLoadingOrderPage.getSelectedRow();

        if (data != null) {
            page.navigate("id=" + data.Id);
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            VesselLoadingOrderPage.show();
        }

    });

    VesselLoadingOrderPage.onButtonClickById("delete", function (page) {
        var data = VesselLoadingOrderPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteVesselLoadingOrder(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    VesselLoadingOrderPage.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            VesselLoadingOrderPage.show();
        }
    });

    return VesselLoadingOrderPage;
}

function VesselMainOrder(id, selector) {
    var model = uiModels.getMainLoadingOrder();
    var mainOrder = new eworkspace.framework.WorkflowPage("MainOrder", model, selector);
    mainOrder.setLoadDataHandler(uiServices.getVesselLoadingOrderDetails);
    //save
    mainOrder.onToolBarItemClick(1, function () {
        var OrderForm = mainOrder.getNavigationPageById('OrderForm');
        OrderForm.save(mainOrder,function (data) {
            uiServices.saveVesselLoadingOrder(data, function () {
                eworkspace.ViewModel.info("Save the record!");
               
                
            })
           
           }
        );
      

    });
    //close
    mainOrder.onToolBarItemClick(2, function () {
        $(".k-widget.k-upload").find("ul").remove();
        mainOrder.parent.navigate();
    });
    //delete
    mainOrder.onToolBarItemClick(3, function () {
        var dialog = new eworkspace.framework.ConfirmationDialog();
        dialog.show("Delete Record", "Are you sure to delete the record?", function () {
            var id = mainOrder.model.data.Id;
            uiServices.deleteVesselLoadingOrder(id, function () {
                ui.info('Successfully delete the record!');
                mainOrder.parent.display();
            })
        })

    });
    return mainOrder;
}

function VesselLoadingOrderForm(id, selector) {
    var template = { Id: 'VesselLoadingOrderForm', url: "src/view/VesselLoadingOrder.html" }
    var model = { data: null };
    var form = new eworkspace.framework.Form(id, model, template, selector);
    form.setLoadCompletedHandler(function (data) {
    });
    form.save = function (mainOrder,callback) {
        if (form.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = form.getData();

        if ($.isFunction(callback))
            callback(data);
        $(".k-widget.k-upload").find("ul").remove();
        mainOrder.parent.navigate();
    }
    return form;
}




export { VesselLoadingOrderList, VesselLoadingOrderForm, VesselMainOrder }
