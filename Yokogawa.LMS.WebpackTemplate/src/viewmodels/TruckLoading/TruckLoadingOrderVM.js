import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/TruckLoading/OdTruckLoadingOrderService';
import * as jobServices from '../../services/TruckLoading/OdTruckLoadingJobService';
import uiModels from './TruckLoadingModels';
import { CommonGridEditors } from '../../common/CommonGridEditor';

var FieldNameMap = new Map();
FieldNameMap.set("ProductName", "ProductId");
FieldNameMap.set("CompartmentNo", "CompartmentId");
FieldNameMap.set("CustomerName", "CustomerId");


function OdTruckLoadingOrderList(id, selector) {
    var model = uiModels.getOdTruckLoadingOrderModel();

    var OdTruckLoadingOrderPage = new eworkspace.framework.ListPage(id, model, selector);
    OdTruckLoadingOrderPage.setLoadDataHandler(uiServices.getOdTruckLoadingOrderList);

    //create
    OdTruckLoadingOrderPage.onButtonClickById("new", function (page) {
        $('#' + OdTruckLoadingOrderPage.Id).find("ul li[name='new']").attr("sytle", "clicked");
        page.display();
    });

    OdTruckLoadingOrderPage.onButtonClickById("edit", function (page) {
        $('#' + OdTruckLoadingOrderPage.Id).find("ul li[name='edit']").attr("sytle", "clicked");
        var grid = OdTruckLoadingOrderPage.getSelectedRow();

        if (grid != null) {
            page.display();
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            OdTruckLoadingOrderPage.show();
        }
    });

    OdTruckLoadingOrderPage.onButtonClickById("delete", function (page) {
        var data = OdTruckLoadingOrderPage.getSelectedRow();

        if (data != null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteOdTruckLoadingOrder(data.Id, function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    OdTruckLoadingOrderPage.display();
                })

            })
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            OdTruckLoadingOrderPage.show();
        }
    });

    return OdTruckLoadingOrderPage;
}

 
    
function MainOrder(id, selector) {
    var model = uiModels.MainOrder();
    var mainOrder = new eworkspace.framework.WorkflowPage("MainOrder", model, selector);
    mainOrder.isCreated = true;
    mainOrder.setFormLoadedHandler(function () {
        GetNavigationButton(mainOrder, 1).css({ "pointer-events": "none", "background-color": "#D3D3D3" });
       
    });
    mainOrder.onPageTabClickById('jobTab', function (page) {
        
        
    })
    mainOrder.onPageTabClickById('orderTab', function (page) {
        var ClickedButton = $('#' + mainOrder.parent.Id).find("ul li[sytle='clicked']");
        if (mainOrder.isCreated) {
            mainOrder.isCreated = false;
            var grid = mainOrder.parent.getSelectedRow();
            if (grid != null && "edit" == ClickedButton.attr("name")) {
                page.display(grid.Id);
            } else {
                page.display("");
               
               
            }
            ClickedButton.removeAttr("sytle");
           
        }
        else {
            page.show();
        }

    })
    //new
    mainOrder.onToolBarItemClick(0,  function () {
        mainOrder.display(null);
    });
    //save
    mainOrder.onToolBarItemClick(1, function () {
        var jobForm = GetNavigationPage(mainOrder, 1);
        var orderForm = GetNavigationPage(mainOrder, 0);
        if (!jobForm.unCompleted) {
            orderForm.save();
        } else {
            jobForm.save(orderForm);
            var Nav_Job = GetNavigationButton(mainOrder, 1);
            Nav_Job.css({ "pointer-events": "none", "background-color": "#D3D3D3"  });
        }
    });
    //close
    mainOrder.onToolBarItemClick(2, function () {
        var jobForm = GetNavigationPage(mainOrder, 1);
        var orderForm = GetNavigationPage(mainOrder, 0);
        
        if (jobForm.unCompleted) {
            jobForm.close(orderForm);
        } else {
            mainOrder.isCreated = true;
            mainOrder.parent.display();
        }
    
    });
    //delete
    mainOrder.onToolBarItemClick(3, function () {
        var orderForm = GetNavigationPage(mainOrder, 0);
        var orderData=orderForm.getData();
        if (orderData.OdTruckLoadingOrderId!= null) {
            var dialog = new eworkspace.framework.ConfirmationDialog();
            dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                uiServices.deleteOdTruckLoadingOrder(orderData.Id , function () {
                    eworkspace.ViewModel.info('Successfully delete the record!');
                    mainOrder.isCreated = true;
                    mainOrder.parent.display();
                })

            })
        } else {
            mainOrder.isCreated = true;
            mainOrder.parent.display();
        }
        

    });
    return mainOrder;
}

