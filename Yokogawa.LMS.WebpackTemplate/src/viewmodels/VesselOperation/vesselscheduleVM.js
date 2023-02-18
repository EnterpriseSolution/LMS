import { AppConfig, eworkspace, utils } from '../../global';
import * as uiServices from '../../services/VesselOperation/vesselscheduleservice'; 
import uiModels from './models';
import { CommonGridEditors } from '../../common/CommonGridEditor';

function VesselSchehduleHistoryList(id, selector) {
    var model = uiModels.getVesselScheduleHistoryModel();
    var list = new eworkspace.framework.ListPage(id, model, selector);
    //set filter default value
    list.addfilter = function (value) {
        list.model.filterConditions = [];
        list.addFilterCondition("IsDeleted", "==", value == "99", "bool", null);
        if (value === "0")
            list.addFilterCondition("StatusId", "==", 4, "int", "And");
        else
            list.addFilterCondition("StatusId", "==", value, "int", "And");
    };

    list.setInitFilterHandler(function () {
        list.addfilter("0");
    });

    var getVesselSchedules = function (option, callback,failcallback) {
        uiServices.getVesselScheduleList(option, callback, failcallback);
    };

    list.setLoadDataHandler(getVesselSchedules);

    list.setEventHandler(function () {
        var gridSelect = function (e) {
            var selectedRows = this.select();
            var dataItem = this.dataItem(selectedRows[0]);
            list.setButtonVisible(4, dataItem.Id != 1);
        };
        var grid = list._getGrid();
        grid.bind("change", gridSelect);

    });

    list.onButtonClickById('view', function (page) {
        if (page == null) {
            console.error("fails to load vessel schedule detail page");
            return;
        }

        //page.previous = list;
        var data = list.getSelectedRow();

        if (data != null) {
            //page.display(data.Id);
            page.navigate('id='+data.Id)
        }
        else {
            eworkspace.ViewModel.warning('Please select a record');
            list.show();
        }

    });

    list.onFilter(0, function (e) {
        var value = this.value();

        list.addfilter(value);
        list.readGridData();
    });

    return list;
}

function VesselSchehduleDetails(id, selector) {
    var model = uiModels.getVesselScheduleDetailsModel();
    var details = new eworkspace.framework.WorkflowPage(id, model, selector);

    details.setLoadDataHandler(uiServices.getVesselScheduleDetail);
    details.setLoadCompletedHandler(function (data) {
        var allowEdit = !data.IsShipDocCreated;
        details.setButtonVisibleById("new", allowEdit);
        details.setButtonVisibleById("save", allowEdit);
        details.setButtonVisibleById("delete", allowEdit);
        details.toggleNavigationbar(1, data.OrderList.length > 0);
        details._setNavigationMenuVisible(details.model.navigation.length - 1, data.StatusId == 4);
    });

    details.onToolBarItemClickById('new', function () {
        details.display("");
    });

    details.onToolBarItemClickById('save', function () {
        var pageSchedule = details.getNavigationPageById('schedule');
        var pageTimesheet = details.getNavigationPageById('timesheet');
        var pagebol = details.getNavigationPageById('bol');

        pageSchedule.save(function (dataJettySchedule) {
            var json = dataJettySchedule;
            pagebol.save(function (bolData) {
                if (bolData.length > 0)
                    json.BOLList = bolData;

                pageTimesheet.save(json.Id, function (timesheetData) {
                    json.Timesheet = timesheetData;
                    VesselOrder.Services.saveVesselScheduleShipmentDetail(json, function (data) {
                        details.display(data.Id);
                    });
                });
            });
        });
    });

    details.onToolBarItemClickById('close', function () {
        //child page display
        details.parent.navigate();
        //details.previous.display();
    });

    details.onToolBarItemClickById('delete', function () {
        var dialog = new eworkspace.framework.ConfirmationDialog();
        dialog.show("Delete Record", "Are you sure to delete the record?",
            function () {
                var pageSchedule = details.getNavigationPageById('schedule');
                var id = pageSchedule.model.data.Id;
                VesselOrder.Services.deleteVesselSchedule(id,
                    function () {
                        details.parent.navigate();
                       // details.previous.display();
                    });
            });
    });

    return details;
};

