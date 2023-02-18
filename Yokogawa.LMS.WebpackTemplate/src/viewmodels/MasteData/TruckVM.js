import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/TruckService';
import * as ComServices from '../../services/MasterData/CompartmentService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';

var FieldNameMap = new Map();
FieldNameMap.set("ProductName", "ProductName");


function TruckList(id, selector) {
    var model = uiModels.getTruckModel();

    var truckList = new eworkspace.framework.ListPage(id, model, selector);
    truckList.setLoadDataHandler(uiServices.getTruckList);

    //create
    truckList.onButtonClickById("new", function (page) {
        var truckDialog = new TruckEditDialog('Truck-edit', [""], truckList);
        truckDialog.show();
    });

    truckList.onButtonClickById("edit", function (page) {

        var data = truckList.getSelectedRow();

        if (data != null) {
            var dialog = new TruckEditDialog('Truck-edit', [data.Id], truckList);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            truckList.show();
        }

    });

    truckList.onButtonClickById("delete", function (page) {
        var data = truckList.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteTruck(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    truckList.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            truckList.show();
        }
    });

    return truckList;
}

function TruckEditDialog(id, params, truckPage) {
    var model = {
        title: "Truck Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".TruckForm", Id: "TruckForm", displayParams: params }
    }
    var truckDialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {
        var TruckForm = truckDialog.pages[truckDialog.model.content.Id];
        TruckForm.save(truckDialog, truckPage);
    }
    var cancel = function () {
        var TruckForm = truckDialog.pages[truckDialog.model.content.Id];
        TruckForm.close(truckDialog);
    }

    truckDialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return truckDialog;
}


function TruckForm(id, selector) {
    var template = { Id: 'TruckForm', url: "src/view/masterdata.html" }
    var model = {
        data: null
    };
    var truckForm = new eworkspace.framework.Form(id, model, template, selector);
    truckForm.setLoadDataHandler(uiServices.getTruckDetails);
   
    truckForm.save = function (dialog, truckPage) {
        if (truckForm.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = truckForm.getData();
        var grid = GetGrid(truckForm.Id, "CompartmentList");
        data.Compartments = grid.dataSource.data();
        uiServices.saveTruck(data, function (truck) {
            truckForm.setData(truck);
            grid.dataSource.data(truck.Compartments);
            $("div.k-overlay").css({ "display": "none" });
            dialog.close();
            eworkspace.ViewModel.info('Save the Truck!');
            truckPage.display();
            //$('#' + truckForm.Id).parent().data("kendoWindow").refresh();
         })

    }

    truckForm.close = function (dialog) {
        dialog.close();
        $("div.k-overlay").css({ "display": "none" });
        
    }

    truckForm.setEventHandler(function (truckForm) {
        $('#' + truckForm.Id).on("click", "#AddCompartment", function (e) {
           if (GetGrid(truckForm.Id, "CompartmentList").dataSource.data().length > 6) {
                eworkspace.ViewModel.error('The number of Compartments can not beyond Six');
                return;
            }
            ShowCompartmentEditDialog(truckForm);

        })
    });

    return truckForm;
}




function ShowCompartmentEditDialog(truckForm,id) {
    $('#' + truckForm.Id).hide();
    var oriTopLength = $('#' + truckForm.Id).parent().parent().css("top");
    var oriSaveFunction = truckForm.save;
    var oriCloseFunction = truckForm.close;

    var compartmentDialog = id == null ? new CompartmentDialog('Compartment-edit', [""]) : new CompartmentDialog('Compartment-edit',[id]);
    compartmentDialog.show();
    var compartmentForm = compartmentDialog.pages[compartmentDialog.model.content.Id];

    truckForm.save = function () {
        if (compartmentForm.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        SetGridData(truckForm, compartmentForm, "CompartmentList");
        CloseCompartmentForm(compartmentForm, truckForm, oriSaveFunction, oriCloseFunction, oriTopLength);
    }

    truckForm.close = function () {
        CloseCompartmentForm(compartmentForm, truckForm, oriSaveFunction, oriCloseFunction, oriTopLength);
    }

}

function CompartmentDialog(id, params) {
    var model = {
        title: "Compartment Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".TCompartmentForm", Id: "TCompartmentForm", displayParams: params }
    }
    var compartmentdialog = new eworkspace.framework.DialogWindow(id, model);
    return compartmentdialog;
}

function TCompartmentForm(id, selector) {
    var template = { Id: 'CompartmentForm', url: "src/view/masterdata.html" }
    var model = { title: "Compartment Details", data: "" };
    var Form = new eworkspace.framework.Form(id, model, template, selector);
    Form.setLoadDataHandler(ComServices.getCompartmentDetails);
    return Form;
}



function CloseCompartmentForm(compartmentForm, truckFrom, oriSaveFunction, oriCloseFunction, oriTopLength){
    $('#' + compartmentForm.Id).remove();
    $('#' + truckFrom.Id).parent().siblings(".k-window-titlebar").find("span").text("Truck Details");
    $('#' + truckFrom.Id).parent().parent().css("top", oriTopLength);
    $('#' + truckFrom.Id).show();
    truckFrom.close = oriCloseFunction;
    truckFrom.save = oriSaveFunction;

}

function GetGrid(Id, labelName) {
    return $('#' + Id).find("ul#"+labelName).data("kendoGrid");
}

function GetDropDownList(Id, labelName) {
    return $('#' + Id).find("select[name=" + labelName + "]").data("kendoComboBox");
}

function SetGridData(oldFrom, currentFrom, labelName) {
    FieldNameMap.forEach(function (fromFieldName, guidFieldName) {
        var tmp = GetDropDownList(currentFrom.Id, fromFieldName);
        var tmpval = tmp.text();
        currentFrom.setDataByField(guidFieldName, tmpval);
    });

    GetGrid(oldFrom.Id, labelName).dataSource.data().push(currentFrom.getData());

}



export { TruckList, TruckForm, TruckEditDialog, TCompartmentForm, CompartmentDialog }
