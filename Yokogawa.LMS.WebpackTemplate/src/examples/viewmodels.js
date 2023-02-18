import React from 'react';
import ReactDOM from 'react-dom';
import services from "./services";
import models from "./models";
//import mycomponents from "./mycomponents";
import App from "./routerexample";
import reactcomponents from "../modules/ReactComponents";
import { Input } from '@progress/kendo-react-inputs';
import {DropDownList,ComboBox} from '@progress/kendo-react-dropdowns';

function routerTest(id,selector){
    let props={
       id:id,
       model:{},
       template:{html:''},
       selector:selector,
       path:'/netflix'
    };

    let page = new reactcomponents.ReactPage(props);
    page.setRenderHandler(function(){
       return <App/>;
   });


}

function helloWorld(id,selector){
  let model = {
       title:"TOM and Jerry",
       data:{ text:'test'}
   }
  let template ={html:''}
   let props = {
                id: id,
                model: model,
                template: template,
                selector:selector
            };
   let page = new reactcomponents.ReactBasePage(props);

   page.setRenderHandler(function(){
       return React.createElement("div",null,React.createElement("h1", null, "Hello " + this.state.title+" "+this.state.data.text));
   });
   
   return page;
   
}

/*function MyWorld(id,selector){
    let model = { 
        title:"User Management",
        buttons:[ {text: "NEW", name: "fa fa-plus"},{text: "SAVE", name: "fa fa-save"},{text: "DELETE", name: "fa fa-trash"}],
        data:{}
    }
    let template = {
        html: '<div><h2 data-bind="text:title"></h2><p><label style="width:80px">Id</label><input type="text" data-bind="value:data.id"  /></p><p><label style="width:80px">Name</label><input type="text" data-bind="value:data.Name"  /></p><p><label style="width:80px">Company</label><input type="text" data-bind="value:data.Company" /></p><p><button data-bind="events:{click:save}" class="k-button" style="margin-right:10px">Save</button><button data-bind="events:{click:search}" class="k-button" style="margin-right:10px">Search</button><button data-bind="events:{click:delete}" class="k-button">Delete</button></p></div>'
    };

    let page = new eworkspace.framework.Form(id,model,template,selector);
    page.setLoadDataHandler(services.createNewUser);

    page.model.new=function(){
        page.display();
    }

    page.model.save=function(){
        var data =page.getData();
        utils.showProcessbar(true);
        services.saveUser(data,function(result){
            utils.showProcessbar(false);
            eworkspace.ViewModel.info("Save the record!");
            page.setData(result);
           
        })
    }

    page.model.search=function(){
        var id =page.getDataByField('id');
        utils.showProcessbar(true);
        services.getUserDetails(id,function(data){
            utils.showProcessbar(false);
            page.setData(data);
        })
    }

    page.model.delete=function(){
        var dialog = new eworkspace.framework.ConfirmationDialog();
        utils.showProcessbar(true);
        dialog.show("Delete Record", "Are you sure to delete the record?", function () {
            var id = page.getDataByField('id');
            services.deleteUser(id, function () {
                utils.showProcessbar(false);
                eworkspace.ViewModel.info('Successfully delete the record!');
                page.display();
            })
        })
    }
    return page;
   
}

function ohWorld(id,selector){
     let model = { 
         title:"User Management",
         buttons:[ {text: "NEW", name: "fa fa-plus"},{text: "SAVE", name: "fa fa-save"},{text: "DELETE", name: "fa fa-trash"}],
         data:{}
   }
 
   let props = {
                id: id,
                model: model,
                template: null,
                selector:selector
            };
   let page = new mycomponents.ReactPageExample(props);   
   //page.setLoadDataHandler(services.createNewUser);


   page.onButtonClick(0,function(){
       page.display();
   })

   page.onButtonClick(1,function(){
       var data = page.getData();
       utils.showProcessbar(true);
       services.saveUser(data,function(result){
           utils.showProcessbar(false);
           page.setData(result);
           eworkspace.ViewModel.info("Save the record!");
       })
   })

   page.onButtonClick(2,function(){
       var dialog = new eworkspace.framework.ConfirmationDialog();
       utils.showProcessbar(true);
       dialog.show("Delete Record", "Are you sure to delete the record?", function () {
           var id = page.getDataByField('id');
           services.deleteUser(id, function () {
               utils.showProcessbar(false);
               eworkspace.ViewModel.info('Successfully delete the record!');
               page.display();
           })
       })
      
   })


   page.setFormHandler(function(data){
       const labelStyle = {
           "width" : "200px"
       }
       const handleChange = (e) =>{ 
           page.setDataByField(e.target.name,e.target.value);
       }
       const searchUser=(e)=>{
           services.getUserDetails(e.target.value,function(data){
               if (data == null)
                   return;
               page.setData(data);
           })
       }
      
       return (
        <form className="form" >
        <p><Input name="id" label="Id"  value={data.id} onChange={searchUser} /></p>
        <p><Input name="Name" label="Name" value={data.Name} onChange={handleChange}  /></p>
        <p><DropDownList name="Company" label="Company" required={true}  
           data={data.CompanyList}
           textField="Name"
           dataItemKey="id"
           value={data.Company}
           onChange={handleChange}
        /></p>
      </form>
       )
    })
    console.info('page viewmodel create')
   return page;
   
}

function hiWorld(id,selector){
    let model ={
        title:"User Form",
        data:null
    }
   let template = {
       html: '<div><h2 data-bind="text:title"></h2><p><label style="width:80px">Id</label><input type="text" data-bind="value:data.id"  /></p><p><label style="width:80px">Name</label><input type="text" data-bind="value:data.Name"  /></p><p><label style="width:80px">Company</label><input type="text" data-bind="value:data.Company" /></p><p><button data-bind="events:{click:save}" class="k-button" style="margin-right:10px">Save</button><button data-bind="events:{click:search}" class="k-button" style="margin-right:10px">Search</button><button data-bind="events:{click:delete}" class="k-button">Delete</button></p></div>'};
   let props = {
                id: id,
                model: model,
                data:null,
                template: template,
                selector:selector,
                className: "listpage"
            };
   let page = new  reactcomponents.KendoReactForm(props); 
   page.setLoadDataHandler(services.createNewUser);

   page.setRenderHandler(function(){
       const labelStyle = {
           "width" : "80px"
       }
       return (
           <div>
           <h2 data-bind="text:title"></h2>
           <p><label data-i18n="Id" style={labelStyle}>Id</label><input type="text" data-bind="value:data.id"  /></p>
           <p><label data-i18n="Name" style={labelStyle}>Name</label><input type="text" data-bind="value:data.Name"  /></p>
           <p><label data-i18n="Company" style={labelStyle}>Company</label><select data-role="dropdownlist"
       data-value-primitive="true"
       data-text-field="Name"
       data-value-field="id"
       data-bind="value: data.Company, source: data.CompanyList"></select></p>
           <p>
            <button data-bind="events:{click:new}" className="k-button" style={{marginRight:'10px'}}>New</button>
            <button data-bind="events:{click:save}" className="k-button" style={{marginRight:'10px'}}>Save</button>
            <button data-bind="events:{click:search}" className="k-button" style={{marginRight:'10px'}}>Search</button>
            <button data-bind="events:{click:delete}" className="k-button">Delete</button></p>
           </div>
       )
       
   });

   page.model.new=function(){
       page.display();
   }

   page.model.save=function(){
       var data =page.getData();
       utils.showProcessbar(true);
       services.saveUser(data,function(result){
           utils.showProcessbar(false);
           eworkspace.ViewModel.info("Save the record!");
           page.setData(result);
           
       })
   }

   page.model.search=function(){
       var id =page.getDataByField('id');
       utils.showProcessbar(true);
       services.getUserDetails(id,function(data){
           utils.showProcessbar(false);
           page.setData(data);
       })
   }

   page.model.delete=function(){
       var dialog = new eworkspace.framework.ConfirmationDialog();
       utils.showProcessbar(true);
       dialog.show("Delete Record", "Are you sure to delete the record?", function () {
           var id = page.getDataByField('id');
           services.deleteUser(id, function () {
               utils.showProcessbar(false);
               eworkspace.ViewModel.info('Successfully delete the record!');
               page.display();
           })
       })
   }

            
   return page;
   
}

 function workflowDiagram (id, selector) {
        var model = { data: [] };
        var page = new eworkspace.framework.WorkflowCanvas(id, model, selector);
        model.pageSelector = page.selector.parent().find('.content_panel');
        return page;
    }

   function MyPanel(id,selector){
       var model = {
           leftPanelSize: "20%",
           leftPanel: { url: "CustomWidget.ViewModel.workflowDiagram", Id: "p1",dataSourceField:'diagram' },
           rightPanel: { url: "CustomWidget.ViewModel.ohWorld", Id: "p2",dataSourceField:"data" },
       }
       var page = new eworkspace.framework.lrsplitpanel(id, model, selector);
       page.setLoadDataHandler(services.getPanelData);
    
       return page;
   }

   function LogList(id, selector) {
       var model = utils.cloneModel(eworkspace.Model.LogList);
       model.buttons.push({ id:'edituser', text: "EDIT", name: "fa-pencil-alt", page: { url: "CustomWidget.ViewModel.MyPanel", Id: "test" } });
            var logList = new eworkspace.framework.ListPage(id, model, selector);
            logList.setLoadDataHandler(eworkspace.Services.getLogList);
            logList.checkedIds = [];

            //delete menu
            logList.onButtonClick(1, function (page) {
                var data = logList.checkedIds;

                if (data != null) {
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        eworkspace.Services.deleteLog(data, function () {
                            logList.display();
                            logList.checkedIds.length = 0;
                            eworkspace.ViewModel.info('Successfully delete the record!');
                        })
                    })
                }
                else {
                    eworkspace.ViewModel.warning('Please select a record');
                    logList.show();
                }
            })

            logList.onButtonClick(2,function(page){
                page.previous =logList;
                var data = logList.getSelectedRow();
                page.display();
            })

            logList.setEventHandler(function () {
                //on dataBound event restore previous selected rows:
                var grid = logList._getGrid();
                grid.content.on("click", ".checkbox", selectRow);

                //on click select all checkbox
                $('.checkAll').click(function (event) {
                    var checked = this.checked;

                    if (checked) {
                        //-select the row
                        $('.checkbox').each(function () {
                            row = $(this).closest("tr"),
                            dataItem = grid.dataItem(row);
                            this.checked = true;
                            row.addClass("k-state-selected");
                            logList.checkedIds.push(dataItem.Id);
                        });
                    } else {
                        //-remove selection
                        $('.checkbox').each(function () {
                            row = $(this).closest("tr"),
                            dataItem = grid.dataItem(row);
                            this.checked = false;
                            row.removeClass("k-state-selected");
                            logList.checkedIds = [];
                        });
                    }
                });

                //on click of the checkbox:
                function selectRow() {
                    var checked = this.checked,
                    row = $(this).closest("tr"),
                    dataItem = grid.dataItem(row);

                    if (checked) {
                        //-select the row
                        row.addClass("k-state-selected");
                        logList.checkedIds.push(dataItem.Id);
                    } else {
                        //-remove selection
                        row.removeClass("k-state-selected");
                        if (logList.checkedIds.indexOf(dataItem.Id) != -1) {
                            logList.checkedIds.splice(logList.checkedIds.indexOf(dataItem.Id), 1);
                        }
                    }

                    if (logList.model.data.length == logList.checkedIds.length) {
                        $('.checkAll').prop('checked', true);
                    } else {
                        $('.checkAll').prop('checked', false);
                    }
                };

            })
            return logList;
}

function niceWorld(id,selector){
    var template = {
        html: "<div class='toolbar' data-role='toolbar' style='margin-bottom:30px'></div>" +
              "<h3 style='margin-left:5px;margin-top:5px;margin-bottom:15px;font-size:16px;'></h3><div class='grid' style='border-width:1px 0px 0px 0px'></div>"
    };
    var model = utils.cloneModel(models.listmodel);
    var page = new mycomponents.list(id, model, selector, template);
    page.onToolBarItemClick(0, function () {
        var parentId = page.Id;
        var pop_window = new eworkspace.ViewModel.SelectUserDialog('select-users', parentId);
        pop_window.display();
    });
    return page;
}

function userList(id,selector)
{
     var userList = new provider[eworkspace.provider].ListPage(id, eworkspace.Model.UserList, selector);
     userList.model.gridOptions.dataSource={
         transport:{
             read:function(options){
                 getUserList(options.data.skip,options.data.take,function(result){
                      options.success(result);
                 })
             },

         },
       pageSize: 2,
       schema: {
           data:"data",
            total: "total" 
       },
       serverPaging: true,
       serverFiltering: true,
       serverSorting: true
     }

     var getUserList=function(skip,take,callback){
         eworkspace.Services.getUserList(function(data){
               var result ={
                   data:[],
                   total:data.length
               };
               result.data=data.slice(skip,take+skip);
               callback(result);

         })
     }
     return userList;
}*/

//export default {helloWorld,hiWorld,ohWorld,LogList,niceWorld,MyPanel,workflowDiagram,userList,routerTest};
export default { helloWorld, routerTest };

