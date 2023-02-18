import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/masterDataService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';


function JettyList(id, selector) {
    var model = uiModels.getJettyModel();

    var jettyPage = new eworkspace.framework.ListPage(id, model, selector);
    jettyPage.setLoadDataHandler(uiServices.getJettyList);

    //create
    jettyPage.onButtonClickById("new", function (page) {
        var dialog = new JettyEditDialog('jetty-edit', [""]);
        dialog.show();
    });

    jettyPage.onButtonClickById("edit", function (page) {
        
        var data = jettyPage.getSelectedRow();

        if (data != null) {
            var dialog = new JettyEditDialog('jetty-edit', [data.Id]);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            jettyPage.show();
        }

    });

    jettyPage.onButtonClickById("delete", function (page) {
        var data = jettyPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteJetty(data.Id, function () {
                   eworkspace.ViewModel.info('Successfully delete the record!');
                })
              
            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            jettyPage.show();
        }
    });
    //jettyPage.setEventHandler(function (page) {

    //    $('#' + jettyPage.Id).on("click", "td[data-field='JettyNo']", function (page) {

    //        var data = jettyPage.getSelectedRow();

    //        if (data != null) {
    //            var dialog = new JettyEditDialog('jetty-edit', [data.Id]);
    //            dialog.show();
    //        }
    //        else {
    //            eworkspace.ViewModel.warning('Please select a record');
    //            jettyPage.show();
    //        }

    //    });

    //});
    

    return jettyPage;
}

function JettyForm(id, selector) {
    var template = { Id: 'jettyform', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getJettyDetails);
    page.save = function () {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();
        uiServices.saveJetty(data, function () {
            eworkspace.ViewModel.info('Save the record!');
        })

    }
    return page;
}

function JettyEditDialog (id, params) {
    var model = {
        title: "Jetty Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".JettyForm", Id: "jettyform", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);
 
    var save = function () {
        var jettyForm = dialog.pages[dialog.model.content.Id];
        jettyForm.save();
    }
    var cancel = function () {
        dialog.close();
    }

    dialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return dialog;
}

export { JettyList, JettyForm, JettyEditDialog }
