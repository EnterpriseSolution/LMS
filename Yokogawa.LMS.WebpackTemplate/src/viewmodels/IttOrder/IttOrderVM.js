import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/IttOrder/IttOrderService';
import uiModels from './IttOrderModels';

import { CommonGridEditors } from '../../common/CommonGridEditor';


function IttOrderList(id, selector) {
    var model = uiModels.getIttOrderModel();

    var IttOrderPage = new eworkspace.framework.ListPage(id, model, selector);
    IttOrderPage.setLoadDataHandler(uiServices.getIttOrderList);

    //create
    IttOrderPage.onButtonClickById("new", function (page) {
       // $('#' + IttOrderPage.Id).find("ul li[name='new']").attr("sytle", "clicked");
        page.navigate("id=null");
    });

    IttOrderPage.onButtonClickById("edit", function (page) {
        $('#' + IttOrderPage.Id).find("ul li[name='edit']").attr("sytle", "clicked");
        var data = IttOrderPage.getSelectedRow();

        if (data != null) {
            page.navigate("id=" + data.Id);
           // page.display();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            IttOrderPage.show();
        }

    });

    IttOrderPage.onButtonClickById("delete", function (page) {
        var data = IttOrderPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteIttOrder(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    IttOrderPage.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            IttOrderPage.show();
        }
    });

    return IttOrderPage;
}

function MainIttOrder(id, selector) {
    var model = uiModels.getMainIttOrder();
    var MainIttOrder = new eworkspace.framework.WorkflowPage("MainIttOrder", model, selector);
    MainIttOrder.setLoadDataHandler(uiServices.getIttOrderDetails);

    MainIttOrder.onPageTabClickById('IttOrder', function (page) {
        var ClickedButton = $('#' + MainIttOrder.parent.Id).find("ul li[sytle='clicked']");
        var grid = MainIttOrder.parent.getSelectedRow();
            if (grid != null && "edit" == ClickedButton.attr("name")) {
                page.display(grid.Id);
            } else {
                page.display("");
            }
            ClickedButton.removeAttr("sytle");

        
      

    })
    //save
    MainIttOrder.onToolBarItemClick(1, function () {
        var IttOrder = MainIttOrder.getNavigationPageById('IttOrder');
        IttOrder.save(MainIttOrder,function (data) {
            uiServices.saveIttOrder(data, function () {
                eworkspace.ViewModel.info("Save the record!");
            })

        }
        );
        

    });
    //close
    MainIttOrder.onToolBarItemClick(2, function () {
        $(".k-widget.k-upload").find("ul").remove();
        MainIttOrder.parent.navigate();
    });
    //delete
    MainIttOrder.onToolBarItemClick(3, function () {
        var dialog = new eworkspace.framework.ConfirmationDialog();
        dialog.show("Delete Record", "Are you sure to delete the record?", function () {
            var id = MainIttOrder.model.data.Id;
            uiServices.deleteIttOrder(id, function () {
                ui.info('Successfully delete the record!');
                MainIttOrder.parent.display();  
            })
        })

    });
    return MainIttOrder;
}

function IttOrderForm(id, selector) {
    var template = { Id: 'IttOrderForm', url: "src/view/IttOrder.html" }
    var model = { data: null };
    var form = new eworkspace.framework.Form(id, model, template, selector);
    form.setLoadCompletedHandler(function (data) {
    });
    form.save = function (MainIttOrder,callback) {
        if (form.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = form.getData();

        if ($.isFunction(callback))
            callback(data);

        $(".k-widget.k-upload").find("ul").remove();
        MainIttOrder.parent.navigate();
    }
    return form;
}




export { IttOrderList, IttOrderForm, MainIttOrder }
