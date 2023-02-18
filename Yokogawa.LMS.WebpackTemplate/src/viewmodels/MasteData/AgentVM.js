import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/MasterData/AgentService';
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';


function AgentList(id, selector) {
    var model = uiModels.getAgentModel();

    var Agentpage = new eworkspace.framework.ListPage(id, model, selector);
    Agentpage.setLoadDataHandler(uiServices.getAgentList);

    //create
    Agentpage.onButtonClickById("new", function (page) {
        var dialog = new AgentEditDialog('Agent-edit', [""], Agentpage);
        dialog.show();
    });

    Agentpage.onButtonClickById("edit", function (page) {

        var data = Agentpage.getSelectedRow();

        if (data != null) {
            var dialog = new AgentEditDialog('Agent-edit', [data.Id], Agentpage);
            dialog.show();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            Agentpage.show();
        }

    });

    Agentpage.onButtonClickById("delete", function (page) {
        var data = Agentpage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteAgent(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                     Agentpage.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            Agentpage.show();
        }
    });

    Agentpage.setEventHandler(function (page) {
        $('#' + Agentpage.Id).on("mouseover", "th[scope='col']", function (e) {
          var targetField = $(e.target).attr("data-field");
           $(e.target).children("a").attr("title", targetField);
        });

        $('#' + Agentpage.Id).on("mouseover", "table[role='grid'] tbody[role='rowgroup'] tr[role='row']", function (e) {
           var targetField = $(e.target).html();
           $(e.target).attr("title", targetField);
            
            
            
        });

});

    return Agentpage;
}

function  AgentForm(id, selector) {
    var template = { Id: 'AgentForm', url: "src/view/masterdata.html" }
    var model = { data: null };
    var page = new eworkspace.framework.Form(id, model, template, selector);
    page.setLoadDataHandler(uiServices.getAgentDetails) ;
    page.save = function () {
        if (page.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = page.getData();
        uiServices.saveAgent(data, function (Agent) {
            page.setData(Agent);
            eworkspace.ViewModel.info('Save the Agent!');
        })

    }
    return page;
}

function AgentEditDialog(id, params, Agentpage) {
    var model = {
        title: "Agent Details",
        width: 800,
        content: { url: AppConfig.viewModelName + ".AgentForm", Id: "AgentForm", displayParams: params }
    }
    var dialog = new eworkspace.framework.DialogWindow(id, model);

    var save = function () {
        var agentForm = dialog.pages[dialog.model.content.Id];
        agentForm.save();
        dialog.close();
        Agentpage.display();
       
    }
    var cancel = function () {
        dialog.close();
        
    }

    dialog.model.buttons = [{ text: "SAVE", onClick: save }, { text: "CANCEL", onClick: cancel }]
    return dialog;
}


export { AgentList, AgentForm, AgentEditDialog }
