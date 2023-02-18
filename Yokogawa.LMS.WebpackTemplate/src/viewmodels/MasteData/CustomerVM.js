import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/CustomerService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';


function CustomerList(id, selector) {
    var model = uiModels.getCustomerModel();

    var CustomerPage = new eworkspace.framework.ListPage(id, model, selector);
    CustomerPage.setLoadDataHandler(uiServices.getCustomerList);

    //create
    CustomerPage.onButtonClickById("new", function (page) {
        var dialog = new CustomerEditDialog('Customer-edit', [""], CustomerPage);
        dialog.show();
    });

    CustomerPage.onButtonClickById("edit", function (page) {

        var data = CustomerPage.getSelectedRow();

        if (data != null) {
            var dialog = new CustomerEditDialog('Customer-edit', [data.Id], CustomerPage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            CustomerPage.show();
        }

    });

    CustomerPage.onButtonClickById("delete", function (page) {
        var data = CustomerPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteCustomer(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    CustomerPage.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            CustomerPage.show();
        }
    });

    return CustomerPage;
}

function CustomerForm(id, selector) {
    var template = { Id: 'CustomerForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getCustomerDetails);
    page.save = function () {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();
        uiServices.saveCustomer(data, function (Customer) {
            page.setData(Customer);
            eworkspace.ViewModel.info('Save the Customer!');
        })

    }
    return page;
}

function CustomerEditDialog(id, params, CustomerPage) {
    var model = {
        title: "Customer Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".CustomerForm", Id: "CustomerForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {
        var CustomerForm = dialog.pages[dialog.model.content.Id];
        CustomerForm.save();
        dialog.close();
        CustomerPage.display();
        
    }
    var cancel = function () {
        dialog.close();
        
    }

    dialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return dialog;
}


export { CustomerList, CustomerForm, CustomerEditDialog }