function OrderForm(id, selector) {
    var template = { Id: 'OdTruckLoadingOrderForm', url: "src/view/TruckLoading.html" }
    var model = { data: null };
    var orderForm = new eworkspace.framework.Form("orderForm", model, template, selector);
    orderForm.setLoadDataHandler(uiServices.getOdTruckLoadingOrderDetails);
    
    orderForm.save = function () {
        if (orderForm.validator.validate() == false) {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
        var data = orderForm.getData();
        var jobGrid = GetGrid(orderForm.Id, "JobGrid");
        data.OdTruckLoadingJobDtos = jobGrid.dataSource.data();
        uiServices.saveOdTruckLoadingOrder(data, function (OdTruckLoadingOrder) {
            orderForm.setData(OdTruckLoadingOrder);
            jobGrid.dataSource.data(OdTruckLoadingOrder.OdTruckLoadingJobDtos);
            eworkspace.ViewModel.info('Save the Order!');
            
        })

    }
    orderForm.setEventHandler(function () {
        $('#' + orderForm.Id).on("click", "#AddTruckLoadingJob", function (e) {
            if (GetGrid(orderForm.Id, "JobGrid").dataSource.data().length > 6) {
                eworkspace.ViewModel.error('The number of Jobs can not beyond Six');
                return;
            }

            var OrderData = orderForm.getData();
            if (OrderData.St_TruckId == null) {
                eworkspace.ViewModel.error('Please select a Truck');
                return;

            }
            var jobFrom = GetNavigationPage(orderForm.parent, 1);
            var Nav_Job = GetNavigationButton(orderForm.parent, 1);
            jobFrom.display({id: "",TruckId: OrderData.St_TruckId });
             Nav_Job.removeAttr("style");
            jobFrom.unCompleted = true;
            Nav_Job.click();
            
            
        })
    });
    return orderForm;
}




function JobForm(id, selector) {
    var template = { Id: 'OdTruckLoadingJobForm', url: "src/view/TruckLoading.html" }
    var model = { data: null };
    var jobForm = new eworkspace.framework.Form("JobForm", model, template, selector);
    jobForm.unCompleted = false;
    jobForm.setLoadDataHandler(jobServices.getOdTruckLoadingJobDetails);
    jobForm.save = function (orderForm) {
        var Nav_Order = GetNavigationButton(orderForm.parent, 0);
        jobForm.unCompleted = false;
        Nav_Order.click();
        SetGridData(orderForm, jobForm, "JobGrid");
    }
        
    jobForm.close = function (orderForm) {
        var data=jobForm.getData();
        var Nav_Order = GetNavigationButton(orderForm.parent, 0);
        var Nav_Job = GetNavigationButton(orderForm.parent, 1);
        jobForm.unCompleted = false;
        Nav_Order.click();
        Nav_Job.css({ "pointer-events": "none", "background-color": "#D3D3D3" });

    }
    return jobForm;

}


function GetGrid(Id, labelName) {
    return $('#' + Id).find("ul#" + labelName).data("kendoGrid");
}


function GetDropDownList(Id, labelName) {
    return $('#' + Id).find("select[name=" + labelName + "]").data("kendoComboBox");
}

function GetNavigationPage(page, index) {
    var orderPageId = page.model.navigation[index].page.Id;
    return page.pages[orderPageId];

}

function GetNavigationButton(page,index) {
    return $('#' + page.Id).find('#MainOrder-nav-' + index);

}

function SetGridData(oldFrom, currentFrom, labelName) {
    FieldNameMap.forEach(function (fromFieldName, guidFieldName) {
        var tmp = GetDropDownList(currentFrom.Id, fromFieldName);
        var tmpval = tmp.text();
        currentFrom.setDataByField(guidFieldName, tmpval);
    });
   
    GetGrid(oldFrom.Id, labelName).dataSource.data().push(currentFrom.getData());
}


export { OdTruckLoadingOrderList, MainOrder, OrderForm, JobForm }
