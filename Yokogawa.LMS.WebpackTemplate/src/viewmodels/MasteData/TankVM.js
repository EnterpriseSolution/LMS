import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/TankService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';
import { StringBuilder } from '../../common/Shared';

function TankList(id, selector) {
    var model = uiModels.getTankModel();

    var TankPage = new eworkspace.framework.ListPage(id, model, selector);
    TankPage.setLoadDataHandler(uiServices.getTankList);

    //create
    TankPage.onButtonClickById("new", function (page) {
        var dialog = new TankEditDialog('Tank-edit', [""], TankPage);
        dialog.list = TankPage;
        dialog.show();
    });

    TankPage.onButtonClickById("edit", function (page) {

        var data = TankPage.getSelectedRow();

        if (data != null) {
            var dialog = new TankEditDialog('Tank-edit', [data.Id], TankPage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            TankPage.show();
        }

    });

    TankPage.onButtonClickById("delete", function (page) {
        var data = TankPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function() {
                uiServices.deleteTank(data.Id, function (json) {
                    if (json === "Deleted") {
                        eworkspace.ViewModel.info('Successfully delete the tank');
                        TankPage.display();
                    } else {
                        eworkspace.ViewModel.info('Tank delete error <br/>' + json);
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

    return TankPage;
}

function TankForm(id, selector) {
    var template = { Id: 'TankForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getTankDetails);  

    page.save = function (callback) {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();
        debugger;
        var sbMsg = new StringBuilder();
        var msgArray = new Array();

        if (data.TankNo == null || data.TankNo.length === 0) {
            msgArray.pushSet("Tank No. is required.");
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
            uiServices.checkTankExist(data.TankNo,
                function(json) {
                    if (json === true) {
                        uiServices.saveTank(data,
                            function() {
                                eworkspace.ViewModel.info('Save tank successfully');
                                if ($.isFunction(callback))
                                    callback();
                            },
                            function(error) {
                                eworkspace.ViewModel.info('Save tank error<br/>' + error.responseText);
                                if ($.isFunction(callback))
                                    callback();
                            });
                    }

                    if (json === false) {
                        eworkspace.ViewModel.info('Tank already exists');
                        return;
                    }
                });
        } else {
            uiServices.saveTank(data, function () {
                    eworkspace.ViewModel.info('Save tank successfully');
                    if ($.isFunction(callback))
                        callback();
                },
                function (error) {
                    eworkspace.ViewModel.info('Save tank error<br/>' + error.responseText);
                    if ($.isFunction(callback))
                        callback();
                });
        }
    }
    return page;
}

function TankEditDialog(id, params, parent) {
    var model = {
        title: "Tank Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".TankForm", Id: "TankForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {     
        var TankForm = dialog.getContentPage();
        TankForm.save(function () {    
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


export { TankList, TankForm, TankEditDialog }
