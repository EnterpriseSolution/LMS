(function (global) {
    var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;
    var React = global.React;
    // The base Class implementation (does nothing)
    var Class = function () { };

    // Create a new Class that inherits from this class
    Class.extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };

    var htmlPage = Class.extend({
        init: function (id, url) {
            this.Id = id;
            this.url = url;
            this.type = 1;
        },
        display: function () {
            this.show();
        },
        destroy: function () {
            console.warn("no destroy action for html page");
        },
        hide: function () {
            console.warn("no hide action for html page");
            return;
        },
        show: function () {
            var win = window.open(this.url, '_blank');
            win.focus();
            console.log("redirect to page " + this.url);
            return;
        }
    })

    var basepage = Class.extend({
        init: function (id, model, template, containerselector) {
            this.Id = id == null ? utils.generateUUID() : id
            this.model = JSON.parse(JSON.stringify(model));
            this.defaultModel = JSON.parse(JSON.stringify(model));
            this.pagetemplate = template != null ? template : { html: '' };
            this.handlers = {};
            this.selector = containerselector != null ? containerselector : app.defaultContainer;
            this.pages = {};
            this.type = 0;
            this.debug = app.Debug;
            this.destroyPage = app.destroyPage;
            this.readable = true;
            this.writable = true;
        },
        setModel: function (model) {
            this.model = JSON.parse(JSON.stringify(model));
            this.defaultModel = JSON.parse(JSON.stringify(model));
        },
        Load: function (callback, isReplace) {
            console.info('loading page layout');
            if (this.pagetemplate.html == null && this.pagetemplate.Id && this.pagetemplate.url == null) {
                var scriptElm = $("#" + this.pagetemplate.Id);
                this.pagetemplate.html = scriptElm.length ? scriptElm.html() : '';
                this.pagetemplate.isScript = scriptElm.attr("type") != null ? scriptElm.attr("type").trim().search('text/') > -1 : false;
            }

            if (this.pagetemplate.html)
                this._loadTemplate(callback, isReplace);
            else if (this.pagetemplate.html == null && this.pagetemplate.url) {
                var self = this;

                $.ajax({
                    url: self.pagetemplate.url,
                    type: "get",
                    dataType: "text",
                    global: false,
                    success: function (data) {
                        self.pagetemplate.html = data;
                        self._loadTemplate(callback, isReplace);
                    }
                });
            }

            if (this.pagetemplate.html === '')
                this._loadTemplate(callback, isReplace);
        },
        _loadTemplate: function (callback, isReplace) {
            isReplace = isReplace == null ? false : isReplace;
            if (this.pagetemplate.html == null)
                return;
            this.convertLocaleModel();
            var elm = this.pagetemplate.Id != null ? $(this.pagetemplate.html).find('#' + this.pagetemplate.Id) : null;
            if (this.pagetemplate.selector != null && elm == null)
                elm = $(this.pagetemplate.html).find(this.pagetemplate.selector);

            var content = (elm && elm.length) ? elm.html() : this.pagetemplate.html;
            if (this.pagetemplate.isScript != null && this.pagetemplate.isScript == true || (elm != null && elm.attr("type") != null && elm.attr("type").trim().search('text/') > -1))
                content = this._handleTemplate(content);
            this.htmlContent = "<div id='" + this.Id + "'>" + content + "</div>";

            var containerElm = (typeof this.selector == 'string') ? $(this.selector) : this.selector;
            if (containerElm.length === 0) {
                console.error('Cannot find container element');
                return;
            }

            if (isReplace == true && $('#' + this.Id).length > 0) {
                $('#' + this.Id).empty();
                $('#' + this.Id).replaceWith(this.htmlContent);
                this.observable = null;
            }
            else if ($('#' + this.Id).length == 0) {
                //containerElm.append(this.htmlContent);
                containerElm.prepend(this.htmlContent);
                this.observable = null;
            }

            if ($.isFunction(callback))
                callback(this);

            if ($.isFunction(this.handlers.eventHandler))
                this.handlers.eventHandler(this);
        },
        _handleTemplate: function (templateHtml) {
            console.info('load template with data');
            return templateHtml;
        },
        _afterLoadData: function (data) {
            console.log('loaded data:', data);
            this.setData(data);
        },
        _refresh: function () {
            console.info('refresh data');
        },
        setLoadDataHandler: function (handler, service) {
            if ($.isFunction(handler)) {
                this.handlers.loadDataHandler = handler;
                this.service = service;
            }
        },
        setEventHandler: function (handler) {
            if ($.isFunction(handler))
                this.handlers.eventHandler = handler;

        },
        getPageDom: function () {
            var elm = $("#" + this.Id);
            this.isLoadedTemplate = elm && elm.length > 0;
            return elm;
        },
        show: function () {
            var elm = this.getPageDom();
            elm.show();
            console.info('show page:' + this.Id);

            $.each(this.pages, function (index, page) {
                if (page)
                    page.hide();
            });
        },
        hide: function () {
            var elm = this.getPageDom();
            elm.hide();
        },
        deleteChildPage: function (id) {
            delete this.pages[id]
            delete app.pages[id];
        },
        destroy: function () {
            this.destroyChildren();

            if (this.parent == null && app.pages[this.Id] != null) {// || this._pagename == null
                delete app.pages[this.Id];
            }

            if (this._path != null)
                delete app.paths[this._path.replace('/', '__')];

            var elm = this.getPageDom();

            if (elm.length > 0) {
                elm.remove();
            }

        },
        destroyChildren: function () {
            if (this.pages == null || this.pages.length == 0)
                return;

            var components = [];
            $.each(this.pages, function (id, page) {
                /* if (page._pagename == null)
                     components.push(id);*/
                page.parent = null;
                page.destroy();
            })
            this.pages = {};
            /*var self = this;
            components.forEach(function (id) {
                delete self.pages[id];
            })*/

        },
        display: function () {
            if ($.isArray(this.disableResources)) {
                var self = this;
                var temp = $.grep(this.disableResources, function (res) {
                    return res == self._pagename+"_R";
                })

                if (temp.length > 0) {
                    this.displayDenypage("Unauthorized Page");
                    return;
                }  
            }
           
            var pagename = (this.pageurl == null ? this.Id : this.pageurl);
            console.log('display page %c ' + pagename, 'color:blue')
            var elm = this.getPageDom(); //$("#" + this.Id);
            if (this.isLoadedTemplate) {
                this.show();
                this.loadData.apply(this, arguments);
                console.info('Apply locale language for page ' + pagename);
                this.initLocale();
            }
            else {
                var self = this;
                var params = arguments;
                this.Load(function () {
                    self.loadData.apply(self, params);
                    console.info('Apply locale language for page ' + pagename);
                    self.initLocale();
                })
            }
        },
        replace: function () {
            var self = this;
            var params = arguments;
            this.destroyChildren();
            this.Load(function () {
                self.loadData.apply(self, params);
                self.initLocale();
            }, true);
        },
        loadData: function () {
            var params = [];
            var callback = null;
            var self = this;
            var pagename = this.pageurl == null ? this.Id : this.pageurl;
            var callbackIndex = -1;
            console.info('loading page data for ' + pagename);
            for (var i = 0; i < arguments.length; i++) {
                params.push(arguments[i]);
                if (callback == null && $.isFunction(arguments[i])) {
                    callback = arguments[i];
                    callbackIndex = i;
                }
                

            }
            var lastIndex = params.length;
            var failCallback = callbackIndex > -1 && callbackIndex < lastIndex-1 && $.isFunction(arguments[callbackIndex + 1]) ? arguments[callbackIndex + 1] : null;

            if (this.handlers == null || $.isFunction(this.handlers.loadDataHandler) === false) {
                var data = this.model != null ? this.model.data : null;
                //var callback = lastIndex > 0 ? params[lastIndex - 1] : null;
                utils.log(pagename + " orignal data:", data, app.Debug);
                if ($.isFunction(callback))
                    callback(data);
                else
                    if ($.isFunction(self.handlers.loadCompletedHandler))
                        self.handlers.loadCompletedHandler(data);

                this._afterLoadData(data);
                utils.log(pagename + " model:", self.model, app.Debug);
                if ($.isFunction(self.handlers.formLoadedHandler))
                    self.handlers.formLoadedHandler();
                self.applyPermission();
                return;
            }

            if (params.length) {
                // var callback = params[lastIndex - 1];
                if ($.isFunction(callback)) {
                    params[callbackIndex] = function (data) {
                        utils.log(pagename + " orignal data:", data, app.Debug);
                        callback(data);
                        self._afterLoadData(data);
                        utils.showProcessbar(false, "#" + self.Id);
                        utils.log(pagename + " model:", self.model, app.Debug);

                        if ($.isFunction(self.handlers.formLoadedHandler))
                            self.handlers.formLoadedHandler();
                        self.applyPermission();
                    }
                }
                else {
                    params[lastIndex] = function (data) {
                        utils.log(pagename + " orignal data:", data, app.Debug);
                        if ($.isFunction(self.handlers.loadCompletedHandler))
                            self.handlers.loadCompletedHandler(data);
                        self._afterLoadData(data);
                        utils.showProcessbar(false, "#" + self.Id);
                        utils.log(pagename + " model:", self.model, app.Debug);

                        if ($.isFunction(self.handlers.formLoadedHandler))
                            self.handlers.formLoadedHandler();

                        self.applyPermission();
                    };
                }
            }
            else {
                params[lastIndex] = function (data) {
                    utils.log(pagename + " orignal data:", data, app.Debug);
                    if ($.isFunction(self.handlers.loadCompletedHandler))
                        self.handlers.loadCompletedHandler(data);
                    self._afterLoadData(data);
                    utils.showProcessbar(false, "#" + self.Id);
                    utils.log(pagename + " model:", self.model, app.Debug);

                    if ($.isFunction(self.handlers.formLoadedHandler))
                        self.handlers.formLoadedHandler();
                    self.applyPermission();
                };
            }

            try {
                utils.showProcessbar(true, "#" + self.Id);
                //set failure callback
                var failCallbackIndex = $.isFunction(failCallback) ? callbackIndex + 1 : params.length;
                params[failCallbackIndex] = function (error) {
                    console.warn(pagename + ' load data failure callback');
                    utils.showProcessbar(false, "#" + self.Id);
                    var errorMsg = error.responseText == null || error.responseText.length == 0 ? "loading data fails" : error.responseText;
                    if (error != null && error.status != null && (error.status == 401 || error.status == 403)) {
                        self.displayDenypage(error.responseText);
                        errorMsg = null;
                    }
                    else {
                        self.setData(self.model.data);
                        self.applyPermission();
                    }
                    

                    if ($.isFunction(failCallback))
                        failCallback(errorMsg);
                }
                this.handlers.loadDataHandler.apply(this.service, params);
            }
            catch (error) {
                utils.showProcessbar(false, '#' + self.Id);
                console.error("Fail to load page:#" + self.Id, error);
            }
        },
        loadPage: function (pageInfo) {
            if (pageInfo == null)
                return;

            if (pageInfo.Id == null && this.pages[pageInfo.Id] != null)
                return;

            if (pageInfo.url != null && pageInfo.url.length) {
                var url = pageInfo.url.trim().toLowerCase();
                console.info('Loading page url:' + pageInfo.url);
                if (url.indexOf("http:") == 0 || url.indexOf("https:") == 0) {
                    /*var win = window.open(pageInfo.path, '_blank');
                    win.focus();*/
                    var HtmlPage = new htmlPage(pageInfo.Id, pageInfo.url);
                    console.log("load html page " + pageInfo.url);

                    if (HtmlPage != null && app.pages[pageInfo.Id] == null)
                        app.pages[pageInfo.Id] = HtmlPage;
                    return;
                }

                var params = [pageInfo.url];

                if (pageInfo.params != null && pageInfo.params.length)
                    params = $.merge(params, pageInfo.params);

                var page = createViewModel.apply(null, params);

                if (page == null) {
                    console.error(pageInfo.url + ' is null');
                    return;
                }

                page.parent = this;
                page.pageurl = pageInfo.url;
                page.debug = url.indexOf("eworkspace") != 0 && page.debug;
                page._path = page._path == null ? page.getPath() : page._path;

                if (page != null && page._pagename != null && app.pages[page.Id] == null)
                    app.pages[page.Id] = page;

                if (page != null) {
                    this.pages[page.Id] = page;
                    pageInfo.Id = page.Id;
                    pageInfo.type = page.type;

                    if (app.router != null && app.initView != null && app.initView.pages[page.Id] != null)
                        app.router.setRoute(page._path);

                }

            }

        },
        setLoadCompletedHandler: function (handler) {
            if ($.isFunction(handler))
                this.handlers.loadCompletedHandler = handler;
        },
        displayDenypage: function (message) {
            var containerElm = $(this.selector);
            message = message != null && message.length > 0 ? ("("+message+")") : "";
            containerElm.html("<h2 class='t-access-error' style='text-align: center;margin-top:100px'>Access Deny" + message + ".It may be due to no permission or session expired!</h2><br/><br/>");
        },
        displayErrorPage: function (message) {
            var containerElm = $(this.selector);
            message = message != null && message.length > 0 ? message : "Unknown";
            message = "<h2 class='t-error' style='text-align: center;margin-top:100px'>" + message + ".</h2><br/>";
            var elm = containerElm.find(".t-access-error");
            if (elm.length > 0) 
                containerElm.append(message);
            else
                containerElm.html(message);
            
            
        },
        setData: function (data) {
            this.model.data = data;
        },
        setFormLoadedHandler: function (handler) {
            if ($.isFunction(handler)) {
                var beforeHandler = this.handlers.formLoadedHandler
                this.handlers.formLoadedHandler = $.isFunction(beforeHandler) ? function () {
                    beforeHandler();
                    handler();
                } : handler;
            }
        },
        initLocale: function () {
            var celm = $('#' + this.Id);
            if ($.isFunction(celm.i18n))
                celm.i18n();
        },
        getItemLabels: function (items, key, defaultItems) {
            if (!$.isFunction($.i18n))
                return;

            if (!$.isArray(items) && !$.isArray(defaultItems) && items[key] != null) {
                items[key] = $.i18n(defaultItems[key]);
                return;
            }
            defaultItems.forEach(function (item, index) {
                if (item[key] != null) {
                    var newValue = $.i18n(item[key]);
                    if (newValue != null && newValue.length > 0) {
                        items[index][key] = newValue;
                    } else
                        items[index][key] = item[key]

                    /*if (eworkspace.currentLang == 'en')
                        items[index][key] = item[key]
                    else {
                        var newValue = $.i18n(item[key]);
                        if (newValue != null && newValue.length > 0) {
                            items[index][key] = newValue;
                        }
                    }*/

                }
            })

        },
        getLocaleLabels: function (attrname, key) {
            if (!$.isFunction($.i18n))
                return;

            var items = this.defaultModel[attrname];

            if (key == null) {
                if (items == null || items.length == 0 || !$.isFunction($.i18n))
                    this.model[attrname] = items;
                else
                    this.model[attrname] = $.i18n(items);
            }
            else {
                var modelItems = this.model[attrname];
                if (modelItems != null && items != null)
                    this.getItemLabels(modelItems, key, items);
            }

        },
        convertLocaleModel: function () {
            console.info('apply local lanuage');
        },
        resize: function () {
            console.info('resize page');
        },
        resizeChildren: function () {
            if (this.pages == null || this.pages.length == 0)
                return;

            $.each(this.pages, function (id, page) {
                if ($.isFunction(page.resize))
                    page.resize();
            })
        },
        getParentById: function (parentId) {
            var parent = this.parent;
            while (parent != null && parent.Id != parentId) {
                parent = parent.parent;
            }
            return parent;
        },
        getParentIds: function (parents) {
            if (this.parent != null) {
                parents.push(this.parent.Id);
                this.parent.getParentIds(parents);
            }
        },
        getFirstChildOfParent: function (parentId) {
            var parent = this.parent;
            if (parent == null)
                return parent;

            if (parent.Id == parentId)
                return this;

            while (parent != null && parent.parent != null && parent.parent.Id != parentId) {
                parent = parent.parent;
            }

            if (parent != null && parent.parent != null && parent.parent.Id == parentId)
                return parent;
            else
                return null;

            return parent;
        },
        getPath: function () {
            if (this._pagename == null || app.router.create == null)
                return null;

            var parent = this.parent;
            if (parent == null || this._path != null)
                return this._path;

            var paths = [];

            while (parent != null && parent.Id != app.initView.Id) {
                if (parent._path != null)
                    paths.push(parent._path);
                else
                    paths.push("/" + parent._pagename)
                parent = parent.parent;
            }
            if (parent.Id != app.initView.Id)
                return null;
            else {
                var path = "";
                while (paths.length) {
                    path += paths.pop();
                }
                path += "/" + this._pagename;
                return path;
            }

        },
        back: function (queryString) {
            if (this.parent != null)
                this.parent.navigate(queryString);
            else
                history.back();
        },
        next: function (id, queryString) {
            console.info('navigate to:' + path);
            var page = this.pages[id];
            if (page == null)
                console.error('Fail to find page ' + id);
            else
                page.navigate(queryString);
        },
        navigate: function (queryString) {
            if (app.router.navigate == null || this._path == null || this._path.length == 0) {
                if (queryString != null && queryString.length > 0) {
                    var params = [];
                    var temp = queryString.replace('&&', '&').split('&');
                    temp.forEach(function (str) {
                        var temp1 = str.split('=');
                        if (temp1.length > 1)
                            params.push(temp1[1]);
                    })
                    this.display.apply(this, params);
                } else
                    this.display();

            }
            else {
                var path = this._path;
                path += queryString == null || queryString.length == 0 ? "" : ("?" + queryString);
                console.info('navigate to:' + path);
                app.paths[this._path.replace('/', '__')] = { pageId: this.Id };
                //app.router.navigate(path);
                app.router.navigateTo(path);
            }
        },
        setEditMode: function (editable, selector) {
            selector = selector == null ? "" : selector.replace(this._pagename, "").replace(":", "");
            editable =  editable == null ? true : editable;
            var elms = selector.length == 0 ? $('#' + this.Id) : $('#' + this.Id).find(selector);
            
            for (var i = 0; i < elms.length; i++) {
                var elm = $(elms[0]);
                if (elm.hasClass("t-permission-hide"))
                    this._showControl(elm, editable);
                else {
                    this._enableControl(elm, editable);
                    this._showControl(selector, editable, 'button');
                }
            }
        },
        _enableControl: function (selector, editable, elementType) {
            editable = editable == null ? true : editable;
            selector = selector == null ? $('#' + this.Id) : (typeof selector == 'string' ? $('#'+this.Id).find(selector):selector)
            
            if (selector.length == 0) {
                console.warn('enable control: cannot find elements');
                return;
            }

            var elements = elementType != null ? selector.find(elementType) : selector.children();
            if (elements == null ||elements.length == 0)
                return;

            elements.prop('disabled', !editable);

        },
        _showControl: function (selector, isShow, elementType) {
            isShow = isShow == null ? true : isShow;
            selector = selector == null ? $('#' + this.Id) : (typeof this.selector == 'string' ? $('#' + this.Id).find(selector) : selector);

            if (selector.length == 0) {
                console.warn('enable control: cannot find elements');
                return;
            }

            var elements = elementType != null ? selector.find(elementType) : selector.children();
            if (elements == null || elements.length == 0)
                return;

            if (isShow)
                elements.show();
            else
                elements.hide()
        },
        applyPermission: function () {
            var self = this;
            if ($.isArray(self.disableResources)) {
                self.disableResources.forEach(function (item) {
                    if ($.isFunction(self.handlers.editModeHandler))
                        self.handlers.editModeHandler(false,item);
                    else
                        self.setEditMode(false, item);
                })
            }
        },
        setEditModeHandler: function (handler) {
            if ($.isFunction(handler))
                this.handlers.editModelHandler = handler;
        }

    });

    var masterPagesidebar = basepage.extend({
        init: function (id,model) {
            this._super(id, model, { Id: 'masterpage', url: 'src/view/masterpage_sidebar.html' }, 'body');
            this.homePage = null;
        },
        _loadTemplate: function (callback, isReplace) {
            var self = this;
            this._super(function () {
                self.menuContainer = $("#accordionSidebar");
                self.bindEvents();
                self.redirectPageId = utils.getURLParameter("pageId");
                self.initLocale();
                $('body').removeClass("bg-login-image");
                //if (utils.getURLParameter("websiteId") != null)
                //  app.profile.websiteId = utils.getURLParameter("websiteId");

                $(".portalname").click(function () {
                    self.replace(self.model.profile.websiteId);
                })

                $("a.sidebar-brand").click(function () {
                    $(".portalname").click()
                });

                if ($.isFunction(callback))
                    callback(self);

            }, isReplace)
        },
        _afterLoadData: function (data) {
            var self = this;
            var currentPage = null;
            this.model = data;
            app.router.setWebsite(this.model.profile);
            app.currentLang = data.DefaultLanguageId;
            this.loadHead();
            this.loadMenus();
            var pathName = window.location.href.split("/");
            var lastPath = pathName[pathName.length - 1]
            var defaultPath = lastPath.length == 0 || lastPath.search(".html") > -1;

            if (this.model.homepage != null) {
                this.model.homepage.params = [this.model.homepage.Id];
                this.loadPage(this.model.homepage);
                this.homePage = this.pages[this.model.homepage.Id];
                currentPage = this.homePage;
            }

            if (currentPage != null && this.RedirectUrl == null)
                currentPage.navigate();
            else 
                this.redirectPage();            
        },
        redirectPage: function () {
            if (this.RedirectUrl != null) {
                var self = this;
                var parts = this.RedirectUrl.split("?");
                var queryString = "";
                if (parts.length > 1)
                    queryString = this.RedirectUrl.replace(parts[0],'');

                var paths = this.RedirectUrl.replace(queryString, "").replace("?", '');
                paths = paths.replace('/' + app.RootRoute, '');
                var pageNames = paths.split('/')
            
                var params = [];
                var temp = queryString.replace('&&', '&').split('&');
                temp.forEach(function (str) {
                    var temp1 = str.split('=');
                    if (temp1.length > 1) {
                        temp1[1] = temp1[1].toLowerCase() == "null" ? null : temp1[1];
                        params.push(temp1[1]);
                    }
                    
                })
                
                if (pageNames.length > 1) {
                    var path = "";
                    pageNames.forEach(function (name, index) {
                        path += (name.length > 0 ? "/" : "") + name;
                        var page = findPageByPagePath(path);
                        if (page != null) {
                            if (index < pageNames.length - 1) {
                                if ((page.pages == null || $.isEmptyObject(page.pages)) && page.type != null && page.type == 3) {
                                    var url = window.location.pathname.length > 0 ? (window.location.pathname + self.RedirectUrl.substring(1)) : self.RedirectUrl;
                                    page.display.apply(page, [url]);
                                    self.curPage = page;
                                }
                                else {
                                    page.Load();
                                    page.hide();
                                }

                            }
                            else {
                                page.display.apply(page, params);
                                self.curPage = page;
                            }
                                
                        }
                        
                    })
                } else if (pageNames.length == 1) {
                    var root = findPageByPagePath("/" + pageNames[0]);
                    root = root == null ? this.model.homepage : root;
                    this.displayChildPage(root.Id, true);
                }

                
                this.RedirectUrl = null;                
            }
        },
        setRedirectUrl: function (url) {
            if (app.router.route == null)
                return null;

            this.serverPath = window.location.origin.toString() + window.location.pathname;
            url = url == null ? window.location.href.replace(this.serverPath, '') : url;
            url = decodeURIComponent(url);
            url =url.replace('#', '');
            var website = app.router.getWebsiteFromPath(url);

            if (url.length > 0 && website != null) {
                this.RedirectUrl = url;
            }

            return website != null ? website.Id : null;
        },
        updatePortalName: function () {
            if (this.model.name && this.model.name.length) {
                var title = $("#" + this.Id).find('.portalname');
                title.html(this.model.name)
                if (this.model.name.length > 11) {
                    title.css("margin-bottom", '30px')
                    title.css("font-size", '14px');
                }
                else {
                    title.css("margin-bottom", '20px')
                    title.css('font-size', '');
                }

            }
        },
        loadHead: function () {
            var self = this;
            var profile = self.model.profile;
            self.updatePortalName();
            var userName = $('#' + this.Id).find('span.navbar-user');
            userName.html(profile.displayName);
            var portalList = $('#' + this.Id).find('.portallist');
            if (profile.websites.length > 1) {
                portalList.show();
                var websitemenus = portalList.find('.dropdown-menu');
                var websitelist = websitemenus.find('.dropdown-item');
                if (websitemenus.length > 0 && websitelist.length == 0) {
                    var divElm = ''
                    profile.websites.forEach(function (website, index) {
                        divElm += '<a class="dropdown-item webistite" href="#" name="' + website.Id + '">' + website.Name + '</a>';
                    });

                    websitemenus.html(divElm);
                    websitelist = websitemenus.find('.dropdown-item');
                    websitelist.click(function () {
                        var websiteId = $(this).attr('name');
                        if (websiteId != null && websiteId !== '') {
                            if (profile.websiteId !== websiteId) {
                                profile.websiteId = websiteId;
                             
                                $.each(self.pages, function (id, page) {
                                    if (page)
                                        page.destroy();//page.hide();
                                });
                                //app.router.setWebsite(profile);
                                self.display(profile.websiteId);
           
                            }

                        }
                    });
                }



            }
            else
                portalList.hide();
        },
        searchPageInfo: function (menus, pageId) {
            var self = this;
            var pageInfo = null;

            if (menus == null || menus.length == 0)
                return pageInfo;

            for (i = 0; i < menus.length; i++) {
                if (menus[i].page != null && menus[i].page.Id === pageId) {
                    pageInfo = menus[i].page;
                    pageInfo.params = [menus[i].page.Id];
                }
                else {
                    pageInfo = self.searchPageInfo(menus[i].menus, pageId, pageInfo);
                }

                if (pageInfo != null)
                    break;
            }

            return pageInfo;

        },
        generateMenus: function (menus, level, parentId, callback, self) {
            var elm = ''

            if ($.isArray(menus) == false)
                return;

            menus.forEach(function (menu) {
                var menuId = 'menu_' + menu.id;

                if (menu.menus == null || menu.menus.length == 0) {
                    if (level < 2)
                        elm += "<li name='" + menuId + "' class='nav-item'><a class='nav-link' data-page-id='" + menu.page.Id + "'><i class='" + menu.icon + "'></i><span data-i18n='" + menu.text + "'>" + menu.text + "</span></a></li>";
                    else if (level == 2)
                        elm += "<a name='" + menuId + "' class='collapse-item'  data-page-id='" + menu.page.Id + "'data-parentId='" + parentId + "' data-i18n='" + menu.text + "'><i class='" + menu.icon + "' style='margin-right:5px'></i>" + menu.text + "</a>"
                }
                else {

                    if (menu.page.url == null && level == 0) {
                        if (/<hr class='sidebar-divider'>$/i.test(elm) == false)
                            elm += "<hr class='sidebar-divider'>";

                        elm += "<div name='" + menuId + "' class='sidebar-heading' data-i18n='" + menu.text + "'>" + menu.text + "</div>";
                        elm += callback(menu.menus, 1, null, callback, self);
                        elm += "<hr class='sidebar-divider'>"
                    }
                    if ((menu.page.url != null && level == 0) || level == 1) {
                        var submenusContainer = "menu_" + menu.id + "_submenus";
                        elm += "<li name='" + menuId + "' class='nav-item'><a data-page-id='" + menu.page.Id + "' class='nav-link collapsed' data-toggle='collapse' data-target='#" + submenusContainer + "' aria-expanded='true' aria-controls='" + submenusContainer + "'><i class='" + menu.icon + "'></i><span data-i18n='" + menu.text + "'>" + menu.text + "</span></a>";
                        elm += "<div id='" + submenusContainer + "' class='collapse' data-parent='#accordionSidebar'><div class='py-2 collapse-inner'>";
                        elm += callback(menu.menus, 2, submenusContainer, callback, self);
                        elm += "</div></div></li>";
                    }


                }

                if (menu.page.url != null) {
                    menu.page.params = [menu.page.Id];
                    self.loadPage(menu.page);
                }
            });

            return elm;
        },
        loadMenus: function () {
            var menu = this.model.menus;

            var self = this;
            // this.generateMenus(menu, null, 0,this.generateMenus, self);
            var elm = this.generateMenus(menu, 0, null, this.generateMenus, self);
            var container = $('#accordionSidebar').find('div.menuslist');
            container.html(elm);
            utils.localize('#' + self.Id, app.currentLang);
            container.find('a:not(.sidebar-brand)').click(function () {
                var m_pageId = $(this).attr("data-page-id");
                var m_parentId = $(this).attr("data-parentid");

                if (m_pageId == null && m_pageId.length == 0)
                    return;
                if (m_parentId == null) {
                    container.find('i').css("color", "");
                }


                if ($(this).parent().find('.show').length > 0) {
                    self.setContentWrapWidth();
                } else {
                    var submenuId = $(this).attr('data-target');
                    if (submenuId == null || ($(".sidebar").hasClass("toggled") == false && $('#sidebarToggle').is(":visible") == true)) {
                        self.setContentWrapWidth();
                    }
                    else {
                        $(this).find('i').css("color", "#fff");
                        var smenuWidth = $(submenuId).width();
                        self.setContentWrapWidth(smenuWidth);
                    }

                    if (submenuId == null && $(this).hasClass('nav-link') == true) {
                        $("[id*='_submenus'].show").removeClass('show');
                    }


                }

                var m_menuId = $(this).attr("data-parentid");
                //self.displayChildPage(m_pageId, true);
                self.navigate(m_pageId);

                /*$.each(self.pages, function (pageId, page) {
                    if (self.homepage != null)
                        self.homePage.hide();
 
                    if (page != null && pageId === m_pageId) {
                        page.display();
                        self.curPage = page;
                    }
                    else
                        page.destroy();// page.hide();
 
                });*/

                if (m_menuId != null && m_menuId.length > 0 && ($('#' + self.Id).find('ul.sidebar').hasClass('toggled') || $('#sidebarToggle').is(":visible") == false)) {
                    $('#' + m_menuId).removeClass('show');
                    $('#' + m_menuId).prev().attr('data-page-id', m_pageId);
                    //self.setContentWrapWidth($('#' + m_menuId).width());
                    self.setContentWrapWidth();
                }


            });
        },
        setContentWrapWidth: function (width) {
            var wrap = $('#content-wrapper');
            var topToggelbtn = $('#sidebarToggleTop');
            //width = width == null ? (($(".sidebar").hasClass("toggled") || topToggelbtn.css('display') !== 'none')?'3rem':'14.8rem') : width
            width = width == null ? '' : width;
            wrap.css('margin-left', width);
            if (this.curPage != null)
                this.curPage.resize();
        },
        bindEvents: function () {
            var self = this;
            var header = $('#' + this.Id).find('.fixedbar.topbar');
            var sticky = header[0].offsetTop;
            self.setContentWrapWidth();
            $("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
                $("body").toggleClass("sidebar-toggled");
                $(".sidebar").toggleClass("toggled");
                self.setContentWrapWidth();
                if ($(".sidebar").hasClass("toggled")) {
                    $('.sidebar .collapse').collapse('hide');
                }
            });

            // Close any open menu accordions when window is resized below 768px
            $(window).resize(function () {
                if ($(window).width() < 768) {
                    $('.sidebar .collapse').collapse('hide');
                }
                var submenu = $("[id*='_submenus'].show");
                if (submenu.length > 0 && $('#' + self.Id).find('ul.sidebar').hasClass('toggled'))
                    self.setContentWrapWidth(submenu.width());
                else
                    self.setContentWrapWidth();
            });

            // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
            $('#' + this.Id).find('.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
                if ($(window).width() > 768) {
                    var e0 = e.originalEvent,
                        delta = e0.wheelDelta || -e0.detail;
                    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                    e.preventDefault();
                }
            });

            $(document).on('scroll', function () {
                var scrollDistance = $(this).scrollTop();
                if (scrollDistance > 100) {
                    $('.scroll-to-top').fadeIn();
                } else {
                    $('.scroll-to-top').fadeOut();
                }

                var container = $('#content-container');
                if (window.pageYOffset > sticky) {
                    header.addClass("sticky");
                    header.width(container.width() - 20);
                    $('#content').css('padding-top', 48);
                } else {
                    header.removeClass("sticky");
                    header.css('width', '');
                    $('#content').css('padding-top', '');
                }
            });

            // Smooth scrolling using jQuery easing
            $(document).on('click', 'a.scroll-to-top', function (e) {
                var $anchor = $(this);
                $('html, body').stop().animate({
                    scrollTop: ($($anchor.attr('href')).offset().top)
                }, 1000, 'easeInOutExpo');
                e.preventDefault();
            });
        },
        displayHomepage: function () {
            if (this.homePage) {
                //this.homePage.display();
                this.homepage.navigate();
                this.curPage = this.homepage;
            }

        },
        navigate: function (childId) {
            var page = this.pages[childId];
            if (app.router.navigate == null || page._path == null || page._path.length == 0 /*||page.type==2react page*/)
                this.displayChildPage(childId, true);
            else {
                if (this.curPage!=null && this.curPage.type != null && this.curPage.type == 3) {
                    var url = this.serverPath+"#"+ page._path;
                    this.curPage = page;
                    window.location.assign(url);
                } else {
                    this.curPage = page;
                   page.navigate();
                }
               
                
            }
            
        },
        displayChildPage: function (childId, isDestroy) {
            isDestroy = isDestroy == null ? false : isDestroy;
            var self = this;
            if (self.homepage != null)
                this.homePage.hide();
            $.each(self.pages, function (pageId, page) {
                if (page != null && pageId === childId) {
                    $(page.selector).empty();
                    page.display();
                    self.curPage = page;
                } else {
                    if (!isDestroy)
                        page.hide();
                    else
                        page.destroy();
                }
            });
        },
        initLocale: function () {
            var self = this;
            utils.initLocale(app.locale, function () {
                var items = $('#' + self.Id).find('.langs-switch a');
                items.click(function (e) {
                    e.preventDefault();
                    console.log('select language ' + $(this).data('locale'));
                    app.currentLang = $(this).data('locale');
                    utils.localize('#' + self.Id, app.currentLang);
                    if (app.router.navigate == null){
                        if (self.curPage!=null)
                             self.curPage.replace();
                    }else {
                        var elm = $(app.defaultContainer).find('div:visible').first();
                        var pageId =elm[0].id;
                        var activePage = app.pages[pageId];

                        if (activePage!= null){
                            var params = app.router.getParamsFromUrl();
                            activePage.replace.apply(activePage,params);
                        }
                    }
                    
                    
                })
            })

        },
        replace: function () {
            var self = this;
            var params = arguments;
            $.each(self.pages, function (id) {
                delete app.pages[id];
            })

            this.pages = {};

            clearAppSetting();

            this.Load(function () {
                self.loadData.apply(self, params);
                self.initLocale();
            }, true);
        }
    });

    var dashboard = basepage.extend({
        init: function (id, model, containerselector, template) {
            var pageTemplate = template != null ? template : { html: "<div class='dashboard-columns'></div>" };
            this._super(id, model, pageTemplate, containerselector);
        },
        _handleTemplate: function (templateHtml) {
            var template = kendo.template(templateHtml);
            return template(this.model);
        },
        _getLayout: function (layout, index) {
            var html = '';
            var self = this;

            layout.forEach(function (row) {
                var rowTemplate = "";
                row.cols.forEach(function (col) {
                    var itemId = self.Id + "_item_" + index;

                    if (col.rows != null && col.rows.length > 0) {
                        rowTemplate += "<div class='col-md-" + col.index + "'>" + self._getLayout(col.rows, index) + "</div>";
                    }
                    else {
                        rowTemplate += "<div id='" + itemId + "' class='col-md-" + col.index + "'></div>";
                    }

                    index++;
                })

                html += "<div class='row'>" + rowTemplate + "</div>";

            });

            return html;
        },
        _loadTemplate: function (callback, isReplace) {
            var self = this;

            this._super(function () {
                var containter = $('#' + self.Id).find('.dashboard-columns');
                //layout:1: 2 rows 3md4 2: 2 rows md3 md6 md3 2md6 3:2 rows 4 md3 md12 4: 2 rows 2 md6 5:2 rows 3 md4 md12 6: 1 row md6 md6(2 rows 2 md6)
                var layout = [];
                if (self.model.layoutSettings != null) {
                    layout = self.model.layoutSettings
                }
                else {
                    var layoutId = self.model.layout == null ? 1 : self.model.layout;
                    switch (layoutId) {
                        case 0:
                            layout = [{ cols: [{ index: 12 }] }, { cols: [{ index: 12 }] }];
                            break;
                        case 1:
                            layout = [{ cols: [{ index: 4 }, { index: 4 }, { index: 4 }] }, { cols: [{ index: 4 }, { index: 4 }, { index: 4 }] }];
                            break;
                        case 2:
                            layout = [{ cols: [{ index: 3 }, { index: 6 }, { index: 3 }] }, { cols: [{ index: 6 }, { index: 6 }] }];
                            break;
                        case 3:
                            layout = [{ cols: [{ index: 3 }, { index: 3 }, { index: 3 }, { index: 3 }] }, { cols: [{ index: 12 }] }];
                            break;
                        case 4:
                            layout = [{ cols: [{ index: 6 }, { index: 6 }] }, { cols: [{ index: 6 }, { index: 6 }] }];
                            break;
                        case 5:
                            layout = [{ cols: [{ index: 4 }, { index: 4 }, { index: 4 }] }, { cols: [{ index: 12 }] }];
                            break;
                        case 6:
                            layout = [{ cols: [{ index: 6 }, { index: 6, rows: [{ cols: [{ index: 6 }, { index: 6 }] }, { cols: [{ index: 6 }, { index: 6 }] }] }] }];
                            break;
                        default:
                            layout = [{ cols: [{ index: 6 }, { index: 6 }] }, { cols: [{ index: 6 }, { index: 6 }] }];
                            break;
                    }
                }

                var html = self._getLayout(layout, 0);
                containter.html(html);

                if ($.isFunction(callback))
                    callback(self);

            }, isReplace);
        },
        _afterLoadData: function (data) {

            this.model.data = this.model.layoutField != null ? data[this.model.layoutField] : data;
            var self = this;
            var index = 0;

            self.model.data.forEach(function (item) {
                var itemId = self.Id + "_item_" + index;
                var pageId = self.Id + "_page_" + index;

                item.page.params = [pageId, "#" + itemId];

                self.loadPage(item.page);
                var page = self.pages[pageId];

                if (self.model.layoutField != null)
                    page.model.data = data;

                self.model.hasBorder = self.model.hasBorder == null ? true : self.model.hasBorder;
                if (self.model.hasBorder)
                    page.setFormLoadedHandler(function () {
                        $("#" + page.Id).addClass("dashboard-column");
                    })

                if (item.isReplace == true)
                    page.replace();
                else
                    page.display();



                index++;
            });
        },
        show: function () {
            $("#" + this.Id).show();
            console.info('show page');
            $.each(this.pages, function (index, page) {
                if (page)
                    page.show();
            });
        }
    });

    var tabstripContainer = basepage.extend({
        init: function (id, model, containerselector, template) {
            var pageTemplate = template != null ? template : { html: '<div class="t-tabstrips"><ul class="nav nav-tabs" role="tablist"></ul><div class="tab-content"></div></div>' };
            this._super(id, model, pageTemplate, containerselector);
        },
        _loadTemplate: function (callback, isReplace) {
            var self = this;
            this._super(function () {

                var ul = $("#" + self.Id).find("ul.nav-tabs");
                var tabstrip = $("#" + self.Id).find(".t-tabstrips");
                var tabContent = tabstrip.find("div.tab-content");
                if (ul.length) {
                    self.model.tabs.forEach(function (tab, index) {
                        var tabId = self.Id + "_tab_" + index;
                        ul.append("<li class='nav-item' role='presentation' data-tab-index='" + index + "'><button class='nav-link t-tab' data-bs-toggle='tab'  type='button' role='tab'>" + utils.getLocaleLabel(tab.title) + "</button></li>");
                        tabContent.append('<div class="tab-pane ' + (index == 0 ? 'active show' : 'fade') + '" role="tabpanel" data-tab-index="' + index + '" ><div class="tabpage" id="' + tabId + '"></div></div>');
                        tab.page.params = [self.Id + "-" + tab.page.Id, "#" + tabId];
                        self.loadPage(tab.page);
                    });

                    tabstrip.find('li.nav-item').click(function (e) {
                        var sender = $(e.currentTarget);
                        var index = sender.attr('data-tab-index');
                        tabstrip.find('button.t-tab').removeClass("selected");
                        tabstrip.find('button.t-tab').eq(index).addClass("selected");
                        var cond = ':eq(' + index + ')';
                        tabstrip.find('div.tab-pane').not(cond).removeClass("show").addClass("fade");
                        tabstrip.find('div.tab-pane').eq(index).addClass("show").addClass('active');

                        $.each(self.pages, function (key, page) {
                            page.parent = self;
                            if (key === self.model.tabs[index].page.Id)
                                page.display();
                            else
                                page.hide();
                        })

                    })

                    self.selectTab(0);
                }


                if ($.isFunction(callback))
                    callback(self);

            }, isReplace);
        },
        selectTab: function (index) {
            var tabstrip = $("#" + this.Id).find(".t-tabstrips");
            tabstrip.find('li.nav-item').eq(index).click();
        }
    });
  