function VesselSchehduleForm(id, selector) {
    var model = uiModels.getVesselScheduleFormModel();
    var template = { Id: 'vesselScheduleForm', url: 'src/view/vesselorder.html' };
    var form = new eworkspace.framework.List(id, model, selector, template);

    form.setLoadCompletedHandler(function (data) {
        form.setGridMode(data.AllowEdit);
    });

    form.setEventHandler(function () {
        form.setColumnEditor("Customer", CommonGridEditors.CustomerEditor);
        form.setColumnEditor("Product", CommonGridEditors.ProductEditor);
        form.setColumnEditor("UOMEntity", CommonGridEditors.UOMEditor);
        form.setColumnEditor("OrderTypeEntity", CommonGridEditors.OrderTypeEditor);
        form.setColumnEditor("OrderQty", CommonGridEditors.Decimal3Editor);

        var grid = form._getGrid();
        $('#' + form.Id).find(".grid .k-grid-content").on("change",
            "input.chkbx",
            function (e) {
                var grid = form._getGrid();
                dataItem = grid.dataItem($(e.target).closest("tr"));
                dataItem.set("IsBlending", this.checked);
            });

        grid.bind('saveChanges',
            function (e) {
                var data = e.sender.dataSource.data();
                var sbMsg = new StringBuilder();
                var msgArray = new Array();
                if (data && data.length > 0) {
                    data.forEach(function (item, index) {
                        if (item.Customer == null || item.Customer.Id == null) {
                            msgArray.pushSet("Customer is required.");
                        }
                        if (item.Product == null || item.Product.Id == null) {
                            msgArray.pushSet("Product is required.");
                        }
                        if (item.OrderQty == null) {
                            msgArray.pushSet("Qty is required.");
                        }
                        if (item.UOMEntity == null || item.UOMEntity.Id == null) {
                            msgArray.pushSet("Uom is required.");
                        }
                        if (item.OrderTypeEntity == null || item.OrderTypeEntity.Id == null) {
                            msgArray.pushSet("Type is required.");
                        }
                    });
                }


                if (msgArray.length > 0) {
                    for (var i = 0; i < msgArray.length; i++) {
                        sbMsg.Append(msgArray[i]);
                        sbMsg.Append("<br/>");
                    }
                }
                var msgResult = sbMsg.ToString();
                if (msgResult.length > 0) {
                    eworkspace.ViewModel.error(msgResult);
                    e.preventDefault();
                    return;
                }

                form.setDataByField('Items', data);
            });

        grid.bind('remove',
            function (e) {
                VesselOrder.Services.deleteVesselScheduleCustomerOrderDetail(e.model.Id);
            });

        $('#' + form.Id).find(".vesselDDL").on("change", function (e) {
            var value = this.value;
            var vessel = $.grep(form.model.data.VesselList, function (e) { return e.value === value; });
            if (vessel.length > 0) {
                form.setDataByField('DWT', vessel[0].dwt);
            }
        });

        form.ValidateInit('div.form.vesselscheduleform');
    });

    form.save = function (callback) {
        if (form.validator.validate()) {

            var data = form.getData();
            var grid = form._getGrid();
            var orderData = grid.dataSource.data();

            var sbMsg = new StringBuilder();
            var msgArray = new Array();

            if (data.VesselId == null) {
                msgArray.pushSet("Vessel is required.");
            }

            if (data.JettyId == null) {
                msgArray.pushSet("Jetty is required.");
            }

            var format = "yyyy-MM-ddTHH:mm:ssZ";
            var plannedArrivalTime = data.PlannedArrivalTime;
            var plannedDepartureTime = data.PlannedDepartureTime;
            if (plannedDepartureTime != null) {
                var from = kendo.parseDate(plannedArrivalTime, format);
                var to = kendo.parseDate(plannedDepartureTime, format);
                if (from > to) {
                    msgArray.pushSet("Planned Departure is later than Planned Arrival.");
                }
            }

            var actualArrivalTime = data.ActualArrivalTime;
            var actualDepartureTime = data.ActualDepartureTime;
            if (actualArrivalTime != null && actualDepartureTime != null) {
                var from = kendo.parseDate(actualArrivalTime, format);
                var to = kendo.parseDate(actualDepartureTime, format);
                if (from > to) {
                    msgArray.pushSet("Vessel All Clear is later than 1st Line Ashore.");
                }
            }

            if (msgArray.length > 0) {
                for (var i = 0; i < msgArray.length; i++) {
                    sbMsg.Append(msgArray[i]);
                    sbMsg.Append("<br/>");
                }
            }
            var msgResult = sbMsg.ToString();
            if (msgResult.length > 0) {
                eworkspace.ViewModel.error(msgResult);
                return;
            }


            var orderList = [];
            if (orderData && orderData.length > 0)
                orderList = orderData.map(function (item) {
                    return {
                        Id: item.Id,
                        CustomerOrderNo: item.CustomerOrderNo,
                        CustomerId: item.Customer.Id,
                        CustomerCode: item.Customer.Code,
                        CustomerName: item.Customer.Name,

                        ProductId: item.Product.Id,
                        ProductCode: item.Product.ProductCode,
                        ProductName: item.Product.ProductName,

                        OrderType: item.OrderTypeEntity.Id,
                        OrderTypeName: item.OrderTypeEntity.Name,
                        IsBlending: item.IsBlending,

                        UOM: item.UOMEntity.Id,
                        UOMName: item.UOMEntity.Name,
                        UOMDisplayName: item.UOMEntity.Name,

                        OperationType: item.OrderTypeEntity.Id,
                        OrderQty: item.OrderQty,
                        Remark: item.Remark,

                        VesselScheduleNo: item.VesselScheduleNo,
                        VesselScheduleId: event.Id,

                        Status: 1,
                        StatusName: "COOpen"
                    };
                });

            var json = utils.cloneModel(data);
            json.OrderList = orderList;
            delete json.JettyList;
            delete json.VesselList;
            delete json.ShipAgentList;
            delete json.CustomerList;
            delete json.PlannedHours;

            if ($.isFunction(callback))
                callback(json);
        }
        else {
            eworkspace.ViewModel.error('Please enter the required fields');
            return;
        }
    };

    form.model.onInputRemark = function (e) {
        $('#' + form.Id).find('.k-counter-container .k-counter-value').html($(e.sender.element).val().length);
    };

    form.model.onActualDateChanged = function (e) {
        var data = form.getData();
        if (data.PlannedArrivalTime && data.PlannedDepartureTime)
            form.setDataByField('PlannedHours', Math.abs(new Date(data.PlannedDepartureTime) - new Date(data.PlannedArrivalTime)) / 36e5);
        if (data.ActualArrivalTime && data.ActualDepartureTime)
            form.setDataByField('AlongsideHours', Math.abs(new Date(data.ActualDepartureTime) - new Date(data.ActualArrivalTime)) / 36e5);

        var timesheet;
        var value = e.sender.value();
        if (e.sender.element[0].name === "FirstLineAshore") {
            timesheet = form.parent.getNavigationPageById('timesheet');
            timesheet.setDataByField("FirstLineAshore", value);
        }
        if (e.sender.element[0].name === "VesselAllClear") {
            timesheet = form.parent.getNavigationPageById('timesheet');
            timesheet.setDataByField("VesselAllClear", value);
        }
    };


    form.model.onSelectVesselLov = function () {
        var dialog = new VesselOrder.ViewModel.VesselSchduleVesselLov('select', function (selectedItem) {
            var jsonSeltItem = utils.cloneModel(selectedItem);
            if (jsonSeltItem) {
                form.setDataByField('VesselId', jsonSeltItem.Id);
                form.setDataByField('VesselName', jsonSeltItem.VesselName);
                form.setDataByField('VesselFlag', jsonSeltItem.VesselFlag);
                form.setDataByField('DWT', jsonSeltItem.DWT);
            }
        });
        dialog.display();
    };

    form.model.onSelectShipAgentLov = function () {
        var dialog = new VesselOrder.ViewModel.ShipAgentLov('select', function (selectedItem) {
            var jsonSeltItem = utils.cloneModel(selectedItem);
            if (jsonSeltItem) {
                form.setDataByField('ShipAgentId', jsonSeltItem.Id);
                form.setDataByField('ShipAgentCode', jsonSeltItem.Code);
                form.setDataByField('ShipAgentName', jsonSeltItem.Name);
            }
        });
        dialog.display();
    };

    return form;
};

