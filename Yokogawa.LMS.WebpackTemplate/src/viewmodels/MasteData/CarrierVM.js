import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/CarrierService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';


function CarrierList(id, selector) {
    var model = uiModels.getCarrierModel();

    var Carrierpage = new eworkspace.framework.ListPage(id, model, selector);
    Carrierpage.setLoadDataHandler(uiServices.getCarrierList);

    //create
    Carrierpage.onButtonClickById("new", function (page) {
        var dialog = new CarrierEditDialog('Carrier-edit', [""], Carrierpage);
        dialog.show();
    });

    Carrierpage.onButtonClickById("edit", function (page) {

        var data = Carrierpage.getSelectedRow();

        if (data != null) {
            var dialog = new CarrierEditDialog('Carrier-edit', [data.Id], Carrierpage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            Carrierpage.show();
        }

    });

    Carrierpage.onButtonClickById("delete", function (page) {
        var data = Carrierpage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteCarrier(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    Carrierpage.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            Carrierpage.show();
        }
    });

    Carrierpage.setEventHandler(function (page) {
        $('#' + Carrierpage.Id).on("mouseover", "th[scope='col']", function (e) {
            var targetField = $(e.target).attr("data-field");
            $(e.target).children("a").attr("title", targetField);
        });

        $('#' + Carrierpage.Id).on("mouseover", "table[role='grid'] tbody[role='rowgroup'] tr[role='row']", function (e) {
            var targetField = $(e.target).html();
            $(e.target).attr("title", targetField);



        });

    });

    return Carrierpage;
}

function CarrierForm(id, selector) {
    var template = { Id: 'CarrierForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getCarrierDetails);
    page.save = function () {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();
        uiServices.saveCarrier(data, function (Carrier) {
            page.setData(Carrier);
            eworkspace.ViewModel.info('Save the Carrier!');
            
        })

    }
    return page;
}

function CarrierEditDialog(id, params, Carrierpage) {
    var model = {
        title: "Carrier Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".CarrierForm", Id: "CarrierForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {
        var CarrierForm = dialog.pages[dialog.model.content.Id];
        CarrierForm.save(Carrierpage);
        dialog.close();
        Carrierpage.display();
        
    }
    var cancel = function () {
        dialog.close();
       
    }

    dialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return dialog;
}


export { CarrierList, CarrierForm, CarrierEditDialog }

