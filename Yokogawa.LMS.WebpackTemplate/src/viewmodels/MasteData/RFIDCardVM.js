import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/RFIDCardService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';
import { StringBuilder } from '../../common/Shared';

function RFIDCardList(id, selector) {
    var model = uiModels.getRFIDCardModel();

    var RFIDCardPage = new eworkspace.framework.ListPage(id, model, selector);
    RFIDCardPage.setLoadDataHandler(uiServices.getRFIDCardList);

    //create
    RFIDCardPage.onButtonClickById("new", function (page) {
        var dialog = new RFIDCardEditDialog('RFIDCard-edit', [""], RFIDCardPage);
        dialog.show();
    });

    RFIDCardPage.onButtonClickById("edit", function (page) {

        var data = RFIDCardPage.getSelectedRow();

        if (data != null) {
            var dialog = new RFIDCardEditDialog('RFIDCard-edit', [data.Id], RFIDCardPage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            RFIDCardPage.show();
        }

    });

    RFIDCardPage.onButtonClickById("delete", function (page) {   
        var data = RFIDCardPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteRFIDCard(data.Id, function (json) {
                    if (json === "Deleted") {
                        eworkspace.ViewModel.info('Successfully delete the card');
                        RFIDCardPage.display();
                    } else {
                        eworkspace.ViewModel.info('Card delete error <br/>' + json);
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
    return RFIDCardPage;
}

function RFIDCardForm(id, selector) {
    var template = { Id: 'RFIDCardForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getRFIDCardDetails);
    page.save = function (callback) {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();                          
        var sbMsg = new StringBuilder();
        var msgArray = new Array();

        if (data.CardNo == null || data.CardNo.length === 0) {
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
            uiServices.checkCardExist(data.CardNo,
                function (json) {
                    if (json === true) {
                        uiServices.saveRFIDCard(data,
                            function () {
                                eworkspace.ViewModel.info('Save card successfully');
                                if ($.isFunction(callback))
                                    callback();
                            },
                            function (error) {
                                eworkspace.ViewModel.info('Save card error<br/>' + error.responseText);
                                if ($.isFunction(callback))
                                    callback();
                            });
                    }

                    if (json === false) {
                        eworkspace.ViewModel.info('Card already exists');
                        return;
                    }
                });
        } 
        else {
            uiServices.saveRFIDCard(data, function () {
                eworkspace.ViewModel.info('Save card successfully');
                if ($.isFunction(callback))
                    callback();
            },
                function (error) {
                    eworkspace.ViewModel.info('Save card error<br/>' + error.responseText);
                    if ($.isFunction(callback))
                        callback();
                });
        }        
    }
    return page;
}

function RFIDCardEditDialog(id, params, parent) {
    var model = {
        title: "RFIDCard Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".RFIDCardForm", Id: "RFIDCardForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {
        var cardForm = dialog.getContentPage();
        cardForm.save(function () {
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


export { RFIDCardList, RFIDCardForm, RFIDCardEditDialog }