function BOLForm (id, selector) {

    var template = { Id: 'vesselBOL', url: 'src/view/vesselorder.html' };
    var model = uiModels.getVesselScheduleHistoryBOLFormModel();
    var details = new eworkspace.framework.ListView(id, model, selector, template);

    details.setEventHandler(function () {
        $(document.body).on('click', '#' + details.Id + ' .k-add-button', function (e) {
            var listView = details._getListView();
            listView.add();
            e.preventDefault();
        });

        $(document.body).on('click', '#' + details.Id + ' .bolCustomerLov', function (e) {
            var dialog = new VesselOrder.ViewModel.CustomerLov('select', function (selectedItem) {
                var jsonSeltItem = utils.cloneModel(selectedItem);
                if (jsonSeltItem) {

                    var li = $(e.currentTarget).parent();
                    var listView = details._getListView();
                    var dataItem = listView.dataItem(li);

                    dataItem.CustomerId = jsonSeltItem.Id;
                    dataItem.CustomerCode = jsonSeltItem.Code;
                    dataItem.CustomerName = jsonSeltItem.Name;
                    listView.refresh();
                    listView.edit(listView.content.children().first())
                }
            });
            dialog.display();
        });

        $(document.body).on('click', '#' + details.Id + ' .k-copy-button', function (e) {
            var li = $(e.currentTarget).parent();
            var listView = details._getListView();
            var dataItem = listView.dataItem(li);
            console.log(dataItem);
            var index = listView.dataSource.total() + 1;;

            if (dataItem) {
                listView.dataSource.add({
                    Id: "",
                    VesselScheduleId: "",
                    Index: index,
                    BOLNo: "",
                    Consignee: dataItem.Consignee,
                    Consignor: dataItem.Consignor,
                    CountryOfLoading: dataItem.CountryOfLoading,
                    CustomPermitNo: dataItem.CustomPermitNo,
                    CustomerId: dataItem.CustomerId,
                    CustomerList: dataItem.CustomerList,
                    CustomerName: dataItem.CustomerName,
                    Destination: dataItem.Destination,
                    DOCInstructor: dataItem.DOCInstructor,
                    Freight: dataItem.Freight,
                    IsNewRecord: true,
                    LastModifiedBy: "",
                    LastModifiedByName: null,
                    LastModifiedOn: null,
                    NominatedQTY: dataItem.NominatedQTY,
                    CuttingPlanList: dataItem.CuttingPlanList,
                    SellingName: dataItem.SellingName,
                    Remark: dataItem.Remark,
                    UOM: dataItem.UOM,
                    UOMName: dataItem.UOMName,
                    UOMList: dataItem.UOMList,
                    UnitValue: dataItem.UnitValue,
                    AllowEdit: "inline-block"
                });
            }
            e.preventDefault();
        });

        $(document.body).on('click', '#' + details.Id + ' button.add',
            function (e) {

                var pop_window = new VesselOrder.ViewModel.OrderLov('select-orders', details.parent.model.data.Id, function (selectedItems) {
                    //var li = $(e.currentTarget).parent();
                    //var listView = details._getListView();
                    //var dataItem = listView.dataItem(li);
                    var elm = $('#' + details.Id).find('.grid');
                    var grid = elm.data("kendoGrid");

                    selectedItems.forEach(function (order, index) {
                        var data = {
                            CustomerOrderId: order.Id,
                            CustomerOrderNo: order.CustomerOrderNo,
                            ProductId: order.ProductId,
                            ProductCode: order.ProductCode,
                            ProductName: order.ProductName,
                            QtyTarget: order.OrderQty,
                            UOM: order.UOM,
                            UOMName: order.UOMName,
                            BlendingFlag: order.BlendingFlag
                        };
                        grid.dataSource.add(data);
                        //dataItem.CuttingPlanList.push(data);
                        //grid.dataSource.data(dataItem.CuttingPlanList);
                    });
                });
                pop_window.display();
            });

        $(document.body).on('click', '#' + details.Id + ' button.save', function (e) {

            var li = $(e.currentTarget).parent();
            var listView = details._getListView();
            var dataItem = listView.dataItem(li);
            //var grid = form._getGrid();
            var grid = $("#" + details.Id).find('.grid').data("kendoGrid");
            grid.saveChanges();
            var gridList = utils.cloneModel(grid.dataSource.data());

            if (gridList.length == 0) {
                eworkspace.ViewModel.info('Please Add cutting plan first');
                return;
            } else {
                dataItem.CuttingPlanList = gridList;
            }

            //TLSVP.info('Save changes success');
            //return;
        });

        details.bindEvent("dataBinding", function (e) {
            console.log('data bind', e);
            if (e.action === "add") {

                var listView = details._getListView();
                var items = listView.dataItems();
                var indexs = items.map(function (item) { return item.Index == null ? 0 : item.Index; });
                var curIndex = Math.max.apply(Math, indexs);
                e.items[0].Index = curIndex + 1;
                e.items[0].UOMList = VesselOrder.Model.UomList.map(function (uom) {
                    return { text: uom.Name, value: uom.Id };
                });
                e.items[0].CustomerList = details.parent.model.data.CustomerList;
            }
            if (e.action === "sync") {
                e.items.forEach(function (bol, index) {
                    var uom = $.grep(bol.UOMList, function (e) { return e.value === bol.UOM; });
                    if (uom.length > 0) {
                        bol.UOMName = uom[0].text;
                        bol.UOMDisplayName = uom[0].text;
                    }
                });
            }

            var listView = details._getListView();
            var items = listView.dataItems();
            console.log('items', items);
        });

        details.bindEvent("edit",
            function (e) {
                var gridElm = $('#' + details.Id).find('.grid');
                if (gridElm.length == 0) {
                    details.display();
                    var listView = details._getListView();
                    listView.edit(listView.content.children().eq(e.model.Index - 1));
                } else {
                    var grid = gridElm.data("kendoGrid");
                    grid.bind("remove", function (e) {
                        VesselOrder.Services.deleteBOLCuttingPlan(e.model.Id);
                    });
                }
            });

        details.bindEvent("remove",
            function (e) {
                VesselOrder.Services.deleteVesselScheduleBOLDetail(e.model.Id, function (item) {
                    var listView = details._getListView();
                    var select = listView.select();
                    if (select) {
                        var index = select.index();
                        var dataItem = listView.dataSource.view()[index];
                        listView.dataSource.remove(dataItem);
                    }
                });
            });
    });

    details.save = function (callback) {
        var listView = details._getListView();
        var data = [];
        if (listView) {
            data = listView.dataSource.data();
        }
        if (data != null && data.length > 0) {

            var sbMsg = new StringBuilder();
            var msgArray = new Array();



            data.forEach(function (bol, index) {
                var total = bol.TotalQty;
                var target = 0;
                if (bol.CuttingPlanList.length == 0)
                    msgArray.pushSet("Please add cutting plan");

                bol.CuttingPlanList.forEach(function (plan, inch) {
                    target = target + plan.QtyTarget;
                });
                target = eval(target);
                if (target > total)
                    msgArray.pushSet("The BOL(" + (index + 1) + ")sum of target qty is greater than total qty");
            });

            if (msgArray.length > 0) {
                for (var i = 0; i < msgArray.length; i++) {
                    sbMsg.Append(msgArray[i]);
                    sbMsg.Append("<br/>");
                }
            }
            var msgResult = sbMsg.ToString();
            if (msgResult.length > 0) {
                eworkspace.ViewModel.error(msgResult);
                return;
            }

            if ($.isFunction(callback));
            callback(data);

        } else {
            if ($.isFunction(callback));
            callback(data);
        }
    };

    return details;
};