/*react base page*/
    var reactPage = basepage.extend({
        init: function (id, model, template, containerselector) {
            this._super(id, model, template, containerselector);
            this.type = 2; //0:js viewmodel,1:html page,2:react page;3:navigation page;
            this.className = model.className;

        },
        _loadTemplate: function (callback, isReplace) {
            isReplace = isReplace == null ? false : isReplace;
            if (this.pagetemplate.html == null)
                return;
            this.convertLocaleModel();
            var elm = this.pagetemplate.Id != null ? $(this.pagetemplate.html).find('#' + this.pagetemplate.Id) : null;
            if (this.pagetemplate.selector != null && elm == null)
                elm = $(this.pagetemplate.html).find(this.pagetemplate.selector);

            var content = (elm && elm.length) ? elm.html() : this.pagetemplate.html;
            if (this.pagetemplate.isScript != null && this.pagetemplate.isScript == true || (elm != null && elm.attr("type") != null && elm.attr("type").trim().search('text/') > -1))
                content = this._handleTemplate(content);

            this.pagetemplate.html = content;
            if ($('#' + this.Id).length == 0) {
                var containerElm = (typeof this.selector == 'string') ? $(this.selector) : this.selector;
                if (this.className != null)
                    containerElm.prepend("<div id=" + this.Id + " class='" + this.className + "'></id>");
                else
                    containerElm.prepend("<div id=" + this.Id + "></id>");
            }

            this._createReactElement();
            console.info('loading elements completed');

            if ($.isFunction(callback))
                callback(this);

            if ($.isFunction(this.handlers.eventHandler))
                this.handlers.eventHandler(this);
        },
        _createReactElement: function () {
            console.info('render UI under container');
            var containerElm = $('#' + this.Id);
            if (containerElm.length === 0) {
                console.error('Cannot find container element');
                return;
            }

            var componentFactory = null;
            if ($.isFunction(this.pagetemplate.renderHandler))
                componentFactory = this.pagetemplate.renderHandler;

            this.component = componentFactory(this.model.props);
           
        },
        setRenderHandler: function (handler) {
            if ($.isFunction(handler))
                this.pagetemplate.renderHandler = handler;
        }
    });
    
    var app = {
        paths: {},
        pages: {},
        defaultContainer: "#content",
        Debug: false,
        destroyPage: true,
        components: {},
        services: {},
        router: {
            getParamsFromUrl:function(url){
                url= url==null? window.location.href:url;
                var params = [];
                if (url != null) {
                    var parts = url.split("?");
                    var queryString = "";
                    if (parts.length > 1)
                        queryString = url.replace(parts[0],'');

                   
                    var temp = queryString.replace('&&', '&').split('&');
                    temp.forEach(function (str) {
                        var temp1 = str.split('=');
                        if (temp1.length > 1)
                            params.push(temp1[1]);
                    })
                } 
                 return params;

            },
            getWebsiteFromPath: function (relativeUrl) {
                relativeUrl = decodeURIComponent(relativeUrl);
                var temp = relativeUrl.split("/");
                var root = temp.length > 1 ? temp[1] : null;

                if (app.Websites == null)
                    app.Websites = [];

                var websiteList = $.grep(app.Websites, function (item) {
                    return item.Route == root;
                });

                return websiteList.length > 0 ? websiteList[0] : null;
            },
            setWebsite: function (profile) {
                var temp = $.grep(profile.websites, function (website) {
                    return website.Id == profile.websiteId
                });
                if (temp.length > 0) {
                    app.RootRoute = temp[0].Route;
                    app.WebsiteId = profile.websiteId;
                    app.Websites = profile.websites
                }
                
            },
            setCreateRounterHandler: function (handler) {
                app.router.create = handler;
            },
            setNavigateHandler: function (handler) {
                app.router.navigate = handler
            },
            setRouteHandler: function (handler) {
                app.router.route = handler;
            },
            routeMissing: function (path) {
                console.log("route missing path:", path);
                if (path != "/" && path.length>1) {
                    var website = app.router.getWebsiteFromPath(path);
                    if (website != null && website.Id != app.WebsiteId) {
                        app.initView.setRedirectUrl();
                        app.initView.display(website.Id);
                    }
                }
                else
                    console.log("no action for route missing path");
                
            },
            setRoute: function (path) {
                if (app.router.route == null || path == null || path.length == 0)
                    return;

                console.info('set route path:' + path);
                if (path != null && path.length > 0) {
                    var index = 0;
                    var funParams = "";
                    var url = "";

                    while (index <= app.maxPageLevel) {
                        funParams += index > 0 ? ((funParams.length > 0 ? "," : "") + "child" + index.toString()) : "";
                        url = "/" + app.RootRoute+ path + (funParams.length > 0 ? ("/:" + funParams.replace(",", "/:")) : "");
                        var args = funParams + (funParams.length > 0 ? "," : "") + "params";
                        var handler = new Function("app", "url", "return " + "function (" + args + ") { app.router.onRoute(url," + args + ") }")(app, url);

                        app.router.route(url, handler);
                        index++;
                    }
                }
            },
            onRoute: function (args) {
                var path = arguments[0];
                var pathWebsite =app.router.getWebsiteFromPath(path);
                var websiteId = pathWebsite.Id;
                if (websiteId != app.WebsiteId)
                {
                    app.initView.setRedirectUrl();
                    app.initView.display(websiteId);
                    return;
                }

                path = path.replace("/" + pathWebsite.Route,"");
                var rootPageId = null;
                var params = arguments[arguments.length - 1];
                if (arguments.length > 2) {
                    for (var i = 1; i < arguments.length - 1; i++) {
                        path = path.replace(':child' + i.toString(), arguments[i]);
                    }
                }
                console.info('current route path:' + path);
                var state = app.paths[path.replace("/", "__")];
                var pageId = state != null ? state.pageId : null;
           
                if (state == null) {
                    var rootPath="/"+path.split('/')[1];
                    var rootPage = findPageByPagePath(rootPath);
                    if (rootPage != null) {
                        pageId = rootPage.Id;
                        rootPageId = pageId;
                        rootPage.Load();
                        rootPage.hide();
                        if (app.initView.curPage!=null)
                           app.initView.curPage.hide();
                    }

                    var curPath = "";
                    for (var i = 1; i < arguments.length - 1; i++) {
                        curPath += (rootPath+"/" + arguments[i]);
                        var page = findPageByPagePath(curPath);
                        if (page != null) {
                            page.Load();
                            pageId = page.Id;
                            page.hide();
                        }
                    }

                }

                if (app.initView.pages[pageId] != null)
                    app.initView.displayChildPage(pageId, true);
                else {
                    var self = app.pages[pageId];
                   // app.initView.displayChildPage("");
                    var keys = Object.keys(params);
                    var args = [];
                    keys.forEach(function (key) {
                        if (key != "_back") {
                            var value = params[key].toLowerCase() == "null" ? null : params[key];
                            args.push(value);
                        }
                    })

                    self.display.apply(self, args);
                }

            },
            navigateTo: function (url) {
                if (app.router.navigate != null){
                    url = "/" + app.RootRoute+url
                   app.router.navigate(url);
                }
                
            }
        },
        maxPageLevel: 2,
        widgets:[]
    }

    var clearAppSetting =function() {
        app.pages = {};
        app.paths = {};
        $.each(app.components, function (name) {
            if (name != "eworkspace.ViewModel")
                delete app.components[name];
        })
        
        app.services = {}
    }

    var findPageByPagePath = function (path) {
        var result = null;
        $.each(app.pages, function (id,page) {
            if (page._path == path)
                result = page;
        })
        return result;
    }

    var findPageByPageName = function (pagename) {
        var result = null;
        $.each(app.pages, function (id, page) {
            if (page._pagename == pagename)
                result = page;
        })

        return result;
    }

    var createViewModel = function (pagename) {
        /*var params = [null];
        params = $.merge(params, arguments);
        return createViewModelFromComponent.apply(null, params);*/
        if (arguments.length == 0)
            return null;

        var classname = arguments[0];

        var params = [];

        for (i = 1; i < arguments.length; i++) {
            params.push(arguments[i]);
        }

        var namespaces = classname.split(".");
        var page = null;
        var parent = null;
        var temp = ''

        var path = namespaces[0] == "eworkspace" ? namespaces[namespaces.length - 1] : namespaces[0] + "_" + namespaces[namespaces.length - 1];

        if (app.router.create != null) {
            app.router.create(app.routerConfig);
        }

        namespaces.forEach(function (segment) {
            if (parent == null) {
                temp += (temp.length ? '.' : '') + segment;
                parent = app.components[temp];
            }

            page = page == null ? parent : page[segment];

        });

        if ($.isFunction(page)) {
            var instance = page.apply(page, params);

            if (instance.selector == app.defaultContainer) {
                path = instance.model==null || instance.model.path == null ? path : instance.model.path;

                if (path.search("/") != 0)
                    path = "/" + path;

                instance._pagename = path.substring(1);
                if (app.initView != null && namespaces[0] != "eworkspace") {

                    var tempResult = $.grep(app.initView.model.widgets, function (item) {
                        return item.Name == namespaces[0];
                    });
                    if (tempResult.length > 0) {
                        var resources = utils.getDisableResources(tempResult[0]);
                        instance.disableResources = $.grep(resources, function (res) {
                            return res.search(instance._pagename)==0
                        })
                    }
                }
            }

            return instance;
        }
        else
            return null;

    }
 
    this.tangram = {};
    var eworkspace = {
        ViewModel: {}, 
        Services: {},
        Model: {}
    };

    tangram.Core = function (config) {
        app.defaultContainer = config.defaultContainer;
        app.Debug = config.Debug;
        app.locale = config.locale;
        app.currentLang = config.currentLang;
        this.onAppCreated = null;
    };

    tangram.Core.prototype = {
        loadConfig: function (filename, callback, failcallback) {
            var self = this;
            $.getJSON(filename).done(function (data) {
                console.log('load configuration ...');
                if (data.Layout == "sidebar") {
                    utils.loadCSS("css/sidebarLayout.css");
                } else {
                    utils.loadCSS("css/bootstrap/css/bootstrap.min.css");
                    utils.loadCSS("css/normal.css");
                }

                data.serviceUrl = data.serviceUrl.toLowerCase().replace("https://", "").replace("http://");
                data.AuthorizationUrl = data.AuthorizationUrl.toLowerCase().replace("https://", "").replace("http://");
                data.serviceUrl = window.location.protocol+"//" + data.serviceUrl;
                data.AuthorizationUrl = window.location.protocol + "//" + data.AuthorizationUrl;
                data.routerConfig = data.routerConfig == null ? {} : data.routerConfig;
                data.routerConfig.routeMissingHandler = app.router.routeMissing;

                $.each(data, function (key, value) {
                    if (key != "components" && key != "basepage" && key != "htmlPage" && key !="MasterPagesidebar")
                        app[key] = value == null && app[key] != null ? app[key] : value;
                })
                console.info('app parameters initialized');

                if ($.isFunction(callback))
                    callback(data);

            }).fail(failcallback);
        },
        setRouterParams: function(websiteId,websites){
            app.router.setWebsite({ websiteId: websiteId, websites: websites });
        },
        registerComponent: function (name, component) {
           // if (app.components[name] == null)
           app.components[name] = component;
        },
        registerComponentServices: function (name, service) {
            //if (app.services[name] == null)
            app.services[name] = service;
        },
        registerPlatformProvider: function (provider) {
            eworkspace.framework = provider;
        },
        registerViewModel: function (name, viewModel) {
            eworkspace.ViewModel[name] = viewModel;
        },
        isComponentLoaded: function (name) {
            var isLoaded = false;
            $.each(app.components, function (componentname) {
                if (componentname == name || componentname.search(name + ".") > -1)
                    isLoaded = true;
            })
            return isLoaded;
        },
        createSessionName :function(key) {
            if (key == null)
                return null;

            return btoa(key) + utils.getTimeStampOfToday();
        },
        createApp: function () {
            if (this.onAppCreated != null) {
                this.onAppCreated();

            }
            else {
                alert('Please implement onAppCreated method');
            }
        },
        registerInitView: function (page) {
            app.initView = page;
        },
        registerRouter: function (createHandler, navigateHandler, setRouteHandler) {
            app.router.setCreateRounterHandler(createHandler);
            app.router.setNavigateHandler(navigateHandler);
            app.router.setRouteHandler(setRouteHandler);
        },
        createRouter: function () {
            if (app.router.create != null) {
                config = {
                    routeMissing: function (e) {
                        config.routeMissingHandler(e.url);
                    }
                }

                app.router.create(config);
            }
        },
        log: function (message, obj) {
            utils.log(message, obj, app.Debug);
        },
        navigateTo: function (path) {
            if (app.router.navigate != null)
                app.router.navigate(path);
        },
        createMasterPageSideBar: function () {
            var model = {
                name: "",
                menus: [],
                profile: null
            }

            return new masterPagesidebar("head",model);
        },
        exportCore: function () {
            if (eworkspace.components == null)
                eworkspace.components = {
                    Class: Class,
                    Basepage: basepage,
                    HtmlPage: htmlPage,
                    Dashboard: dashboard,
                    ReactPage: reactPage,
                    TabstripContainer: tabstripContainer
                }
           
            if (eworkspace.widgets == null)
                eworkspace.widgets = widget;

            if (eworkspace.utils == null)
                eworkspace.utils = utils;

            return eworkspace;
        },
        exportServices: function () {
            return eworkspace.Services;
        },
        exportComponentServices: function (name) {
            return app.services[name];
        },
        createbasePage: function (id, model, template, containerselector) {
            return new basepage(id, model, template, containerselector);
        },
        createhtmlPage: function (id, url) {
            return new htmlPage(id, url);
        },
        createWidget: function (widgetname, options) {
            return new widget[widgetname](options);
        },
        createUtils: function () {
            return new utilsLibs();
        },
        ApplyLocalization: function () {
            $.each(app.pages, function (attr, page) {
                page.initLocale();
            })
        },
        displayDenypage: function () {
            var containerElm = $('body');
            containerElm.html("<h2 style='text-align: center;margin-top:100px'>No permission to Access system. Please contact Adminstrator!</h2>");
        }
    }

    var widget = {
        Dropdownfilter: function (options) {
            var dropdownlist = function (options) {

                this.dataTextField = options.dataTextField;
                this.dataValueField = options.dataValueField;
                this.dataCheckedField = options.dataCheckedField;
                this.dataSource = options.dataSource;
                this.container = options.container;
                this.title = options.title == null ? 'Select an option' : options.title;
                this.onChange = $.isFunction(options.onChange) ? options.onChange : $.noop();
                this.id = options.id == null ? utils.generateUUID() : options.id;
                this.selectedValues = [];
                this.isMutilpleSelect = options.isMutilpleSelect == null ? true : false;
                this.defaultTitle = options.title == null ? 'Select an option' : options.title;
                this.template = '<div class="filter"><select style="width:100%;"><option>' + this.title + '</option></select><div class="overSelect"></div></div>';

                var self = this;
                var optionitems = this.isMutilpleSelect ? '<label for="all"><input type="checkbox" />Select All </label>' : '';
                this.dataSource.forEach(function (data) {
                    var isChecked = data[options.dataCheckedField] === true || data[options.dataCheckedField] === 'true' ? true : false;
                    optionitems += '<label for="' + data[options.dataValueField] + '"><input type="checkbox" ' + (isChecked ? 'checked' : '') + ' />' + data[options.dataTextField] + '</label>';

                    if (isChecked)
                        self.selectedValues.push(data);

                });


                this.template += '<div class="options">' + optionitems + '</div>';
                this.template = '<div  id="' + this.id + '" class="dropdownlist-filter">' + this.template + '</div>'

                this.container.append(this.template);

                var filter = $('#' + this.id).find('.filter');

                filter.click(function () {
                    var options = $('#' + self.id).find('.options');
                    options.toggle();
                });

                this._bindEvent();
            };

            dropdownlist.prototype = {
                getfilterConditions: function () {
                    var conditions = [];
                    var self = this;
                    var index = 0

                    this.selectedValues.forEach(function (item) {
                        var operator = '===';
                        var searchvalue = { operator: operator, value: item[self.dataValueField], key: self.dataValueField };
                        if (index > 0) {
                            searchvalue.joinoperator = "||"
                        }
                        conditions.push(searchvalue);
                        index++;
                    });

                    return conditions;
                },
                filterData: function (data, callback) {
                    var result = [];
                    var conditions = this.getfilterConditions();
                    if (null == conditions || typeof conditions == 'undefined')
                        return result;

                    var isValid = false;
                    data.forEach(function (item) {
                        var strCondition = '';
                        var searchValue = ''
                        var i = 0;
                        conditions.forEach(function (condition) {
                            searchValue = condition.value == '%' ? "(true)" : "(item['" + condition.key + "']" + condition.operator + "conditions[" + i + "].value" + ')';
                            strCondition += (condition.joinoperator == null || typeof condition.joinoperator == 'undefined' ? '' : condition.joinoperator) + searchValue;
                            i++;
                        })

                        isValid = eval(strCondition);

                        if (isValid == true)
                            result.push(item);
                    });

                    if ($.isFunction(callback))
                        callback(result);

                },
                _bindEvent: function () {
                    var self = this;

                    var labels = $('#' + this.id).find("label");
                    if (self.selectedValues.length == labels.length - 1 && self.isMutilpleSelect && labels.length)
                        $(labels[0]).find("input").prop('checked', true);

                    $(labels).bind('change', function () {
                        var item = $(this).attr("for");
                        if (item === "all") {
                            self.selectedValues.length = 0;
                            var isChecked = $(this).find('input').is(':checked');

                            for (i = 1; i < labels.length; i++) {
                                var inputitem = labels[i];
                                $(inputitem).find("input").prop('checked', isChecked);
                            }

                            if ($(this).find('input').is(':checked'))
                                self.dataSource.forEach(function (data) {
                                    if (data[self.dataValueField].toString() !== item)
                                        self.selectedValues.push(data);
                                });
                        }
                        else {
                            if ($(this).find('input').is(':checked')) {
                                if (self.isMutilpleSelect === false) {
                                    self.selectedValues.length = 0;
                                    for (i = 0; i < labels.length; i++) {
                                        var inputitem = labels[i];
                                        if ($(inputitem).attr("for") != item) {
                                            $(inputitem).find("input").prop('checked', false);
                                        }
                                    }
                                    $('#' + self.id).find("option").html(item)

                                }

                                self.dataSource.forEach(function (data) {
                                    if (data[self.dataValueField].toString() === item) {
                                        self.selectedValues.push(data);
                                        return false;
                                    }
                                });

                            }
                            else
                                self.selectedValues = $.grep(self.selectedValues, function (data) {
                                    if (self.isMutilpleSelect == false)
                                        $('#' + self.id).find("option").html(self.defaultTitle);
                                    return data[self.dataValueField].toString() !== item;

                                });

                            var isCheckAll = self.selectedValues.length == labels.length - 1 && labels.length > 1 ? true : false

                            if (self.isMutilpleSelect)
                                $(labels[0]).find("input").prop('checked', isCheckAll);
                        }

                        self.onChange();
                    });
                },
                refresh: function (dataSource, callback) {

                    var self = this;
                    var optionitems = this.isMutilpleSelect == true ? '<label for="all"><input type="checkbox" />Select All </label>' : '';
                    this.dataSource = dataSource;
                    self.selectedValues.length = 0;
                    this.dataSource.forEach(function (data) {
                        var isChecked = data[self.dataCheckedField] === true || data[self.dataCheckedField] === 'true' ? true : false;
                        optionitems += '<label for="' + data[self.dataValueField] + '"><input type="checkbox" ' + (isChecked ? 'checked' : '') + ' />' + data[self.dataTextField] + '</label>';

                        if (isChecked)
                            self.selectedValues.push(data);
                    });

                    var container = $('#' + this.id).find('.options');
                    container.html(optionitems);

                    this._bindEvent();


                    if ($.isFunction(callback))
                        callback(self.selectedValues);
                }
            }

            return dropdownlist;
        },
        PageLoadingBar: function (options) {
            var pageloader = function (options) {
                var isShow = options.isShow;
                isShow = isShow == null ? false : isShow;

                this.spinner = $('div.T-pageloader');
                if (this.spinner.length == 0) {
                    var html = '<div class="T-pageloader" style="display:none;"><span class="spinner-border"></span></div>';
                    $(document.body).append(html);
                    this.spinner = $('div.T-pageloader');
                }
              
                this.selector = options.selector == null ? 'body' : options.selector;
                var elm = (typeof this.selector == 'string') ? $(this.selector) : this.selector;

                var height = this.selector == 'body' ? '100%' : elm.height();
                var position = elm.position();
                this.spinner.height(height);
                this.spinner.css('top', position.top);
                this.spinner.css('left', position.left);
                if (isShow == true)
                    this.show();
                else
                    this.hide();
            }
            pageloader.prototype = {
                show: function () {
                    console.info("set process bar as busy for " + this.selector);
                    this.spinner.show();
                },
                hide: function () {
                    console.info("set process bar as false for " + this.selector);
                    this.spinner.hide();
                }
            }
            return  new pageloader(options);
        },
        TreeView: function (options) {
            var treeView = function (options) {
                this.id = utils.generateUUID();
                this.options = options;
                this.handlers = {}
                this.html = "<ul id='" + this.id + "' class='tm-treeview'></ul>";
                this.model = this.options.dataSource == null || this.options.dataSource.schema == null || this.options.dataSource.schema.model == null ? { text: 'text', children: 'children' } : this.options.dataSource.schema.model;
                this.model.text = this.model.text == null ? 'text' : this.model.text;
                this.model.children = this.model.children == null ? 'children' : this.model.children;
                if ($.isFunction(this.options.select))
                    this.handlers.select = this.options.select;
            }
            treeView.prototype = {
                getTreeItemLayout: function (item, treeView) {
                    var itemElm = "";
                    if ($.isArray(item)) {
                        itemElm += "<ul class='nested'>";
                        item.forEach(function (childItem) {
                            itemElm += treeView.getTreeItemLayout(childItem, treeView)
                        })
                        itemElm += "</ul>"
                    } else {
                        item.nodeId = 'tv-' + utils.generateUUID();
                        if ($.isArray(item[treeView.model.children]) && item[treeView.model.children].length > 0) {
                            itemElm += '<li><a class="closed"><i class="fas fa-angle-right"></i><span id=' + item.nodeId + '>' + item[treeView.model.text] + '</span>'
                            itemElm += treeView.getTreeItemLayout(item[treeView.model.children], treeView) + "</a></li>";
                        } else {
                            itemElm += '<li ><span id=' + item.nodeId + ' style="margin-left:1em" >' + item[treeView.model.text] + '</span></li>';
                        }
                    }
                    return itemElm;
                },
                createTreeView: function (data) {
                    var schema = this.options.dataSource == null ? null : this.options.dataSource.schema;
                    var self = this;
                    if ($.isArray(data)) {
                        var itemElm = "";
                        data.forEach(function (item) {
                            itemElm += self.getTreeItemLayout(item, self);
                        })

                        console.log('treeView layout', itemElm);
                        $('#' + self.id).html(itemElm);
                        this.bindEvent("select");
                        $('#' + self.id).find('li>a').click(function (e) {
                            var elm = e.target.tagName == "I" ? $(e.target).parent() : $(e.target);
                            var iconElm = e.target.tagName == "I" ? $(e.target) : $(e.target).find('i');
                            var removedClassName = elm.hasClass('closed') ? "closed" : "expanded";
                            var addClassName = elm.hasClass('closed') ? "expanded" : "closed";
                            var removeIconName = elm.hasClass('closed') ? "fa-angle-right" : "fa-angle-down";
                            var addIconName = elm.hasClass('closed') ? "fa-angle-down" : "fa-angle-right";
                            elm.removeClass(removedClassName);
                            elm.addClass(addClassName);
                            iconElm.removeClass(removeIconName);
                            iconElm.addClass(addIconName);


                        })
                    }
                },
                bindEvent: function (eventname) {
                    var self = this;
                    if ($.isFunction(this.handlers[eventname]))
                        $('#' + this.id).find('li').find('span').click(function (e) {
                            var event = {
                                sender: self,
                                node: e.target
                            }

                            var item = self.dataItem(event.node);
                            self.handlers[eventname](event);
                        })
                },
                bind: function (eventname, handler) {
                    var self = this;
                    if ($.isFunction(handler)) {
                        this.handlers[eventname] = handler;
                        this.bindEvent(eventname);
                    }

                },
                searchValue: function (id, items) {
                    var self = this;
                    var result = null;
                    items.forEach(function (item) {
                        if (result != null)
                            return false;

                        if (item.nodeId == id)
                            result = item;
                        else if ($.isArray(item[self.model.children]) && item[self.model.children].length > 0)
                            result = self.searchValue(id, item[self.model.children]);
                    });
                    return result;

                },
                dataItem: function (node) {
                    return this.searchValue(node.id, this.options.dataSource.data);

                },
                setDataSource: function (dataSource) {
                    this.options.dataSource = dataSource;
                    this.model = this.options.dataSource == null || this.options.dataSource.schema == null || this.options.dataSource.schema.model == null ? { text: 'text', children: 'children' } : this.options.dataSource.schema.model;
                    this.model.text = this.model.text == null ? 'text' : this.model.text;
                    this.model.children = this.model.children == null ? 'children' : this.model.children;
                    if (this.options.dataSource.data == null)
                        this.options.dataSource.data = [];
                    this.createTreeView(this.options.dataSource.data);
                },
                setData: function (data) {
                    this.options.dataSource.data.length = 0;
                    this.options.dataSource.data = data;
                    this.createTreeView(this.options.dataSource.data);
                }

            }
            return treeView;
        }
    }

    Date.prototype.toMSJSON = function () {
        var date = '/Date(' + this.getTime() + ')/'; //CHANGED LINE
        return date;
    };
    Date.prototype.monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];
    Date.prototype.getMonthName = function () {
        return this.monthNames[this.getMonth()];
    };
    Date.prototype.getShortMonthName = function () {
        return this.getMonthName().substr(0, 3);
    };
    Date.prototype.getWeekDayName = function (length) {
        var day = this.getDay();
        var dayname = "";

        switch (day) {
            case 1:
                dayname = "Monday";
                break;
            case 2:
                dayname = "Tuesday";
                break;
            case 3:
                dayname = "Wednesday";
                break;
            case 4:
                dayname = "Thursday";
            case 5:
                dayname = "Friday";
                break;
            case 6:
                dayname = "Saturday";
                break;
            case 0:
                dayname = "Sunday"
                break;
            default:
                break;
        }

        if (length != null && length > 0 && dayname.length >= length)
            dayname = dayname.substr(0, length);
        return dayname;
    }
    Date.prototype.getDateOfseveralDaysAgo = function (days) {
        var result = this - 1000 * 60 * 60 * 24 * days;   // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
        result = new Date(result);
        return result;
    }

    var utilsLibs = function () { }
    utilsLibs.prototype = {
        loadCSS: function (url) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url + "?rnd=" + Math.floor(Math.random() * 100);
            document.getElementsByTagName("head")[0].appendChild(link);
        },
        getBaseUrl: function () {
            return window.location.origin.toString() + window.location.pathname.toString();
        },
        getRelativeUrl: function () {
            var webUrl = window.location.origin.toString() + window.location.pathname.toString();
            return window.location.toString().replace(webUrl, '');
        },
        getTemplate: function (url, callback, id) {
            if (url.length == 0 || url == null || typeof url == 'undefined')
                return;

            $.ajax({
                url: url,
                type: "get",
                dataType: "text",
                success: function (data) {
                    var result = data;
                    if (id) {
                        var elm = $(data).find('#' + id)
                        result = elm.html();
                    }

                    if ($.isFunction(callback))
                        callback(result);
                }
            });
        },
        getEmptyGUID: function () {
            return "00000000-0000-0000-0000-000000000000";
        },
        generateUUID: function () {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now();; //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        cloneModel: function (model) {
            return JSON.parse(JSON.stringify(model));
        },
        pad: function (n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        },
        getURLParameter: function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');

            for (var i = 0; i < sURLVariables.length; i++) {

                var sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0].toLowerCase() == sParam.toLowerCase()) {
                    return sParameterName[1];
                }
            }
        },
        getWidgetSettings: function (widget) {
            var result = [];
            if (widget.RoleSettings != null) {
                widget.RoleSettings.forEach(function (item) {
                    result.push(JSON.parse(item));
                })
            }
            return result;
        },
        getDisableResources: function (widget) {
            var result = [];
            if (widget.DisableResources != null) {
                widget.DisableResources.forEach(function (item) {
                    result.push(item);
                })
            }
            return result;
        },
        setProcessbarhandler: function (handler) {
            this.totalPB = 0;

            if ($.isFunction(handler))
                this.handler = handler
        },
        showProcessbar: function (isShow, selector) {
            if (this.handler != null)
                this.handler(isShow, selector);
        },
        htmlEntities: function (str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },
        toString: function (value, format, culture) {
            if (value == null)
                return value;

            if (platForm.provider == "kendo")
                this.formatter = kendo;

            if (culture != null)
                this.formatter.culture(culture);

            if (format.search('dd') > -1 || format.search('MM') > -1 || format.search('yyyy') > -1 || format.search('MMM') > -1)
                value = this.formatter.parseDate(value);

            return this.formatter.toString(value, format);
        },
        setDateParseHandler: function (handler) {
            if ($.isFunction(handler))
                this.dateParseHandler = handler;
        },
        toDateString: function (date, dateFormat, parseDateFormat) {
            var result = date;
            if (date == null)
                return '';

            date = parseDateFormat==null?new Date(date):date;
            if ($.isFunction(this.dateParseHandler))
                result = this.dateParseHandler(date, dateFormat, parseDateFormat);

            return result;
        },
        getAppName: function () {
            var appName = '';
            if (location.pathname.split('/').length > 1)
                appName = location.pathname.split('/')[1];
            else
                appName = location.pathname.split('/')[0];

            return appName;
        },
        log: function (message, obj, isShowLog) {
            isShowLog = isShowLog == null ? false : isShowLog;
            if (isShowLog)
                console.log('%c ' + message, 'color:blue', obj);
        },
        initLocale: function (source, callback) {
            if ($.isFunction($.i18n))
                $.i18n().load(source).done(callback)
        },
        localize: function (selector, lang) {
            if (!$.isFunction($.i18n))
                return;

            $.i18n().locale = lang;
            $(selector).i18n();
        },
        getLocaleLabel: function (text) {
            if ($.isFunction($.i18n))
                return $.i18n(text);
            else
                return text;
        },
        getLocaleLabels: function (items, key) {
            if (!$.isFunction($.i18n))
                return items;

            var result = [];
            if (!$.isArray(items) && items[key] != null) {
                return $.i18n(items[key]);
            }
            items.forEach(function (item, index) {
                if (item[key] != null) {
                    var newItem = utils.cloneModel(item);
                    var newValue = $.i18n(item[key]);
                    if (newValue != null && newValue.length > 0) {
                        newItem[key] = newValue;
                        result.push(newItem);
                    } else
                        result.push(item);
                }
            })

            return result;

        },
        getTimeStampOfToday: function () {
            var date = new Date();
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        },
        decode: function (data, time) {
            var result = data;
            time = time == null ? 1 : time;
            while (time) {
                result = atob(result);
                time--;
            }
            return result;
        },
        getParameters: function (func) {
            return (func + '')
                .replace(/[/][/].*$/mg, '') // strip single-line comments
                .replace(/\s+/g, '') // strip white space
                .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
                .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
                .replace(/=[^,]+/g, '') // strip any ES6 defaults  
                .split(',').filter(Boolean); // split & filter [""]
        }  
    }
    var utils = new utilsLibs();

    global.convertDateToString = function (date, dateFormat) {
        return utils.toDateString(date, dateFormat);//toKendoDateString(date, dateFormat, parseDateFormat);
    }
    global.convertToDateString = function (date, dateFormat, parseDateFormat) {
        return utils.toDateString(date, dateFormat, parseDateFormat);
    }

    global.showProcessbar = function (isShow, selector) {
        utils.showProcessbar(isShow, selector)
    }

})(this);
