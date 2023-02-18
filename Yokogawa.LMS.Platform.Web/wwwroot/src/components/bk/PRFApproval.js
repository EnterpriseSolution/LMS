PRFApproval = {
    Services: {},
    Model: {},
    ViewModel: {},
    ServiceDomain: location.protocol + '//' + location.host + '/PRF.WebAPI/api',
    SPWebsite: "workflow",
    SPListTitle:"PRF",
    defaultFailCallback: function (caller) {
        if (caller != null && $.isFunction(caller.failCallback))
            caller.failCallback();
    },
    info: function (message, okhandler) {
        var dialog = new eworkspace.framework.AlertDialog();
        dialog.info(message, okhandler);
    },
    warning: function (message, okhandler) {
        var dialog = new eworkspace.framework.AlertDialog();
        dialog.warning(message, okhandler);
    },
    error: function (message, okhandler) {
        var dialog = new eworkspace.framework.AlertDialog();
        dialog.error(message, okhandler);
    },
    startWith: function (string, searchString) {
        if (searchString == null || string == null || string.length == 0 || searchString.length == 0)
            return false;

        var subStr = string.substr(0, searchString.length);
        return subStr.toUpperCase() == searchString.toUpperCase();
    }
}

PRFApproval.Services =  {
    GetApprovalLevel: function () {
        var level = 0;
        var settings = utils.getWidgetSettings(PRFApproval);
        if (null != settings && settings.length > 0) {
            var result = $.grep(settings, function (settingItem) {
                return settingItem.Level!=null
            });

            level = result.length > 0 ? result[0].Level : level;
        }
   
        return level;
    },
    GetOperation: function () {
        var operation='%';
        var settings = utils.getWidgetSettings(PRFApproval);
        if (null != settings && settings.length > 0) {
            var result = $.grep(settings, function (settingItem) {
                return settingItem.Operation != null
            });

            operation = result.length > 0 ? result[0].Operation : operation;
        }

        return operation;
    },
    setPRFData: function (json) {
        if (json == null)
            return;
        json.DateSubmit = null != json.DateSubmit ? utils.toString(json.DateSubmit, 'dd MMM yyyy') : null;
        json.DateCreate = null != json.DateCreate ? utils.toString(json.DateCreate, 'dd MMM yyyy') : null;
        json.InitContractValueDesc = utils.toString(json.InitContractValue, 'c0');
        json.ContractValueDesc = json.ContractValue == 0 ? '' : utils.toString(json.ContractValue, 'c0');
        json.InitCostEstimateDesc = utils.toString(json.InitCostEstimate, 'c0');
        json.CostEstimateDesc = json.CostEstimate == 0 ? '' : utils.toString(json.CostEstimate, 'c0');
        json.InitGPDesc = utils.toString(json.InitGP, 'c0');
        json.GPDesc = json.GP == 0 ? '' : utils.toString(json.GP, 'c0');
        json.CurOrderIntakeDesc = json.CurOrderIntake == 0 ? '' : utils.toString(json.CurOrderIntake, 'c0');
        json.CurMonthOrderIntakeDesc = json.CurMonthOrderIntake == 0 ? '' : utils.toString(json.CurMonthOrderIntake, 'c0');
        
    },
    getTransactionMonth: function (callback,failcallback) {
        if (PRFApproval.MasterData.TransactionMonth != null)
        {
            if ($.isFunction(callback))
                callback(PRFApproval.MasterData.TransactionMonth);
            return;
        }
 
        $.ajax({
            type: "GET",
            url: PRFApproval.ServiceDomain + '/PRF/transactionmonths',
            cache: false,
            success: function (json) {
                if (null == json)
                    return;
                var today = new Date();
                var defaultMonth = { Year: today.getFullYear(), Month: today.getMonth() + 1, StartYear: today.getFullYear(),StartMonth:today.getMonth()+1 };
                var transactionMonth = {};
                for (var i = 0; i < json.length; i++)
                {
                    var item = json[i];
                    if (transactionMonth.Year == null || transactionMonth.Year < item.Year) {
                        transactionMonth.Year = item.Year;
                        transactionMonth.Month = item.Month;
                    } else if (transactionMonth.Month < item.Month) {
                        transactionMonth.Month = item.Month;
                    }

                    if (transactionMonth.StartYear == null || transactionMonth.StartYear > item.StartYear) {
                        transactionMonth.StartYear = item.StartYear;
                        transactionMonth.StartMonth = item.StartMonth;
                    } else if (transactionMonth.StartMonth > item.StartMonth) {
                        transactionMonth.StartMonth = item.StartMonth;
                    }
                }

                if ($.isEmptyObject(transactionMonth))
                    transactionMonth = defaultMonth;

                transactionMonth.options = [];
                for (var year = transactionMonth.Year; year >= transactionMonth.StartYear; year--) {
                    var endMonth = transactionMonth.StartYear == year ? transactionMonth.StartMonth : 1;
                    for (var month = transactionMonth.Month; month >= endMonth; month--) {
                        var d = new Date(year, month - 1, 1);
                        var desc = d.getShortMonthName() + ' ' + year.toString();
                        var value = year.toString() + '-' + month.toString();
                        var option = { text: desc, value: value };
                        transactionMonth.options.push(option);
                    }
                }
  
                PRFApproval.MasterData.TransactionMonth = transactionMonth;
                if ($.isFunction(callback)) callback(transactionMonth);
            },
            error: function (xhr) {
                alert('Service Error(get transaction month):' + xhr.responseText);
                if ($.isFunction(failcallback))
                    failcallback();
            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
    },
    getPRFApproval: function (isHistory, callback,failcallback) {
        $.ajax({
            type: "GET",
            url: PRFApproval.ServiceDomain + '/PRF/PRFListforApprovals?isHistory=' + isHistory,
            cache: false,
            success: function (json) {
                json.forEach(function (item) {
                    if (item.DocTypeId == 1) {
                        item.GPPCT = 'NA';
                        item.ContractValue = 'NA';
                        item.GPPCTAsLastMonth = 'NA';
                    }
                })
                if ($.isFunction(callback)) callback(json);
            },
            error: function (xhr) {
                alert('Service Error(get approval list):' + xhr.responseText);
                if ($.isFunction(failcallback))
                    failcallback();
            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
    },
    getPRFPendingApproval: function (callback, failcallback) {
        PRFApproval.Services.getPRFApproval(false, callback, failcallback);
    },
    getPRFApprovalHitory: function (callback, failcallback) {
        PRFApproval.Services.getPRFApproval(true, callback, failcallback)
    },
    getPRFList: function (year, month, callback, failcallback) {
        var operation = PRFApproval.Services.GetOperation();
        $.ajax({
            type: "GET",
            url: PRFApproval.ServiceDomain + '/PRF/PRFList?year=' + year.toString() + '&month=' + month.toString() + "&operation="+operation,
            cache: false,
            success: function (json) {
                json.forEach(function (item) {
                    if (item.DocTypeId == 1) {
                        item.GPPCT = 'NA';
                        item.ContractValue = 'NA';
                        item.GPPCTAsLastMonth = 'NA';
                    }
                })
                if ($.isFunction(callback)) callback(json);
            },
            error: function (xhr) {
                alert('Service Error(get all PRF list):' + xhr.responseText);
                if ($.isFunction(failcallback))
                    failcallback();
            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
       
    },
    getPRFHistory: function (year,month,callback, failcallback) {
        $.ajax({
            type: "GET",
            url: PRFApproval.ServiceDomain + '/PRF/PRFHistory?year='+year.toString()+'&month='+month.toString(),
            cache: false,
            success: function (json) {
                json.forEach(function (item) {
                    if (item.DocTypeId == 1) {
                        item.GPPCT = 'NA';
                        item.ContractValue = 'NA';
                        item.GPPCTAsLastMonth = 'NA';
                    }
                })
                
                if ($.isFunction(callback)) callback(json);
            },
            error: function (xhr) {
                alert('Service Error(get PRF history):' + xhr.responseText);
                if ($.isFunction(failcallback))
                    failcallback();
            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
    },
    getPRFDetails: function (id, callback, failcallback) {
        $.ajax({
            type: "GET",
            url: PRFApproval.ServiceDomain + '/PRF/PRFInfo?id=' + id,
            cache: false,
            success: function (json) {
                PRFApproval.Services.setPRFData(json);
                if ($.isFunction(callback)) callback(json);
            },
            error: function (xhr) {
                alert('Service Error(get PRF details):' + xhr.responseText);
                if ($.isFunction(failcallback))
                    failcallback();
            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
    },
    uploadFile: function (file, projectNo,company, callback) {
        var formData = new FormData();
        formData.append('file', file.rawFile);
        var fileName = file.name != file.rawFile.name ? file.name : null;
        
        utils.showProcessbar(true);
        $.ajax(
        {
            url: "/" + utils.AppName + "/FileUploadHandler.ashx?FolderName=sharepoint&spsiteName=" + PRFApproval.SPWebsite + "&listtitle=" + PRFApproval.SPListTitle + "&subfoldername=" + company + "/"+projectNo + (fileName != null ? '&FileName=' + fileName : ''),
            type: 'POST',
            success: function (json) {
                json = JSON.parse(json);
                if (json.Error == null || json.Error.length == 0) {
                    if ($.isFunction(callback))
                        callback(json);
                }
                else
                    PRFApproval.error(json.Error);

                utils.showProcessbar(false);

            },
            error: function (e) {
                PRFApproval.error("upload fail!");
                utils.showProcessbar(false);
            },
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        });
    },
    downloadFile: function (fileUrl, fileLocation, callback) {
        if (fileLocation == null || fileLocation == 0) {
            var fileInfo = fileUrl.toLowerCase().split('workflow');
            var baseUrl = fileInfo[0] + "workflow";
            eworkspace.Services.downloadSPDocument(baseUrl, fileUrl, callback);
        } else {
            eworkspace.Services.downloadLocalDocument(fileUrl, callback)
        }
    },
    deleteDocument: function (id, callback) {
        utils.showProcessbar(true);
        $.ajax({
            type: "DELETE",
            url: (PRFApproval.ServiceDomain + '/PRF/document/' + id),
            success: function (json) {
                utils.showProcessbar(false);

                if (json != null && json.length > 0)
                    alert(json);
                else if ($.isFunction(callback))
                    callback();

                
            },
            error: function (xhr) {
                utils.showProcessbar(false);
                alert('Service Error(delete document):' + xhr.responseText);

            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
    },
    saveDocument: function (document, callback) {
        utils.showProcessbar(true);
        $.ajax({
            type: "POST",
            url: PRFApproval.ServiceDomain  + '/PRF/document',
            data: JSON.stringify(document),
            success: function (json) {
                utils.showProcessbar(false);
                
                if ($.isFunction(callback))
                    callback(json);
            },
            error: function (xhr) {
                alert('Service Error(Save document):' + xhr.responseText);
                utils.showProcessbar(false);
            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
    },
    approve: function (request, callback) {
        utils.showProcessbar(true);
        $.ajax({
            type: "POST",
            url: PRFApproval.ServiceDomain + '/PRF/approve',
            data: JSON.stringify(request),
            success: function (json) {
                utils.showProcessbar(false);
                if (json != null && json.Error!=null && json.Error.length>0)
                    alert(json.Error);

                if ($.isFunction(callback))
                    callback(json);
            },
            error: function (xhr) {
                alert('Service Error(approve):' + xhr.responseText);
                utils.showProcessbar(false);
            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
    },
    stampDateApproval: function (ids, callback) {
        utils.showProcessbar(true);
        $.ajax({
            type: "POST",
            url: PRFApproval.ServiceDomain + '/PRF/StampApprovalDates',
            data: JSON.stringify(ids),
            success: function (json) {
                utils.showProcessbar(false);
                if (json != null &&  json.length > 0) {
                    alert(json);
                    return;
                }

                if ($.isFunction(callback))
                    callback();
            },
            error: function (xhr) {
                alert('Service Error(Stamp Approval Date):' + xhr.responseText);
                utils.showProcessbar(false);
            },
            dataType: 'json',
            contentType: 'application/json',
            processData: false
        });
    },
}

PRFApproval.MasterData = {}

PRFApproval.Model.PRFList = {
    title: "PRF/PB List",
    buttons: [
            { text: "SEARCH", name: "glyphicon-search" },
            { text: "VIEW", name: "glyphicon-eye-open", page: { url: 'PRFApproval.ViewModel.PRFDetails', Id: "requestDetails" } },
    ],
    filters: [        
         {
             width: '20%',
             items: [
                 { text: 'All', value: '' },
             ]
         }
    ],
    gridOptions: {
        dataSource: {
            data: [
            ],
            pageSize: 8
        },
        height: 590,
        selectable: true,
        groupable: true,
        filterable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        toolbar: ["excel"],
        excel: {
            allPages: true
        },
        columns: [
            { field: "ProjectNo", title: 'Proj No', width: '116px', template: '<a href="\\#">#=ProjectNo#</a>' },
            { field: "ProjectName", title: 'Project Name' },
            { field: "Company", title: 'Comp', width: '90px' },
            { field: "Operation", title: 'Operation', width: '160px' },
            { field: "TransactionMonth", title: 'Month', width: '100px' },
            { field: "State", title: 'Status', width: '120px' },
            { field: "InitGPPCT", title: 'Init GP(%)', width: '100px', template: "<span style='color:#=InitGPPCT<0?'red':null#'>#=kendo.toString(InitGPPCT,'n')#</span>" },
            { field: "GPPCT", title: 'GP(%)', width: '80px', template: "<span style='color:#=GPPCT<0?'red':null#'>#=kendo.toString(GPPCT,'n')#</span>" },
            { field: "InitContractValue", title: 'Init CV', width: '116px', format: '{0:c0}' },
            { field: "ContractValue", title: 'CV', width: '116px', format: '{0:c0}' },
            { field: "GPPCTAsLastMonth", title: 'Prev GP(%)', width: '120px', template: "<span style='color:#=GPPCTAsLastMonth<0?'red':null#'>#=kendo.toString(GPPCTAsLastMonth,'n')#</span>" },
            { field: "OwnerName", title: 'PMO Head', width:'110px' },
            { field: "DateApproval", title: 'Date Approval', width: '145px', template: "#=DateApproval==null?'':kendo.toString(kendo.parseDate(DateApproval, 'yyyy-MM-dd'), 'dd MMM yyyy') #" },
        ]
    },
    conditions: [
            { field: "ProjectNo", title: 'Project No', type: 'text' },
            { field: "ProjectName", title: 'Project Name', type: 'text' },
            { field: "Company", title: 'Company', type: 'text' },
            { field: "Operation", title: 'Operation', type: 'text' },
            { field: "TransactionMonth", title: 'Month', width: '100px' },
            { field: "State", title: 'Status', type: 'text' },
            { field: "InitGPPCT", title: 'Init GP(%)', type: 'text' },
            { field: "GPPCT", title: 'GP(%)', type: 'text' },
            { field: "InitContractValue", title: 'Init Contract Value', type: 'text' },
            { field: "ContractValue", title: 'Contract Value', type: 'text' },
            { field: "GPPCTAsLastMonth", title: 'GP(%) As Last Month', type: 'text' },
            { field: "OwnerName", title: 'PMO Head', type: 'text' },
            { field: "DateApproval", title: 'Date Approval (yyyy-mm-dd)', type: 'text' },

    ],
    data: []

}

PRFApproval.Model.PRFApprovalList = {
         title: "PRF/PB List",
         buttons: [
                 { text: "SEARCH", name: "glyphicon-search" },
                 { text: "APPROVE", name: "glyphicon-ok-sign" },
                 { text: "REJECT", name: "glyphicon-remove-sign" },
                 { text: "VIEW", name: "glyphicon-eye-open", page: { url: 'PRFApproval.ViewModel.PRFDetails', Id: "requestDetails" } },
         ],
         filters: [
              {
                  width: '20%',
                  items: [
                          { text: 'Pending Requests', value: '0' },
                          { text: 'Approval History', value: '1' }
                  ]

              },
              {
                  width: '8%',
                  items: [
                      { text: 'All', value: '' },
                  ]
              }
         ],
         gridOptions: {
             dataSource: {
                 data: [
                 ],
                // pageSize: 2
             },
             toolbar: ["excel"],
             excel: {
                 allPages: true
             },
             height: 580,
             selectable: "multiple",
             groupable: true,
             filterable: false,
             scrollable: true,
             sortable: true,
             pageable: false,
             columns: [
                 { template: "<input type='checkbox' class='checkbox' />", width: "32px", headerTemplate: '<input type="checkbox" name="check-all" />' },
                 { field: "ProjectNo", title: 'Proj No', width: '118px', template: '<a href="\\#">#=ProjectNo#</a>' },
                 { field: "ProjectName", title: 'Project Name'},
                 { field: "Company", title: 'Comp', width: '90px' },
                 { field: "Operation", title: 'Operation', width: '160px' },
                 { field: "TransactionMonth", title: 'Month', width: '100px' },
                 { field: "DocTypeName", title: 'Type', width: '100px' },
                 { field: "State", title: 'Status', width: '120px' },
                 { field: "InitGPPCT", title: 'Init GP(%)', width: '100px', template: "<span style='color:#=InitGPPCT<0?'red':null#'>#=kendo.toString(InitGPPCT,'n')#</span>" },
                 { field: "GPPCT", title: 'GP(%)', width: '80px', template: "<span style='color:#=GPPCT<0?'red':null#'>#=kendo.toString(GPPCT,'n')#</span>" },
                 { field: "InitContractValue", title: 'Init CV', width: '116px', format: '{0:c0}' },
                 { field: "ContractValue", title: 'CV', width: '116px', format: '{0:c0}' },
                 { field: "GPPCTAsLastMonth", title: 'Prev GP(%)', width: '120px', template: "<span style='color:#=GPPCTAsLastMonth<0?'red':null#'>#=kendo.toString(GPPCTAsLastMonth,'n')#</span>" },
                 { field: "ProjectManager", width: '130px',title: 'Proj Mgr' },
                 { field: "OwnerName", title: 'PMO Head' },
                 { field: "DateApproval", title: 'Date Approval', width: '145px', template: "#=DateApproval==null?'':kendo.toString(kendo.parseDate(DateApproval, 'yyyy-MM-dd'), 'dd MMM yyyy') #" },
             ]
         },
         conditions: [
                 { field: "ProjectNo", title: 'Project No', type: 'text' },
                 { field: "ProjectName", title: 'Project Name', type: 'text' },
                 { field: "Company", title: 'Company',type: 'text' },
                 { field: "Operation", title: 'Operation', type: 'text' },
                 { field: "TransactionMonth", title: 'Month', width: '100px' },
                 { field: "State", title: 'Status',type: 'text' },
                 { field: "InitGPPCT", title: 'Init GP(%)',type: 'text' },
                 { field: "GPPCT", title: 'GP(%)',type: 'text'  },
                 { field: "InitContractValue", title: 'Init Contract Value',type: 'text'  },
                 { field: "ContractValue", title: 'Contract Value',type: 'text'  },
                 { field: "GPPCTAsLastMonth", title: 'GP(%) As Last Month',type: 'text'  },
                 { field: "ProjectManager", title: 'PM',type: 'text'  },
                 { field: "OwnerName", title: 'PMO Head',type: 'text'  },
                 { field: "DateApproval", title: 'Date Approval (yyyy-mm-dd)', type: 'text' },
            
         ],
         data: []

}


PRFApproval.Model.PRFDetails = {
    toolBarItems: [
       { template: "<button><span class='glyphicon glyphicon-ok-sign'></span>APPROVE</button>" },
       { template: "<button><span class='glyphicon glyphicon-remove'></span>REJECT</button>" },
       { template: "<button><span class='glyphicon glyphicon-remove'></span>CLOSE</button>" },
    ],
    title: "PRF/PB Details",
    headers: [{ title: 'Project No', field: "ProjectNo" }, { title: 'Type', field: "DocTypeName" }, { title: 'Company', field: "Company" }, { title: 'Operation', field: "Operation" }, { title: 'Month', field: "TransactionMonth" }, { title: 'Status', field: 'State' }],
    data: null,
    navigation: [
                 { text: 'PRF/PB Form', page: { url: "PRFApproval.ViewModel.PRFForm", Id: "form" } },
                 { text: 'Relevant Documents', page: { url: "PRFApproval.ViewModel.UploadRelevantDocuments", Id: "docs" } }],
    content: []
}

PRFApproval.Model.UploadRelevantDocuments = {
    gridDataSourceField: "RelevantDocument",
    gridOptions: {
        dataSource: {
            data: [],
            pageSize: 5,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        FileName: { editable: false },
                        DocTypeName: { editable: false },
                        UploadBy: { editable: false },
                        DateUpload: { editable: false }
                    }
                }
            }
        },
        height: 250,
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        editable: true,
        columns: [
            { field: "FileName", title: 'File Name', template: '<a href="\\#">#=FileName#</a>', width: '350px' },
            { field: "DocTypeName", title: 'Doc Type' },
            { field: "UploadBy", title: 'Upload By' },
            { field: "DateUpload", title: 'Date Upload', template: "#= kendo.toString(kendo.parseDate(DateUpload, 'yyyy-MM-dd'), 'dd MMM yyyy') #" },
            { command: "destroy", title: "" }
        ]
    },
    data: {}
}

PRFApproval.ViewModel = {
    PRFApprovalList: function (id, selector) {
        var model = utils.cloneModel(PRFApproval.Model.PRFApprovalList);
       // model.ApprovalLevel = PRFApproval.Services.GetApprovalLevel();
        model.view = "0";
        
        var requestList = new eworkspace.framework.ListPage(id, model, selector);
        var getHistory = function (callback) {
            PRFApproval.Services.getPRFHistory(requestList.model.viewYear, requestList.model.viewMonth, callback);
        }
        requestList.setLoadDataHandler(PRFApproval.Services.getPRFPendingApproval);
        requestList.setLoadCompletedHandler(function (data) {
            var grid = requestList._getGrid();
            
            if (data.length>0 && 1 == data[0].Level)
                grid.hideColumn(14);
            else
                grid.hideColumn(13);

            if (requestList.model.view == "0") {
                grid.hideColumn(15);
                grid.showColumn(0);
                grid.showColumn(6);
            }
            else {
                grid.hideColumn(6);
                grid.showColumn(15);
                grid.hideColumn(0);
            }
        });
        requestList.setFormLoadedHandler(function () {
            var checkAll = $('#' + requestList.Id).find("input[type=checkbox][name=check-all]");
            checkAll.prop('checked', false);

            var grid = requestList._getGrid();
            grid.content.on("click", "a", function () {
                row = $(this).closest("tr"),
                dataItem = grid.dataItem(row);
                PRFApproval.Services.downloadFile(dataItem.SourceFileUrl, dataItem.SourceFileLocation);
            });

            grid.content.on("click", "tr", function () {
                row = $(this);
                var checkbox = row.find('.checkbox');
                row.parent().find("tr.k-state-selected").find('.checkbox').prop('checked', true);

                row.parent().find("tr").not('.k-state-selected').find('.checkbox').prop('checked', false);
                //checkbox.prop('checked', row.hasClass("k-state-selected"));

            });

            grid.table.on("click", ".checkbox", selectRow);
            function selectRow() {
                var checked = this.checked,
                row = $(this).closest("tr")
                if (checked)
                    grid.select(row);
                else {
                    if (row.hasClass("k-state-selected")) {
                        row.removeClass("k-state-selected");

                    }

                    var selectedCheckBox = row.parent().find('.checkbox:checked');
                    if (selectedCheckBox.length==0)
                        checkAll.prop('checked', false);
                }
            }

            

        });
        requestList.setEventHandler(function () {
            var checkAll = $('#' + requestList.Id).find("input[type=checkbox][name=check-all]");
            //select all
            checkAll.click(function () {
                var grid = requestList._getGrid();
                var checkboxs = grid.table.find('.checkbox');

                if (checkAll.is(':checked')) {
                    checkboxs.prop('checked', true);
                 
                } else {
                    checkboxs.prop('checked', false);
                }

                for (var i = 0; i < checkboxs.length; i++)
                {
                    var row = $(checkboxs[i]).closest('tr');
                    if (checkAll.is(':checked'))
                        grid.select(row);
                    else {
                        if (row.hasClass("k-state-selected")) 
                            row.removeClass("k-state-selected");

                       
                    }

                }
            });
        })
      

        requestList.onFilter(0, function (e) {
            var value = this.value();
            requestList.model.view = value;
            var options = requestList.model.filters[1].items;
            switch (value) {
                case "0":
                    requestList.setLoadDataHandler(PRFApproval.Services.getPRFPendingApproval);
                    break;
                default:
                    requestList.setLoadDataHandler(getHistory);
                    break;
            }

            if (value != "0")
                PRFApproval.Services.getTransactionMonth(function (json) {
                    requestList.refreshFilter(1, json.options)
                    var value = requestList.getValueofFilter(1);
                    setTransactionYearandMonth(value);
                    requestList.display();
                    requestList.setButtonVisible(1, false);
                    requestList.setButtonVisible(2, false);
                })
            else {
                requestList.refreshFilter(1, options)
                requestList.display();
                requestList.setButtonVisible(1, true);
                requestList.setButtonVisible(2, true);
            }
            
            
        });

        var setTransactionYearandMonth = function (value) {
            if (value != null && value.length > 0) {
                var temp = value.split('-');
                requestList.model.viewYear = temp[0];
                requestList.model.viewMonth = temp[1];
            }
        }
        requestList.onFilter(1, function (e) {
            var value = this.value();
            setTransactionYearandMonth(value);
            requestList.display();
            
        });

        var openRequest = function (page, callback) {
            var grid = requestList._getGrid();
            var rows = grid.select();
            var isMultiSelect = rows.length > 1;

            if (grid.dataItem(rows) == null) {
                PRFApproval.error('Please select a record');
                requestList.display();
                return;
            }
            var data = [];
            rows.each(function (index, row) {
                var item = grid.dataItem(row);
                //item.Level = requestList.model.ApprovalLevel;
                
                data.push(item);
            })

            if (data != null) {
                if (page != null) {
                    page.previous = requestList;
                }
                

                if ($.isFunction(callback))
                    callback(data);
            }
        }

        requestList.Approve = function (data, isApproved, comment, callback) {
            var items = [];
            items.push(data);
            requestList.batchApprove(items, isApproved, comment, callback);
        }

        requestList.batchApprove = function (items, isApproved, comment, callback) {
            var info = '';
            
            var request = {
                PRFList: items,
                ApproverId:eworkspace.Model.Profile.globalEmpId,
                IsApproved:isApproved,
                Comment: comment,
            }
            
            PRFApproval.Services.approve(request, function (result) {
                if (isApproved == true)
                    PRFApproval.info("Approved Successfully");
                else
                    PRFApproval.info("Rejected Successfully")

                var ids = [];
                request.PRFList.forEach(function (item) {
                    ids.push(item.Id);
                })
                
                if (request.PRFList.length > 1) {
                    PRFApproval.Services.stampDateApproval(ids);
                    if ($.isFunction(callback))
                        callback(result);
                } else if (request.PRFList.length == 1) {
                    PRFApproval.Services.stampDateApproval(ids, function () {
                        if ($.isFunction(callback))
                            callback(result);
                    });

                }
                   
              
                
            })
        }

        //approve
        requestList.onButtonClick(1, function (page) {
            openRequest(page, function (data) {
                requestList.batchApprove(data, true, null, function (result) {
                    requestList.display();
                });
            })
        });

        //reject
        requestList.onButtonClick(2, function (page) {
            openRequest(page, function (data) {
                var dialog = new PRFApproval.ViewModel.ApprovalDialog(requestList.Id + '-rejectDialog', function (comment) {
                    dialog.close();
                    requestList.batchApprove(data, false, comment, function (result) {
                        requestList.display();
                    });
                });
                dialog.show();
            });
        });

        requestList.onButtonClick(3, function (page) {
            openRequest(page, function (items) {
                var data = items[0];
                
                page.model.ApprovalLevel = data.Level;
                page.display(data.Id);
            })
        });

        requestList.Activate = function () {
            requestList.display();
        }

        return requestList;
    },
    ApprovalDialog: function (id, callback) {
        var model = {
            title: "Approval Comment",
            width: 600,
            content: { url: "PRFApproval.ViewModel.RejectReasonForm", Id: id + '-rejectForm' }
        }
        var dialog = new eworkspace.framework.DialogWindow(id, model);
        var reject = function () {
            var rejectReason = $('#txtRejectReason').val();
            if ($.isFunction(callback))
                callback(rejectReason);
        }
        var cancel = function () {
            dialog.close();
        }
        dialog.model.buttons = [{ text: "Reject", onClick: reject, width: '80px' }, { text: "cancel", onClick: cancel }]
        return dialog;
    },
    RejectReasonForm: function (id, selector) {
        var template = { Id: 'prf_rejectReason', url: rootUrl + "src/view/PRFApproval.html" }
        var model = { data: null };
        var RejectReasonForm = new provider[eworkspace.provider].Form(id, model, template, selector);
        return RejectReasonForm;
    },
    PRFDetails: function (id, selector) {
        var model = utils.cloneModel(PRFApproval.Model.PRFDetails);

        var requestDetails = new eworkspace.framework.WorkflowPage(id, model, selector);
        requestDetails.setLoadDataHandler(PRFApproval.Services.getPRFDetails);
        requestDetails.setLoadCompletedHandler(function (data) {
            /*if (data.FileUrl != null && data.FileUrl.length > 0) {
                var char = data.FileLocation == 0 ? '/' : '\\';
                var temp = data.FileUrl.split(char);
                data.SourceFile = temp[temp.length - 1];
            }*/
            
            var approver = $.grep(data.Approvals, function (item) {
                return item.ApproverId == eworkspace.Model.Profile.globalEmpId&&item.DateApproval == null;
            })

            var result = requestDetails.getControlStatus(data, requestDetails.model.ApprovalLevel)
            requestDetails.setButtonVisible("APPROVE", result.Approve);
            requestDetails.setButtonVisible("REJECT", result.Reject);
           
        });

        requestDetails.getControlStatus = function (data, approvalLevel) {
            var result = {  Approve: false, Reject: false };
            if (approvalLevel == 0)
                return result;

            var approvedList = $.grep(data.Approvals, function (item) {
                return item.DateApproval != null&& item.Level <= approvalLevel
            });

            result.Approve = approvedList.length <approvalLevel;
            result.Reject = result.Approve;

  
            return result;
        }

        //approve
        requestDetails.onToolBarItemClick(0, function () {
            requestDetails.model.data.Level = requestDetails.model.ApprovalLevel;
            requestDetails.previous.Approve(requestDetails.model.data, true, null, function (result) {
                var prf = $.grep(result.PRFList, function (item) {
                    return item.Id == requestDetails.model.data.Id;
                });

                if (prf.length == 0)
                 return;

                /*requestDetails.model.data.DocStatusId = prf[0].DocStatusId;
                requestDetails.model.data.State = prf[0].State;
                requestDetails.model.data.Approvals = prf[0].Approvals;
                requestDetails.rebindData(requestDetails.model.data);
                requestDetails._displayTabPage(0);
                
                requestDetails.setButtonVisible("APPROVE", false);
                requestDetails.setButtonVisible("REJECT", false);*/
                requestDetails.display(requestDetails.model.data.Id)
            });
        });

        //reject
        requestDetails.onToolBarItemClick(1, function () {
            var dialog = new PRFApproval.ViewModel.ApprovalDialog(requestDetails.Id + '-rejectDialog', function (comment) {
                dialog.close();
                requestDetails.model.data.Level = requestDetails.model.ApprovalLevel;
                requestDetails.previous.Approve(requestDetails.model.data, false, comment, function (result) {
                    var prf = $.grep(result.PRFList, function (item) {
                        return item.Id == requestDetails.model.data.Id;
                    });
                    
                    if (prf.length == 0)
                        return;

                    requestDetails.display(requestDetails.model.data.Id)
                    /*requestDetails.model.data.DocStatusId = prf[0].DocStatusId;
                    requestDetails.model.data.State = prf[0].State;
                    requestDetails.model.data.Approvals = prf[0].Approvals;
                    requestDetails.rebindData(requestDetails.model.data);
                    requestDetails._displayTabPage(0);
                    requestDetails.setButtonVisible("APPROVE", false);
                    requestDetails.setButtonVisible("REJECT", false);*/
                });
            });
            dialog.show();
        });

        //close
        requestDetails.onToolBarItemClick(2, function () {
            requestDetails.previous.Activate();
        });

        requestDetails.onPageTabClick(0, function (page) {
            var pg = page.pages[page.model.navigation[0].page.Id];
            pg.model.data = page.model.data;
            pg.parent = page;

            //pg.model.ApprovalLevel = page.model.ApprovalLevel;
            pg.display();
        });

        requestDetails.onPageTabClick(1, function (page) {
            var requestForm = page.pages[page.model.navigation[0].page.Id];
            
            var pg = page.pages[page.model.navigation[1].page.Id];
            pg.model.data = {
                Id: page.model.data.Id,
                ProjectNo: page.model.data.ProjectNo,
                DocTypeId: page.model.data.DocTypeId,
                DocTypeName: page.model.data.DocTypeName,
                isDisable: page.model.ApprovalLevel >1,
                DocStatusId: page.model.data.DocStatusId,
                ProcessId: page.model.data.Id,
                Company:page.model.data.Company,
                RelevantDocument: page.model.data.RelevantDocs
            }

            pg.parent = requestDetails;
            pg.display();


        });

        requestDetails.setEventHandler(function () {
            var tabId = requestDetails._getPageId(0);
            var tab = $("#" + requestDetails.Id).find('#' + tabId);
            tab.css('background-color', 'gray');
        });

      
        return requestDetails;
    },
    PRFForm: function (id, selector) {
        var template = { Id: 'prfform', url: rootUrl + "src/view/PRFApproval.html" }
        var model = { data: null, styledata: {}}
        var requestForm = new eworkspace.framework.Page(id, model, template, selector);

        requestForm.displayRejectInfo = function (data, approvals) {
            data.RejectInfo = {};
            var rejectDiv = $('#' + requestForm.Id).find('table.rejectInfo');
            var isShow = false;
            var rejectApproval = $.grep(approvals, function (item, i) {
                return item.IsApproved == false && item.DateApproval != null;
            })

            if (rejectApproval.length > 0)
                rejectDiv.show();
            else
                rejectDiv.hide();

            rejectApproval.forEach(function (item) {
                data.RejectInfo.Description = item.ApproverName + " / " + utils.toString(item.DateApproval, 'dd MMM yyyy');
                data.RejectInfo.Comment = item.Comment;
            })
        }

        requestForm.initApprovers = function (data) {
            var approverCols = $('#' + requestForm.Id).find('td.approver');
            var count = approverCols.length;
            data.Approvals = data.Approvals == null ? [] : data.Approvals;
           
            data.Approvals.forEach(function (item) {
                var approverProperty = "Approver" + item.Level;
                data[approverProperty] = utils.cloneModel(item);
                data[approverProperty].DateApproval = item.IsApproved == false ? null : utils.toString(item.DateApproval, 'dd MMM yyyy');
            })

            requestForm.displayRejectInfo(data, data.Approvals);
        }

        requestForm.model.download = function () {
            PRFApproval.Services.downloadFile(requestForm.model.data.SourceFileUrl, requestForm.model.data.SourceFileLocation);
        }

        requestForm.setLoadCompletedHandler(function (data) {
            requestForm.initApprovers(data);
            requestForm.model.styledata.InitGPPCTDesc = data.InitGPPCT < 0 ? "red" : "black";
            requestForm.model.styledata.GPPCTDesc = data.GPPCT < 0 ? "red" : "black";
            requestForm.model.styledata.GPPCTDescAsLastMonth = data.GPPCTAsLastMonth < 0 ? "red" : "black";
            if (requestForm.observable != null)
                requestForm.observable.set("styledata", requestForm.model.styledata);
                
            
        })
        return requestForm;

    },
    UploadRelevantDocuments: function (id, selector) {
        var template = { Id: 'uploadDoc', url: rootUrl + "src/view/PRFApproval.html" }
        var model = utils.cloneModel(PRFApproval.Model.UploadRelevantDocuments);

        var uploadForm = new eworkspace.framework.List(id, model, selector, template);

        uploadForm.setEventHandler(function () {

            var inputFile = $('#' + uploadForm.Id).find('input[name=docfile]');
            var docExport = $("#" + uploadForm.Id).find('.exportpdf').find('button');

            var deleteFile = function (e) {
                if (e.model.IsReadOnly) {
                    PRFApproval.error('Cannot delete this document!');
                    uploadForm.display();
                    return;
                }

                PRFApproval.Services.deleteDocument (e.model.Id, function () {
                    uploadForm.model.data.RelevantDocument = $.grep(uploadForm.model.data.RelevantDocument, function (item) {
                        return item.Id != e.model.Id;
                    })

                    uploadForm.parent.model.data.RelevantDocument = uploadForm.model.data.RelevantDocument;
                    PRFApproval.info('Document deleted');
                }, function () {
                    uploadForm.display();
                });
            }

            var grid = uploadForm._getGrid();
            grid.bind("remove", deleteFile);

            grid.content.on("click", "a:not('.k-button')", function () {
                row = $(this).closest("tr"),
                 dataItem = grid.dataItem(row);
                PRFApproval.Services.downloadFile(dataItem.FileUrl,dataItem.LocationId);
            });

            if (docExport.length) {
                docExport.click(function () {
                    //generate document
                    alert('generate');
                })
            }

            inputFile.kendoUpload({
                async: {},
                select: onSelectFile,
                multiple: false
            });

            function onSelectFile(e) {
                if (e.files.length > 0 && !e.files[0].name.match(/\.(?!(js|exe)$)([^.]+$)/)) {
                    e.preventDefault();
                    alert("exe or js file is not allowed!");
                    return false;
                }
                else {
                    if (uploadForm.model.data.Id != null && uploadForm.model.data.Id.length > 0)
                        $.each(e.files, function (index, value) {
                            PRFApproval.Services.uploadFile(value, uploadForm.model.data.ProjectNo, uploadForm.model.data.Company, function (json) {
                                var document = { ProcessId: uploadForm.model.data.ProcessId, FileName: json.FileName, FileUrl: json.FileUrl, DateUpload: null, DocTypeName: "Others", IsReadOnly: false };
                                PRFApproval.Services.saveDocument(document, function (doc) {
                                    PRFApproval.info("upload successfully!");
                                    uploadForm.model.data.RelevantDocument.unshift(doc);
                                    uploadForm.refreshgridData(uploadForm.model.data.RelevantDocument);
                                    uploadForm.parent.model.data.RelevantDocument = uploadForm.model.data.RelevantDocument;

                                });
                            });

                        });
                    else
                        PRFApproval.error('Please save Request form first');
                }


            };

        })

        uploadForm.disable = function (disable, canExport) {
            canExport = canExport == null ? !disable : canExport;
            var uploadArea = $("#" + uploadForm.Id).find(".uploadarea");
            var docExport = $("#" + uploadForm.Id).find('.exportpdf');
            var grid = uploadForm._getGrid();

            if (disable == true) {
                uploadArea.hide();
                grid.hideColumn(4);
            } else {
                uploadArea.show();
                grid.showColumn(4);
            }


            if (canExport == true)
                docExport.show();
            else
                docExport.hide();
        }

        uploadForm.setLoadCompletedHandler(function (data) {
            data.isDisable = data.isDisable == null ? true : data.isDisable;
            data.RelevantDocument = data.RelevantDocument == null ? [] : data.RelevantDocument;
            uploadForm.disable(data.isDisable, data.DocStatusId>1);
        })

        uploadForm.generatePDFReport = function (doc, callback) {
            /*DebitCreditNote.Services.generatePDFReport(doc, function (document) {
                var existDoc = $.grep(doc.RelevantDocument, function (item) {
                    var isExist = item.DocTypeId == doc.DocTypeId && item.FileName == doc.DocNo + '.pdf';
                    if (isExist)
                        item.DateCreate = document.DateCreate;

                    return isExist;

                });

                if (existDoc.length == 0) {
                    document.DocTypeName = doc.DocTypeName;
                    doc.RelevantDocument.unshift(document);
                }


                if ($.isFunction(callback))
                    callback(doc);
            })*/
        }

        return uploadForm;

    },
    PRFList: function (id, selector) {
        var model = utils.cloneModel(PRFApproval.Model.PRFList);
        var requestList = new eworkspace.framework.ListPage(id, model, selector);
        //requestList.model.ApprovalLevel = 0;
        var getPRFList = function (callback) {
            if (requestList.model.viewYear == null)
                PRFApproval.Services.getTransactionMonth(function (json) {
                    setTransactionYearandMonth(json.options[0].value);
                    PRFApproval.Services.getPRFList(requestList.model.viewYear, requestList.model.viewMonth, callback);
                    requestList.refreshFilter(0, json.options);
                })
            else
                PRFApproval.Services.getPRFList(requestList.model.viewYear, requestList.model.viewMonth, callback);
        }
        requestList.setLoadDataHandler(getPRFList);
        requestList.setFormLoadedHandler(function () {
            var grid = requestList._getGrid();
            grid.content.on("click", "a", function () {
                row = $(this).closest("tr"),
                dataItem = grid.dataItem(row);
                PRFApproval.Services.downloadFile(dataItem.FileUrl, dataItem.FileLocation);
            });
        })
     
        var setTransactionYearandMonth = function (value) {
            if (value != null && value.length > 0) {
                var temp = value.split('-');
                requestList.model.viewYear = temp[0];
                requestList.model.viewMonth = temp[1];
            }
        }
        requestList.onFilter(0, function (e) {
            var value = this.value();
            setTransactionYearandMonth(value);
            requestList.display();

        });

   
        requestList.onButtonClick(1, function (page) {
            var grid = requestList._getGrid();
            var row = grid.select();
            var data = grid.dataItem(row);

            if (data != null) {
                page.previous = requestList;
                page.display(data.Id);
            }
            else {
                alert('Please select a record');
                requestList.display();
            }
        });

        requestList.Activate = function () {
            requestList.display();
        }
        return requestList;
    }
}

