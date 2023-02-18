(function (global) {
    global.mobileCore = new tangram.Core({
        defaultContainer: "body",
        Debug: true
    });

    var eworkspace = global.mobileCore.exportCore();
    var Class = eworkspace.components.Class;
    var basepage = eworkspace.components.Basepage;
    var custTool = eworkspace.utils;

    var ui = function () { }
    ui.prototype = {
        initLocale: function (sourceFile, callback) {
            if ($.isFunction($.i18n))
                $.i18n().load(sourceFile).done(callback)
        },
        getKeyValue: function (keyname) {
            var tempResult = mobile.appConfig.keys;
            var result = null;
            if ($.isArray(tempResult)) {
                tempResult.forEach(function (item) {
                    var key = item.name;
                    var value = item.value;
                    var seed = item.type == "external" ? 2 : 1;
                    
                    result = custTool.decode(value, seed);
                })
            } else if (tempResult != null) {
                var key = tempResult.name;
                var value = tempResult.value;
                var seed = tempResult.type == "external" ? 2 : 1;
                result= custTool.decode(value, seed);
            }

            return result;
        },
        getAppConfig: function (callback, failCallback) {
            if (mobile.appConfig != null) {
                var result = {};
                $.each(mobile.appConfig, function (attr, value) {
                    var temp = attr.split('_');
                    var attr = temp[0];
                    var seed = temp[1] == "external" ? 2 : 1;
                    result[attr] = custTool.decode(value, seed);
                })
                callback(result);
            } else {
                $.getJSON("mobile.appConfig.json", callback).fail(function (d, textStatus, error) {
                    console.log('read appConfig fails');
                    if ($.isFunction(failCallback))
                        failCallback(error);
                })
            }

        },
        localize: function (selector, lang) {
            if (!$.isFunction($.i18n))
                return;

            $.i18n().locale = lang;
            $(selector).i18n();
        },
        ApplyLocalization: function (lang) {
            mobile.currentLang = lang;
            mobileCore.ApplyLocalization();
        },
        getActiveView: function () {
            var viewElms = $('[data-role="view"]:visible');
            if (viewElms.length > 0) {
                var id = viewElms.attr('id').replace(/_view$/, "")
                return custTool.pages[id]
            } else
                return null;
        },
        notify: function (title, body, okhandler) {
            var dialog = new mobile.kendo.AlertDialog();
            dialog.notify(title, body, okhandler);
        },
        info: function (message, okhandler) {
            var newMsg = custTool.getLocaleLabel(message);
            var dialog = new mobile.kendo.AlertDialog();
            dialog.info(newMsg, okhandler);
        },
        warning: function (message, okhandler) {
            var newMsg = custTool.getLocaleLabel(message);
            var dialog = new mobile.kendo.AlertDialog();
            dialog.warning(newMsg, okhandler);
        },
        error: function (message, okhandler) {
            var newMsg = custTool.getLocaleLabel(message);
            var dialog = new mobile.kendo.AlertDialog();
            dialog.error(newMsg, okhandler);
        }
    }

    var AlertDialog = Class.extend({
        show: function (typeId, message, okhandler, messageTitle) {
            var lbOk = "OK";

            message = custTool.getLocaleLabel(message);
            lbOk = custTool.getLocaleLabel("OK");

            var html = "";
            var title = "<span class='k-icon k-i-info' style='margin-right:5px;font-size:23px;color:#0072c6;margin-bottom:3px'></span>";
            typeId = typeId == null ? 0 : typeId;
            switch (typeId) {
                case 0:
                    messageTitle = messageTitle == null ? "Message" : messageTitle;
                    title += custTool.getLocaleLabel(messageTitle);
                    break;
                case 1:
                    messageTitle = messageTitle == null ? "Warning" : messageTitle;
                    title = "<span class='k-icon k-i-warning' style='margin-right:5px;font-size:23px;color:#ffbf00;margin-bottom:3px'></span>" + custTool.getLocaleLabel(messageTitle);
                    break;
                case 2:
                    messageTitle = messageTitle == null ? "Error" : messageTitle;
                    title = "<span class='k-icon k-i-close-outline' style='margin-right:5px;color:red;font-size:23px;margin-bottom:3px'></span>" + custTool.getLocaleLabel(messageTitle);;
                    break;
            }

            if (message.search('\n') < 0)
                html = '<p class="dialog-msg" style="text-align:center;margin-top:10px;margin-bottom:10px">' + message + '</p>';
            else {
                var messages = message.split('\n');
                messages.forEach(function (item) {
                    html += '<p class="dialog-msg">' + item + "</p>";
                })
            }

            html = '<div class="dialog-alert">' + html + '</div><div style="margin-bottom:10px"><p style="text-align:center"><button class="k-button k-primary" style="width:100%;">' + lbOk + '</button></p></div>';

            var kendoWindow = $("<div />").kendoWindow({
                title: {
                    text: title,
                    encoded: false
                },
                resizable: false,
                modal: true,
                width: 300,
                actions: {}
            });

            kendoWindow.data("kendoWindow").content(html).center().open();
            kendoWindow.parent().find('.k-window-titlebar').css('border-bottom-style', 'solid');
            kendoWindow.parent().find('.k-window-titlebar').css('border-bottom-color', '#c9c9c9');
            kendoWindow.parent().find('.k-window-titlebar').css('border-bottom-width', '1px');
            kendoWindow.parent().find('.k-window-titlebar').css('background-color', 'white');
            kendoWindow.find(".k-button").click(function () {
                kendoWindow.data("kendoWindow").close();
                if ($.isFunction(okhandler))
                    okhandler();

            }).end();
        },
        notify: function (title, body, okhandler) {
            this.show(0, body, okhandler, title);
        },
        info: function (message, okhandler) {
            this.show(0, message, okhandler);
        },
        warning: function (message, okhandler) {
            this.show(1, message, okhandler);
        },
        error: function (message, okhandler) {
            this.show(2, message, okhandler);
        }

    });

    var ConfirmationDialog = Class.extend({
        show: function (title, message, okhandler) {
            var buttons = ["YES", "NO"];
            var newButtons = [];
            title = custTool.getLocaleLabel(title);
            message = custTool.getLocaleLabel(message);
            buttons.forEach(function (button) {
                var text = custTool.getLocaleLabel(button);
                newButtons.push(text);
            })

            var html = '<div class="dialog-confirmation"><p class="dialog-message" style="margin-bottom:20px;text-align:center">' + message + '</p><span class="dialog-buttons"> <button class="dialog-confirm k-button k-primary" style="width:50%">' + newButtons[0] + '</button><button class="dialog-cancel k-button" style="width:50%;text-align:center">' + newButtons[1] + '</button></span></div>';
            var elem = $("div.dialog-confirmation");
            var kendoWindow = $("<div />").kendoWindow({
                title: {
                    text: '<i class="far fa-question-circle" style="margin-right:10px;color:#0072c6"></i>' + title,
                    encoded: false
                },
                resizable: false,
                modal: true,
                width: 300,
                actions: {}
            });

            kendoWindow.data("kendoWindow").content(html).center().open();
            kendoWindow.parent().find('.k-window-titlebar').css('border-bottom-style', 'solid');
            kendoWindow.parent().find('.k-window-titlebar').css('border-bottom-color', '#c9c9c9');
            kendoWindow.parent().find('.k-window-titlebar').css('border-bottom-width', '1px');
            kendoWindow.parent().find('.k-window-titlebar').css('background-color', 'white');
            kendoWindow.find(".dialog-confirm,.dialog-cancel").click(function () {
                if ($(this).hasClass("dialog-confirm")) {
                    if ($.isFunction(okhandler))
                        okhandler();
                }

                kendoWindow.data("kendoWindow").close();
            }).end();
        }
    });

    var View = basepage.extend({
        init: function (id, model, template, containerselector) {
            this.Id = id == null ? custTool.generateUUID() : id
            this.model = custTool.cloneModel(model);
            this.defaultModel = custTool.cloneModel(model);
            this.pagetemplate = template != null ? template : { html: '' };
            this.handlers = {};
            this.selector = containerselector != null ? containerselector : mobile.appConfig.Container;
            this.pages = {};
            this.type = 3; //3-mobile view
            this.isLayout = false;
            this.debug = true;
            this.isLoaded = false
            if (this.model.transition == null)
                this.model.transition = 'slide';

        },
        LoadViewLayout: function () {
            if (this.isLoaded == true)
                return;
            console.info('loading view layout');
            if (this.pagetemplate.html == null && this.pagetemplate.Id && this.pagetemplate.url == null) {
                var scriptElm = $("#" + this.pagetemplate.Id);
                this.pagetemplate.html = scriptElm.length ? scriptElm.html() : '';
                this.pagetemplate.isScript = scriptElm.attr("type") != null ? scriptElm.attr("type").trim().search('text/') > -1 : false;
            }

            if (this.pagetemplate.html)
                this.createView(false);
            else if (this.pagetemplate.html == null && this.pagetemplate.url) {
                var self = this;

                $.ajax({
                    url: self.pagetemplate.url,
                    type: "get",
                    dataType: "text",
                    global: false,
                    success: function (data) {
                        self.pagetemplate.html = data;
                        console.log('view html', data);
                        self.createView(false);
                    }
                });
            }

            if (this.pagetemplate.html === '')
                this.createView(false);
        },
        _getViewId: function () {
            return this.Id + "_view";
        },
        getViewLayout: function (content) {
            var self = this;
            this.viewId = this._getViewId();
            console.info('create view');
            this.model.dataShow = $.isFunction(this.handlers.dataShow) ? this.handlers.dataShow :
                function (e) {
                    console.log('view params', e.view.params);

                    if (e.view.params.reloadData === "false")
                        return;

                    console.log('display view with params', e.view.params);

                    self.model.parentUrl = window.location.hash;

                    if ($.isEmptyObject(e.view.params))
                        self.display();
                    else {
                        self.model.displayParams = e.view.params;
                        self.display(e.view.params);
                    }

                };


            this.model.onViewInit = this.handlers.onInitView;
            this.model.onViewShow = this.handlers.onViewShow;
            mobile.models[this.Id] = new kendo.observable(this.model);

            var modelname = "mobile.models." + this.Id;
            var viewLayout = '<div data-role="view" id="' + this.viewId + '" data-model="' + modelname + '" data-use-native-scrolling="true" ';

            if (this.model.transition != null && this.model.transition != '')
                viewLayout += ' data-transition="' + this.model.transition + '" ';

            if (this.model.title != null)
                viewLayout += ' data-title="' + this.model.title + '" ';

            if (this.model.layout != null) {
                var layoutId = $.type(this.model.layout) == "string" ? this.model.layout : (this.model.layout.views == null || !$.isArray(this.model.layout.views) ? this.model.layout.id : null);

                if (layoutId != null)
                    viewLayout += ' data-layout="' + layoutId + '" ';
            }


            if ($.isFunction(this.model.dataShow))
                viewLayout += ' data-show="' + modelname + '.dataShow' + '"';

            if ($.isFunction(this.handlers.onInitView) || $.isFunction(this.handlers.onViewShow)) {
                var eventString = '';

                if ($.isFunction(this.handlers.onInitView))
                    eventString += "init:onViewInit"
                if ($.isFunction(this.handlers.onViewShow))
                    eventString += (eventString.length > 0 ? ',' : '') + 'show:onViewShow';

                viewLayout += ' data-bind="events:{' + eventString + '}"';
            }

            viewLayout += ' >';
            viewLayout += this._loadNavigationBar(this.model.navigationBar);

            if (this.model.notification != null)
                viewLayout += "<div class='tm-notification'></div>"

            if (this.model.statusBarTemplate != null)
                viewLayout += "<div class='tm-statusbar' style='" + (this.model.isShowStatusBar == false ? "display:none" : "") + "'>" + this.model.statusBarTemplate + "</div>";

            viewLayout += content + '</div>';
            return viewLayout;

        },
        createView: function (isReplace) {
            isReplace = isReplace == null ? false : isReplace;
            console.log('container element:', this.selector);
            var containerElm = (typeof this.selector == 'string') ? $(this.selector) : this.selector;
            if (containerElm.length === 0) {
                console.error('Cannot find container element');
                return;
            }

            var viewId = this.isLayout == true ? this.Id : this._getViewId();
            if (containerElm.find('#' + viewId).length > 0 && isReplace == false)
                return;

            if (this.pagetemplate.html == null)
                return;

            var elm = this.pagetemplate.Id != null ? $(this.pagetemplate.html).find('#' + this.pagetemplate.Id) : null;
            if (this.pagetemplate.selector != null && elm == null)
                elm = $(this.pagetemplate.html).find(this.pagetemplate.selector);

            var content = (elm && elm.length) ? elm.html() : this.pagetemplate.html;
            if (this.pagetemplate.isScript != null && this.pagetemplate.isScript == true || (elm != null && elm.attr("type") != null && elm.attr("type").trim().search('text/') > -1))
                content = this._handleTemplate(content);

            this.convertLocaleModel();
            this.htmlContent = this.getViewLayout(content);

            if ($('#' + viewId).length == 0) {
                if (this.parent != null && this.parent.isLayout == true)
                    $(this.htmlContent).insertBefore('#' + this.parent.Id);
                else {
                    containerElm.append(this.htmlContent);
                }

                if (!this.isLayout) {
                    this._loadNextView(this.model.nextView, this.selector);
                }


            } else if (isReplace == true) {
                $('#' + this.viewId).empty();
                $('#' + this.viewId).replaceWith(this.htmlContent);
            }

            mobile.UI.localize('#' + viewId, mobile.currentLang);
        },
        _loadSharedLayout: function () {
            if (this.model.layout == null || typeof this.model.layout == "string" || this.model.layout.id == null)
                return;

            var content = '';

            if (this.model.layout.header != null) {
                content += '<header data-role="header">';
                if (this.model.layout.header.navigationBar != null)
                    content += this._loadNavigationBar(this.model.layout.header.navigationBar);
                if (this.model.layout.header.statusBarTemplate != null)
                    content += "<div class='tm-statusbar' style='display:none'>" + this.model.layout.header.statusBarTemplate + "</div>";
                content += "</header>"
            }

            var viewLayout = '<div data-role="layout" data-id="' + this.model.layout.id + '" '
            viewLayout += ">" + content + "</div>";

            console.log('container element:', this.selector);
            var containerElm = (typeof this.selector == 'string') ? $(this.selector) : this.selector;
            if (containerElm.length === 0) {
                console.error('Cannot find container element');
                return;
            }

            if (containerElm.find('div[data-id="' + this.model.layout.id + '"]').length > 0)
                return;

            containerElm.append(viewLayout);
        },
        _loadNavigationBar: function (navigationBar) {
            var navigationLayout = '';
            if (navigationBar == null)
                return navigationLayout;
            var self = this;

            var navigationLayout = '<div data-role="navbar" class="tm-subtitle">';
            navigationLayout += navigationBar.title != null ? '<span data-bind="text:navigationBar.title"></span>' : '<span data-role="view-title"></span>';
            navigationLayout += navigationBar.subtitle != null ? '<span data-bind="text:navigationBar.subtitle" class="subtitle"></span>' : (self.model.subtitle != null ? '<span class="subtitle"></span>' : '')

            navigationBar.buttons.forEach(function (button) {
                button.align = button.align == null ? 'right' : button.align;
                navigationLayout += '<a data-align="' + button.align + '"';

                if (button.backButton != null && button.backButton == true && self.parent != null) {
                    var url = self.parent.viewId + (button.reloadData === false ? '?reloadData=false' : '');
                    navigationLayout += ' data-role="backbutton" href="#' + url + '"';
                }
                else {
                    navigationLayout += ' data-role="button"';

                    if (button.rel != null)
                        navigationLayout += ' data-rel="' + button.rel + '"';

                    if (button.href != null) {
                        button.href = button.rel != null && button.rel == "actionsheet" ? (self._getViewId() + '_' + button.href) : button.href;
                        navigationLayout += ' href="#' + button.href + '" ';
                    }

                    if (button.click != null) {
                        navigationLayout += ' data-click="' + "mobile.models." + self.Id + '.' + button.click + '"';
                    }
                }

                navigationLayout += ">";

                if (button.icon != null)
                    navigationLayout += '<i class="' + button.icon + '"></i>';

                if (button.text != null)
                    navigationLayout += button.text;

                navigationLayout += "</a>";

            })
            navigationLayout += "</div>"
            return navigationLayout;

        },
        _loadNextView: function (page, selector) {
            var self = this;
            var views = $.isArray(page) ? page : [];

            if (page != null && !$.isArray(page))
                views.push(page);

            views.forEach(function (page) {
                var view = self._loadChildPage(page, selector);
                if (self.nextView == null)
                    self.nextView = view;
            })

            $.each(this.pages, function (key, page) {
                if (self.model.layout != null && $.isArray(self.model.layout.views) && self.model.layout.views.length > 0) {
                    self.model.layout.views.forEach(function (id) {
                        if (id == page.Id)
                            page.model.layout = self.model.layout.id;
                    })
                }

                page.LoadViewLayout();
            })

            this._loadSharedLayout();

            if ($.isEmptyObject(this.pages))
                this.onViewLoaded();
        },
        _loadTemplate: function (callback, isReplace) {
            var self = this;

            this.createView(isReplace);
            if (self.model.notification != null) {
                var elm = $('#' + this.viewId).find('.tm-notification');
                var container = $('#' + this.viewId).find(self.model.notification.appendTo);
                elm.kendoNotification({
                    appendTo: container,
                    autoHideAfter: self.model.notification.autoHideAfter
                });
            }

            callback(this);

            if ($.isFunction(this.handlers.eventHandler))
                this.handlers.eventHandler(this);

            this.isLoadedTemplate = true;
        },
        _loadChildPage: function (page, selector) {
            if (page != null) {
                var params = page.isPopover == true ? [page.Id, '#' + this.viewId] : [page.Id, selector];
                page.params = $.isArray(page.params) ? $.merge(params, page.params) : params;
                this.loadPage(page);
                return this.pages[page.Id];
            } else
                return null;
        },
        setData: function (data) {
            this.model.data = data;

            if (data != null)
                mobile.models[this.Id].set("data", data);

        },
        setField: function (field, value) {
            if (mobile.models[this.Id] != null)
                mobile.models[this.Id].set(field, value);

        },
        getField: function (field) {
            if (mobile.models[this.Id] != null)
                return mobile.models[this.Id].get(field);
            else
                return this.model[field];

        },
        getData: function () {
            if (mobile.models[this.Id] != null)
                return mobile.models[this.Id].get("data");
            else
                return this.model.data;
        },
        show: function () {
            console.info('show view:' + this.viewId);
            //this._super();
            /*if (mobile.app != null)
                mobile.app.navigate('#' + this.viewId);
            else
                this._super();*/
        },
        destroy: function () {
            this.destroyChildren();
            delete custTool.pages[this.Id];
            var elm = this.getPageDom();
            if (this.isLayout)
                elm.data("kendoMobileView").destroy();
            else
                elm.data("kendoMobileLayout").destroy();
            elm.remove();
        },
        getPageDom: function () {
            return $("#" + this.viewId);
        },
        setInitViewHandler: function (handler) {
            if ($.isFunction(handler))
                this.handlers.onInitView = handler;
        },
        setViewShowHandler: function (handler) {
            if ($.isFunction(handler))
                this.handlers.onViewShow = handler;
        },
        setDataShowHandler: function (handler) {
            if ($.isFunction(handler))
                this.handlers.dataShow = handler
        },
        onViewLoaded: function () {
            var self = this;
            var isLoaded = true;
            $.each(this.pages, function (key, page) {
                if (page.isLoaded == false)
                    isLoaded = false;
            })

            this.isLoaded = isLoaded
            if (this.isLoaded) {
                if (this.parent != null)
                    this.parent.onViewLoaded();
                else {
                    if (mobile.app == null) {
                        console.info('current View Id ' + this.viewId);
                        console.info('mobile app is creating');
                        if ($.isFunction(this.handlers.onAppCreated))
                            this.handlers.onAppCreated(function () {
                                self._createApp();
                            });
                        else
                            this._createApp();
                        /* this.handlers.onAppCreated(function () {
                             if (self.redirectView != null)
                                 mobile.config.initial ='#'+self.redirectView.viewId;
                             else {
                                 mobile.config.initial = '#' + self.viewId;
                                 if (self.isLayout == true)
                                     mobile.config.initial = '#' + self.currentView.viewId;
                             }
     
                             mobile.app = new kendo.mobile.Application(document.body, mobile.config);
                         });*/
                    }

                }
            }

        },
        _createApp: function () {
            var self = this;
            if (self.redirectView != null)
                mobile.config.initial = self.redirectView.isLayout ? ('#' + self.redirectView.currentView.viewId) : ('#' + self.redirectView.viewId);
            else {
                mobile.config.initial = '#' + self.viewId;
                if (self.isLayout == true)
                    mobile.config.initial = '#' + self.currentView.viewId;
            }

            mobile.app = new kendo.mobile.Application(document.body, mobile.config);
        },
        showNextView: function (params) {
            if (this.nextView != null) {
                var id = this.nextView.isLayout ? this.nextView.currentView.viewId : this.nextView.viewId;
                var url = '#' + id + (params == null ? '' : '?' + params);
                mobile.app.navigate(url);
            }
        },
        showPreviousView: function (params) {
            if (this.parent != null && this.parent.isLayout == false) {
                var url = '#' + this.parent.viewId + (params == null ? '' : '?' + params);
                mobile.app.navigate(url);
            }

        },
        navigateTo: function (url) {
            console.info('navigate to:' + url);
            mobile.app.navigate(url);
        },
        convertLocaleModel: function () {
            var viewId = this._getViewId();

            this.getLocaleLabels('title');
            var titleElm = $('#' + viewId).find('[data-role="view-title"]');
            if (titleElm.length > 0)
                titleElm.html(this.model.title);
            if (this.model.navigationBar != null) {
                this.getItemLabels(this.model.navigationBar, 'title', this.defaultModel.navigationBar);
                this.setField('navigationBar', this.model.navigationBar);
            }

        },
        initLocale: function () {
            mobile.UI.localize('#' + this.viewId, mobile.currentLang);
            this.convertLocaleModel();
        },
        setOnAppCreatedHandler: function (handler) {
            if ($.isFunction(handler))
                this.handlers.onAppCreated = handler;
        },
        setStatusBar: function (isShow) {
            var statusBarElm = $('#' + this.viewId).find('.tm-statusbar');
            if (isShow == true)
                statusBarElm.show();
            else
                statusBarElm.hide();

        },
        refresh: function () {
            console.log('Refresh view:', this.model.displayParams)
            if (this.model.displayParams != null && !$.isEmptyObject(this.model.displayParams))
                this.display(this.model.displayParams);
            else
                this.display();
        },
        showNotification: function (message, type) {
            if (this.model.notification == null) {
                console.warn("notification is disable");
                return;
            }

            type = type == null ? "info" : type;
            var newMsg = custTool.getLocaleLabel(message);
            var elm = $('#' + this.viewId).find('.tm-notification');
            elm.getKendoNotification().show(newMsg, type);
        }
    });

    var TabLayoutView = View.extend({
        init: function (id, model, containerselector) {
            var pageTemplate = { Id: 'tabscriptLayout', url: 'src/view/template_mobile_kendo.html' }
            this._super(id, model, pageTemplate, containerselector);
            this.isLayout = true;
        },
        getViewLayout: function (content) {
            this.viewId = this._getViewId();
            var viewLayout = '<div id="' + this.Id + '" data-role="layout" data-id="' + this.viewId + '" '
            viewLayout += ">" + content + "</div>";
            return viewLayout;
        },
        createView: function (isReplace) {
            this._super(isReplace);
            this.loadTabs();
        },
        _loadChildPage: function (page, selector) {
            if (page != null) {
                var params = [page.Id, selector];
                page.params = $.isArray(page.params) ? $.merge(params, page.params) : params;
                this.loadPage(page);
                var instance = this.pages[page.Id];
                instance.model.layout = this.viewId;
                instance.model.transition = this.model.transition;
                return instance;
            } else
                return null;
        },
        loadTabs: function () {
            var self = this;
            var tabbuttons = '';
            var viewLayout = '';

            self.model.tabs.forEach(function (tab, index) {
                if (tab.page != null && tab.page.url != null) {
                    tab.page.Id = tab.page.Id == null ? tab.id : tab.page.Id;
                    var page = self._loadChildPage(tab.page, self.selector);
                    if (page.type == 1)
                        tabbuttons += '<a href="' + tab.page.url + '" data-icon="' + tab.icon + '" data-rel="external">' + tab.label + '</a>';
                    else {

                        tabbuttons += '<a href="#' + page._getViewId() + '" data-icon="' + tab.icon + '"' + (tab.icon.search("fa-") == 0 ? 'class="fa"' : '') + '>' + tab.label + '</a>';

                        if (self.currentView == null)
                            self.currentView = page;
                    }
                } else {
                    viewLayout += '<div data-role="view" id="' + tab.id + '" data-title="' + tab.label + '" data-layout="' + self.viewId + '" data-transition="' + self.model.transition + '"></div>';
                    tabbuttons += '<a href="#' + tab.id + '" class="fa" data-icon="' + tab.icon + '"' + (tab.icon.search("fa-") == 0 ? 'class="fa"' : '') + '>' + tab.label + '</a>';
                }
            });

            var tabs = $('#' + self.Id).find('.tabs');
            if (tabs.find('a').length == 0)
                $('#' + self.Id).find('.tabs').append(tabbuttons);

            $.each(this.pages, function (key, page) {
                page.LoadViewLayout();
            })

            if (viewLayout.length > 0)
                $(viewLayout).insertBefore('#' + self.Id)
        },

    })

    var ActionSheetView = View.extend({
        _loadActionSheets: function () {
            var self = this;
            var layout = '';

            if ($.isArray(this.model.actionsheets)) {
                this.model.actionsheets.forEach(function (actionsheet, index) {
                    if ($.isArray(actionsheet.items)) {
                        var sheetId = self._getViewId() + '_' + actionsheet.id;
                        layout += '<ul id="' + sheetId + '" data-role="actionsheet" >';
                        actionsheet.items.forEach(function (item, index) {
                            var itemId = item.id == null ? (sheetId + "_" + index.toString()) : item.id;
                            layout += '<li><a id="' + itemId + '"' + (item.action != null && item.action.length > 0 ? (' data-action="' + "mobile.models." + self.Id + '.' + item.action + '"') : '') + '>' + '<span data-i18n="' + item.name + '">' + item.name + '</span>' + '</a></li>'
                        })
                        layout += "</ul>"
                    }
                });

            }

            console.log(layout);
            return layout;
        },
        getViewLayout: function (content) {
            var newContent = this._loadActionSheets() + content;
            var layout = this._super(newContent);
            console.log('actonsheet view layout:', layout)
            return layout;
        },
        _getActionSheetItem: function (id) {
            return $('#' + id);
        },
        hideActionSheetItem: function (id) {
            var item = this._getActionSheetItem(id);
            item.hide();
        },
        showActionSheetItem: function (id) {
            var item = this._getActionSheetItem(id);
            item.show();
        },
        convertLocaleModel: function () {
            this._super();
            var viewId = this._getViewId();
            var text = custTool.getLocaleLabel("Cancel")
            var cancelElm = $('#' + viewId + '_command').find('.km-actionsheet-cancel').find('a');
            cancelElm.html(text);
        },
        initLocale: function () {
            mobile.UI.localize('#' + this.viewId, mobile.currentLang);
            mobile.UI.localize('#' + this.viewId + '_command', mobile.currentLang);
            this.convertLocaleModel();
        }

    });

    var ListView = ActionSheetView.extend({
        init: function (id, model, containerselector, template) {
            this._super(id, model, template, containerselector);
            this.pagetemplate = template != null ? template : { html: '<ul class="tm-listview"></ul>' };

        },
        _getItemTemplate: function (callback) {
            var self = this;
            if (self.model.itemTemplate.html == null && self.model.itemTemplate.id != null)
                self.model.itemTemplate.html = $(self.model.itemTemplate.id).html();

            callback();

        },
        setInitViewHandler: function (handler) {
            var self = this;
            this.handlers.onInitView = self._getItemTemplate(function () {
                self.LoadListView();
                if ($.isFunction(handler))
                    handler();
            })
        },
        _getListView: function () {
            var viewId = this._getViewId();
            var listView = $("#" + viewId).find(".tm-listview");
            return listView.data("kendoMobileListView");
        },
        LoadListView: function () {
            this.model.headerTemplate = this.model.dataSource.group == null ? null : (this.model.headerTemplate == null ? "" : this.model.headerTemplate);
            this.model.fixedHeaders = this.model.dataSource.group == null ? false : true;
            var viewId = this._getViewId();
            console.log('list view datasource', this.model.dataSource)
            var listView = $("#" + viewId).find(".tm-listview");
            if (listView.data("kendoMobileListView") == null) {
                if (this.model.headerTemplate != null)
                    listView.kendoMobileListView({
                        dataSource: kendo.data.DataSource.create(this.model.dataSource),
                        template: this.model.itemTemplate.html,
                        headerTemplate: this.model.headerTemplate,
                        fixedHeaders: this.model.fixedHeaders,
                        filterable: this.model.filterable,
                        click: this.handlers.onItemClick
                    });
                else
                    listView.kendoMobileListView({
                        dataSource: kendo.data.DataSource.create(this.model.dataSource),
                        template: this.model.itemTemplate.html,
                        filterable: this.model.filterable,
                        click: this.handlers.onItemClick
                    });
            }


        },
        setData: function (data) {
            this._super(data);
            var viewId = this._getViewId();
            var listView = this._getListView();
            if (listView != null)
                listView.dataSource.data(data);
            this.initLocale();
        },
        createView: function (isReplace) {
            this.setInitViewHandler(function () {
                console.info('load items');
            });
            this._super(isReplace);
        },
        setItemClickHandler: function (handler) {
            if ($.isFunction(handler))
                this.handlers.onItemClick = handler;

        }
    });

    var Popover = View.extend({
        init: function (id, model, containerselector) {
            var pageTemplate = { html: '' }
            this._super(id, model, pageTemplate, containerselector);
        },
        getViewLayout: function (content) {
            this.viewId = this._getViewId();
            var viewLayout = '<div id="' + this.Id + '" data-role="popover"';
            if (this.model.panel != null)
                viewLayout += " data-pane=" + JSON.stringify(this.model.panel) + '"';

            if (this.model.popup != null)
                viewLayout += " data-popup=" + JSON.stringify(this.model.popup) + '"';

            viewLayout += ">" + content + "</div>";
            return viewLayout;
        },
        createView: function (isReplace) {
            this._super(isReplace);
            this.loadViews();
        },
        loadViews: function () {
            var self = this;
            self.model.views.forEach(function (view, index) {
                if (view.url != null) {
                    view.Id = view.Id == null ? self.Id + '_' + index.toString() : view.Id;
                    var params = [view.Id, '#' + self.Id];
                    view.params = $.isArray(view.params) ? $.merge(params, view.params) : params;
                    self.loadPage(view);
                }
            });

            $.each(this.pages, function (key, page) {
                page.LoadViewLayout();
            })
        }
    });

    var Drawer = View.extend({
        getViewLayout: function (content) {
            var self = this;
            this.viewId = this._getViewId();
            var viewLayout = '<div id="' + this.viewId + '" data-role="drawer"';
            if (this.model.views != null)
                viewLayout += " data-views='" + JSON.stringify(this.model.views) + "'";

            if (this.model.position != null)
                viewLayout += " data-position='" + this.model.position + "'";


            if (this.model.style != null)
                viewLayout += ' style="' + this.model.style + '" ';

            this.model.dataShow = $.isFunction(this.handlers.dataShow) ? this.handlers.dataShow : null;

            mobile.models[this.Id] = new kendo.observable(this.model);
            var modelname = "mobile.models." + this.Id;

            if ($.isFunction(this.model.dataShow))
                viewLayout += ' data-show="' + modelname + '.dataShow' + '"';

            if ($.isFunction(this.model.drawerInit))
                viewLayout += ' data-init="' + modelname + '.drawerInit' + '"';

            viewLayout += ">" + content + "</div>";
            return viewLayout;

        }

    });

    var g = function () {
        this.kendo = {};
        this.currentLang = "en";
        this.models = {};
        this.config = { skin: "nova", platform: 'ios' };
    }
    g.prototype = {
        init: function () {
            this.UI = new ui();
            this.registerComponent("AlertDialog", AlertDialog);
            this.registerComponent("ConfirmationDialog", ConfirmationDialog);
            this.registerComponent("View", View);
            this.registerComponent("TabLayoutView", TabLayoutView);
            this.registerComponent("ActionSheetView", ActionSheetView);
            this.registerComponent("ListView", ListView);
            this.registerComponent("Popover", Popover);
            this.registerComponent("Drawer", Drawer);
        },
        registerComponent: function (name, component) {
            this.kendo[name] = component;
        },
        getUtils: function () {
            return custTool;
        }
    }

    global.mobile = new g();
    global.mobile.init();
    custTool.setProcessbarhandler(function (isShow, selector) {
        isShow = isShow == null ? false : isShow;
        selector = selector == null ? "body" : selector;

        if (typeof selector == 'string')
            console.info("set process bar as " + isShow + " for " + selector);
        else
            console.info("set process bar as " + isShow);

        /*if (isShow == false) {
            if (this.totalPB > 0)
                this.totalPB--;
        }
        else
            this.totalPB++;*/
        var elm = (typeof selector == 'string') ? $(selector) : selector;
        if (elm == null || elm.length == 0)
            return;

        var totalBI = elm.attr('data-BI-number');

        if (totalBI == null)
            totalBI = 0;

        if (isShow == false) {
            if (totalBI > 0)
                totalBI--;
        }
        else
            totalBI++;

        console.info("total busy bar for " + selector + ":" + totalBI);
        elm.attr('data-BI-number', totalBI);

        var mask = elm.find('div.k-loading-mask');


        if (isShow == true && mask.length > 0 || isShow == false && totalBI > 0)
            return;

        kendo.ui.progress(elm, isShow);

    });
    custTool.setDateParseHandler(function (date, dateFormat, parseDateFormat) {
        if (date == null)
            return date;

        if (parseDateFormat == null)
            return kendo.toString(kendo.parseDate(date), dateFormat);
        else
            return kendo.toString(kendo.parseDate(date, parseDateFormat), dateFormat);
    });
    custTool.toKendoDateString = function (date, dateFormat, parseDateFormat) {
        return custTool.toDateString(date, dateFormat, parseDateFormat);
    }
})(this);





