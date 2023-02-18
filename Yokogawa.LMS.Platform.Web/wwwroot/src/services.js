define(["jquerylibs/jquery.timer"], function () {
    var config, appInstance, profile, self = null;
    var commonService = null;

    var service = function (appConfig,userProfile,instance,utils) {
        console.info('load jquery timer');
        config = appConfig;
        profile = userProfile;
        commonService = instance.exportServices();
        appInstance = instance;
        self = this;
        self.utils = utils;
    };
    service.prototype = {
        getMethods: function (obj) {
            var methods = [];
            if (obj == null)
                return methods;

            $.each(obj, function (name, item) {
                if ($.isFunction(item)) {
                    methods.push({ name: name, params: self.utils.getParameters(item), func: item});
                }
                
            })

            var proto = obj.__proto__;
            while (proto != null && proto.__proto__ != null) {
                var temp = Object.getOwnPropertyNames(proto);
                if (temp != null) {
                    temp.forEach(function (item) {
                        if (item != "constructor") {
                            methods.push({ name: name, params: self.utils.getParameters(item),func: item});
                        }
                            
                    })
                    proto = proto.__proto__;
                }
                
               
            }
            
           
            return methods;
        },
        getVirualData: function (items, pageIndex, pageSize, totalRecords, defaultItem) {
            var count = pageSize * (pageIndex - 1);
            var nextCount = totalRecords - count * pageIndex;
            var data = [];
            defaultItem = defaultItem == null ? {} : defaultItem;
            for (var i = 0; i < count; i++) {
                data.push({DateCreate:null,DateModify:null})
            }
            data = $.merge(data, items);
            for (var i = 0; i < nextCount; i++) {
                data.push({  })
            }
            return data;
        },
        getPageViewModel: function (pageId,callback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'users/pageurl?pageId=' + pageId + '&userId=' + profile.username),
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get page url):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        generateUserSecret: function (settings, callback) {
            self.utils.showProcessbar(true);
            options = {
                type: "POST",
                url: (config.serviceUrl + 'users/newsecret'),
                data: JSON.stringify(settings),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(generate user secret):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
        },
        getUserList: function (callback, failCallback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'users/users/' + profile.WebsiteId),
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get user list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr)
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            };
            commonService.callApi(options);
        },
        getADUserList: function (callback, failCallback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'users/externalusers/'+profile.WebsiteId),
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get ad user list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr)
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            };

            commonService.callApi(options);
        },
        getADUserDetails: function (id, callback, failCallback) {
            id = id == null ? self.utils.getEmptyGUID() : id;
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'users/externaluser?id=' + id + "&websiteId=" + profile.WebsiteId),
                success: function (json) {
                    json.DateCreate = self.utils.toDateString(json.DateCreate, "dd MMM yyyy, hh:mm")
                    json.DateModify = json.DateModify != null ? self.utils.toDateString(json.DateModify, "dd MMM yyyy, hh:mm") : null;
                    json.LastModifyDate = json.DateModify != null ? json.DateModify : json.DateCreate;


                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get ad user details):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
               
        },
        getUserDetails: function (id, callback,failCallback) {
            id = id == null ? self.utils.getEmptyGUID() : id;
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'users/user?id=' + id + "&websiteId=" + profile.WebsiteId),
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss")

                    $.each(json, function (attr, value) {
                        if (value == null)
                            json[attr] = '';
                    })

                    json.NewPassword = window.atob(json.Password);
                    json.ConfirmedPassword = json.NewPassword;
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get user details):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
                

        },
        saveUser: function (user, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'users/user'),
                data: JSON.stringify(user),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss") 
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(save user):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        saveADUser: function (user, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'users/externaluser'),
                data: JSON.stringify(user),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss")
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(save AD user):' + xhr.responseText);
                    
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
        },
        deleteUser: function (id, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'users/user/' + id),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete user):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        deleteADUser: function (userId, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'users/externaluser/' + userId),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete ad user):' + xhr.responseText);
                },
                processData: false
            };
            commonService.callApi(options);
        },
        getDashboards: function (callback, failCallback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'dashboards/' + profile.WebsiteId),
                success: function (json) {
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get dashboards):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            };

            commonService.callApi(options);
        },
        getDashboard: function (id, callback, failCallback) {
            id = id == null || id == 0 ? self.utils.getEmptyGUID() : id;
           var options = {
               type: "GET",
               url: config.serviceUrl + 'dashboards/' + profile.WebsiteId + '/' + id,
               success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss");

                   if (id == self.utils.getEmptyGUID())
                       json.WebsiteId = profile.WebsiteId;

                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get dashboard:' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        deleteDashboard: function (id, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'dashboards/' + id),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback))
                        callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete dashboard):' + xhr.responseText);
                },
                processData: false
            };
            commonService.callApi(options);
        },
        saveDashboard: function (dashboard, callback) {
            self.utils.showProcessbar(true);
            options = {
                type: "POST",
                url: (config.serviceUrl + 'dashboards'),
                data: JSON.stringify(dashboard),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss");

                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(save dashboard):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
        },
        publishDashboard: function (dashboardId, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'dashboards/publish'),
                data: JSON.stringify({ id: dashboardId }),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(publish dashboard):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getRoleList: function (callback,failCallback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'roles/' + profile.WebsiteId),
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get role list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
        },
        getRolesUnderMenu: function (menuId,callback, failCallback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'roles/normalroles/' + profile.WebsiteId),
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get normal role list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
        },
        getMenuList: function (callback, failCallback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'menus/list/' + profile.WebsiteId),
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get menu list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getMenuDetails: function (id, callback,failCallback) {
            id = id == null || id === 0 ? self.utils.getEmptyGUID() : id;
            var options = {
                type: "GET",
                url: config.serviceUrl + 'menus/' + profile.WebsiteId+'/' + id,
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss");

                    if (id == self.utils.getEmptyGUID())
                        json.WebsiteId = profile.WebsiteId;

                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get menu details):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        saveMenu: function (menu, callback) {
            self.utils.showProcessbar(true);
            menu.OrderId = menu.OrderId == null && menu.OrderId.length == 0 ? 0 : parseInt(menu.OrderId);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'menus'),
                data: JSON.stringify(menu),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss")

                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(save menu):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
        },
        deleteMenu: function (id, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'menus/' + id),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete menu):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options)
        },
        getContactList: function (callback,failCallback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'users/contacts'),
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get contact list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getContactDetails: function (id, callback,failCallback) {
            if (id == null || id === 0) {
                var json = { Id: self.utils.getEmptyGUID(), UserId: profile.UserId, ContactName: "", ContactEmail: "", Organization: "", Mobile: "", Extension: "" };
                if ($.isFunction(callback)) callback(json);
            }
            else {
                var options = {
                    type: "GET",
                    url: (config.serviceUrl + 'users/contact/' + id),
                    success: function (json) {
                        if ($.isFunction(callback)) callback(json);
                    },
                    error: function (xhr) {
                        alert('Service Error(get contact):' + xhr.responseText);
                        if ($.isFunction(failCallback))
                            failCallback(xhr);
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    processData: false
                }

                commonService.callApi(options);
            }
            
        },
        deleteContact: function (id, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'users/contact/' + id),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete contact):' + xhr.responseText);
                },
                processData: false
            }

            commonService.callApi(options);
        },
        saveContact: function (contact, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'users/contact'),
                data: JSON.stringify(contact),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(save contact):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getRoleById: function (id, callback, failcallback) {
            id = id == null ? self.utils.getEmptyGUID(): id;
            var options = {
                type: "GET",
                url: config.serviceUrl + 'roles/' +  profile.WebsiteId+'/'+id,
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss")
                    var temp = [];
                    var widgets = {};
                    json.ModulePermissions = json.ModulePermissions.map((item,index) => {
                        if (item.WidgetId == null)
                            temp.push(item);
                        else {
                            if (widgets[item.WidgetId] == null)
                                widgets[item.WidgetId] = [];
                            widgets[item.WidgetId].push(item);
                        }
                    });

                    json.WidgetSettings.forEach(function (widget, index) {
                        var parent = { Id: widget.WidgetId, Name: widget.WidgetName, ResourceType: "Widget", parentId: null };
                        if (widgets[widget.WidgetId] != null) {
                            temp.push(parent);
                            widgets[widget.WidgetId].forEach(function (item) {
                                item.parentId = parent.Id
                                parent.ReadPermission = item.ReadPermission;
                                parent.WritePermission = item.WritePermission;
                                temp.push(item);
                            })
                        } else {
                            var permissions = $.grep(json.Permissions, function (item) {
                                if (item.WidgetId != null)
                                    return $.grep(json.PermissionIds, function (id) { return id == item.Id }).length > 0;
                                else
                                    return false;
                            });
                            var tempWidget = $.grep(permissions, function (item) { return item.WidgetId == widget.WidgetId });
                            if (tempWidget.length > 0) {
                                temp.push(parent);
                                parent.ReadPermission = tempWidget.length > 0;
                                parent.WritePermission = parent.ReadPermission;
                            }
                    
                        }
                        
                    })
                    json.ModulePermissions = temp;
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get role detail):' + xhr.responseText);
                    if ($.isFunction(failcallback))
                        failcallback();
                    
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
        },
        saveRole: function (role, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'roles'),
                data: JSON.stringify(role),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss") 
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(save role):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        deleteRole: function (id, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'roles/' + id),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete role):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        getViewList: function (callback,failCallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'dashboards/views/' + profile.WebsiteId,
                success: function (json) {
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get views:' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        retrieveWidget: function (widgetName,namespace, callback,serviceUrl) {
            var result = { Services: [] };
            result[namespace] = [];
            var component = eval(widgetName);
            component = $.isFunction(component[widgetName]) ? component[widgetName] : component;
            if ($.isFunction(component)) {
                component = new component({
                    viewModelName: widgetName + "." + namespace,
                    profile: profile,
                    serviceUrl: serviceUrl
                });

                if ($.isFunction(component.setCore))
                    component.setCore(appInstance.exportCore());
            }
                
            var viewModel = null;
            if ($.isFunction(component.exportViewModel)) {
                var obj = component.exportViewModel();
                viewModel = $.isFunction(obj) ? new obj() : obj;
            }
            else
                viewModel = component[namespace];

            var viewModels = this.getMethods(viewModel)
            result.ViewModel = $.grep(viewModels, function (item) {
                var page = new item.func();
                var isServerHandler = page.handlers.loadDataServerHandler != null;
                var displayHandler = isServerHandler ? page.handlers.loadDataServerHandler : page.handlers.loadDataHandler;
                var displayParams = self.utils.getParameters(displayHandler);
                return (isServerHandler || !isServerHandler && displayParams[0].toLowerCase() == "callback" || page.model.data!=null && displayHandler==null);
            });

            var services = null;
            if ($.isFunction(component.exportServices)) {
                var obj = component.exportServices();
                services = $.isFunction(obj)?new obj():obj;
            }
            else
                services = component[namespace];

            result.Services = this.getMethods(services);
         
            if ($.isFunction(callback))
                callback(result);
            
        },
        loadWidget: function (widgetName, namespace, nameList, callback,serviceUrl) {
            if (widgetName.length == 0)
            {
                if ($.isFunction(callback))
                    callback();
                return;
            }
            namespace = namespace = null || namespace.length == 0 ? "ViewModel" : namespace;
            if (!$.isArray(nameList))
                nameList = [];
            else
                nameList.length = 0;

            if (!appInstance.isComponentLoaded(widgetName))
                requirejs(['app/components/' + widgetName], function () {
                    self.retrieveWidget(widgetName, namespace, function (result) {
                        result[namespace].forEach(function (item) {
                            nameList.push(item);
                        })
                        if ($.isFunction(callback))
                            callback(result);
                    }, serviceUrl);
                })
            else
                self.retrieveWidget(widgetName, namespace, function (result) {
                    result[namespace].forEach(function (item) {
                        nameList.push(item);
                    })
                    if ($.isFunction(callback))
                        callback(result);
                }, serviceUrl);
        },
        getViewDetails: function (id, callback,failcallback) {
            id = id == null ? self.utils.getEmptyGUID() : id
            
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'dashboards/view/' + profile.WebsiteId + '/' + id),
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss")
                    json.NameList = [];
                    json.SourceName = '';
                    json.CModel = json.Model != null && json.Model.length > 0 ? JSON.parse(json.Model) : {};
                    json.Items = [];
                    json.Title = json.CModel != null ? json.CModel.title : '';
                    json.ViewModelType = json.ViewModelType != null ? json.ViewModelType : '';
                    json.WidgetId = json.WidgetId == null ? '' : json.WidgetId;
                    

                    if (json.CModel != null) {
                        if (json.ViewModelType == 'eworkspace.framework.List') {
                            json.Items = json.CModel.gridOptions.columns;
                        }
                        else if (json.ViewModelType == 'eworkspace.framework.Chart') {
                            //json.CModel.chartType = json.CModel.chartType == null ? {} : json.CModel.chartType;

                            if (!$.isArray(json.CModel.chartOptions.seriesColors))
                                json.CModel.chartOptions.seriesColors = [];

                            json.serieColorList = "";
                            json.CModel.chartOptions.seriesColors.forEach(function (color) {
                                json.serieColorList += (json.serieColorList != null && json.serieColorList.length > 0 ? "," : "") + color;
                            })
                            json.CModel.chartOptions.series.forEach(function (seriesItem) {
                                json.Items.push({ title: seriesItem.name, field: seriesItem.field });
                            })
                        }
                    }

                    var namespace = json.ViewModelType == "" ? "ViewModel" : "Services";
                    if (json.Widget.length > 0)
                        self.loadWidget(json.Widget, namespace, json.NameList, function () {
                            if ($.isFunction(callback))
                                callback(json);
                        }, json.WidgetServiceUrl);
                    else
                        if ($.isFunction(callback)) callback(json);

                },
                error: function (xhr) {
                    alert('Service Error(get view details):' + xhr.responseText);
                    if ($.isFunction(failcallback))
                        failcallback();
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        saveView: function (view, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'dashboards/view'),
                data: JSON.stringify(view),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss")
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(save view):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        deleteView: function (id, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'dashboards/view/' + id),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete contact):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        getPageList: function (callback,failCallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'pages/' + profile.WebsiteId,
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get page list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getPageDetails: function (id, callback,failCallback) {
            id = id == null ? "null" : id;
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'pages/' + profile.WebsiteId + '/' + id),
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss");
                    json.IsSystem = json.IsSystemMenu == 1;
                    $.each(json, function (attr, value) {
                        if (value == null)
                            json[attr] = '';
                    })

                    json.NameList = [];

                    if (json.WidgetName.length > 0)
                        self.loadWidget(json.WidgetName, json.WidgetNamespace, json.NameList, function () {
                            if ($.isFunction(callback))
                                callback(json);
                        })
                    else
                        if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get page details):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options)
        },
        savePage: function (page, callback) {
            if (page.WidgetId != null && page.WidgetId.length == 0)
                page.WidgetId = null;


            self.utils.showProcessbar(true);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'pages'),
                data: JSON.stringify(page),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    json.LastModifyDate = json.DateModify != null ? self.utils.toDateString(json.DateModify, "dd MMM yyyy, hh:mm") : self.utils.toDateString(json.DateCreate, "dd MMM yyyy, hh:mm");
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(save page):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        deletePage: function (id, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'pages/' + id),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete page):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        getWidgetList: function (callback,failCallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'widgets/' + profile.WebsiteId,
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get widget list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getWidgetDetails: function (id, callback,failCallback) {
            id = id == null || id === 0 ? self.utils.getEmptyGUID() : id;
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'widgets/' + profile.WebsiteId + '/' + id),
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss");
                    json.protocol = window.location.protocol + "//";
                    if (id == self.utils.getEmptyGUID())
                        json.DefaultWebsiteId = profile.WebsiteId;

                    $.each(json, function (attr, value) {
                        if (value == null)
                            json[attr] = '';
                    })
                    json.EnableExistingModel = true;
                    json.isVisible = true;
                    json.isEnabled = true;
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get widget):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getWidgetByName: function (name, callback, failCallback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'widgets?name=' + name + "&websiteId=" + profile.WebsiteId),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(get widget):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        saveWidget: function (widget,callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'widgets'),
                data: JSON.stringify(widget),
                success: function (json) {
                    self.utils.showProcessbar(false);
                    json.LastModifiedOn = self.utils.toDateString(json.LastModifiedOn, "dd MMM yyyy HH:mm:ss");
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(save widget):' + xhr.responseText);
                    self.utils.showProcessbar(false);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        deleteWidget: function (id, callback) {
            self.utils.showProcessbar(true);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'widgets/' + id),
                success: function () {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    self.utils.showProcessbar(false);
                    alert('Service Error(delete widget):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        getWidgetResources: function (widget, callback, failcallback) {
            $.getJSON(widget.url).done(function (data) {
                var result = [];
                result = data.APIs.map((item, index) => { 
                    return {
                        Id: index.toString(),
                        Name: item.Name,
                        Description: item.Description,
                        ResourceTypeId: 0,
                        ResourceType: "API",
                        ReadPermission: false,
                        WritePermission: false,
                        parentId:null
                    };
                });
                var i = result.length;
                
                data.UIs.forEach(function (item, index) {
                    item.Id = (i + index).toString();
                    item.WidgetId= widget.Id,
                    item.ResourceTypeId = 1;
                    item.ResourceType = "Page";
                    item.ReadPermission = true;
                    item.WritePermission = true;
                    item.parentId = null;
                    result.push(item);
                    if ($.isArray(item.Resources)) {
                        item.Resources.map((child, index) => {
                            child.id = item.Id + "_" + index.toString();
                            child.WidgetId = widget.Id
                            child.ResourceTypeId = 2;
                            child.ResourceType = "Control";
                            child.parentId = item.Id;
                            child.parentName = item.Name;
                            child.Name = item.Name + ":" + child.Name;
                            child.ReadPermission = true;
                            child.WritePermission = true;
                            result.push(child);
                            return child;
                        });
                        
                    }
           
                });
                
                if ($.isFunction(callback))
                    callback(result);
            }).fail(function (jqXHR, textStatus, error) {
            /* error */
                var err = jqXHR.status+":"+ textStatus + ", " + error;
                console.warn("Request Failed: " + err); 
                if ($.isFunction(failcallback))
                    failcallback();

            })
        },
        getLogList: function (url,options,callback, failCallback) {
            var parameter = {
                Criterias: options.criterias == null ? [] : options.criterias,
                CurrentPageIndex: options.page,
                PageSize: options.pageSize,
                OrderBy: options.orderBy,
                IsAscending: options.isAscending

            }
            url = url == null ? (config.serviceUrl + 'AuditTrails/list'):url
            var options = {
                type: "POST",
                url: url,
                data: JSON.stringify({
                    filter: parameter,
                    websiteId: profile.WebsiteId
                }),
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get log list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getWebsiteList: function (callback,failCallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'websites',
                success: function (json) {
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get website list):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getWebsiteDetails: function (id, callback,failCallback) {
            id = id == null ? self.utils.getEmptyGUID():id;
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'websites/' + id),
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(new Date(json.LastModifiedOn), "dd MMM yyyy, hh:mm");         
                    json.protocol = window.location.protocol+"//";
                    json.Languages=config.Languages;
                    json.DefaultLanguageId=json.DefaultLanguageId==null||json.DefaultLanguageId.length==0?config.Languages[0].Id:json.DefaultLanguageId
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(get website):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
          
        },
        saveWebsite: function (website, callback) {
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'websites'),
                data: JSON.stringify(website),
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(new Date(json.LastModifiedOn), "dd MMM yyyy, hh:mm");
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    var message = xhr.responseJSON != null ? xhr.responseJSON.Message : xhr.responseText;
                    alert('Service Error(save website):' + message);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        deleteWebsite: function (id, callback) {
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'websites/' + id),
                success: function () {
                    if ($.isFunction(callback))
                        callback();
                },
                error: function (xhr) {
                    alert('Service Error(delete website):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        getOrganizationList: function (callback,failcallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'users/organizations/' + profile.WebsiteId,
                success: function (json) {
                    var result = { Users: [], Domains: json, FieldType: 'NAME' };

                    if ($.isFunction(callback))
                        callback(result);
                 
                },
                error: function (xhr) {
                    alert('Service Error(get organization list):' + xhr.responseText);
                    if ($.isFunction(failcallback)) failcallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getDomains: function (callback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'users/organizations/' + profile.WebsiteId,
                success: function (jsonDomains) {
                    if ($.isFunction(callback))
                        callback(jsonDomains);
                },
                error: function (xhr) {
                    alert('Service Error(get domains):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getContactsForSearch: function (callback) {
            self.getDomains(function (domains) {
                var result = { Domains: domains, Users: [] };
                self.getContactList(function (json) {
                    json.forEach(function (contact) {
                        var user = { UserId: contact.ContactId, UserName: contact.ContactName, Email: contact.ContactEmail }
                        result.Users.push(user);

                    })
                    if ($.isFunction(callback))
                        callback(result);
                })
            })
        },
        searchADUser: function (domain, fieldType, searchText, callback) {
            var url = domain.IsAzureADAccount ? (config.AuthorizationUrl + 'users/searchUsers?Domain=' + domain.LocationId + '&FieldType=' + fieldType + '&SearchText=' + searchText) : (config.AzureServiceUrl + 'users/search/' + searchText);
            
            var options = {
                type: "GET",
                url: url,
                success: function (json) {
                    if (json != null) {
                        json.forEach(function (data, index) {
                            JSON.stringify(data, function (key, value) {
                                if (value && typeof value === 'object') {
                                    var replacement = {};
                                    for (var k in value) {
                                        if (Object.hasOwnProperty.call(value, k)) {
                                            replacement[k && k.charAt(0).toUpperCase() + k.substring(1)] = value[k];
                                        }
                                    }
                                    json[index] = replacement;
                                    return replacement;
                                }
                                return value;
                            });
                        })
                    }
                    if ($.isFunction(callback)) callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(send ad user):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        searchUsers: function (location, fieldType, searchText, callback) {
            var url = !location.IsAzureADAccount ? (config.serviceUrl + 'users/searchUsers?locationId=' + location.LocationId + '&fieldType=' + fieldType + '&fieldValue=' + searchText) : (config.AzureServiceUrl + 'users/search/' + searchText);
            var options = {
                type: "GET",
                url: url,
                success: function (json) {
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(search users):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        deleteUserRole: function (id, userId, callback) {
            var path = userId == null || userId.length == 0 ? ("/" + id) : ("?roleId=" + id + "&&userId=" + userId);
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'roles/userroles' + path ),
                success: function (json) {
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(delete user role):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        uploadFiles: function (type, files, widgetName, callback) {
            var formData = new FormData();
            if ($.isArray(files))
                files.forEach(function (file) {
                    formData.append('files', file.rawFile);
                    if (file.displayName!=null)
                        formData.append('fileNames', file.displayName);
                })
            else {
                formData.append('file', file.rawFile);
                if (file.displayName != null)
                    formData.append('fileNames', file.displayName);
            }
            
      
            self.utils.showProcessbar(true);
            var options = {
                url: "/FileUploadHandler.ashx?UploadType=" + type + (widgetName != null ? "&WidgetName=" + widgetName : ""),
                type: 'POST',
                success: function (json) {
                    self.utils.showProcessbar(false);
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (e) {
                    self.utils.showProcessbar(false);
                    alert("upload fail!");
                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            }
           
        },
        uploadResourceFiles: function (files, widgetId, widgetName, callback) {
            var resourceFiles = [];
            files.forEach(function (file) {
                resourceFiles.push({ WidgetId: widgetId, File: file, DefaultWebsiteId: profile.WebsiteId, FileName: file.name });
            });

            self.saveResourceFile(resourceFiles, callback);
        },
        deleteResourceFile: function (id,callback) {
            var options = {
                type: "DELETE",
                url: (config.serviceUrl + 'document/resourcefile/' + id),
                success: function () {
                    if ($.isFunction(callback))
                        callback();
                },
                error: function (xhr) {
                    alert('Service Error(delete Resource file):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        saveResourceFile: function (files, callback) {
            if (files.length == 0) {
                if ($.isFunction(callback))
                    callback(json);
            } else {
                var formData = new FormData();

                files.forEach(function (resourcefile, index) {
                    if (index == 0) {
                        formData.set('FileName', resourcefile.FileName);
                        formData.set('WidgetId', resourcefile.WidgetId);
                        formData.set('DefaultWebsiteId', resourcefile.DefaultWebsiteId);

                    }
                    formData.append('Files', resourcefile.File);
                })

                self.utils.showProcessbar(true);
                var options = {
                    url: (config.serviceUrl + 'document/resourcefiles'),
                    type: 'POST',
                    data: formData,
                    success: function (json) {
                        self.utils.showProcessbar(false);
                        if ($.isFunction(callback))
                            callback(json);
                    },
                    error: function (e) {
                        self.utils.showProcessbar(false);
                        alert("saveResourceFile fails!");
                    },
                    processData: false,
                    contentType: false

                }

                commonService.callApi(options);
            }

       
        },
        getClientSettings: function (id, callback, failcallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'clients/' + id,
                success: function (json) {
                    //json.Id = json.ClientId;
                    json.IsSystemDefined = json.ClientId == config.ClientId;
                    json.Clients = json.Clients.map(function (item) {
                        item.IsSystemDefined = item.ClientId == config.ClientId;
                        return item;
                    })
                    if ($.isFunction(callback))
                        callback(json);

                },
                error: function (xhr) {
                    var errorObj = JSON.parse(xhr.responseText);

                    if (errorObj.error_description == null)
                        alert(xhr.responseText);
                    else
                        alert(errorObj.error_description);

                    if ($.isFunction(failcallback))
                        failcallback();
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        getClients: function (callback, failcallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl  + 'clients',
                success: function (json) {
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Get Clients Fails:' + xhr.responseText);

                    if ($.isFunction(failcallback))
                        failcallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        saveClient: function (client, callback) {
            var options = {
                type: "POST",
                url: config.serviceUrl + 'clients',
                data: JSON.stringify(client),
                success: function (json) {
                    json.LastModifiedOn = self.utils.toDateString(new Date(json.LastModifiedOn), "dd MMM yyyy, hh:mm");
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    alert('Service Error(Save client):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            commonService.callApi(options);
        },
        deleteClient: function (id, callback) {
            var options = {
                type: "DELETE",
                url: config.serviceUrl + 'clients/' + id,
                success: function () {
                    if ($.isFunction(callback)) callback();
                },
                error: function (xhr) {
                    alert('Service Error(delete client):' + xhr.responseText);
                },
                processData: false
            }
            commonService.callApi(options);
        },
        exportClientSettings: function (callback,failcallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'clients/xmlclients',
                success: function (json) {
                    if ($.isFunction(callback))
                        callback(json);
                },
                error: function (xhr) {
                    var errorObj = JSON.parse(xhr.responseText);

                    if (errorObj.error_description == null)
                        alert(xhr.responseText);
                    else
                        alert(errorObj.error_description);

                    if ($.isFunction(failcallback))
                        failcallback();
                },
                contentType:"text/xml",
                processData: false
            }
            commonService.callApi(options);
        },
        changePassword: function (oldpsw, newpsw, callback) {
            var data = {
                oldpassword: window.btoa(oldpsw),
                newpassword: window.btoa(newpsw)
            }
            var options = {
                type: "POST",
                url: config.AuthorizationUrl + 'api/Account/changepassword',
                data: JSON.stringify(data),
                success: function (json) {
                    if (json != null && json.length > 0) {
                        alert(json);
                        return;
                    }

                    if ($.isFunction(callback))
                        callback();

                },
                error: function (xhr) {
                    alert('Service Error(change password):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            commonService.callApi(options);
        },
        importFromExcelFile: function (widgetname, sourcefilename, mappingfilename, mappingId,callback) {
        },
        exportToExcelFile: function (jsonstring, mappingfilename, mappingId, templateFilename,callback) {
        },
        
    }
    return service;
});
