import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/DriverService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';


function DriverList(id, selector) {
    var model = uiModels.getDriverModel();

    var DriverPage = new eworkspace.framework.ListPage(id, model, selector);
    DriverPage.setLoadDataHandler(uiServices.getDriverList);

    //create
    DriverPage.onButtonClickById("new", function (page) {
        var dialog = new DriverEditDialog('Driver-edit', [""], DriverPage);
        dialog.show();
    });

    DriverPage.onButtonClickById("edit", function (page) {

        var data = DriverPage.getSelectedRow();

        if (data != null) {
            var dialog = new DriverEditDialog('Driver-edit', [data.Id], DriverPage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            DriverPage.show();
        }

    });

    DriverPage.onButtonClickById("delete", function (page) {
        var data = DriverPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteDriver(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    DriverPage.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            DriverPage.show();
        }
    });

    return DriverPage;
}

function DriverForm(id, selector) {
    var template = { Id: 'DriverForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getDriverDetails);
  
    page.save = function () {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();
        uiServices.saveDriver(data, function (Driver) {
            page.setData(Driver);
            eworkspace.ViewModel.info('Save the Driver!');
        })

    }
    return page;
}

function DriverEditDialog(id, params, driverPage) {
    var model = {
        title: "Driver Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".DriverForm", Id: "DriverForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {
        var DriverForm = dialog.pages[dialog.model.content.Id];
        DriverForm.save();
        dialog.close();
        driverPage.display();
        
    }
    var cancel = function () {
        dialog.close();
        
    }

    dialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return dialog;
}


export { DriverList, DriverForm, DriverEditDialog }
