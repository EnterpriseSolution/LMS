var createViewModels = function () {
    var mobileApp = {
        Model: {},
        createSessionName: function (key) {
            if (key == null)
                return null;

            return btoa(key) + utils.getTimeStampOfToday();
        }
    }

    var utils = mobile.getUtils();
    mobileApp.Model.layout = {
        navigationButton: [],
        transition: 'slide',
        tabs: [
            { id: 'home', icon: "fa-calendar", label: "Schedule", page: { Id: 'home', url: 'mobileApp.ViewModels.homeView'} },
            { id: 'shipment', icon: "fa-vessel", label: "Shipment", page: { Id: 'shipment', url: 'mobileApp.ViewModels.shipView' } },
            { id: 'order', icon: "fa-document", label: "Order", page: { Id: "order", url: 'mobileApp.ViewModels.OrderView' } },
            { id: 'inventory', icon: "fa-warehouse", label: "Inventory", page: { Id: 'inventory', url: 'mobileApp.ViewModels.InventoryView' } },
            { id: 'job', icon: "fa-transaction", label: "Jobs", page: { Id: 'job', url: 'mobileApp.ViewModels.TransactionView'} },
        ]

    }
    mobileApp.Model.foo = {
        title: 'Schedule',
        data: {
            title: 'Test'
        }
    }
    mobileApp.Model.OrderTypes = [
        { id: 1, name: 'Vessel Order' },
        { id: 2, name: 'Tank to Tank' },
        { id: 3, name: 'ITT' },
    ];
    mobileApp.Model.OrderStatus = [
        { id: 'D', name: 'Draft', color: '#ffd966' },
        { id: 'R', name: 'Registered', color: '#00DDFF' },
        { id: 'P', name: 'Planned' },
        { id: 'A', name: 'Active' },
    ];

    var mobileService = function () {
        var service = function () {
            console.info('load jquery timer');
            this.sessionName = mobileApp.createSessionName(mobile.appConfig.appId);
            var self = this;
            $(document).ajaxSend(function (event, request, settings) {
                self.getToken(function (access_token) {
                    if (access_token != null)
                        request.setRequestHeader("Authorization", "Bearer " + access_token);
                })
            });

            $.ajaxSetup({ cache: false });

        };
        service.prototype = {
            createSession: function (json) {
                localStorage.setItem(this.sessionName, JSON.stringify({
                    expireDate: json.expireDate,
                    access_token: json.access_token,
                    refresh_token: json.refresh_token,
                    refresh_token_expires_in: json.refresh_token_expires_in
                }))
            },
            getSession: function () {
                var obj = localStorage.getItem(this.sessionName);
                obj = obj != null && obj.length > 0 ? JSON.parse(obj) : null;
                return obj;
            },
            callApi: function (options) {
                mobileApp.Services.getToken(function (token) {
                    options.headers = options.headers || {};
                    options.headers["Authorization"] = "bearer " + token;
                    $.ajax(options);
                });
            },
            getUserProfile: function () {
                var profile = localStorage.getItem(mobileService.sessionName);
                mobileApp.profile = profile == null ? null : JSON.parse(profile);
                if (profile != null)
                    mobileApp.profile = mobileApp.Services.getSession();
            },
            login: function (user, callback, failCallback) {
                $.ajax({
                    type: "POST",
                    url: mobile.appConfig.AuthorizationUrl + 'token',
                    data: "grant_type=password&username=" + user.UserId + "&password=" + user.Password + "&client_id=" + mobile.appConfig.appId,
                    global: false,
                    success: function (json) {
                        json.expireDate = new Date(json.expires); 
                        mobileApp.profile = json;
                        mobileApp.Services.createSession(json);
                        
                        if ($.isFunction(callback))
                            callback();
                    },
                    error: function (xhr) {
                        if (xhr.responseText == null || xhr.responseText.length == 0) {
                            alert("Login fails");
                        }

                        var errorObj = JSON.parse(xhr.responseText);
                        alert(errorObj.Message);

                        if ($.isFunction(failCallback))
                            failCallback();
                    },
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded',
                    processData: false
                });
            },
            logout: function (callback, failcallback) {
                var options= {
                    type: "DELETE",
                    url: mobile.appConfig.serviceUrl + 'users/signout/' + mobile.appConfig.appId,
                    success: function (json) {
                        if ($.isFunction(callback))
                            callback();
                    },
                    error: function (xhr) {
                        console.error("logout fails:" + xhr.responseText);
                        if ($.isFunction(failCallback))
                            failCallback();
                    },
                    processData: false
                };

                mobileApp.Services.callApi(options);
                localStorage.clear();
            },
            getToken: function (callback, failcallback) {
                if (mobileApp.Services.sessionName == null && mobileApp.Services.sessionName.length == 0) {
                    failcallback();
                    return;
                }
                var current = new Date();
                var internal = 5;
                if (mobileApp.profile == null)
                    mobileApp.Services.getUserProfile();

                var checkedDate = new Date(current.setMinutes(current.getMinutes() + 5));
                if (mobileApp.profile != null && mobileApp.profile.expireDate > checkedDate && mobileApp.profile.access_token != null)
                    callback();
                else if (mobileApp.profile != null) {
                    appInstance.Services.getAccessToken(mobileApp.profile.user.refresh_token, callback, failCallback);
                }
                else if ($.isFunction(failcallback))
                    failcallback();
            },
            getAccessToken: function (refreshtoken, callback, failCallback) {
                var self = this;
                console.info("start to get access token by refreshtoken");

                $.ajax({
                    type: "POST",
                    url: mobile.appConfig.AuthorizationUrl + 'token',
                    data: "grant_type=refresh_token&refresh_token=" + refreshtoken + "&client_id=" + mobile.appConfig.appId, 
                    global: false,
                    success: function (json) {
                        json.expireDate = new Date(json.expires);
                        self.createSession(json);
                      
                        if ($.isFunction(callback))
                            callback(json.access_token);
                    },
                    error: function (xhr) {
                        alert(xhr.responseText);

                        if ($.isFunction(failCallback))
                            failCallback();
                    },
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded',
                    processData: false
                });
            },
            getVesselScheduleList: function (start, end, callback) {
                var data = [
                    {
                        id: 1,
                        start: new Date("2020/8/9 08:00 AM"),
                        end: new Date("2020/8/9 09:00 AM"),
                        title: "Vessel A",
                        jettyId: 1,
                        statusColor: "red"
                    },
                    {
                        id: 2,
                        start: new Date("2020/8/31 08:00 AM"),
                        end: new Date("2020/9/2 09:00 AM"),
                        title: "Vessel B",
                        jettyId: 2,
                        statusColor: "blue"

                    }
                ]
                var filter = $.grep(data, function (item) {
                    return item.start >= start && item.end <= end;
                })
                var result = {
                    data: filter,
                    JettyList: [
                        { text: "Jetty 01", value: 1 },
                        { text: "Jetty 02", value: 2 },
                        { text: "Jetty 03", value: 3 }
                    ]
                }

                result.data.forEach(function (item) {
                    item.JettyList = result.JettyList;
                })
                if ($.isFunction(callback))
                    callback(result);
            },
            getShipmentList: function (callback) {

                var data = [
                    { shipmentNo: "V2093838", vesselName: 'Vessel A', ETA: '15 Aug 2020', status: 'H', color: 'red', letter: "Unassigned Vessels", JettyId: "0", assignedJetty: null },
                    { shipmentNo: "V2093839", vesselName: 'Vessel B', ETA: '03 Aug 2020', status: 'A', color: 'green', letter: "Jetty 1", JettyId: "1", assignedJetty: 1 },
                    { shipmentNo: "V2093840", vesselName: 'Vessel C', ETA: '04 Aug 2020', status: 'D', color: 'blue', letter: "Jetty 1", JettyId: "2", assignedJetty: 1 },
                ];

                if ($.isFunction(callback))
                    callback(data);

            },
            getShipmentDetails: function (params, callback) {
                mobileApp.Services.getShipmentList(function (list) {
                    var result = $.grep(list, function (item) {
                        return item.shipmentNo == params.id
                    });
                    var data = result.length > 0 ? result[0] : {
                        title: "",
                        JettyList: [
                            { id: 1, name: "Jetty 1" },
                            { id: 2, name: "Jetty 2" }
                        ],
                        vesselName: '',
                        vesselId: '',
                        assignedJetty: null,
                        plannedArrival: new Date(),
                        Remark: null,
                        OrderList: [],
                        shipmentNo: null
                    };

                    data.title = params.id == null ? 'New Schedule' : (params.id + "-" + data.vesselName);

                    if (result.length > 0) {
                        data.OrderList = [
                            { OrderNo: "202008080001-E", Qty: 10000, UOM: 'M3@15C', ProductName: "Product A", CustomerName: "Customer A", OperationType: 1, OperationTypeIcon: "fas fa-arrow-circle-up" },
                            { OrderNo: "202008080002-E", Qty: 5000, UOM: 'M3@15C', ProductName: "Product B", CustomerName: "Customer B", OperationType: 2, OperationTypeIcon: "fas fa-arrow-circle-down" },
                        ];

                        data.JettyList = [
                            { id: 1, name: "Jetty 1" },
                            { id: 2, name: "Jetty 2" }
                        ]

                        data.plannedArrival = new Date(data.ETA);

                    }

                    if (params.jettyname != null) {
                        var jetty = $.grep(data.JettyList, function (item) {
                            return item.name == params.jettyname;
                        });
                        if (jetty.length > 0)
                            data.assignedJetty = jetty[0].id;
                    }


                    if ($.isFunction(callback))
                        callback(data)
                })

            },
            getOrderDetails: function (params, callback) {
                var data = {
                    title: "",
                    UOMList: [
                        { id: 1, name: "M3@15C" },
                        { id: 2, name: "Metric Ton" }
                    ],
                    UOM: null,
                    UOMId: null,
                    VesselId: '',
                    CustomerName: '',
                    ProductName: '',
                    Qty: 0,
                    Remark: null,
                    OrderNo: params.id == null ? 0 : params.id,
                    OperationType: 1,
                    OperationTypeIcon: "fas fa-arrow-circle-up"
                };
                data.title += params.id == null ? 'New Order' : params.id;


                if ($.isFunction(callback))
                    callback(data)
            },
            getOrderList: function (callback) {

                var data = [
                    { OrderNo: "202009020001-I", vesselName: "Vesssel A", plannedArrival: new Date('15 Aug 2020'), startDate: new Date('15 Aug 2020'), CustomerName: 'Customer A', status: 'D', color: '#ffd966', letter: "Vessel Order", Qty: 5000.000, UOMId: 2, UOM: "MT", ProductName: "Product A", OrderType: 1, OperationType: 1 },
                    { OrderNo: "202009020002-E", vesselName: "Vesssel B", plannedArrival: new Date('03 Aug 2020'), startDate: new Date('03 Aug 2020'), CustomerName: 'Customer B', status: 'A', color: 'green', letter: "Vessel Order", Qty: 8000.000, UOMId: 2, UOM: "MT", ProductName: "Product B", OrderType: 1, OperationType: 2 },
                    { OrderNo: "202009020003-I", vesselName: "Vesssel C", plannedArrival: new Date('04 Aug 2020'), startDate: new Date('04 Aug 2020'), CustomerName: 'Customer C', status: 'P', color: 'blue', letter: "Vessel Order", Qty: 10000.000, UOMId: 2, UOM: "MT", ProductName: "Product C", OrderType: 1, OperationType: 1 },
                    { OrderNo: "202009020004", vesselName: "", startDate: null, CustomerName: 'Customer A', status: 'A', color: 'green', letter: "Tank to Tank", Qty: 5000.000, UOMId: 2, UOM: 'MT', ProductName: "Product A", OrderType: 2 },
                    { OrderNo: "202009020005", vesselName: "", startDate: null, CustomerName: 'Customer B', status: 'A', color: 'green', letter: "ITT", Qty: 8000.000, UOMId: 2, UOM: 'MT', ProductName: "Product B", OrderType: 3 },

                ];

                if ($.isFunction(callback))
                    callback(data);

            },
            getOrderDetailsByOrderNo: function (params, callback) {
                mobileApp.Services.getOrderList(function (list) {
                    var result = $.grep(list, function (item) {
                        return item.OrderNo == params.id
                    });

                    var data = result.length > 0 ? result[0] : {
                        title: "",
                        UOMList: [
                            { id: 1, name: "M3@15C" },
                            { id: 2, name: "Metric Ton" }
                        ],
                        UOM: null,
                        UOMId: null,
                        VesselName: '',
                        ETA: '',
                        CustomerName: '',
                        ProductName: '',
                        status: 'R',
                        color: null,
                        startDate: new Date(),
                        OrderType: params.OrderType,
                        Qty: 0,
                        Remark: null,
                        OrderNo: params.id == null ? 0 : params.id,
                        OperationType: null,
                        OperationTypeIcon: "fas fa-arrow-circle-up"
                    };

                    var orderType = $.grep(mobileApp.Model.OrderTypes, function (item) {
                        return item.id == data.OrderType
                    })[0];

                    var status = $.grep(mobileApp.Model.OrderStatus, function (item) {
                        return item.id == data.status;
                    })[0];
                    data.color = status.color;
                    data.title = params.id == null ? ('New ' + orderType.name) : (orderType.name + " : " + params.id + " (" + status.name + ")");
                    if (result.length > 0) {
                        data.UOMList = [
                            { id: 1, name: "M3@15C" },
                            { id: 2, name: "Metric Ton" }
                        ];



                    }

                    if ($.isFunction(callback))
                        callback(data)
                })




            },
            getInventoryList: function (callback) {

                var data = [
                    { TankName: "T1001", ProductName: "Product A", Temperature: '15C', Density: '0.9811', GSV: 18937.623, MT: 18558.871, USBBL: 119156 },
                    { TankName: "T1002", ProductName: "Product B", Temperature: '15C', Density: '0.9811', GSV: 18937.623, MT: 18558.871, USBBL: 119156 },
                    { TankName: "T1003", ProductName: "Product A", Temperature: '15C', Density: '0.9811', GSV: 18937.623, MT: 18558.871, USBBL: 119156 },
                    { TankName: "T1004", ProductName: "Product C", Temperature: '15C', Density: '0.9811', GSV: 18937.623, MT: 18558.871, USBBL: 119156 },
                    { TankName: "T1005", ProductName: "Product B", Temperature: '15C', Density: '0.9811', GSV: 18937.623, MT: 18558.871, USBBL: 119156 },
                    { TankName: "T1006", ProductName: "Product A", Temperature: '15C', Density: '0.9811', GSV: 18937.623, MT: 18558.871, USBBL: 119156 },
                ];

                if ($.isFunction(callback))
                    callback(data);

            },
            getJobList: function (callback) {

                var data = [
                    { JobNo: "202009020001-I-1", vesselName: "Vesssel A", startDate: '15 Aug 2020', endDate: '', CustomerName: 'Customer A', status: 'C', color: 'lightgray', letter: "Vessel Order", Qty: 5000.000, Actual: 4999.938, UOMId: 2, UOM: "MT", ProductName: "Product A", OrderType: 1, OperationTypeIcon: "fas fa-arrow-circle-up" },
                    { JobNo: "202009020002-E-1", vesselName: "Vesssel B", startDate: '03 Aug 2020', endDate: '', CustomerName: 'Customer B', status: 'A', color: 'green', letter: "Vessel Order", Qty: 8000.000, Actual: 7999.938, UOMId: 2, UOM: "MT", ProductName: "Product B", OrderType: 1, OperationTypeIcon: "fas fa-arrow-circle-up" },
                    { JobNo: "202009020003-I-1", vesselName: "Vesssel C", startDate: '04 Aug 2020', endDate: '', CustomerName: 'Customer C', status: 'P', color: 'blue', letter: "Vessel Order", Qty: 10000.000, Actual: 9999.938, UOMId: 2, UOM: "MT", ProductName: "Product C", OrderType: 1, OperationTypeIcon: "fas fa-arrow-circle-up" },
                    { JobNo: "202009020004-1", vesselName: "", startDate: '', endDate: '', CustomerName: 'Customer A', status: 'A', color: 'green', letter: "Tank to Tank", Qty: 5000.000, Actual: 4999.938, UOMId: 2, UOM: 'MT', ProductName: "Product A", OrderType: 2, OperationTypeIcon: null },
                    { JobNo: "202009020005-1", vesselName: "", startDate: '', endDate: '', CustomerName: 'Customer B', status: 'A', color: 'green', letter: "ITT", Qty: 8000.000, Actual: 7999.938, UOMId: 2, UOM: 'MT', ProductName: "Product B", OrderType: 3, OperationTypeIcon: null },

                ];

                if ($.isFunction(callback))
                    callback(data);

            },
        }
        return new service();
    }
    mobileApp.Services = new mobileService();
    var viewModels = function () {
        mobileApp.templateUrl = mobile.appConfig.templateFolder + "/template_mobile_kendo.html";
    };
    viewModels.prototype = {
        homeView: function (id, selector) {
            //var template = { html: '<h1 data-bind="text:data.title"></h1><button data-bind="events: {click: changeTitle}">TEST</button> <ul data-role="listview" data-style="inset" data-type="group"><li><a data-bind="events: {click: changeView}">test</a></li></ul>' };
            var template = { Id: 'vesselSchedule', url: mobileApp.templateUrl }; //{ html: '<div class="scheduler" style="margin-right:10px"></div>' };
            var view = new mobile.kendo.View(id, mobileApp.Model.foo, template, selector);
            var getDateRange = function (curr) {
                var result = {};
                var days = new Date(curr.getFullYear(), curr.getMonth(), 0).getDate() - curr.getDay();
                var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                var last = (first < 0 ? (days + first) : first) + 6; // last day is the first day + 6

                result.firstday = new Date(curr.setDate(first));
                result.lastday = new Date(curr.setDate(last));
                return result;
            }

            var getVesselSchedules = function (callback) {
                if (view.model.currentDate == null)
                    view.model.currentDate = new Date;
                var dateRange = getDateRange(new Date(view.model.currentDate.getFullYear(), view.model.currentDate.getMonth(), 1));
                var firstDate = new Date(dateRange.firstday.getTime());
                dateRange.lastday = new Date(firstDate.setDate(firstDate.getDate() + 41));
                console.log('date Range', dateRange);
                mobileApp.Services.getVesselScheduleList(dateRange.firstday, dateRange.lastday, callback);
            }
            view.setLoadDataHandler(getVesselSchedules);

            //view.model.nextView = { Id: 'next', url: 'mobileApp.ViewModels.nextView' };
            /* view.model.changeTitle = function () {
                 this.set("data.title", 'My Test');
             }
        
             view.model.changeView = function () {
                 alert('change view')
                 view.showNextView();
             }*/
            view.setLoadCompletedHandler(function (data) {
                var viewId = view._getViewId();
                var schedulerElm = $('#' + viewId).find(".scheduler");
                var scheduler = schedulerElm.data("kendoScheduler");
                scheduler.dataSource.data(data.data);
                scheduler.resources[0].dataSource.data(data.JettyList);
                view.model.masterData = data.JettyList;
                //scheduler.refresh(); 
            })
            view.setInitViewHandler(function () {
                var curr = new Date; // get current date
                var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                var firstday = new Date(curr.setDate(first));

                var viewId = view._getViewId();
                var schedulerElm = $('#' + viewId).find(".scheduler");
                var scheduler = schedulerElm.data("kendoScheduler");
                if (scheduler == null) {
                    schedulerElm.kendoScheduler({
                        date: curr,
                        startTime: new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDay()),
                        height: '700',
                        mobile: 'phone',
                        editable: {
                            template: $("#editor").html()
                        },
                        majorTimeHeaderTemplate: "",
                        dateHeaderTemplate: kendo.template("<strong>#=date.getWeekDayName(1)#</strong>"),
                        views: [
                            {
                                type: "timelineWeek",
                                selected: true,
                                majorTick: 1440,
                                minorTickCount: 1,
                                columnWidth: 40
                            },
                            { type: "month" }
                        ],
                        group: {
                            resources: ["Jetties"],
                            orientation: "vertical"
                        },
                        resources: [
                            {
                                field: "jettyId",
                                name: "Jetties",
                                dataSource: [
                                    { text: "Jetty 01", value: 1, color: "#6eb3fa" },

                                ],
                                title: "Jetty"
                            }
                        ],
                    });
                    scheduler = schedulerElm.data("kendoScheduler");
                    var onSave = function (e) {
                        console.log('save', e);
                        alert('save')
                    }

                    var onDateChange = function (e) {
                        view.model.currentDate = e.date;
                        view.display();
                    }

                    var onAdd = function (e) {
                        if (e.action == "add")
                            e.items[0].JettyList = view.model.masterData;
                    }


                    scheduler.bind("save", onSave);
                    scheduler.bind("navigate", onDateChange);
                    scheduler.dataSource.bind("change", onAdd);


                }



            })

            return view;

        },
        shipView: function (id, selector) {
            var template = { Id: 'shipment', url: mobileApp.templateUrl};
            var model = {
                title: "Shipment",
                dataSource: {
                    data: [],
                    group: { field: "letter", dir: 'desc' },
                },
                filterable: {
                    placeholder: "Type to search...",
                    field: "shipmentNo"
                },
                itemTemplate: { id: '#shipment-template' },
                headerTemplate: "<span data-i18n='${value}'>${value}</span><a style='float:right;color:black' onclick='mobile.models.shipment.addShipment(\"${value}\")'><i class='fas fa-plus'></i></a>",
                data: [],
                nextView: { Id: 'shipmentdtl', url: 'mobileApp.ViewModels.ShipmentDetailView' }


            }
            var view = new mobile.kendo.ListView(id, model, selector, template);
            view.setLoadDataHandler(mobileApp.Services.getShipmentList);
            view.setItemClickHandler(function (e) {
                view.showNextView('id=' + e.dataItem.shipmentNo);
            });

            view.model.addShipment = function (name) {
                console.log(name)
                view.showNextView('jettyname=' + name);
            }

            return view;

        },
        ShipmentDetailView: function (id, selector) {
            //var template = { html: '<h1 data-bind="text:data.title"></h1><button data-bind="events: {click: changeTitle}">Next View</button> <ul data-role="listview" data-style="inset" data-type="group"><li><a href="#nextView">test</a></li></ul>' };
            var template = { Id: 'shipmentDetails', url: mobileApp.templateUrl };
            var model = {
                navigationBar: {
                    title: "Vessel Schedule",
                    buttons: [
                        {
                            align: 'right',
                            rel: 'actionsheet',
                            href: 'command',
                            icon: 'far fa-list-alt'
                        },
                        {
                            align: 'left',
                            backButton: true,
                            text: "Back"
                        }
                    ]
                },
                actionsheets: [
                    {
                        id: "command",
                        items: [
                            { id: "cmd_saveSchedule", name: "Save Schedule", action: "saveShipment" },
                            { id: "cmd_addOrder", name: "Add Order", action: "addOrder" },
                            { id: "cmd_deleteSchedule", name: "Delete Schedule", action: "deleteShipment" },

                        ]
                    }
                ],
                nextView: [
                    { Id: 'selectVessel', url: 'mobileApp.ViewModels.VesselList' },
                    { Id: 'addorder', url: 'mobileApp.ViewModels.BasicOrder' },
                    //{ Id: 'addorder', url: 'mobileApp.ViewModels.OrderPopup', isPopover: true },
                ],
                data: {}
            }
            var view = new mobile.kendo.ActionSheetView(id, model, template, selector);

            view.setLoadDataHandler(mobileApp.Services.getShipmentDetails);
            view.setLoadCompletedHandler(function (data) {
                var list = getListView();
                list.dataSource.data(data.OrderList);
                if (data.shipmentNo == null)
                    view.hideActionSheetItem("cmd_deleteSchedule");
                else
                    view.showActionSheetItem("cmd_deleteSchedule")
            })
            view.setEventHandler(function () {
                var listView = getListView();
                listView.bind("click", view.model.onOrderClick);
            })
            var getListView = function () {
                var viewId = view._getViewId();
                var listView = $("#" + viewId).find(".tm-listview");
                return listView.data("kendoMobileListView");
            }

            view.model.AddOrderToList = function (item) {
                view.model.data.OrderList.push(item);
                view.getField('data.OrderList').push(item);
                var list = getListView();
                list.dataSource.data(view.model.data.OrderList);
            }

            view.model.onOrderClick = function (e) {
                view.navigateTo('#addorder_view?id=0');
            }

            view.setInitViewHandler(function () {
                $("#" + view.viewId).find('.firstSection').data("kendoMobileCollapsible").expand();
            })

            view.model.saveShipment = function () {
                var data = view.getData();
                alert(JSON.stringify(data));
            }

            view.model.deleteShipment = function () {
                //this.set("data.title", 'My Test');
                alert('d')
            }

            view.model.addOrder = function () {
                //this.set("data.title", 'My Test');
                view.navigateTo('#addorder_view?id=0');
            }

            view.model.selectVessel = function () {

                view.navigateTo('#selectVessel_view');
            }

            /*mobileApp.ViewModels.OrderPopup = function (id, selector) {
                var model = {
                    views: [
                        { Id: 'createOrder', url: 'mobileApp.ViewModels.nextView' },
                    ]
                }
                var view = new mobile.kendo.Popover(id, model, selector);
                return view;
            }

            mobileApp.ViewModels.nextView = function (id, selector) {
                var template = { html: '<h1 data-bind="text:data.title"></h1><button data-bind="events: {click: changeTitle}">Next View</button> <ul data-role="listview" data-style="inset" data-type="group"><li><a href="#nextView">test</a></li></ul>' };

                var view = new mobile.kendo.View(id, mobileApp.Model.foo, template, selector);
                view.model.changeTitle = function () {
                    this.set("data.title", 'My Test');
                }

                return view;

            }*/

            return view;
        },
        VesselList: function (id, selector) {
            var template = { Id: 'vessels', url: mobileApp.templateUrl };
            var model = {
                title: "Select Vessel",
                navigationBar: {
                    title: "Select Vessel",
                    buttons: [
                        {
                            align: 'left',
                            backButton: true,
                            text: "Back",
                            reloadData: false
                        }
                    ]
                },
                dataSource: {
                    data: [],
                },
                filterable: {
                    placeholder: "Type to search...",
                    field: "name"
                },
                itemTemplate: {
                    html: '${name}'
                },
                data: [
                    { id: 1, name: "Vessel A" },
                    { id: 2, name: "Vessel B" },
                    { id: 3, name: "Vessel C" }
                ],

            }

            var view = new mobile.kendo.ListView(id, model, selector, template);
            view.setItemClickHandler(function (e) {
                view.parent.setField("data.VesselName", e.dataItem.name);
                view.parent.setField("data.VesselId", e.dataItem.id);
                view.parent.setField("data.title", view.parent.model.data.No + '-' + e.dataItem.name);
                view.showPreviousView('reloadData=false');
            });
            return view;

        },
        BasicOrder: function (id, selector) {
            var template = { Id: 'basicOrder', url: mobileApp.templateUrl };
            var model = {
                navigationBar: {
                    title: "Order Info",
                    buttons: [
                        {
                            align: 'right',
                            rel: 'actionsheet',
                            href: 'command',
                            icon: 'far fa-list-alt'
                        },
                        {
                            align: 'left',
                            backButton: true,
                            text: "Back",
                            reloadData: false
                        }
                    ]
                },
                actionsheets: [
                    {
                        id: "command",
                        items: [
                            { name: "Save", action: "saveOrder" },
                            { name: "Delete", action: "deleteOrder" },
                        ]
                    }
                ],
                data: {}
            }
            var view = new mobile.kendo.ActionSheetView(id, model, template, selector);
            view.setLoadDataHandler(mobileApp.Services.getOrderDetails);
            view.model.saveOrder = function () {
                var data = view.getData();
                var item = utils.cloneModel(data);
                item.UOM = $.grep(item.UOMList, function (uom) {
                    return uom.id == item.UOMId;
                })[0].name;
                item.OperationTypeIcon = item.OperationType == 1 ? "fas fa-arrow-circle-up" : "fas fa-arrow-circle-down";
                view.parent.model.AddOrderToList(item);

                view.showPreviousView('reloadData=false');
                alert(JSON.stringify(data));
            }

            view.model.deleteOrder = function () {
                //this.set("data.title", 'My Test');
                alert('d')
            }
            return view;

        },
        OrderView: function (id, selector) {
            var template = { Id: 'orderlist', url: mobileApp.templateUrl };
            var model = {
                title: "Orders",
                dataSource: {
                    data: [],
                    group: { field: "letter", dir: 'desc' },
                },
                filterable: {
                    placeholder: "Type to search...",
                    field: "CustomerName"
                },
                itemTemplate: { id: '#order-template' },
                headerTemplate: "${value}<a style='float:right;color:black' onclick='mobile.models.order.addOrder(\"${value}\")'><i class='fas fa-plus'></i></a>",
                data: [],
                nextView: { Id: 'orderdtl', url: 'mobileApp.ViewModels.OrderDetailView' }


            }
            var view = new mobile.kendo.ListView(id, model, selector, template);
            view.setLoadDataHandler(mobileApp.Services.getOrderList);
            view.setItemClickHandler(function (e) {
                view.showNextView('id=' + e.dataItem.OrderNo);
            });

            view.model.addOrder = function (name) {
                var orderType = $.grep(mobileApp.Model.OrderTypes, function (type) {
                    return type.name == name;
                });
                var orderTypeId = orderType.length > 0 ? orderType[0].id : 0;

                view.showNextView('OrderType=' + orderTypeId);
            }

            return view;
        },
        OrderDetailView: function (id, selector) {
            //var template = { html: '<h1 data-bind="text:data.title"></h1><button data-bind="events: {click: changeTitle}">Next View</button> <ul data-role="listview" data-style="inset" data-type="group"><li><a href="#nextView">test</a></li></ul>' };
            var template = { Id: 'order', url: mobileApp.templateUrl };
            var model = {
                navigationBar: {
                    title: "Order",
                    buttons: [
                        {
                            align: 'right',
                            rel: 'actionsheet',
                            href: 'command',
                            icon: 'far fa-list-alt'
                        },
                        {
                            align: 'left',
                            backButton: true,
                            text: "Back"
                        }
                    ]
                },
                actionsheets: [
                    {
                        id: "command",
                        items: [
                            { id: "cmd_approve", name: "Approve", action: "approveOrder" },
                            { id: "cmd_reject", name: "Reject", action: "rejectOrder" },
                            { id: "cmd_saveOrder", name: "Save Order", action: "saveOrder" },
                            { id: "cmd_addTank", name: "Add Tank", action: "addTank" },
                            { id: "cmd_addBOL", name: "Add BOL Instruction", action: "addBOL" },
                            { id: "cmd_deleteOrder", name: "Delete Order", action: "deleteOrder" },
                        ]
                    }
                ],
                nextView: [
                    // { Id: 'selectVessel', url: 'mobileApp.ViewModels.VesselList' },
                    //{ Id: 'addorder', url: 'mobileApp.ViewModels.BasicOrder' },
                    //{ Id: 'addorder', url: 'mobileApp.ViewModels.OrderPopup', isPopover: true },
                ],
                data: {}
            }
            var view = new mobile.kendo.ActionSheetView(id, model, template, selector);

            view.setLoadDataHandler(mobileApp.Services.getOrderDetailsByOrderNo);
            view.setLoadCompletedHandler(function (data) {
                if (data.OrderType == 1) {
                    $('#' + view.viewId).find('.vesselorder').show();
                } else
                    $('#' + view.viewId).find('.vesselorder').hide();

                if (data.status == 'D') {
                    view.showActionSheetItem("cmd_approve");
                    view.showActionSheetItem("cmd_reject");
                    view.hideActionSheetItem("cmd_saveOrder");
                    view.hideActionSheetItem("cmd_addTank");
                } else {
                    view.hideActionSheetItem("cmd_approve");
                    view.hideActionSheetItem("cmd_reject");
                    view.showActionSheetItem("cmd_saveOrder");
                    view.showActionSheetItem("cmd_addTank");
                }

                if (data.OrderNo == null || data.status == 'D' || data.status == 'A')
                    view.hideActionSheetItem("cmd_deleteOrder");
                else
                    view.showActionSheetItem("cmd_deleteOrder")

                if (data.OperationType == 1 && data.status != 'D') {
                    $('#' + view.viewId).find('.bol-doc').show();
                    view.showActionSheetItem("cmd_addBOL");
                }
                else {
                    $('#' + view.viewId).find('.bol-doc').hide();
                    view.hideActionSheetItem("cmd_addBOL");
                }
            })

            view.setInitViewHandler(function () {
                $("#" + view.viewId).find('.firstSection').data("kendoMobileCollapsible").expand();
            })

            view.setEventHandler(function () {
                var listView = getListView();
                listView.bind("click", view.model.onOrderClick);
            })
            var getListView = function () {
                var viewId = view._getViewId();
                var listView = $("#" + viewId).find(".tm-listview");
                return listView.data("kendoMobileListView");
            }

            view.model.AddOrderToList = function (item) {
                view.model.data.OrderList.push(item);
                view.getField('data.OrderList').push(item);
                var list = getListView();
                list.dataSource.data(view.model.data.OrderList);
            }

            view.model.onOperationTypeChange = function (e) {
                var value = e.sender.value();

                if (value == 1 && view.model.data.status != 'D') {
                    $('#' + view.viewId).find('.bol-doc').show();
                    view.showActionSheetItem("cmd_addBOL");
                }
                else {
                    $('#' + view.viewId).find('.bol-doc').hide();
                    view.hideActionSheetItem("cmd_addBOL");
                }
            }

            view.model.onOrderClick = function (e) {
                view.navigateTo('#addorder_view?id=0');
            }

            view.model.saveOrder = function () {
                var data = view.getData();
                alert(JSON.stringify(data));
            }

            view.model.approveOrder = function () {
                //this.set("data.title", 'My Test');
                alert('d')
            }

            view.model.rejectOrder = function () {
                //this.set("data.title", 'My Test');
                alert('d')
            }

            view.model.deleteOrder = function () {
                //this.set("data.title", 'My Test');
                alert('delete')
            }

            view.model.addTank = function () {
                //this.set("data.title", 'My Test');
                //view.navigateTo('#addorder_view?id=0');
                alert('add tank click')
            }

            view.model.addBOL = function () {
                //this.set("data.title", 'My Test');
                //view.navigateTo('#addorder_view?id=0');
                alert('add BOL click')
            }

            return view;

        },
        InventoryView: function (id, selector) {
            var template = { Id: 'inventorylist', url: mobileApp.templateUrl };
            var model = {
                title: "Inventory",
                dataSource: {
                    data: []
                },
                filterable: {
                    placeholder: "Type to search...",
                    field: "TankName"
                },
                itemTemplate: { id: '#inventory-template' },
                data: []
            }
            var view = new mobile.kendo.ListView(id, model, selector, template);
            view.setLoadDataHandler(mobileApp.Services.getInventoryList);
            return view;
        },
        TransactionView: function (id, selector) {
            var template = { Id: 'transactionlist', url: mobileApp.templateUrl };
            var model = {
                title: "Job Transactions",
                dataSource: {
                    data: [],
                    group: { field: "letter", dir: 'desc' },
                },
                filterable: {
                    placeholder: "Type to search...",
                    field: "CustomerName"
                },
                itemTemplate: { id: '#job-template' },
                headerTemplate: "${value}",
                data: []
            }
            var view = new mobile.kendo.ListView(id, model, selector, template);
            view.setLoadDataHandler(mobileApp.Services.getJobList);
            return view;
        },
        loginView: function (id, selector) {
            var template = { Id: 'loginForm', url: mobileApp.templateUrl};
            var model = {
                config: {
                    skin: "nova",

                },
                data: {
                    UserId: '',
                    Password: '',
                    LanguageId: mobile.currentLang,
                },
                nextView: { Id: 'app', url: 'mobileApp.ViewModels.HomeLayout' }
            }

            var view = new mobile.kendo.View(id, model, template, selector);
            view.model.onLogin = function () {
                //save user token
                var data = utils.cloneModel(view.getData());

                mobileApp.Services.login(data, function (isSaved) {
                    view.showNextView();
                    mobile.UI.ApplyLocalization(data.LanguageId);
                }, function () {
                    view.display();
                });

            }

            view.setOnAppCreatedHandler(function (callback) {
                mobileApp.Services.getToken(function () {
                    view.redirectView = view.nextView;
                    mobile.UI.ApplyLocalization(mobileApp.profile.currentLang);
                    console.log("access token", mobileApp.profile.access_token);
                    if (mobileApp.notification != null)
                        mobileApp.notification.register();

                    if ($.isFunction(callback))
                        callback();
                }, function () {
                        view.redirectView = null;
                        console.log('locale Languange:', mobile.currentLang);
                        mobile.UI.ApplyLocalization(view.model.data.LanguageId);
                        view.initLocale();
                        if ($.isFunction(callback))
                            callback();
                })


            });
            view.setDataShowHandler(function (e) {
                console.log('view params', e.view.params);
                view.setData({
                    UserId: '',
                    Password: '',
                    LanguageId: mobileApp.profile != null ? mobileApp.profile.currentLang : mobileApp.currentLang
                });
                mobileApp.Services.logout();

            })

            view.model.onLanuageChanged = function () {
                var lanuageId = view.getData().LanguageId;
                if (lanuageId != null && lanuageId.length > 0) {
                    mobile.UI.ApplyLocalization(lanuageId);
                    view.initLocale();
                }
            }
            view.model.onChanged = function () {
                //save user token

                var password = view.getField('data.Password');
                if (password == '' || password == null) {
                    this.set("isVisible", false);
                    var viewId = view._getViewId();
                    var input = $('#' + viewId).find("input.password")[0];
                    input.type = "password";
                }

            }
            view.model.onTogglePassword = function () {
                var viewId = view._getViewId();

                var input = $('#' + viewId).find("input.password")[0];
                if (input.type === "password") {
                    input.type = "text";
                } else {
                    input.type = "password";
                }
            }
            view.model.onKeyup = function () {
                //save user token
                this.set('isVisible', true);
            }

            view.setInitViewHandler(function () {
                var content = $('#' + view.viewId).find('.km-content');
                content.addClass("bg-login-image");
                var margin = $('#' + view.viewId).height() / 8;
                $('#' + view.viewId).find('form').css('margin-top', margin);

            })

            return view;

        },
        HomeLayout: function (id, selector) {
            var layout = new mobile.kendo.TabLayoutView(id, mobileApp.Model.layout, selector);
            return layout;
        }

    }
    return viewModels;
}
