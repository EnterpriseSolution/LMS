import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/VesselService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';
import { StringBuilder } from '../../common/Shared';

function VesselList(id, selector) {
    var model = uiModels.getVesselModel();

    var VesselPage = new eworkspace.framework.ListPage(id, model, selector);
    VesselPage.setLoadDataHandler(uiServices.getVesselList);

    //create
    VesselPage.onButtonClickById("new", function (page) {
        var dialog = new VesselEditDialog('Vessel-edit', [""], VesselPage);
        dialog.show();
    });

    VesselPage.onButtonClickById("edit", function (page) {

        var data = VesselPage.getSelectedRow();

        if (data != null) {
            var dialog = new VesselEditDialog('Vessel-edit', [data.Id], VesselPage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            VesselPage.show();
        }

    });

    VesselPage.onButtonClickById("delete", function (page) {
        var data = VesselPage.getSelectedRow();       
        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteVessel(data.Id, function (json) {
                    if (json === "Deleted") {
                        eworkspace.ViewModel.info('Successfully delete the vessel');
                        VesselPage.display();
                    } else {
                        eworkspace.ViewModel.info('Vessel delete error <br/>' + json);
                        return;
                    }
                });

            });
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            TankPage.show();
        }
    });

    return VesselPage;
}

function VesselForm(id, selector) {
    var template = { Id: 'VesselForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getVesselDetails);
    page.save = function (callback) {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();

        var sbMsg = new StringBuilder();
        var msgArray = new Array();

        if (data.VesselName == null || data.VesselName.length === 0) {
            msgArray.pushSet("Vessel Name is required.");
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

        var id = data.Id;
        if (id === utils.getEmptyGUID()) {
            uiServices.checkVesselExist(data.VesselName,
                function (json) {
                    if (json === true) {
                        uiServices.saveVessel(data,
                            function () {
                                eworkspace.ViewModel.info('Save vessel successfully');
                                if ($.isFunction(callback))
                                    callback();
                            },
                            function (error) {
                                eworkspace.ViewModel.info('Save vessel error<br/>' + error.responseText);
                                if ($.isFunction(callback))
                                    callback();
                            });
                    }

                    if (json === false) {
                        eworkspace.ViewModel.info('Vessel already exists');
                        return;
                    }
                });
        } else {
            uiServices.saveVessel(data, function () {
                eworkspace.ViewModel.info('Save vessel successfully');
                if ($.isFunction(callback))
                    callback();
            },
                function (error) {
                    eworkspace.ViewModel.info('Save vessel error<br/>' + error.responseText);
                    if ($.isFunction(callback))
                        callback();
                });
        }
    }   
    return page;
}

function VesselEditDialog(id, params, parent) {
    var model = {
        title: "Vessel Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".VesselForm", Id: "VesselForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {       
        var VesselForm = dialog.getContentPage();
        VesselForm.save(function () {
            dialog.close();
            parent.display()
        });
    }
    var cancel = function () {
        dialog.close();
    }

    dialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return dialog;
}


export { VesselList, VesselForm, VesselEditDialog }
