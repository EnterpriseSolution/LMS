import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/CompartmentService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';


function CompartmentList(id, selector) {
    var model = uiModels.getCompartmentModel();

    var Compartmentpage = new eworkspace.framework.ListPage(id, model, selector);
    Compartmentpage.setLoadDataHandler(uiServices.getCompartmentList);

    //create
    Compartmentpage.onButtonClickById("new", function (page) {
        var dialog = new CompartmentEditDialog('Compartment-edit', [""], Compartmentpage);
        dialog.show();
    });

    Compartmentpage.onButtonClickById("edit", function (page) {

        var data = Compartmentpage.getSelectedRow();

        if (data != null) {
            var dialog = new CompartmentEditDialog('Compartment-edit', [data.Id], Compartmentpage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            Compartmentpage.show();
        }

    });

    Compartmentpage.onButtonClickById("delete", function (page) {
        var data = Compartmentpage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteCompartment(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    Compartmentpage.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            Compartmentpage.show();
        }
    });

    Compartmentpage.setEventHandler(function (page) {
        $('#' + Compartmentpage.Id).on("mouseover", "th[scope='col']", function (e) {
            var targetField = $(e.target).attr("data-field");
            $(e.target).children("a").attr("title", targetField);
        });

        $('#' + Compartmentpage.Id).on("mouseover", "table[role='grid'] tbody[role='rowgroup'] tr[role='row']", function (e) {
            var targetField = $(e.target).html();
            $(e.target).attr("title", targetField);
        });

    });

    return Compartmentpage;
}

function CompartmentForm(id, selector) {
    var template = { Id: 'CompartmentForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getCompartmentDetails);
    page.setFormLoadedHandler(function () {
        var data = page.getData();
        if (data.CompartmentId !=null ) {
           $('#' + page.Id).find('input[name="Remarks"]').attr("disabled", true).addClass("k-state-disabled");
        } else {
            $('#' + page.Id).find('input[name="Remarks"]').attr("disabled", false).removeClass("k-state-disabled");
        }
       
    });

    page.save = function () {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();
        data.ProductId = $('#' + page.Id).find("select[data-role='dropdownlist']").data("kendoDropDownList").value();
        uiServices.saveCompartment(data, function (Compartment) {
            page.setData(Compartment);
            eworkspace.ViewModel.info(' Save the Compartment!');
        })

    }
   

    return page;
}

function CompartmentEditDialog(id, params, Compartmentpage) {
    var model = {
        title: "Compartment Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".CompartmentForm", Id: "CompartmentForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);
    
    var save = function () {
        var CompartmentForm = dialog.pages[dialog.model.content.Id];
        CompartmentForm.save();
        dialog.close();
        Compartmentpage.display();
        
    }
    var cancel = function () {
        dialog.close();
        
    }

    dialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return dialog;
}


export { CompartmentList, CompartmentForm, CompartmentEditDialog }