function TimeSheetForm(id, selector) {
    var model = { data: null };
    var template = { Id: 'timesheetForm', url: 'src/view/vesselorder.html' };
    var form = new eworkspace.framework.Form(id, model, template, selector);
    form.save = function (vesselScheduleId, callback) {
        var data = form.getData();
        if (data.VesselSchduleId == null)
            data.VesselScheduleId = vesselScheduleId;

        if ($.isFunction(callback))
            callback(data);
    };

    form.model.onActualDateChanged = function (e) {
        var data = form.getData();

        var schedule;
        var value = e.sender.value();
        if (e.sender.element[0].name === "FirstLineAshore") {
            schedule = form.parent.getNavigationPageById('schedule');
            schedule.setDataByField("ActualArrivalTime", value);
        }

        if (e.sender.element[0].name === "VesselAllClear") {
            schedule = form.parent.getNavigationPageById('schedule');
            schedule.setDataByField("ActualDepartureTime", value);
        }
    };

    return form;
};

function ShipmentDocumentExportForm(id, selector) {
    var model = {
        title: "Documents:",
        gridOptions: {
            dataSource: {
                data: [],
                group: {
                    field: "Title",
                    dir: "asc",
                },
            },
            height: '400',
            groupable: false,
            scrollable: true,
            selectable: {
                mode: "multiple, row"
            },
            pageable: false,
            columns: [
                { field: "DocName", title: 'Name' },
                { field: "CustomerName", title: 'Customer' }
                //{ command: ["destroy"], title: "", width: '150px' }
            ]
        },
        data: []
    }

    var template = { Id: 'shipmentDocExport', url: 'src/view/shipmentdoc.html' };
    var form = new eworkspace.framework.List(id, model, selector, template);
    form.model.onExport = function () {

        var grid = form._getGrid();
        var rows = grid.select();

        var item = grid.dataItem(rows);
        var docName = item.DocName;
        console.info(docName);


        var reportName = "";
        if (docName === "Bill of Lading")
            reportName = "SL_BillOfLading";
        if (docName === "Certificate of Quantity")
            reportName = "SL_CertificateOfQuantity";

        if (reportName.length === 0) {
            eworkspace.ViewModel.info("Not implementation yet, Export only works with Bill of Lading and Certificate of Quantity");
            return;
        }
        var param = {
            BillId: item.BOLId,
            ReportName: reportName
        };

        VesselOrder.Services.exportReport(param,
            function (fileUrl) {
                VesselOrder.Services.downloadLocalDocument(fileUrl,
                    function () {
                        console.log('Exported Successfully');
                    });
            });
    }
    return form;
}

export { VesselSchehduleHistoryList, VesselSchehduleDetails, VesselSchehduleForm, BOLForm, TimeSheetForm, ShipmentDocumentExportForm }
