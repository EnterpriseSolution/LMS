define(["kendo.all.min"], function () {
    var provider = {
        kendo: {},
        createSession: function (config) {
            this.session = {
                locale: config.locale,
                currentLang: config.currentLang,
            }
            this.routerConfig = config.routerConfig;
        },
        createRouter: function (config) {
            
            if (this.router != null)
                return;

            console.log('create kendo router');
            
            if (config != null) {
                if (config.routeMissingHandler != null)
                    config.routeMissing = function (e) { config.routeMissingHandler(e.url) };

                this.router = new kendo.Router(config);
            }
            else
                this.router = new kendo.Router();

            this.router.start();
            /*window.onpopstate = function (event) {
                alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
            };*/
        },
        navigate: function (path) {
            if (this.router != null)
              this.router.navigate(path);
        },
        setRoute: function (path, callback) {
            if (this.router !=null)
              this.router.route(path, callback);
        }
    };

    provider.create = function (core) {
        var basepage = core.components.Basepage;
        var Class = core.components.Class;
        provider.kendo.HtmlPage = core.components.HtmlPage;
        provider.kendo.Basepage = basepage;
        provider.kendo.Dashboard = core.components.Dashboard;
        
        var utils = core.utils;
        var widgets = core.widgets;

        if (utils == null)
            console.error('utils.js is required');
        else
            console.info('loading kendo supported framwork');

        utils.loadCSS("css/kendo/kendo.default.min.css");
        utils.loadCSS("css/kendo/kendo.common-office365.min.css");
        utils.loadCSS("css/kendo/kendo.office365.min.css");

        utils.setProcessbarhandler(function (isShow, selector) {
            isShow = isShow == null ? false : isShow;
            selector = selector == null ? "body" : selector;

            if (typeof selector == 'string')
                console.info("set process bar as " + isShow + " for " + selector);
            else
                console.info("set process bar as " + isShow);

            if (isShow == false)
                this.totalPB--;
            else
                this.totalPB++;

            console.info("total busy bar:" + this.totalPB);

            if (typeof selector == 'string' && selector == 'body' && ((this.totalPB > 0 && isShow == false) || (this.totalPB > 1 && isShow == true)))
                return;

            var elm = (typeof selector == 'string') ? $(selector) : selector;
            kendo.ui.progress(elm, isShow);

            //this.totalPB = isShow == false ? 0 : this.totalPB;
        });
        utils.setDateParseHandler(function (date, dateFormat, parseDateFormat) {
            if (date == null)
                return date;

            if (parseDateFormat == null) 
                return kendo.toString(date, dateFormat);
            else
                return kendo.toString(kendo.parseDate(date, parseDateFormat), dateFormat);
        });
        utils.toKendoDateString = function (date, dateFormat, parseDateFormat) {
            return kendo.toString(date, dateFormat);
        }

        $.fn.tmTreeView = function (options) {
            var treeView = new widgets.TreeView(options);
            this.append(treeView.html);
            treeView.createTreeView(options.dataSource.data);
            return treeView;

        };

        provider.kendo.gridAdapter = {
            createGrid: function (selector, options, container) {
                var gridEml = container == null ? $(selector) : $(container).find(selector);
                if (gridEml.length == 0)
                    return null;

                var gridOptions = this.getDataTableOptions(options);
                return gridEml.DataTable(gridOptions);
            },
            getDataTableOptions: function (options) {
                return options;
            },
            tableRow: function (rowIndex, grid) {
                var view = grid.dataSource.view();
                return grid.tbody.find("tr[data-uid='" + view[rowIndex].uid + "']");
            },
            data: function (grid) {
                return grid.dataSource.data();
            },
            view: function (grid) {
                return grid.dataSource.view();
            },
            table: function (grid) {

                return grid.table;
            },
            dataItem: function (selector, grid) {
                return grid.dataItem(selector);
            },
            bind: function (eventname, handler, grid) {
                eventname = eventname == "select" ? 'change' : eventname;
                grid.bind(eventname, handler);
            }
        }
        provider.kendo.template = { url: "src/view/template_kendo.html", html: "" };
        provider.kendo.Chart = basepage.extend({
            init: function (id, model, template, containerselector) {
                var pageTemplate = template == null ? { html: '<div class="filters clearfix"></div><div class="chart clearfix"></div>' } : template;
                this.conditions = {};
                this._super(id, model, pageTemplate, containerselector);
                this.pageType = "Chart";

            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {
                    var chart = $('#' + self.Id).find('.chart');
                    if (self.model.title != null && self.model.title.length > 0) {
                        if (self.model.chartOptions.title == null)
                            self.model.chartOptions.title = {};
                        self.model.chartOptions.title.text = self.model.title;
                    }


                    if (self.model.categoryField != null && self.model.categoryField.length > 0)
                        self.model.chartOptions.categoryAxis.field = self.model.categoryField;

                    if (self.model.chartType != null && self.model.chartType.length > 0)
                        self.model.chartOptions.seriesDefaults.type = self.model.chartType;

                    chart.kendoChart(self.model.chartOptions);
                    self.chart = chart.data("kendoChart");

                    if ($.isFunction(self.handlers.getFilterHandler))
                        self.handlers.getFilterHandler(function (filterData) {
                            self.model.filters = filterData;
                            self._generateFilters(callback);
                        });
                    else
                        self._generateFilters(callback);

                }, isReplace)
            },
            setFilterHandler: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.getFilterHandler = handler;
            },
            _generateFilters: function (callback) {
                var self = this;
                var filter_container = $('#' + self.Id).find('.filters');

                if (self.model.filters != null)
                    self.model.filters.forEach(function (filter) {
                        filter.container = filter_container;
                        var ddl = new utils.widgets.dropdownfilter(filter);
                        filter.ddl = ddl;

                        self.conditions[filter.dataValueField] = [];
                        ddl.selectedValues.forEach(function (item) {
                            self.conditions[filter.dataValueField].push(item[filter.dataValueField]);
                        });

                        ddl.onChange = function () {
                            if (filter.type === 'graph')
                                self.changSerieFields(filter);
                            else if (filter.type === "service") {
                                self.conditions[filter.dataValueField] = [];
                                this.selectedValues.forEach(function (item) {
                                    self.conditions[filter.dataValueField].push(item[filter.dataValueField]);
                                });
                                self.display(self.conditions);
                            }
                            else {

                                self._filterData();
                            }
                        }
                    });


                if ($.isFunction(callback))
                    callback();
            },
            _filterGraph: function () {
                var self = this;
                if (self.model.filters != null)
                    this.model.filters.forEach(function (filter) {
                        if (filter.type == 'graph')
                            self.changSerieFields(filter);
                    });

            },
            _filterData: function () {
                var self = this;
                if (self.model.filters != null)
                    this.model.filters.forEach(function (filter) {
                        if (filter.type == 'data' && filter.dataSource.length > 0) {
                            var i = 0;
                            var data = i < 1 ? self.model.data : self.model.chartOptions.dataSource.data();
                            filter.ddl.filterData(data, function (result) {
                                self.refresh(result);
                            });
                            i++;
                        }
                    });

            },
            _afterLoadData: function (data) {
                this.model.data = data;
                this._refreshCategory(data);
                this.refresh(data);
                this._filterGraph();

            },
            _refreshCategory: function (data) {
                var self = this;
                if (self.model.filters == null)
                    return;

                data = new kendo.data.DataSource({
                    data: data
                });
                data.sort({
                    field: self.model.chartOptions.categoryAxis.field,
                    dir: "asc"
                });

                if (this.model.chartOptions.dataSource == null)
                    this.model.chartOptions.dataSource = data;

                data = data.view();

                self.model.filters.forEach(function (filter) {
                    if (filter.dataValueField == self.model.chartOptions.categoryAxis.field) {
                        var dataSource = [];
                        var CategoryData = {};

                        data.forEach(function (item) {
                            var category = item[self.model.chartOptions.categoryAxis.field];
                            if (typeof CategoryData[category] === 'undefined' || CategoryData[category] === null) {
                                CategoryData[category] = category
                                var filterItem = {};
                                filterItem[filter.dataTextField] = category;
                                filterItem[filter.dataValueField] = category;
                                filterItem[filter.dataCheckedField] = true;
                                dataSource.push(filterItem);
                            }

                        });
                        filter.dataSource = dataSource;
                        filter.ddl.refresh(dataSource);
                    }
                })

            },
            display: function () {

                var elm = $("#" + this.Id);
                var params = this.model.filters != null && this.model.filters.length ? [] : arguments;

                if (this.model.filters != null && this.model.filters.length)
                    params.push(this.conditions);

                if (elm && elm.length) {
                    this.show();
                    this.loadData.apply(this, params);
                }
                else {
                    var self = this;
                    this.Load(function () {
                        self.loadData.apply(self, params);
                    })
                }
            },
            refresh: function (data) {

                if ($.isArray(this.model.chartOptions.dataSource.data) == true)
                    this.model.chartOptions.dataSource = new kendo.data.DataSource(this.model.chartOptions.dataSource);

                this.model.chartOptions.dataSource.data(data);
                this.chart.setDataSource(this.model.chartOptions.dataSource);

                var self = this;
                if (this.model.chartOptions.group != null) {
                    self.chart.options.series.length = 0;
                    this.model.chartOptions.dataSource.group(this.model.chartOptions.group.field);
                    var view = this.model.chartOptions.dataSource.view();

                    view.forEach(function (item) {
                        if ($.isArray(self.model.chartOptions.group.serieFields))
                            self.model.chartOptions.group.serieFields.forEach(function (serieItem) {
                                var serie = { name: item.value, field: serieItem.field, data: item.items };

                                if (serieItem.name != null)
                                    serie.name = serieItem.name;

                                if ($.isArray(serieItem.colors)) {
                                    serieItem.colors.forEach(function (colorItem) {
                                        if (colorItem.value === item.value) {
                                            serie.color = colorItem.color;
                                            if (serieItem.name != null)
                                                serie.name += " " + colorItem.value
                                            return false;
                                        }

                                    })
                                }

                                self.chart.options.series.push(serie);

                            });

                    })
                }

                this.chart.redraw();
            },
            changSerieFields: function (filter) {
                var self = this;
                var chartOptions = self.chart.options;
                chartOptions.series.forEach(function (serie) {
                    var isShow = false;
                    filter.ddl.selectedValues.forEach(function (item) {
                        if (item[filter.dataValueField] === serie.name) {
                            isShow = true;
                            return false;
                        }
                    });
                    serie.visible = isShow;
                });

                self.chart.redraw();
            }
        });
        provider.kendo.NPage = basepage.extend({
            init: function (id, model, template, containerselector) {
                this._super(id, model, template, containerselector);
            },
            _afterLoadData: function (data) {
                this.model.data = data
            }
        });
        provider.kendo.Page = basepage.extend({
            init: function (id, model, template, containerselector) {
                this._super(id, model, template, containerselector);
                this.handlers.disableGridColumnHandler = {};
            },
            _afterLoadData: function (data) {
                this.setData(data);
            },
            bindEvent: function (eventname, eventhandler) {
                if ($.isFunction(eventhandler))
                    this.observable[eventname] = eventhandler;
            },
            _handleTemplate: function (templateHtml) {
                var template = kendo.template(templateHtml);
                return template(this.model);
            },
            getData: function () {
                if (this.observable == null)
                    return this.model.data;

                var data = this.observable.get("data");
                return utils.cloneModel(data);
            },
            setData: function (data) {
                this.model.data = data;
                if (this.validator != null)
                    this.validator.hideMessages();

                if (this.observable == null) {
                    var bindElm = $("#" + this.Id);
                    if (bindElm.length > 0) {
                        //bindElm.find("input:radio").prop('checked', false);
                        //bindElm.find("input:checkbox").prop('checked', false);
                        this.observable = kendo.observable(this.model);
                        kendo.bind(bindElm, this.observable);
                    }

                }
                else {
                    this.observable.set("data", data);
                }
            },
            setDataByField: function (field, value) {
                if (this.observable != null)
                    this.observable.set('data.' + field, value);
                else if (this.model.data != null)
                    this.model.data[field] = value;
                else
                    console.warn('data is null');

            },
            getDataByField: function (field) {
                if (this.observable != null)
                    return this.observable.get('data.' + field);
                else {
                    return this.model.data != null ? this.model.data[field] : null;
                }

            },
            ValidateInit: function (selector, options) {
                var form = $("#" + this.Id).find(selector);
                this.valdidatoroptions = options
                if (this.valdidatoroptions != null)
                    this.validator = form.kendoValidator(this.valdidatoroptions).data("kendoValidator");
                else
                    this.validator = form.kendoValidator().data("kendoValidator");
            },
            convertLocaleGrid: function (selector) {
                var grid = $('#' + this.Id).find(selector);
                if (grid.length == 0)
                    return;
                var colElms = grid.find('th[role="columnheader"]');
                for (var i = 0; i < colElms.length; i++) {
                    var txtElm = $(colElms[i]).contents().last()[0];
                    var text = txtElm.wholeText;
                    var newText = utils.getLocaleLabel(text);
                    //txtElm.replaceWith(newText);
                    txtElm.nodeValue = newText;
                }

                this.convertLocaleGridButtons(selector);
            },
            convertLocaleGridButtons: function (selector) {
                var grid = $('#' + this.Id).find(selector);
                if (grid.length == 0)
                    return;

                var btnElms = grid.find('a.k-button');
                for (var j = 0; j < btnElms.length; j++) {
                    var txtElm = $(btnElms[j]).contents().last()[0];
                    var text = txtElm.wholeText;
                    var newText = utils.getLocaleLabel(text);
                    //txtElm.text(newText);
                    txtElm.nodeValue = newText;
                }

            },
            setGridModeBySelector: function (selector, editable) {
                var gridElm = $("#" + this.Id).find(selector);

                for (var i = 0; i < gridElm.length; i++) {
                    var grid = $(gridElm[i]).data("kendoGrid");

                    if (grid == null) {
                        console.log("setGridModeBySelector:Cannot get grid");
                        continue;
                    }
                    var options = grid.getOptions();
                    if (!$.isFunction(options.edit))
                        this.setDisableGridColumn(grid, i.toString(), !editable);

                    /*if (editable === options.editable)
                        continue;*/

                    if (editable)
                        console.log("start to show grid");
                    else
                        console.log("start to hide grid");

                    var toolbar = $(gridElm[i]).find(".k-grid-toolbar");

                    if (toolbar.length > 0) {
                        if (editable)
                            toolbar.show();
                        else
                            toolbar.hide();
                    }

                    grid.columns.forEach(function (col, index) {
                        if (col.command != null) {
                            if (editable)
                                grid.showColumn(index);
                            else
                                grid.hideColumn(index);
                        }

                    })
                }
            },
            setDisableGridColumn: function (grid, index, disableFlag) {
                var self = this;
                if (!$.isFunction(this.handlers.disableGridColumnHandler[index]) && disableFlag == true) {
                    self.handlers.disableGridColumnHandler[index] = function (e) {
                        if (disableFlag) {
                            e.sender.closeCell();
                            return;
                        }
                    };

                    grid.bind("edit", self.handlers.disableGridColumnHandler[index]);
                }

            },
            destroy: function () {
                this._super();
                this.observable = null;
            },
            setEditMode: function (editable, selector) {
                this._super(editable, selector);
                var elms = selector.length == 0 ? $('#' + this.Id) : $('#' + this.Id).find(selector);
                var kendoControls = elms.find('[data-role]');
                if (kendoControls.length > 0) {
                    this._enableSpecialControl(selector, editable);
                    this.setGridModeBySelector(selector, editable);
                }
            },
            _enableSpecialControl: function (selector, editable) {
                var root = selector == null || selector.length == 0 ? $(this.Id) : $(this.Id).find(selector);
                if (root.length == 0) {
                    console.warn('enable control: cannot find element by ' + selector);
                    return;
                }

                var elements = root.is("[data-role]")?root: root.find("[data-role]");
                elements.forEach(function (item) {
                    var elm = $(item);
                    var datarole = elm.attr("data-role");
                    var controlType = null;
                    switch (datarole) {
                        case "dropdownlist":
                            controlType = "kendoDropDownList";
                            break;
                        case "textarea":
                            controlType = "kendoTextArea";
                            break;
                        case "combobox":
                            controlType = "kendoComboBox";
                            break;
                        case "datepick":
                            controlType = "kendoDatePicker";
                            break;
                        case "datetimepick":
                            controlType = "kendoTimePicker";
                            break;
                        case "timepick":
                            controlType = "kendoDateTimePicker";
                            break;
                        case "numerictextbox":
                            controlType = "kendoNumericTextBox";
                            break;
                        case "checkboxgroup":
                            controlType = "kendoCheckBoxGroup";
                            break;
                        case "radiogroup":
                            controlType = "kendoRadioGroup";
                            break;
                        case "textbox":
                            controlType = "kendoTextBox";
                            break;
                        case "multiselect":
                            controlType = "kendoMultiSelect";
                            break;
                        case "upload":
                            controlType = "kendoUpload";
                            break;
                        case "dropdowntree":
                            controlType = "kendoDropDownTree";
                            break;
                        case "autocomplete":
                            controlType = "kendoAutoComplete";
                            break;
                    }

                    var control = elm.data(controlType);
                    if (control != null) {
                        if ($.isFunction(control.disable)) {
                            if (editable)
                                control.enable();
                            else
                                control.disable();
                        } else
                            control.enable(editable);
                    }

                });
          
            }
        });

        provider.kendo.List = provider.kendo.Page.extend({
            init: function (id, model, containerselector, template) {
                var toolBarHtml = model.toolBarItems != null && model.toolBarItems.length > 0 ? "<div class='toolbar' data-role='toolbar' style='margin-bottom:30px'></div>" : "";
                var pageTemplate = template == null ? { html: toolBarHtml + "<h3 style='margin-left:5px;margin-top:5px;margin-bottom:10px;font-size:16px;'></h3><div class='grid' style='border-width:1px 0px 0px 0px'></div>" } : template;
                this._super(id, model, pageTemplate, containerselector);
                this.pageType = "List";
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {

                    var curPage = $("#" + self.Id);
                    var title = curPage.find('h3');
                    if (title.length > 0)
                        title.html(self.model.title);

                    if (self.model.toolBarItems != null) {
                        var toolbar = $("#" + self.Id).find('.toolbar');
                        if (toolbar.length)
                            toolbar.kendoToolBar({
                                items: self.model.toolBarItems
                            });

                        var itemIndex = 0;
                        self.model.toolBarItems.forEach(function (item) {
                            var toolbar = $('#' + self.Id).find('.toolbar');
                            if (item.template != null) {
                                var button = toolbar.find('[data-uid]:eq(' + itemIndex + ')');
                                button.click(item.click);
                            }

                            itemIndex++;
                        })
                    }

                    //create list
                    var grid = $("#" + self.Id).find('.grid');

                    self.model.gridOptions.dataBound = $.isFunction(self.handlers.dataBound) ? self.handlers.dataBound : self.toggleScrollbar;
                    //server paging
                    if (self.handlers.loadDataServerHandler != null) {

                        if (self.model.gridOptions.dataSource.serverPaging == true) {
                            if (self.model.gridOptions.dataSource.schema == null)
                                self.model.gridOptions.dataSource.schema = {
                                    data: "data",
                                    total: "total"
                                };
                            self.model.dataSourceField = self.model.gridOptions.dataSource.schema.data;
                        }
                        self.model.gridOptions.dataSource.transport = {
                            read: self.handlers.loadDataServerHandler
                        };

                        if (self.model.gridOptions.sortable === true) {
                            self.model.gridOptions.dataSource.serverSorting == true;
                            self.model.gridOptions.sort = function (e) {
                                self.model.sorting = {
                                    orderBy: e.sort.field,
                                    isAscending: e.sort.dir == "asc"
                                }
                            }
                        }

                        if (self.model.gridOptions.filterable === true) {
                            self.model.criterias = [];
                            self.model.gridOptions.dataSource.serverFiltering = true;
                            self.model.gridOptions.filter = function (e) {
                                if (e.filter == null) {
                                    console.log("filter has been cleared");
                                    self.model.criterias.length == 0;
                                } else {
                                    /* The result can be observed in the DevTools(F12) console of the browser. */
                                    console.log(e.filter);
                                    var filters = [];
                                    filters.push({ field: e.filter.filters[0].field, operator: e.filter.filters[0].operator, value: e.filter.filters[0].value })
                                    self.model.criterias = filters;
                                }
                            }
                        }
                    }
                    grid.kendoGrid(self.model.gridOptions);

                    if ($.isFunction(callback))
                        callback(self);
                }, isReplace);
            },
            _afterLoadData: function (data) {
                var data = data ? data : this.model.data;
                this.model.data = data;
                var gridData = $.isArray(data) ? data : (this.model.gridDataSourceField != null ? data[this.model.gridDataSourceField] : []);
                this.refreshgridData(gridData);

                if (this.searcher != null)
                    this.searcher.setData(gridData);

                this._super(data);
            },
            _getGrid: function () {
                var grid = $("#" + this.Id).find('.grid');
                return grid.data("kendoGrid");
            },
            refreshgridColumns: function (columns) {
                this.model.gridOptions.columns = columns;
                var grid = $("#" + this.Id).find('.grid');
                var options = grid.data("kendoGrid").options;
                options.columns = this.model.gridOptions.columns;
                //grid.empty();
                grid.setOptions(this.model.gridOptions);
                // grid.kendoGrid(options);
            },
            refreshgridData: function (data) {
                if (data == null)
                    return;

                var grid = this._getGrid();
                grid.dataSource.data(data);

                this.convertLocaleGridButtons('.grid');
            },
            getgridData: function () {
                var grid = this._getGrid();
                return grid.dataSource.data();
            },
            setGridDataBound: function (handler) {
                var self = this;
                this.handlers.dataBound = $.isFunction(handler) ? function (e) { self.toggleScrollbar(e); handler(e) } : self.toggleScrollbar;
            },
            toggleScrollbar: function (e) {
                var gridWrapper = e.sender.wrapper;
                var gridDataTable = e.sender.table;
                var gridDataArea = gridDataTable.closest(".k-grid-content");
                var areaOffset = gridDataArea.length > 0 ? gridDataArea[0].offsetHeight : 0;
                gridWrapper.toggleClass("no-scrollbar", gridDataTable[0].offsetHeight < areaOffset);
            },
            rebindGrid: function (options) {
                var grid = this._getGrid();
                this.model.gridOptions = options;
                //grid.empty();
                grid.setOptions(this.model.gridOptions)
                //grid.kendoGrid(this.model.gridOptions);
            },
            convertLocaleModel: function () {
                var self = this;
                this.getLocaleLabels('title');
                this.getItemLabels(this.model.gridOptions.columns, 'title', this.defaultModel.gridOptions.columns);
            },
            setGridPagerChangeHandler: function (handler) {
                var grid = this._getGrid();
                var pager = grid.pager;
                pager.bind('change', handler);
            },
            setLoadDataHandler: function (handler, service) {
                if ($.isFunction(handler) == false)
                    return;

                this.service = service;
                if (this.model.gridOptions != null &&
                    (this.model.gridOptions.dataSource.serverPaging == true
                        || this.model.gridOptions.dataSource.serverFiltering == true
                        /*|| this.model.gridOptions.dataSource.serverGrouping == true*/
                        || this.model.gridOptions.dataSource.serverSorting == true)) {
                    var self = this;
                    options.data.pageSize = self.model.gridOptions.dataSource.pageSize;
                    if (self.model.sorting != null) {
                        options.data.orderBy = self.model.sorting.orderBy;
                        options.data.isAscending = self.model.sorting.isAscending;
                    }

                    self.model.criterias = $.isArray(self.model.criterias) ? self.model.criterias : [];
                    options.data.criterias = self.model.criterias;
                    this.handlers.loadDataServerHandler = function (options) {
                        console.log('dataOptions', options.data)
                        handler(options.data, function (result) {
                            var data = self.model.dataSourceField == null ? result : result[self.model.dataSourceField];
                            if ($.isFunction(self.handlers.loadCompletedHandler))
                                self.handlers.loadCompletedHandler(data);
                            console.log('list data', result);
                            options.success(result);
                            self.model.data = data;
                        }, function (result) {
                            options.error(result);
                            self.model.data = [];
                        })
                    }
                }
                else
                    this.handlers.loadDataHandler = handler;
            },
            _getColumn: function (field) {
                var grid = this._getGrid();
                if (grid == null)
                    return null;

                var column = $.grep(grid.columns, function (col) {
                    return col.field == field;
                })

                return (column.length > 0 ? column[0] : null);

            },
            setColumnEditor: function (field, handle) {
                var col = this._getColumn(field);
                if (col == null) {
                    console.warn("Fails to get column")
                    return;
                }

                if ($.isFunction(handle))
                    col.editor = handle;
            },
            setGridMode: function (editable) {
                this.setGridModeBySelector('.grid', editable);
            },
            onToolBarItemClick: function (index, handler) {
                var i = 0;
                if (this.model.toolBarItems != null && $.isArray(this.model.toolBarItems))
                    this.model.toolBarItems.forEach(function (item) {
                        if (index === i) {
                            if ($.isFunction(handler))
                                item.click = handler;
                            return false;
                        }
                        i++;
                    })

            },
            setButtonVisible: function (name, isVisible) {
                isVisible = isVisible == null ? true : isVisible;
                var buttons = $('#' + this.Id).find('.toolbar').find('div[data-uid]');
                var button = buttons.length == 1 ? buttons : null;

                if (buttons.length > 1)
                    for (i = 0; i < buttons.length; i++) {
                        if ($(buttons[i]).text() == name) {
                            button = $(buttons[i]);
                            if (button != null && button.length) {
                                if (isVisible == false)
                                    button.hide();
                                else
                                    button.show();
                            }
                        }
                    }
            },
            setButtonVisibleByIndex: function (index, isVisible) {
                if (index < 0)
                    return;
                isVisible = isVisible == null ? true : isVisible;
                var button = $('#' + this.Id).find('.toolbar').find('div[data-uid]:eq(' + index + ')');
                if (button != null && button.length) {
                    if (isVisible == false)
                        button.hide();
                    else
                        button.show();
                }

            },
            setButtonVisibleById: function (id, isVisible) {
                isVisible = isVisible == null ? true : isVisible;
                var btnIndex = -1;
                this.model.toolBarItems.forEach(function (item, index) {
                    if (item.id == id && btnIndex < 0)
                        btnIndex = index;
                })
                this.setButtonVisibleByIndex(btnIndex, isVisible);
            },
            setEditMode: function (editable, selector) {
                selector = selector == null ? "" : selector.replace(this._pagename + ":", "");;
                editable = editable == null ? true : editable;
                if ($.isNumeric(selector))
                    this.setButtonVisibleByIndex(selector);
                else
                    this.setButtonVisible(selector);
                setGridMode(editable);
            }
        });
        
        provider.kendo.TreeList = provider.kendo.Page.extend({
            init: function (id, model, containerselector, template) {
                var pageTemplate = template == null ? { html: "<h3 style='margin-left:5px;margin-top:5px;margin-bottom:5px;font-size:16px;'></h3><div class='treelist' style='border-width:1px 0px 1px 0px'></div>" } : template;
                this._super(id, model, pageTemplate, containerselector);
                this.pageType = "List";
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {

                    var curPage = $("#" + self.Id);
                    var title = curPage.find('h3');
                    title.html(self.model.title);
                    //create list

                    self.model.gridOptions.dataBound = $.isFunction(self.handlers.dataBound) ? self.handlers.dataBound : self.toggleScrollbar;
                    self.model.gridOptions.expand = self.handlers.expand;
                    var grid = $("#" + self.Id).find('.treelist');
                    self.model.gridOptions.dataSource = new kendo.data.TreeListDataSource(self.model.gridOptions.dataSource);
                    grid.kendoTreeList(self.model.gridOptions);

                    if ($.isFunction(callback))
                        callback(self);
                }, isReplace);
            },
            _afterLoadData: function (data) {
                var data = data != null ? data : this.model.data;
                var gridData = $.isArray(data) ? data : (this.model.gridDataSourceField != null ? data[this.model.gridDataSourceField] : []);

                this.refreshgridData(gridData);

                if (this.searcher != null)
                    this.searcher.setData(gridData);

                this._super(data);
            },
            _getGrid: function () {
                var grid = $("#" + this.Id).find('.treelist');
                return grid.data("kendoTreeList");
            },
            refreshgridData: function (data) {
                data = data.map(item => {
                    if (item.parentId == null)
                        item.parentId = null;

                    if (this.model.treeModel != null) {
                        var idName = this.model.treeModel.id;
                        var parentIdName = this.model.treeModel.parentId;
                        if (idName != null)
                            item.id = item[idName];

                        if (parentIdName != null)
                            item.parentId = item[parentIdName];
                    }

                    return item;
                })

                var grid = this._getGrid();
                grid.dataSource.data(data);

                /*if (this.dataSource == null) {
                    this.dataSource = new kendo.data.TreeListDataSource({
                        data: data
                    });

                    grid.setDataSource(this.dataSource);
                } else*/


            },
            setGridDataBound: function (handler) {
                var self = this;
                this.handlers.dataBound = $.isFunction(handler) ? function (e) { self.toggleScrollbar(e); handler(e) } : self.toggleScrollbar;
            },
            setTreeItemExpand: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.expand = handler;
            },
            toggleScrollbar: function (e) {
                var gridWrapper = e.sender.wrapper;
                var gridDataTable = e.sender.content;
                var gridDataArea = gridDataTable.closest(".k-grid-content");
                gridWrapper.toggleClass("no-scrollbar", gridDataTable[0].offsetHeight < gridDataArea[0].offsetHeight);
            },
            convertLocaleModel: function () {
                var self = this;
                this.getLocaleLabels('title');
                this.getItemLabels(this.model.gridOptions.columns, 'title', this.defaultModel.gridOptions.columns);
            }
        });

        provider.kendo.Form = provider.kendo.Page.extend({
            init: function (id, model, template, containerselector) {
                this._super(id, model, template, containerselector);
            },
            setValidatorOptions: function (options) {
                this.valdidatoroptions = options
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {

                    if (self.valdidatoroptions != null)
                        self.validator = $("#" + self.Id).kendoValidator(self.valdidatoroptions).data("kendoValidator");
                    else
                        self.validator = $("#" + self.Id).kendoValidator().data("kendoValidator");

                    if ($.isFunction(callback))
                        callback(self);
                }, isReplace)
            }

        });

        provider.kendo.DynamicForm = provider.kendo.Form.extend({
            init: function (id, model, containerselector) {
                var template = { html: '' };
                this._super(id, model, template, containerselector);
            },
            setFormLoadedHandler: function (handler) {
                var self = this;
                if ($.isFunction(handler)) {
                    this.handlers.formLoadedHandler = function () {
                        handler();
                        self.setData(self.model.data);
                    }
                }
            },
            _afterLoadData: function (data) {
                if (data == null)
                    return;
                this.model.data = data;

                if (this.model.data.html != null)
                    $('#' + this.Id).html(this.model.data.html);

                if (!$.isFunction(this.handlers.formLoadedHandler))
                    this.handlers.formLoadedHandler();
                else
                    this.setData(self.model.data);
            }

        });

        provider.kendo.MasterPagetopbar = basepage.extend({
            init: function () {
                this._super("head", {}, { Id: 'masterpage', url: 'src/view/masterpage_topbar.html' }, 'body');
                this.homePage = null;
                /*  var self = this;
                  this.menuContainer = $(".menucontainer");
                  this.menuContainer.hide();
                  this.redirectPageId = utils.getURLParameter("pageId");
      
                  if (utils.getURLParameter("websiteId") != null)
                      provider.Profile.websiteId = utils.getURLParameter("websiteId");
      
                  $(".portalname").click(function () {
      
                      if (self.homePage) {
                          $.each(self.pages, function (id, page) {
                              if (page)
                                  page.hide();
                          });
                          self.homePage.show();
                      }
      
                      self.loadMenus();
                      $("#" + self.Id).find(".portal-selectedmenus").empty();
      
                  })
      
                  $("#openmenu").click(function () {
                      self.loadMenus();
                      self.toggleMenu($(".menusbutton"));
                  })
      
                  $(".container").click(function () {
                      $('#' + self.Id).find('.portaltitlehover').removeClass("portaltitlehover");
                      self.menuContainer.hide();
                  })
      
                  $('.home').click(function () {
      
                      $(".portalname").click()
      
                  });
                  */

            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {
                    self.menuContainer = $(".menucontainer");
                    self.menuContainer.hide();
                    self.redirectPageId = utils.getURLParameter("pageId");

                    if (utils.getURLParameter("websiteId") != null)
                        provider.Profile.websiteId = utils.getURLParameter("websiteId");

                    $(".portalname").click(function () {

                        if (self.homePage) {
                            $.each(self.pages, function (id, page) {
                                if (page)
                                    page.hide();
                            });
                            self.homePage.show();
                        }

                        self.loadMenus();
                        $("#" + self.Id).find(".portal-selectedmenus").empty();

                    })

                    $("#openmenu").click(function () {
                        self.loadMenus();
                        self.toggleMenu($(".menusbutton"));
                    })

                    $(".container").click(function () {
                        $('#' + self.Id).find('.portaltitlehover').removeClass("portaltitlehover");
                        self.menuContainer.hide();
                    })

                    $('.home').click(function () {

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
                this.loadHead();
                this.loadMenus();

                if (this.model.homepage != null) {
                    this.model.homepage.params = [this.model.homepage.Id];
                    this.loadPage(this.model.homepage);
                    this.homePage = this.pages[this.model.homepage.Id];
                    currentPage = this.homePage;
                }

                var redirectPageId = utils.getURLParameter("pageId");
                var websiteId = utils.getURLParameter("websiteId");

                if (redirectPageId != null && redirectPageId.length && websiteId != null && websiteId == provider.Profile.websiteId) {
                    var isExist = false
                    $.each(this.pages, function (id, page) {
                        if (page.Id === redirectPageId) {
                            currentPage = page;
                            isExist = true;
                        }
                        else
                            page.hide();
                    });


                    if (isExist === false) {
                        var pageInfo = this.searchPageInfo(this.model.menus, redirectPageId);
                        if (pageInfo != null) {
                            this.loadPage(pageInfo);
                            currentPage = this.pages[pageInfo.Id];
                        }
                    }

                }

                if (currentPage != null)
                    currentPage.display();
            },
            loadHead: function () {
                var self = this;
                if (this.model.name && this.model.name.length) {
                    var title = $("#" + this.Id).find('.portalname');
                    title.html(this.model.name)
                }

                var userName = $('#' + this.Id).find('span.navbar-user');
                userName.html(provider.Profile.displayName);

                if (provider.Profile.websites.length > 1) {
                    $('.portaltitle').find('.glyphicon-triangle-bottom').show();

                    var dropdown = $('.portaltitle').find('.dropdown');
                    var websitemenus = $('.portaltitle').find('.dropdown-menu');

                    if (websitemenus.length == 0) {
                        dropdown.append('<ul class="dropdown-menu websitemenus"></ul>');
                        websitemenus = $('.portaltitle').find('.dropdown-menu');
                        provider.Profile.websites.forEach(function (website, index) {
                            var divHtml = '<div class="websitename" ' + (index == 0 ? 'style="border:none">' : ">");
                            websitemenus.append('<li name="' + website.Id + '">' + divHtml + '<div style="margin-left:20px"><span>' + website.Name + '</span></div></div></li>')
                        });
                    }

                    var websitelist = $("#" + this.Id).find('.websitename').parent();
                    websitelist.click(function () {
                        var websiteId = $(this).attr('name');
                        if (websiteId != null && websiteId !== '') {
                            if (provider.Profile.websiteId !== websiteId) {
                                provider.Profile.websiteId = websiteId;
                                $.each(self.pages, function (id, page) {
                                    if (page)
                                        page.hide();
                                });
                                self.display();
                                $("#" + self.Id).find(".portal-selectedmenus").empty();
                            }

                        }
                    });

                }
            },
            toggleMenu: function (elm) {

                if (elm.hasClass('portaltitlehover'))
                    this.menuContainer.hide();
                else
                    this.menuContainer.show();

                $('#' + this.Id).find('.portaltitlehover').removeClass("portaltitlehover");

                if (this.menuContainer.is(':visible')) {
                    elm.addClass("portaltitlehover");
                }

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
            generateMenus: function (menus, parentId, callback, self) {
                var elm = '';
                if ($.isArray(menus) == false)
                    return;

                menus.forEach(function (menu) {
                    elm = elm + "<li><a><i class='" + menu.icon + "'></i>" + menu.text + "</a></li>";
                });

                var container = $(".menucontainer").find(".menu");
                container.html(elm);

                menus.forEach(function (menu) {
                    menu.page.params = [menu.page.Id];
                    self.loadPage(menu.page);
                });

                var submenuscontainer = $("#" + self.Id).find(".portal-selectedmenus");
                var parentElm = parentId == null ? $('.menusbutton') : submenuscontainer.find("[name=" + parentId + "]");

                $('.menu li').click(function () {
                    var index = $(this).index();

                    var menuPage = menus[index].page;
                    if (menuPage != null && menuPage.url != null) {
                        if (self.homepage != null && menuPage.type == 0)
                            self.homePage.hide();

                        $.each(self.pages, function (pageId, page) {
                            if (page && pageId === menuPage.Id) {
                                page.display();
                                self.toggleMenu(parentElm);
                            }
                            else
                                if (page && menuPage.type == 0)
                                    page.hide();

                        });

                    }

                    //open html page in new tab
                    if (menuPage.type == 1)
                        return;

                    var title = menus[index].text;

                    var submenu = '<td name="' + menus[index].id + '" ><span class="menuitem ' + (menus[index].menus == null || menus[index].menus.length == 0 ? ' hidden-xs' : '') + '"><span class="menustext"' + ($(window).width() < 768 ? ' style="width:70px"' : '') + '>' + title + '</span>';
                    submenu += menus[index].menus == null || menus[index].menus.length == 0 ? "</td>" : '<span class="caret" style="margin-bottom:10px;margin-right:5px"></span></span></td>'

                    if (parentId == null)
                        submenuscontainer.html(submenu);
                    else {
                        if (parentElm.length > 0) {
                            $(parentElm).nextAll().remove();
                            submenuscontainer.append(submenu);

                        }
                        else {
                            submenuscontainer.html(submenu);
                        }

                    }


                    var submenus = menus[index].menus;

                    if (submenus != null && submenus.length > 0) {
                        var menuItem = submenuscontainer.find("[name=" + menus[index].id + "]");
                        menuItem.click(function () {
                            var id = menuItem.attr('name');
                            callback(submenus, id, callback, self);
                            self.toggleMenu(menuItem);
                        });

                        self.toggleMenu(parentElm);
                        menuItem.click();
                    }
                });

            },
            loadMenus: function () {
                var menu = this.model.menus;
                var self = this;
                this.generateMenus(menu, null, this.generateMenus, self);
            },
            displayHomepage: function () {
                if (this.homePage)
                    this.homePage.display();
            },
            initLocale: function () {
                var self = this;
                utils.initLocale(provider.session.locale, function () {
                    var items = $('#' + self.Id).find('.langs-switch a');
                    items.click(function (e) {
                        e.preventDefault();
                        console.log('select language ' + $(this).data('locale'));
                        provider.session.currentLang = $(this).data('locale');
                        utils.localize('#' + self.Id, provider.session.currentLang);
                        if (self.curPage != null)
                            self.curPage.replace();
                    })
                })

            }
        });

        provider.kendo.ListView = basepage.extend({
            init: function (id, model, containerselector, template) {
                var pageTemplate = template != null ? template : { html: '<div class="listview"></div> <div class="listviewpager"></div>' };
                this._super(id, model, pageTemplate, containerselector);
            },
            _afterLoadData: function (data) {
                this.model.data = data ? data : this.model.data;
                var dataSource = new kendo.data.DataSource({
                    data: this.model.data,
                    pageSize: this.model.pageSize,
                    schema: this.model.schema
                });

                if (this.model.pageSize) {
                    var pager_elm = $('#' + this.Id).find('.listviewpager');
                    var pager = $(pager_elm).data("kendoPager");
                    pager.setDataSource(dataSource);
                }


                var lv_elm = $('#' + this.Id).find('.listview');
                var listView = $(lv_elm).data("kendoListView");
                listView.setDataSource(dataSource);

                var height = $(document).height() - $(".nav").height() - 29;
                var width = $(this.selector).width();
                var count = Math.ceil(this.model.data.length / 2);
                this.itemheight = this.itemheight ? this.itemheight : this.model.data.length > 0 ? height / count - 26 * count : height;
                this.itemwidth = this.model.data.length > 0 ? width / 2 - 22 : width;
                var item_widthpctage = (this.itemwidth < 400 ? 98 : this.itemwidth / width * 100) + '%'

                var items = $('#' + this.Id).find('.item');
                items.height(this.itemheight);
                items.width(item_widthpctage);
                $(lv_elm).css("border", 'none');
            },
            _getItemTemplate: function (callback) {
                var self = this;
                if (self.model.itemTemplate.html == null && self.model.itemTemplate.url)
                    utils.getTemplate(self.model.itemTemplate.url, function (html) {
                        self.model.itemTemplate.html = html;
                        if (self.model.itemEditTemplate != null && self.model.itemEditTemplate.Id != null)
                            utils.getTemplate(self.model.itemEditTemplate.url, function (html) {
                                self.model.itemEditTemplate.html = html;
                                callback();
                            });
                        else
                            callback();
                    }, self.model.itemEditTemplate.Id)
                else if (self.model.itemTemplate.Id != null) {
                    self.model.itemTemplate.html = kendo.template($("#" + self.model.itemTemplate.Id).html());

                    if (self.model.itemEditTemplate != null && self.model.itemEditTemplate.Id != null)
                        self.model.itemEditTemplate.html = kendo.template($("#" + self.model.itemEditTemplate.Id).html());

                    callback();

                }

            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this.model.selectable = this.model.selectable && typeof this.model.selectable != 'undefined' ? this.model.selectable : false;
                this._super(function () {
                    var dataSource = new kendo.data.DataSource({
                        data: self.model.data,
                        pageSize: self.model.pageSize,
                        schema: self.model.schema
                    });

                    if (self.model.pageSize && typeof self.model.pageSize != 'undefined') {
                        var pager = $('#' + self.Id).find('.listviewpager');
                        if (pager.length)
                            pager.kendoPager({
                                dataSource: dataSource
                            });
                    }

                    self._getItemTemplate(function () {
                        var listView = $('#' + self.Id).find('.listview');
                        if (listView.length)
                            listView.kendoListView({
                                dataSource: dataSource,
                                selectable: self.model.selectable,
                                template: self.model.itemTemplate.html,
                                editTemplate: self.model.itemEditTemplate.html
                            });

                        if ($.isFunction(callback))
                            callback();
                    });

                }, isReplace);
            },
            _loadItem: function () {
                console.info('load item');
                var items = $('#' + this.Id).find('.item');
                for (i = 0; i < items.length; i++) {
                    $(items[i]).attr('id', "#" + this.Id + '_item_' + i);
                }
            },
            _getListView: function () {
                var listView = $('#' + this.Id).find('.listview');
                return listView.data("kendoListView");
            },
            bindEvent: function (eventname, handle) {
                var listView = this._getListView();
                listView.bind(eventname, handle);
            },
            _getGrid: function () {
                var grid = $("#" + this.Id).find('.grid');
                return grid.data("kendoGrid");
            },
            _getColumn: function (field) {
                var grid = this._getGrid();
                if (grid == null)
                    return null;

                var column = $.grep(grid.columns, function (col) {
                    return col.field == field;
                })

                return (column.length > 0 ? column[0] : null);

            },
            setColumnEditor: function (field, handle) {
                var col = this._getColumn(field);
                if (col == null) {
                    console.warn("Fails to get column")
                    return;
                }

                if ($.isFunction(handle))
                    col.editor = handle;
            },
            setEditMode: function (editable, selector) {
                var btns = $('#' + this.Id).find(".listview").find("a.k-button");
                if (editable)
                    btns.show();
                else
                    btns.hide();

            }
        });

        provider.kendo.GridDashboard = provider.kendo.ListView.extend({
            init: function (id, model, containerselector, template) {
                model.itemTemplate = template == null ? { html: '<div class="item" ><div class="gridtitle"><p style="padding-top:10px;">#:Title#</P></div><div class="grid" style="height:100%;" ></div></div>' } : template;
                model.selectable = false;
                this._super(id, model, containerselector);
            },
            _loadItem: function () {
                this._super();
                var gridlist = $('#' + this.Id).find('.grid');
                var index = 0;

                for (i = 0; i < gridlist.length; i++) {
                    var gridData = this.model.data[i].items;

                    $(gridlist[i]).kendoGrid({
                        dataSource: {
                            data: gridData
                        },
                        height: this.model.gridHeight,
                        filterable: false,
                        sortable: true,
                        columns: this.model.data[i].columns
                    });

                    index++;
                }
            },
            _afterLoadData: function (data) {
                this._super(data);

                var gridlist = $('#' + this.Id).find('.grid');
                var items = $('#' + this.Id).find('.item');
                var itemElm = $('#' + this.Id).find("#" + this.Id + '_item_' + 0);

                if (itemElm.length == 0) {
                    this._loadItem();
                }
                else {
                    for (i = 0; i < gridlist.length; i++) {

                        var gridData = this.model.data[i].items;
                        var grid = $(gridlist[i]).data("kendoGrid");
                        datasource = new kendo.data.DataSource({
                            data: gridData
                        });
                        grid.setDataSource(datasource);
                        grid.refresh();
                    }
                }
            },
            convertLocaleModel: function () {
                var self = this;
                this.model.data.forEach(function (dataItem, i) {
                    self.getItemLabels(dataItem, 'Title', self.defaultModel.data[i]);
                    self.getItemLabels(dataItem.columns, 'title', self.defaultModel.data[i].columns);
                })
            }
        });

        provider.kendo.ListPage = basepage.extend({
            init: function (id, model, containerselector, template) {
                this.buttonContainer = null;
                //this.containerId = containerId;
                var pageTemplate = template != null ? template : { Id: "listpage" };
                this._super(id, model, pageTemplate, containerselector);
                if (this.model.gridOptions != null && this.model.gridOptions.dataSource == null)
                    this.model.gridOptions.dataSource = { data: [], pageSize: 10 };
            },
            _handleTemplate: function (templateHtml) {
                var template = kendo.template(templateHtml);
                return template(this.model);
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                self.model.filters = self.model.filters == null ? [] : self.model.filters;
                self.model.conditions = self.model.conditions == null ? [] : self.model.conditions;

                this._super(function () {
                    var curPage = $("#" + self.Id);
                    curPage.addClass("listpage");
                    //create list
                    var grid = $("#" + self.Id).find('.grid');

                    if (grid.length > 0 && self.model.gridOptions != null) {
                        var gridheight = window.innerHeight - grid[0].getBoundingClientRect().top - 80 - (self.model.filters.length > 0 ? 32 : 0);
                        self.model.gridOptions.height = gridheight;
                        self.model.gridOptions.edtiable = false;
                        //server paging
                        if (self.handlers.loadDataServerHandler != null) {
                            self.model.criterias = [];
                            if ($.isFunction(self.handlers.initFilter))
                                self.handlers.initFilter();
                            else if (!$.isArray(self.model.filterConditions))
                                self.model.filterConditions = [];

                            if (self.model.gridOptions.dataSource.serverPaging == true) {
                                if (self.model.gridOptions.dataSource.schema == null)
                                    self.model.gridOptions.dataSource.schema = {
                                        data: "data",
                                        total: "total"
                                    };
                                self.model.dataSourceField = self.model.gridOptions.dataSource.schema.data;
                            }
                            self.model.gridOptions.dataSource.transport = {
                                read: self.handlers.loadDataServerHandler
                            };

                            if (self.model.gridOptions.sortable === true) {
                                self.model.gridOptions.dataSource.serverSorting == true;
                                self.model.gridOptions.sort = function (e) {
                                    /* The result can be observed in the DevTools(F12) console of the browser. */
                                    console.log(e.sort.field);
                                    /* The result can be observed in the DevTools(F12) console of the browser. */
                                    console.log(e.sort.dir);
                                    self.model.sorting = {
                                        orderBy: e.sort.field,
                                        isAscending: e.sort.dir == "asc"
                                    }
                                }
                            }


                            if (self.model.gridOptions.filterable === true) {
                                self.model.gridConditions = [];
                                self.model.gridOptions.dataSource.serverFiltering = true;
                                self.model.gridOptions.filter = function (e) {
                                    if (e.filter == null) {
                                        console.log("filter has been cleared");
                                        //self.model.criterias.length = 0;
                                        self.model.gridConditions.length = 0;
                                    } else {
                                        /* The result can be observed in the DevTools(F12) console of the browser. */
                                        console.log(e.filter);
                                        self.searcher._reset();
                                        var filters = [];
                                        filters.push({ field: e.filter.filters[0].field, operator: e.filter.filters[0].operator, value: e.filter.filters[0].value })
                                        if ($.isFunction(self.handlers.filterDataTransform))
                                            self.handlers.filterDataTransform(filters[0]);

                                        self.model.gridConditions = filters;
                                    }
                                }
                            }

                        }


                        grid.kendoGrid(self.model.gridOptions);
                    } else
                        console.error("fails to define grid options");


                    //create advanced Searcher control
                    if (self.model.conditions != null && self.model.conditions.length > 0) {
                        var container = $('#' + self.Id).find(".searcher");
                        self.searcher = new provider.kendo.AdvancedSearcher(self.model.conditions, self.model.queries, container, self.model.data);
                        if ($.isFunction(self.handlers.loadDataServerHandler)) {
                            self.searcher.search = function (filters) {
                                //self.model.criterias = filters;
                                self.model.queryConditions = filters;
                                var gridWidget = grid.data("kendoGrid");
                                gridWidget.dataSource.read();
                            }
                        }

                        self.searcher.onSearch(function (data) {
                            self.refreshgridData(data);
                        });

                        self.searcher.setDataTransformHandler(self.handlers.filterDataTransform);
                    }

                    //create buttons
                    if (self.model.buttons && self.model.buttons.length) {
                        self.buttonContainer = $("#" + self.Id).find('.clearfix.buttonmenu');
                        var container = self.buttonContainer;
                        var i = 0;
                        var btnId = self._getPrefix("_btn_");

                        var buttonList = '';
                        self.model.buttons.forEach(function (menu) {
                            buttonList += '<li id="' + btnId + i + '" ' + (menu.id != null ? ('name="' + menu.id + '" ') : '') + '><span class="fa ' + menu.name + '"></span>' + menu.text + '</li>';

                            i++;
                        });

                        if (buttonList.length)
                            container.append(buttonList);

                        var index = 0
                        self.model.buttons.forEach(function (item) {
                            self._bindNavigation(item);
                            self._bindButton(index);
                            if (item.visible && item.visible === "false") {
                                var btnId = self._getPrefix("_btn_") + index;
                                $("#" + btnId).hide();
                            }

                            index++;
                        });

                    }

                    //create filter
                    if (self.model.filters && self.model.filters.length) {
                        var filterContainter = $("#" + self.Id).find('.filter');
                        var i = 0;
                        var count = self.model.filters.length;
                        var prefix = self._getPrefix('_filter_');

                        self.model.filters.forEach(function (filter) {
                            var id = prefix + i;
                            var input = '<input id="' + id + '"'+ (filter.id!=null?('name="'+filter.id+'"'):'') +' style="width:' + filter.width + ';border-style:none" />';
                            if (i < count - 1)
                                input = input + '|';
                            filterContainter.append(input);

                            var dropdownlist = $("#" + id).kendoDropDownList({
                                dataTextField: "text",
                                dataValueField: "value",
                                dataSource: filter.items,
                                index: 0
                            }).data("kendoDropDownList");
                            self._bindFilter(i);

                            if (filter.select) {
                                dropdownlist.select(filter.select);
                                dropdownlist.trigger("change");
                            }

                            i++;

                        });
                    }

                    if ($.isFunction(callback))
                        callback(self);
                }, isReplace);

            },
            show: function () {
                $("#" + this.Id).show();
                $.each(this.pages, function (index, page) {
                    if (page)
                        page.hide();
                });

                if (this.searcher.query.length > 0)
                    this.searcher.show();
            },
            hide: function () {
                $("#" + this.Id).hide();
                var self = this;
                $.each(this.pages, function (index, page) {
                    if (page)
                        page.hide();
                });

            },
            _afterLoadData: function (data) {
                this.model.data = data ? data : this.model.data;
                if (this.model.data == null)
                    return;

                if ($.isFunction(this.handlers.loadDataServerHandler))
                    this.readGridData();
                else {
                    this.refreshgridData(data);

                    if (this.searcher != null)
                        this.searcher.setData(data);
                }
            },
            onButtonClick: function (index, handler) {
                if (!$.isFunction(handler)) {
                    console.warn('onButtonClick: invalid function handler');
                    return;
                }
                if ($.isFunction(handler) && index < this.model.buttons.length)
                    this.model.buttons[index].click = handler;
            },
            onButtonClickById: function (id, handler) {
                if (!$.isFunction(handler)) {
                    console.warn('onButtonClickById: invalid function handler');
                    return;
                }
                var btn = $.grep(this.model.buttons, function (item) {
                    return item.id == id;
                })
                if (btn.length > 0) {
                    btn.forEach(function (button) {
                        button.click = handler;
                    })
                }
                else
                    console.error("fails to set button handler due to invalid button Id")
            },
            onFilter: function (index, handler) {
                if (!$.isFunction(handler)) {
                    console.warn('onFilter: invalid function handler');
                    return;
                }
                if ($.isFunction(handler) && this.model.filters.length > index)
                    this.model.filters[index].change = handler;
            },
            onFilterById: function (id, handler) {
                if (!$.isFunction(handler)) {
                    console.warn('onFilterById: invalid function handler');
                    return;
                }
                var filters = $.grep(this.model.filters, function (item) {
                    return item.id == id;
                });
                if (filters.length > 0) {
                    filters.forEach(function (filter) {
                        filter.change = handler;
                    })
                }
                else
                    console.error('Fails to set filter handler due to invalid id');

            },
            _bindButton: function (index) {

                if (this.defaultModel.buttons[index].name.search("search") > -1) {
                    var self = this;
                    var searchArea = $('#' + this.Id).find('div[name="search"]');

                    if (searchArea.length) {
                        var id = '#' + this._getButtonId(index);
                        var btn = $(id);
                        if (!btn.hasClass("search"))
                            btn.addClass("search");
                        self.model.buttons[index].click = function () {
                            searchArea.toggle();
                        };
                    }
                       
                }

                if (this.model.buttons[index].click) {
                    var id = '#' + this._getButtonId(index);
                    var self = this;
                    var btn = $(id);

                    if (btn.length) 
                        btn.click(function () {
                            var page = null;
                            if (self.model.buttons[index].page && typeof self.model.buttons[index].page != 'undefined') {
                                self.hide();
                                if (self.model.buttons[index].page.Id && typeof self.model.buttons[index].page.Id != 'undefined')
                                    page = self.pages[self.model.buttons[index].page.Id];
                            }
                            console.log("%c button " + self.model.buttons[index].text + " (index:" + index + ")" + " clicked", "color:blue");
                            self.model.buttons[index].click(page);
                        });    
                }
            },
            _bindFilter: function (index) {

                if (this.model.filters[index].change) {
                    var id = "#" + this._getfilterId(index);
                    if ($(id).length) {
                        var dropdownlist = $(id).data("kendoDropDownList");
                        var self = this;
                        dropdownlist.bind("change", this.model.filters[index].change);
                    }
                }
            },
            _getButtonId: function (index) {
                return this._getPrefix('_btn_') + index;
            },
            _getButton: function (id) {
                var btnIndex = -1;
                this.model.buttons.forEach(function (button, index) {
                    if (button.id == id && btnIndex < 0)
                        btnIndex = index;
                })

                return $('#' + this._getButtonId(btnIndex));
            },
            _getfilterId: function (index) {
                return this._getPrefix('_filter_') + index;
            },
            _getfilter: function (id) {
                var filterIndex = -1;
                this.model.filters.forEach(function (filter, index) {
                    if (filter.id == id && filterIndex < 0)
                        filterIndex = index;
                })
                var dropdown = $('#' + this._getfilterId(filterIndex));
                return dropdown;
            },
            _getPrefix: function (prefix) {
                return this.Id + prefix;
            },
            _bindNavigation: function (item) {

                if (item.page != null && this.pages[item.page.Id] == null) {
                    if (item.page.Id.search(this.Id) != 0)
                        item.page.Id = this.Id + "-" + item.page.Id;
                    var params = [item.page.Id, this.selector];
                    item.page.params = $.isArray(item.page.params) ? $.merge(params, item.page.params) : params;
                    this.loadPage(item.page);
                }
            },
            _getGrid: function () {
                var grid = $("#" + this.Id).find('.grid');
                return grid.data("kendoGrid");
            },
            refreshgrid: function (columns, data) {
                this.model.gridOptions.columns = columns;
                this.model.data = data;
                var grid = $("#" + this.Id).find('.grid');
                var options = grid.data("kendoGrid").options;
                options.columns = this.model.gridOptions.columns;
                //grid.empty();
                //grid.kendoGrid(options);
                grid.setOptions(this.model.gridOptions);
                this.refreshgridData(data);
            },
            refreshFilter: function (index, options) {
                var ddlId = this._getfilterId(index);
                var ddlElm = $('#' + this.Id).find("#" + ddlId);
                if (ddlElm.length > 0) {
                    var ddl = ddlElm.data("kendoDropDownList");
                    ddl.setDataSource(options)
                } else {
                    console.warn('cannot find filter');
                }

            },
            getValueofFilter: function (index) {
                var ddlId = this._getfilterId(index);
                var ddlElm = $('#' + this.Id).find("#" + ddlId);
                if (ddlElm.length > 0) {
                    var ddl = ddlElm.data("kendoDropDownList");
                    return ddl.value();
                } else
                    return null;
            },
            getValueofFilterById: function (id) {
                var ddlElm = this._getfilter(id);
                if (ddlElm.length > 0) {
                    var ddl = ddlElm.data("kendoDropDownList");
                    return ddl.value();
                } else
                    return null;

            },
            getSelectedRow: function () {
                var grid = this._getGrid();
                var rows = grid.select();

                if (rows.length < 2)
                    return grid.dataItem(rows);
                else {
                    var items = [];
                    $(rows).each(function () {
                        items.push(grid.dataItem($(this)));
                    });
                    return items;
                }
            },
            refreshgridData: function (data) {
                var grid = this._getGrid();
                grid.dataSource.data(data);
            },
            readGridData: function (data) {
                var grid = this._getGrid();
                grid.dataSource.read();
            },
            setButtonVisible: function (index, isVisible) {
                isVisible = isVisible == null ? true : isVisible;

                var buttonId = this._getButtonId(index);
                var button = $('#' + this.Id).find("#" + buttonId);
                if (button && button.length) {
                    if (isVisible == false)
                        button.hide();
                    else
                        button.show();
                }
            },
            setButtonVisibleById: function (id, isVisible) {
                var button = this._getButton(id);
                if (button.length > 0) {
                    if (isVisible == false)
                        button.hide();
                    else
                        button.show();
                } else
                    console.warn('cannot find button with id:' + id);
            },
            convertLocaleModel: function () {
                var self = this;
                this.getLocaleLabels('title');
                this.getLocaleLabels('buttons', 'text');

                this.model.filters.forEach(function (filter, index) {
                    var defaultFilterItems = self.defaultModel.filters[index].items;
                    self.getItemLabels(filter.items, 'text', defaultFilterItems);
                })

                this.getLocaleLabels('conditions', 'title');

                this.getItemLabels(this.model.gridOptions.columns, 'title', this.defaultModel.gridOptions.columns);
            },
            _addCondition: function (fieldName, operator, value, dataType, joinoperator) {
                var item = {
                    field: fieldName,
                    operator: operator,
                    value: value,
                    valueType: dataType,
                    joinoperator: joinoperator
                }

                return item;
            },
            addFilterCondition: function (fieldName, operator, value, dataType, joinoperation) {
                dataType = dataType == null ? "string" : dataType;
                if (!$.isArray(this.model.filterConditions))
                    this.model.filterConditions = [];

                var item = this._addCondition(fieldName, operator, value, dataType, joinoperation);
                this.model.filterConditions.push(item);
            },
            setInitFilterHandler: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.initFilter = handler;
            },
            addPrecondition: function (fieldName, operator, value, dataType, joinoperation) {
                dataType = dataType == null ? "string" : dataType;
                operator = operator == null ? "=" : operator;

                if (!$.isArray(this.model.preconditions))
                    this.model.preconditions = [];
                var item = this._addCondition(fieldName, operator, value, dataType, joinoperation);
                this.model.preconditions.push(item);
            },
            _mergeCriterias: function (source, target) {
                if (!$.isArray(source) || source.length == 0)
                    return target;

                var item = target.length > 0 ? {
                    joinoperator: "And",
                    Criterias: source
                } : source;

                if ($.isArray(item))
                    target = $.merge(target, item);
                else
                    target.push(item);
                return target;
            },
            setLoadDataHandler: function (handler, service) {
                if ($.isFunction(handler) == false)
                    return;

                this.service = service;
                if (this.model.gridOptions != null &&
                    (this.model.gridOptions.dataSource.serverPaging == true
                        //|| this.model.gridOptions.dataSource.serverGrouping == true
                        || this.model.gridOptions.dataSource.serverFiltering == true
                        || this.model.gridOptions.dataSource.serverSorting == true)) {
                    var self = this;
                    this.handlers.loadDataServerHandler = function (options) {
                        console.log('Grid Options', options)

                        var criterias = $.isArray(self.model.preconditions) ? $.grep(self.model.preconditions, function (item) {
                            return true;
                        }) : [];

                        self.model.criterias = $.isArray(self.model.criterias) ? self.model.criterias : [];
                        self.model.criterias.length == 0;

                        criterias = self._mergeCriterias(self.model.criterias, criterias);
                        criterias = self._mergeCriterias(self.model.filterConditions, criterias);
                        criterias = self._mergeCriterias(self.model.queryConditions, criterias);
                        criterias = self._mergeCriterias(self.model.gridConditions, criterias);

                        options.data.criterias = criterias;
                        options.data.pageSize = self.model.gridOptions.dataSource.pageSize;
                        if (self.model.sorting != null) {
                            options.data.orderBy = self.model.sorting.orderBy;
                            options.data.isAscending = self.model.sorting.isAscending;
                        }

                        handler(options.data, function (result) {
                            var data = self.model.dataSourceField == null ? result : result[self.model.dataSourceField];
                            if ($.isFunction(self.handlers.loadCompletedHandler))
                                self.handlers.loadCompletedHandler(data);
                            console.log('list page data', result);
                            self.model.data = data;

                            // if (self.searcher.query.length == 0)
                            //   self.model.criterias.length = 0;

                            options.success(result);
                        }, function (result) {
                                self.model.data = [];
                                options.error(result);
                                console.error('loading server paging data fails')
                        })
                    }
                }
                else
                    this.handlers.loadDataHandler = handler;
            },
            setFilterDataTransformHandler: function (handler) {
                if ($.isFunction(handler)) {
                    this.handlers.filterDataTransform = handler;
                }
            },
            setEditMode: function (editable, selector) {
                selector = selector == null ? "" : selector.replace(this._pagename, "").replace(":", "");
                var btn = selector.length == 0 ? $('#' + this.Id).find(".buttonmenu").find("li:not(.search)") : $('#' + this.Id).find("li[id*='" + selector + "'],li[name='" + selector + "']");
                if (btn.length > 0) {
                    if (editable)
                        btn.show();
                    else
                        btn.hide();
                }
                var filter = selector.length == 0 ? $('#' + this.Id).find(".filter").find("input") : $('#' + this.Id).find("input[id*='" + selector + "'],input[name='" + selector + "']");
                for (var i = 0; i < filter.length; i++) {
                    var ddl = $(filter[i]).data("kendoDropDownList");
                    if (ddl != null)
                        ddl.enable(editable);
                }               
            }
        })

        provider.kendo.WorkflowPage = basepage.extend({
            init: function (id, model, containerselector, template) {
                var pageTemplate = template == null ? { Id: "pagedetail" } : template;
                this._super(id, model, pageTemplate, containerselector);
                this.observable = null;
            },
            _afterLoadData: function (data) {
                var self = this;

                this.model.data = data != null ? data : this.model.data;
                var observableData = { headers: [], data: this.model.data };

                if (this.model.headers != null && this.model.headers.length && this.model.data != null) {
                    //self.observable.headers.length = 0;
                    this.model.headers.forEach(function (header) {
                        var value = self.model.data[header.field] != null ? self.model.data[header.field] : null;
                        observableData.headers.push({ title: header.title, value: value });
                    })
                }

                if (self.observable == null) {
                    self.observable = kendo.observable(observableData);
                    kendo.bind($("#" + self.Id), self.observable);
                }
                else {

                    self.rebindData(self.model.data);
                }

                self._loadDataForChildPage(self.model.navigation, data);
                self.model.content.forEach(function (content) {
                    self._loadDataForChildPage(content.items, data);
                })

                this.setFlag(this.model.step);
                self._displayContentPage();

            },
            _loadDataForChildPage: function (items, data) {
                var self = this;
                if (!$.isArray(items)) {
                    console.warn('loadDataForChildPage error: first parameters should be array');
                    return;
                }

                data = utils.cloneModel(data);
                items.forEach(function (item) {
                    if (item.page != null && item.page.Id != null && item.page.url != null) {
                        var dataSource = null;
                        var page = self.pages[item.page.Id];
                        if (item.dataSourceField != null) {
                            dataSource = $.isArray(item.dataSourceField) ? {} : (item.dataSourceField.length > 0 ? data[item.dataSourceField] : data);
                            if ($.isArray(item.dataSourceField)) {
                                item.dataSourceField.forEach(function (fieldname) {
                                    dataSource[fieldname] = data[fieldname];
                                })
                            }
                        }

                        if (!$.isFunction(page.handlers.loadDataHandler)) {
                            page.model.data = dataSource == null ? data : dataSource;
                            page.setData(page.model.data);
                        }

                    }
                })

            },
            _displayContentPage: function (isReplace) {
                var self = this;
                isReplace = isReplace == null ? false : isReplace;
                if (self.model.content == null)
                    return;

                self.model.content.forEach(function (area) {
                    area.items.forEach(function (item) {
                        if (item.type === 'page' && item.page != null) {
                            var pg = self.pages[item.page.Id];

                            if (pg != null) {
                                if ($.isArray(item.page.displayParamFields)) {
                                    var displayParams = [];
                                    item.page.displayParamFields.forEach(function (fieldName) {
                                        if (self.model.data != null)
                                            displayParams.push(self.model.data[fieldName]);
                                    });

                                    if (isReplace)
                                        pg.replace.apply(pg, displayParams);
                                    else
                                        pg.display.apply(pg, displayParams);
                                } else {
                                    if (isReplace)
                                        pg.replace();
                                    else
                                        pg.display();
                                }
                            }

                        }

                    })
                });


            },
            _createContent: function () {
                var self = this;
                //create content
                if (self.model.content != null) {
                    var areaIndex = 0;
                    self.model.content.forEach(function (area) {
                        if (area.items.length) {
                            var id = self.Id + '_content_' + areaIndex;
                            var html = '<div id=' + id + ' class="content"><div class="area"><div></div>';

                            if (area.title != null && area.title.length)
                                html = '<div id=' + id + ' class="content"><h2><span class="fas fa-sort-down" style="margin-right:5px"></span>' + area.title + '</h2><br /><div class="area"><div></div>'

                            $('#' + self.Id).append(html);

                            var btnCollapse = $('#' + id).find('span.fas');
                            var divContent = $('#' + id).find('.area');
                            btnCollapse.click(function () {
                                divContent.toggle();

                                if (divContent.is(":visible")) {
                                    $(this).removeClass("fa-caret-right");
                                    $(this).addClass("fa-sort-down");
                                }
                                else {
                                    $(this).removeClass("fa-sort-down");
                                    $(this).addClass("fa-caret-right");
                                }
                            })

                            var itemNum = 0;
                            area.items.forEach(function (item) {
                                var colLenght = area.columnLength == null ? 3 : area.columnLength;
                                var colNum = itemNum % colLenght;
                                var colClass = 'col-xs-' + 12 / colLenght;

                                if (colNum === 0) {
                                    var areaHtml = '';
                                    for (i = 0; i < colLenght; i++) {
                                        var width = 98 / colLenght;
                                        areaHtml += '<div class="' + colClass + '" style="width:' + width + '%"></div>';
                                    }

                                    divContent.append('<div class="row">' + areaHtml + '</div>');
                                }


                                var row = divContent.find('div.row').last();

                                switch (item.type) {
                                    case 'databind':
                                        var html = '';
                                        item.items.forEach(function (obj) {
                                            html += '<span class="textbox" style="width:100%"><label>' + obj.title + ':</label><input type="text" data-bind="value:data.' + obj.field + '"  disabled></input></span>';
                                        })
                                        var elm = row.find('.' + colClass).eq(colNum);
                                        elm.append("<div>" + html + "</div>");
                                        break;
                                    case 'page':
                                        var selector = $(row.find('.' + colClass)[colNum]);
                                        self._loadChildPage(item.page, selector);
                                        break;
                                }

                                itemNum++;
                            })
                        }

                        areaIndex++;
                    });

                }

            },
            _handleTemplate: function (templateHtml) {
                var template = kendo.template(templateHtml);
                return template(this.model);
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {
                    var curPage = $("#" + self.Id);
                    curPage.addClass("pagedetail");

                    if (self.model.toolBarItems != null) {
                        var toolbar = $("#" + self.Id).find('.toolbar');
                        if (toolbar.length)
                            toolbar.kendoToolBar({
                                resizable: false,
                                items: self.model.toolBarItems
                            });

                    }

                    //create navigation
                    var navigation = $("#" + self.Id).find('.clearfix.navigation');

                    if (navigation.length) {

                        var pageIndex = 0;
                        var pagesContainer = $("#" + self.Id).find(".pages");

                        if (self.model.navigation != null && self.model.navigation.length) {
                            self.model.navigation.forEach(function (step) {

                                var stepId = self._getNavigationMenuId(pageIndex);
                                var elm = "<li id='" + stepId + "' " + (step.visible == false ? " style='display:none' " : "") + (pageIndex === 0 ? "class='active' >" : ">") + "<span class='fa' style='margin-right:5px'></span>" + step.text + "<i class='arrow'></i></li>";
                                navigation.append(elm);

                                if (pagesContainer.length) {
                                    var pageId = self._getPageId(pageIndex);
                                    var pageHtml = "<div id='" + pageId + "' class='display-hide clearfix'></div>"
                                    pagesContainer.append(pageHtml);
                                    self._loadChildPage(step.page, "#" + pageId);
                                }

                                pageIndex++;
                            });

                            pagesContainer.append("<div style='display: flex;justify-content: space-between;margin-top:10px'><span></span><span class='k-icon k-i-expand collapse clearfix'></span></div>")
                            var button = pagesContainer.find(".collapse");
                            button.click(function () {
                                $.each(self.pages, function (id, page) {
                                    var elm = pagesContainer.find('#' + page.Id);
                                    if (elm.length)
                                        page.hide();
                                })

                                button.hide();
                            })

                            self._bindPageClick();
                            pagesContainer.show();
                        }
                        else {
                            pagesContainer.hide();
                        }

                    }


                    var itemIndex = 0
                    if (self.model.toolBarItems != null)
                        self.model.toolBarItems.forEach(function (item) {
                            var toolbar = $('#' + self.Id).find('.toolbar');

                            if (item.template != null) {
                                var button = toolbar.find('[data-uid]:eq(' + itemIndex + ')');
                                button.click(item.click);
                            }

                            itemIndex++;
                        })


                    self._createContent();

                    if ($.isFunction(callback)) {
                        callback(self);
                    }

                }, isReplace);

            },
            onToolBarItemClick: function (index, handler) {
                if (!$.isFunction(handler)) {
                    console.warn('onToolBarItemClick needs function handler');
                    return;
                }
                var self = this;
                var items = $.grep(this.model.toolBarItems, function (item, itemindex) {
                    return itemindex == index;
                })
                if (items.length == 0) {
                    console.warn("onToolBarItemClick:invalid index");
                    return;
                }

                items.forEach(function (item) {
                    item.click = function () {
                        console.log("%c button (index:" + index + ")" + " clicked", "color:blue");
                        handler();
                    }
                })


            },
            onToolBarItemClickById: function (id, handler) {
                if (!$.isFunction(handler)) {
                    console.warn('onToolBarItemClickById needs function handler');
                    return;
                }

                var self = this;
                var items = $.grep(this.model.toolBarItems, function (item) {
                    return item.id == id;
                })

                if (items.length == 0) {
                    console.warn("onToolBarItemClickById:invalid id");
                    return;
                }

                items.forEach(function (item) {
                    item.click = function () {
                        console.log("%c button (id:" + id + ")" + " clicked", "color:blue");
                        handler();
                    }
                })
            },
            onPageTabClick: function (index, handler) {
                var self = this;
                if ($.isFunction(handler) && this.model.navigation.length > index) {
                    var pageInfo = this.model.navigation[index].page;
                    this.model.navigation[index].click = function () {
                        console.log("%c tab (index:" + index + ")" + " clicked", "color:blue");
                        var page = pageInfo != null ? self.pages[pageInfo.Id] : null;
                        handler(page);
                    }
                }

            },
            onPageTabClickById: function (id, handler) {
                if (!$.isFunction(handler)) {
                    console.warn('onPageTabClickById: invalid function handler');
                    return;
                }
                var self = this;
                var navigations = $.grep(this.model.navigation, function (tab, index) {
                    return tab.id == id;
                });

                if (navigations.length == 0) {
                    console.warn("onPageTabClickById:invalid id");
                    return;
                }
                navigations.forEach(function (tab, index) {
                    if (tab.id == id) {
                        var pageInfo = tab.page;
                        tab.click = function () {
                            console.log("%c tab (id:" + id + ")" + " clicked", "color:blue");
                            var page = pageInfo != null ? self.pages[pageInfo.Id] : null;
                            handler(page);
                        }
                    }
                })

            },
            setFlag: function (index) {
                index = index == null ? 0 : index;
                var steps = $("#" + this.Id).find('.clearfix.navigation >li');
                $("#" + this.Id).find('.clearfix.navigation').find('span.fa').removeClass('fa-bookmark');

                if (steps.length) {
                    var flagIcon = $(steps[index]).find('span.fa');
                    flagIcon.addClass('fa-bookmark');
                    this._displayTabPage(index);
                }
            },
            _displayTabPage: function (index) {
                var defaultTabs = $("#" + this.Id).find(".navigation li");
                if (defaultTabs.length) {
                    var defaultTab = defaultTabs[index];
                    if (defaultTab)
                        defaultTab.click();
                }
            },
            _getHeaderColumnId: function (index) {
                return this.Id + "-header-" + index;
            },
            _getNavigationMenuId: function (index) {
                return this.Id + "-nav-" + index;
            },
            _getPageId: function (index) {
                return this.Id + '-page-' + index;
            },
            _getSummaryId: function (index) {
                return this.Id + '-summary-' + index;
            },
            _loadChildPage: function (page, selector) {
                if (page != null) {
                    var id = page.Id.search(this.Id) != 0 ? (this.Id + "-" + page.Id) : page.Id;
                    var params = [id, selector];
                    page.params = $.isArray(page.params) ? $.merge(params, page.params) : params;
                    this.loadPage(page);
                }

            },
            _getSelectedTabIndex: function () {
                var index = 0;
                var navigation = $("#" + this.Id).find('.clearfix.navigation');
                var tab = navigation.find('.active');

                if (tab && tab.length)
                    index = tab.index();

                return index;
            },
            _bindPageClick: function () {
                var self = this;
                var tab = $("#" + this.Id).find('.navigation li');
                if (tab.length)
                    tab.click(function () {
                        var index = $(this).index();

                        $(this).addClass('active').siblings().removeClass('active');
                        var naviagatinItem = self.model.navigation[index];
                        $("#" + self.Id).find('div.display-hide').hide().eq(index).fadeIn(200);
                        if ($.isFunction(naviagatinItem.click)) {
                            naviagatinItem.click(self);
                        } else {
                            var curPage = self.pages[naviagatinItem.page.Id];
                            if (curPage != null)
                                curPage.display();
                        }

                        self.model.navigation.forEach(function (navItem) {
                            if (navItem.page.Id != naviagatinItem.page.Id && $.isFunction(self.pages[navItem.page.Id].getData))
                                self.pages[navItem.page.Id].model.data = self.pages[navItem.page.Id].getData();
                        })

                        $("#" + self.Id).find(".collapse").show();
                    });
            },
            _setNavigationMenuVisible: function (index, visible) {
                this.model.navigation[index].visible = visible;
                var id = this._getNavigationMenuId(index);
                var elm = $('#' + this.Id).find('#' + id);
                if (visible)
                    elm.show();
                else
                    elm.hide();
            },
            rebindData: function (data) {
                var self = this;
                self.observable.set("data", data);
                var i = 0;
                self.observable.headers.forEach(function (col) {
                    col.set("value", data[self.model.headers[i].field]);
                    i++;
                });
            },
            setButtonVisible: function (name, isVisible) {
                isVisible = isVisible == null ? true : isVisible;
                var buttons = $('#' + this.Id).find('.toolbar').find('div[data-uid]');
                var button = buttons.length == 1 ? buttons : null;

                if (buttons.length > 1)
                    for (i = 0; i < buttons.length; i++) {
                        if ($(buttons[i]).text() == name) {
                            button = $(buttons[i]);
                            if (button != null && button.length) {
                                if (isVisible == false)
                                    button.hide();
                                else
                                    button.show();
                            }
                        }
                    }
            },
            setButtonVisibleByIndex: function (index, isVisible) {
                if (index < 0)
                    return;
                isVisible = isVisible == null ? true : isVisible;
                var button = $('#' + this.Id).find('.toolbar').find('div[data-uid]:eq(' + index + ')');
                if (button != null && button.length) {
                    if (isVisible == false)
                        button.hide();
                    else
                        button.show();
                }

            },
            setButtonVisibleById: function (id, isVisible) {
                isVisible = isVisible == null ? true : isVisible;
                var btnIndex = -1;
                this.model.toolBarItems.forEach(function (item, index) {
                    if (item.id == id && btnIndex < 0)
                        btnIndex = index;
                })
                this.setButtonVisibleByIndex(btnIndex, isVisible);
            },
            resetTabTitle: function (index, title) {

                var tabId = this._getNavigationMenuId(index);
                var tab = $('#' + this.Id).find('#' + tabId);

                if (tab != null && tab.length > 0) {
                    this.model.navigation[index].text = title;
                    var titlehtml = tab.children()[0].outerHTML + title + tab.children()[1].outerHTML;
                    tab.html(titlehtml);
                }

            },
            toggleNavigationbar: function (index, isShow) {
                var navigationId = this._getNavigationMenuId(index);
                var pageId = this._getPageId(index);
                var page = this.pages[pageId];
                if (isShow == true) {
                    $('#' + navigationId).show();
                    if (page != null)
                        page.show()
                } else {
                    $('#' + navigationId).hide();
                    if (page != null)
                        page.hide();
                }

            },
            getNavigationPage: function (index) {
                if (index < this.model.navigation.length && index > -1) {
                    var pageId = this.model.navigation[index].page.Id;
                    return this.pages[pageId];
                } else
                    return null;
            },
            getNavigationPageById: function (id) {
                var navigations = $.grep(this.model.navigation, function (tab) {
                    return tab.id == id;
                })
                if (navigations.length > 0) {
                    var pageId = navigations[0].page.Id;
                    return this.pages[pageId];
                }
                else
                    return null;
            },
            getContentPage: function (contentIndex, index) {
                if ($.isArray(this.model.content)) {
                    if (index < this.model.content[contentIndex].items.length && index > -1) {
                        var pageId = this.model.content[contentIndex].items[index].page.Id;
                        return this.pages[pageId];
                    } else
                        return null;
                }
                else
                    return null;
            },
            getContentPageById: function (id) {
                var page = null;
                if ($.isArray(this.model.content)) {
                    this.model.content.forEach(function (content) {
                        if ($.isArray(content.items) && page == null) {
                            content.items.forEach(function (item) {
                                if (item.id == id && item.page != null && page == null)
                                    page = this.pages[item.page.Id];
                            })
                        }
                    })
                }

                return page;


            },
            convertLocaleModel: function () {
                var self = this;
                this.getLocaleLabels('title');
                this.getLocaleLabels('headers', 'title');
                this.getLocaleLabels('navigation', 'text');
                this.model.content.forEach(function (contentItem, index) {
                    self.getItemLabels(contentItem, "title", self.defaultModel.content[index]);
                    contentItem.items.forEach(function (item, j) {
                        if (item.type == 'databind') {
                            var defaultContentItems = self.defaultModel.content[index].items[j].items;
                            self.getItemLabels(item.items, 'title', defaultContentItems);
                        }
                    })
                })
            },
            destroy: function () {
                this._super();
                this.observable = null;
            },
            setEditMode: function (editable, selector) {
                selector = selector == null ? "" : selector.replace(this._pagename, "").replace(":", "");
                selector = selector.replace(this._pagename + ":", "");;
                editable = editable == null ? true : editable;
                if ($.isNumeric(selector))
                    this.setButtonVisibleByIndex(selector);
                else
                    this.setButtonVisible(selector);
            },
        })

        provider.kendo.DialogWindow = basepage.extend({
            init: function (id, model) {
                this._super(id, model, null, ".dialogwindow");

            },
            getContentPage: function () {
                return this.pages[this.model.content.Id];
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                var pageId = self.Id + "-" + self.model.content.Id;
                var container = $(self.selector);
                container = container.length > 0 ? $(container[0]) : $("<div class='dialogwindow') />");
                var params = [pageId, container];
                self.model.content.params = $.isArray(self.model.content.params) ? $.merge(params, self.model.content.params) : params;
                self.loadPage(self.model.content);
                self.defaultModel.buttons = self.model.buttons;
                self.convertLocaleModel();
                self.window = container.data("kendoWindow");
                if (self.window == null)
                    container.kendoWindow();

                self.window = container.data("kendoWindow");
                
                self.window.setOptions({
                    title: self.model.title,
                    resizable: true,
                    modal: true,
                    width: self.model.width,
                    height: self.model.height,
                    close: function () {
                        self.destroyChildren();
                        self.window.destroy();
                    }
                });


                if ($.isFunction(callback))
                    callback(self);

                if ($.isFunction(self.handlers.eventHandler))
                    self.handlers.eventHandler(self);

              
                var contentpage = self.getContentPage();
                var contentCallback = function () {
                    var container = $(self.selector);
                    if (self.model.buttons != null) {
                        var htmlButtons = $(container).find('button.dialogButton');
                        if (htmlButtons.length == 0) {
                            var buttonshtml = '';
                            var i = 0;
                            self.model.buttons.forEach(function (button) {
                                var html = '<button style="margin-right:5px;margin-left:5px;width:60px' + (button.width != null ? 'width:' + button.width : '') + '"' + ' class="dialogButton k-button' + (buttonshtml.length === 0 ? ' k-primary' : '') + '">' + button.text + '</button>';
                                buttonshtml += html;
                            });
                            $(container).append('<br/><div style="text-align:center">' + buttonshtml + '</div><br/>');
                            htmlButtons = $(container).find('button.dialogButton');
                        }

                        for (i = 0; i < htmlButtons.length; i++) {
                            if ($.isFunction(self.model.buttons[i].onClick))
                                $(htmlButtons[i]).click(self.model.buttons[i].onClick);
                        }

                    }

                    /*self.window.setOptions({
                        title: self.model.title,
                        widith: self.model.widith
                    });
                    self.window.center().open();*/

                }
                var failCallback = function (error) {
                    if (error != null) {
                        var errMsg = new provider.kendo.AlertDialog();
                        errMsg.error(error);
                    }
                    
                }

                if (contentpage != null)
                    if ($.isArray(self.model.content.displayParams)) {
                        var params = [];
                        params.push(contentCallback);
                        params.push(failCallback);
                        params = $.merge(self.model.content.displayParams, params);
                        contentpage.display.apply(contentpage, params);
                    }
                    else
                        contentpage.display(contentCallback, failCallback)


                self.window.center().open();

            },
            close: function ()
            {
                var self = this;
                 if (self.window != null) {
                    self.window.center().close();
                }
            },
            show: function (callback) {
                if (this.window != null)
                    this.window.center().open();
                else
                    this._loadTemplate(callback);
            },
            hide: function () {
                this.close();
            },
            convertLocaleModel: function () {
                this.getLocaleLabels('title');
                this.getLocaleLabels('buttons', 'text');
            }

        });

        provider.kendo.ConfirmationDialog = Class.extend({
            show: function (title, message, okhandler) {
                var buttons = ["YES", "NO"];
                var newButtons = [];
                title = utils.getLocaleLabel(title);
                message = utils.getLocaleLabel(message);
                buttons.forEach(function (button) {
                    var text = utils.getLocaleLabel(button);
                    newButtons.push(text);
                })

                var html = '<div class="dialog-confirmation"><p class="dialog-message">' + message + '</p><span class="dialog-buttons"> <button class="dialog-confirm k-button k-primary">' + newButtons[0] + '</button><button class="dialog-cancel k-button">' + newButtons[1] + '</button></span></div>';
                var elem = $("div.dialog-confirmation");
                var kendoWindow = $("<div />").kendoWindow({
                    title: {
                        text: '<i class="far fa-question-circle" style="margin-right:10px;color:#0072c6"></i>' + title,
                        encoded: false
                    },
                    resizable: false,
                    modal: true,
                    width: 450
                });

                kendoWindow.data("kendoWindow").content(html).center().open();

                kendoWindow.find(".dialog-confirm,.dialog-cancel").click(function () {
                    if ($(this).hasClass("dialog-confirm")) {
                        if ($.isFunction(okhandler))
                            okhandler();
                    }

                    kendoWindow.data("kendoWindow").close();
                }).end();
            }
        });

        provider.kendo.AlertDialog = Class.extend({
            show: function (typeId, message, okhandler) {
                var lbOk = "OK";

                message = utils.getLocaleLabel(message);
                lbOk = utils.getLocaleLabel("OK");

                var html = "";
                var title = "<span class='k-icon k-i-info' style='margin-right:5px;font-size:23px;color:#0072c6'></span>";
                typeId = typeId == null ? 0 : typeId;
                switch (typeId) {
                    case 0:
                        title += utils.getLocaleLabel("Message");
                        break;
                    case 1:
                        title = "<span class='k-icon k-i-warning' style='margin-right:5px;font-size:23px;color:#ffbf00'></span>" + utils.getLocaleLabel("Warning");
                        break;
                    case 2:
                        title = "<span class='k-icon k-i-close-outline' style='margin-right:5px;color:red;font-size:23px'></span>" + utils.getLocaleLabel("Error");;
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

                html = '<div class="dialog-alert">' + html + '</div><div style="margin-bottom:10px"><p style="text-align:center"><button class="k-button' + (typeId == 0 ? ' k-primary' : '') + '" style="width:40%;">' + lbOk + '</button></p></div>';

                var kendoWindow = $("<div />").kendoWindow({
                    title: {
                        text: title,
                        encoded: false
                    },
                    actions: {},
                    resizable: false,
                    modal: true,
                    width: 350
                });

                kendoWindow.data("kendoWindow").content(html).center().open();
                kendoWindow.parent().find('.k-header').css('border-color', '#c9c9c9');
                kendoWindow.find(".k-button").click(function () {
                    kendoWindow.data("kendoWindow").close();
                    if ($.isFunction(okhandler))
                        okhandler();

                }).end();
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

        provider.kendo.AdvancedSearcher = Class.extend({
            init: function (conditions, queries, container, data, id) {
                this.container = container;
                this.conditions = conditions;
                this.queries = queries == null ? [] : queries;
                this.query = [];
                this.data = data;
                this.handlers = {};
                this.Editable = true;
                var self = this;
                this.conditionItems = [
                    { name: 'Like', value: 'search', operator: 'contains' },
                    { name: 'Start With', value: 'startswith', operator: 'startswith' },
                    { name: 'End With', value: 'endswith', operator: 'endswith' },
                    { name: 'Equal To', value: '==', operator: '==' },
                    { name: 'Not Equal To', value: '!=', operator: '!=' },
                    { name: 'Less Than', value: '<', operator: '<' },
                    { name: 'Not Less Than', value: '>=', operator: '>=' },
                    { name: 'More Than', value: '>', operator: '>' },
                    { name: 'Not More Than', value: '<=', operator: '<=' }
                ];

                var temp = $.grep(this.queries, function (item) {
                    return item.isDefault == true;
                });
                if (temp.length > 0)
                    this.defaultQuery = temp[0];

                if (conditions != null && conditions.length > 0) {
                    self.Id = id == null ? utils.generateUUID() : id;
                    var content = '<div id="' + self.Id + '" name="search" style="display:none" class="blockborder">' + $("#advancedsearch").html(); +'</div>';

                    container.append(content);

                    var toolBar = $('#' + self.Id).find(".toolbar");
                    var lblRun = utils.getLocaleLabel("Run");
                    var lblInsert = utils.getLocaleLabel("Insert");
                    var lblDelete = utils.getLocaleLabel("Delete");
                    var lblMenu1 = utils.getLocaleLabel("Insert below");
                    var lblMenu2 = utils.getLocaleLabel("Insert above");
                    var lblGroup = utils.getLocaleLabel("Group");
                    var lblUngroup = utils.getLocaleLabel("Ungroup");
                    var lblReset = utils.getLocaleLabel("Clear");
                    var hidden = self.defaultQuery == null ? (!self.Editable) : (self.defaultQuery.editable==null || !self.defaultQuery.editable);
                    toolBar.kendoToolBar({
                        items: [
                            {
                                type: "button", text: lblRun
                            },
                            {
                                type: "splitButton",
                                text: lblInsert,
                                hidden: hidden,
                                click: function (e) {

                                    var table = $("#" + self.Id).find('table[name="searchcontrol"]');
                                    var rows = table.find('tr');
                                    var index = rows.length - 1;

                                    var checkedRows = table.find("[type='checkbox']");

                                    for (var i = 0; i < checkedRows.length; i++) {
                                        if ($(checkedRows[i]).is(':checked')) {
                                            index = i;// + 1;

                                            if (e.id === "insert_above")
                                                break;
                                        }

                                    }

                                    index = e.id === "insert_above" ? index : index + 1;

                                    self._generateSearchRow(index);
                                },
                                menuButtons: [
                                    { text: lblMenu1, icon: "insert-s", id: "insert_below" },
                                    { text: lblMenu2, icon: "insert-n", id: "insert_above" }

                                ]
                            },
                            {
                                type: "button",
                                text: lblGroup,
                                hidden: hidden,
                                click: function (e) {
                                    var table = $("#" + self.Id).find('table[name="searchcontrol"]');
                                    var rows = table.find('tr');
                                    var group = [];
                                    var checkedRows = table.find("[type='checkbox']:checked");
                                    if (checkedRows.length < 1)
                                        return;

                                    var groupId = utils.generateUUID();
                                    for (var i = 1; i < rows.length; i++) {
                                        if ($(rows[i]).find("[type='checkbox']").is(':checked')) {
                                            group.push(i)
                                            if (checkedRows.length == 1) {
                                                group.unshift(0);
                                            }

                                            if ($(rows[i]).attr("data-group-id") != null) {
                                                var items = table.find('tr[data-group-id="' + $(rows[i]).attr("data-group-id") + '"]');
                                                if (items.length > 0)
                                                    group.push(i + items.length - 1);
                                            }


                                        }
                                    }

                                    var startIndex = group[0], endIndex = group[group.length - 1];
                                    for (var i = startIndex; i <= endIndex; i++) {
                                        var row = $(rows[i]);
                                        row.attr("data-group-id", groupId);
                                        var colElm = row.find("td").eq(2);
                                        if (!colElm.hasClass("tm-group"))
                                            colElm.addClass("tm-group");

                                        colElm.removeClass("last");
                                        colElm.removeClass("first");

                                        if (i == startIndex)
                                            colElm.addClass("first");

                                        if (i == endIndex) {
                                            colElm.addClass("last");
                                        }

                                        if (i != startIndex) {
                                            row.find("[type='checkbox']").hide();
                                        }

                                        if (startIndex == 0)
                                            $(rows[0]).find("[type='checkbox']").show();

                                        $(rows[i]).find("[type='checkbox']").prop("checked", false)
                                    }
                                    table.find("[type='checkbox']").prop('checked', false);
                                }
                            },
                            {
                                type: "button",
                                text: lblUngroup,
                                hidden: hidden,
                                click: function (e) {
                                    var table = $("#" + self.Id).find('table[name="searchcontrol"]');
                                    var rows = table.find('tr');
                                    var group = [];
                                    var checkedRows = table.find("[type='checkbox']:checked");
                                    if (checkedRows.length < 1)
                                        return;

                                    for (var i = 0; i < rows.length; i++) {
                                        if ($(rows[i]).attr("data-group-id") != null && $(rows[i]).find("[type='checkbox']").is(':checked')) {
                                            group.push($(rows[i]).attr("data-group-id"))
                                        }
                                    }

                                    group.forEach(function (groupId) {
                                        var row = table.find('tr[data-group-id="' + groupId + '"]');
                                        row.find("[type='checkbox']").show();

                                        if ($(rows[0]).attr("data-group-id") == groupId) {
                                            $(rows[0]).find("[type='checkbox']").prop('checked', false);
                                            $(rows[0]).find("[type='checkbox']").hide();
                                        }


                                        var colElm = row.find("td.tm-group");
                                        colElm.removeClass("tm-group");
                                        colElm.removeClass("last");
                                        colElm.removeClass("first");

                                        row.removeAttr("data-group-id");


                                    })
                                    table.find("[type='checkbox']").prop('checked', false);
                                }
                            },
                            { type: "separator" },
                            {
                                type: "button",
                                text: lblDelete,
                                hidden: hidden,
                                click: function (e) {
                                    var table = $("#" + self.Id).find('table[name="searchcontrol"]');
                                    var checkedRows = table.find("[type='checkbox']");
                                    var rows = table.find('tr');

                                    for (var i = checkedRows.length - 1; i > -1; i--) {
                                        if ($(checkedRows[i]).is(':checked')) {
                                            var row = $("#" + self.Id).find('table[name="searchcontrol"] > tbody > tr').eq(i);
                                            var groupId = row.attr("data-group-id");
                                            if (row.attr("data-group-id") != null) {
                                                if ($(rows[0]).attr("data-group-id") == groupId) {
                                                    $(rows[0]).removeAttr("data-group-id");
                                                    $(rows[0]).find("[type='checkbox']").prop('checked', false);
                                                    $(rows[0]).find("[type='checkbox']").hide();
                                                    var colElm = $(rows[0]).find("td.tm-group");
                                                    colElm.removeClass("tm-group");
                                                    colElm.removeClass("last");
                                                    colElm.removeClass("first");

                                                }


                                                $("#" + self.Id).find('table[name="searchcontrol"] > tbody > tr[data-group-id="' + groupId + '"]').remove();
                                            } else
                                                row.remove();
                                        }

                                    }
                                    table.find("[type='checkbox']").prop('checked', false);
                                }
                            },
                            {
                                type: "button",
                                text: lblReset,
                                click: function (e) {
                                    self._reset();
                                }
                            }

                        ]
                    });

                    //create search conditions
                    if (self.defaultQuery == null)
                        self._generateSearchRow(0);
                    else
                        self._generateSearchConditionsByQuery(self.defaultQuery);

                }
            },
            _reset: function () {
                var content = $($("#advancedsearch").html());
                var template = "";
                for (var i = 0; i < content.length; i++) {
                    if (content[i].className == "searchPanel")
                        template = $(content[i]).html();
                }

                $("#" + this.Id).find('div.searchPanel').html(template);
                //create search conditions
                if (this.defaultQuery == null)
                    this._generateSearchRow(0);
                else
                    this._generateSearchConditionsByQuery(this.defaultQuery);

                this.query.length = 0;
                this.executeQuery();
            },
            _generateSearchRow: function (index, itemIndex, operator, value,joinOperator) {
                var table = $("#" + this.Id).find('table[name="searchcontrol"]');
                var rows = table.find('tr');
                var rowcount = rows.length;

                var self = this;
                if (index > 0) {
                    var newrow = '<tr style="height:45px;"><td style="width:5px;"><input type="checkbox" /></td><td><select name="join" style="width:100%"></select></td>';
                    newrow += '<td style="width:10px"></td><td><select name="conditions" style="width:100%"></select></td><td></td>';
                    newrow += '<td><select name="Operator" style="width:100%"></select></td><td></td><td><select name="value" style="width:100%;"></select></td></tr>';
                    table.find("tbody > tr").eq(index - 1).after(newrow);
                }

                var row = table.find('tr')[index];

                var sel_join = $(row).find("[name='join']");
                if (index > 0) {
                    sel_join.kendoDropDownList({
                        dataTextField: "name",
                        dataValueField: "value",
                        dataSource: [
                            { name: 'And', value: '&&' },
                            { name: 'Or', value: '||' }

                        ],
                        index: joinOperator == null || joinOperator == '&&' || joinOperator.toLowerCase() == 'and'?0:1
                    });
                    
                }
                else {
                    sel_join.hide();
                }


                var newConditionItems = utils.getLocaleLabels(this.conditionItems, "name");
                var sel_op = $(row).find("[name='Operator']");
                sel_op.kendoDropDownList({
                    dataTextField: "name",
                    dataValueField: "value",
                    dataSource: newConditionItems,
                    index: 0,
                });
                var sel_con = $(row).find("[name='conditions']");
                sel_con.attr('Id', this.Id + '_r_' + rowcount);
                sel_con.kendoDropDownList({
                    dataTextField: "title",
                    dataValueField: "field",
                    dataSource: this.conditions,
                    index: 0,
                    change: function () {
                        var dropdownlist = sel_con.data("kendoDropDownList");
                        var selectedIndex = dropdownlist.select();
                        self._generateSearchValue(index, selectedIndex);
                    }
                });
                var itemId = itemIndex!=null?itemIndex: (index < this.conditions.length ? index : this.conditions.length - 1);

                this._generateSearchValue(index, itemId, operator, value);


            },
            _generateSearchValue: function (rowId, index,operator,defaultValue) {
                var self = this;
                defaultValue = defaultValue == null ? "" : defaultValue;
                var table = $("#" + this.Id).find('table[name="searchcontrol"]');
                var rows = table.find('tr');
                var row = rows.length == 1 ? rows : $(rows[rowId]);
                var lastColumn = row.find('td:last');
                var sel_con = row.find("[name='conditions']");
                if (sel_con.length) {
                    var dropdownlist = sel_con.data("kendoDropDownList");
                    dropdownlist.select(index);
                    var field = dropdownlist.value();
                    var conditionItem = $.grep(this.conditions, function (condItem) {
                        return condItem.field == field
                    })[0];
                    conditionItem.dataType = conditionItem.dataType == null ? "string" : conditionItem.dataType;
                    conditionItem.type = conditionItem.type == null ? "text" : conditionItem.type;
                    var sel_op = row.find("[name='Operator']");
                    if (sel_op.length > 0) {
                        var operatorIndex = 0;
                        var operators = [];
                        var opDDl = sel_op.data("kendoDropDownList");
                        if (conditionItem.type.toLowerCase() == "listvalue") {
                            operators = $.grep(this.conditionItems, function (item) {
                                return item.operator == "==" || item.operator == "!=";
                            })
                        } else {
                            operators = conditionItem.dataType != "string" ? $.grep(this.conditionItems, function (item) {
                                return item.operator != 'contains' && item.operator != 'startswith' && item.operator != 'endswith';
                            }) : this.conditionItems;
                        }

                        opDDl.dataSource.data(operators);

                        operators.forEach(function (item, i) {
                            if (item.value == operator || item.operator == operator)
                                operatorIndex = i;
                        })

                        opDDl.select(operatorIndex);
                    }

                }

                var item = this.conditions[index];
                var value_elem = '';
                switch (item.type.toLowerCase()) {
                    case "listvalue":
                        value_elem = '<select name="value" class="list" style="width:100%"></select>'
                        break;
                    case "text":
                        value_elem = '<input name="value" type="text" class="k-textbox" style="width:100%" value="' + defaultValue+'" />'
                        break;
                    case "date":
                        value_elem = '<input name="value" class="date" style="width:100%;" value="' + defaultValue + '" />'
                        break;
                    case "datetime":
                        value_elem = '<input name="value" class="datetime" style="width:100%;" value="' + defaultValue + '" />'
                        break;
                }

                lastColumn.html(value_elem);

                if (item.type.toLowerCase() == 'listvalue') {
                    var value = lastColumn.find('select');
                   
                    if ($.isFunction(item.loadDataSource)) {
                        utils.showProcessbar(true, '#' + self.Id);
                        item.loadDataSource(function (data) {
                            utils.showProcessbar(false, '#' + self.Id);
                            item.values = data;
                            $(value).kendoDropDownList({
                                valuePrimitive: true,
                                dataTextField: "name",
                                dataValueField: "value",
                                dataSource: item.values,
                                optionLabel: {
                                    name: "All",
                                    value: null
                                 }
                            });
                            var ddl = $(value).data("kendoDropDownList");
                            if (defaultValue.length > 0)
                                 ddl.value(defaultValue);
                        })
                    } else {
                        $(value).kendoDropDownList({
                            valuePrimitive: true,
                            dataTextField: "name",
                            dataValueField: "value",
                            dataSource: item.values,
                            dataSource: item.values,
                            optionLabel: {
                                name: "All",
                                value: null
                            }
                        });
                        var ddl = $(value).data("kendoDropDownList");
                        if (defaultValue.length > 0)
                            ddl.value(defaultValue);
                    }
                }

                if (item.type.toLowerCase() == 'date') {
                    var value = lastColumn.find('input.date')
                    $(value).kendoDatePicker({
                        format: "dd MMM yyyy"
                    });
                }

                if (item.type.toLowerCase() == 'datetime') {
                    var value = lastColumn.find('input.datetime')
                    $(value).kendoDateTimePicker({
                        format: "dd MMM yyyy HH:mm:ss"
                    });
                }

            },
            _generateSearchConditionsByQuery: function (query) {
                var self = this;
                var rowIndex = 0;
                query.filters.forEach(function (filter, index) {
                    var itemIndex = 0
                    if (filter.criterias != null && filter.criterias.length > 0) {
                        var groupId = utils.generateUUID();
                        filter.criterias.forEach(function (filterItem, j) {
                            rowIndex = rowIndex + j;
                            self.conditions.forEach(function (item, i) {
                                if (item.field == filterItem.field)
                                    itemIndex = i;
                            });
                            self._generateSearchRow(rowIndex, itemIndex, filterItem.operator, filterItem.value, filterItem.joinoperator);
                            var row = $("#" + self.Id).find('table[name="searchcontrol"]').find('tr').eq(rowIndex);
                            row.attr("data-group-id", groupId);
                            var colElm = row.find("td").eq(2);
                            colElm.addClass("tm-group");

                            if (j == 0)
                                colElm.addClass("first");

                            if (j == filter.criterias.length - 1)
                                colElm.addClass("last");
                            
                            

                        })

                    } else {
                        self.conditions.forEach(function (item, i) {
                            if (item.field == filter.field)
                                itemIndex = i;
                        });
                        self._generateSearchRow(rowIndex, itemIndex, filter.operator, filter.value, filter.joinoperator);
                    }
                    rowIndex++;
                    
                })
            },
            _generateQuery: function (condition, value) {
                var searchValue = '';
                if (condition.value == '%' || condition.field ==null)
                    searchValue = "(true)";
                else {
                    switch (condition.operator) {
                        case "search":
                            searchValue = "(item['" + condition.field + "'].toLowerCase()." + condition.operator + "(" + value + ".toLowerCase())>-1)";//"(conditions[" + i + "].value.toLowerCase())>-1" + ')'
                            break;
                        default:
                            if (condition.valueType.toLowerCase() == "datetime") {
                                searchValue = "(new Date(item['" + condition.field + "'])" + condition.operator + "new Date(" + value + ")" + ')';
                            } else {
                                searchValue = "(item['" + condition.field + "']" + condition.operator + value + ')';
                            }
                            break
                    }
                }

                return searchValue;
            },
            filterData: function (data, conditions, callback) {
                var result = [];

                if ((null == conditions || typeof conditions == 'undefined') && $.isFunction(callback)) {
                    callback(result);
                    return;
                }

                if (conditions.length == 0 && $.isFunction(callback)) {
                    callback(data);
                    return;
                }

                var isValid = false;
                var self = this;
                data.forEach(function (item) {
                    var strCondition = '';
                    var searchValue = ''
                    var i = 0;
                    conditions.forEach(function (condition) {
                        if (condition.criterias != null && condition.criterias.length > 0) {
                            var temp = "";
                            var index = 0;
                            condition.criterias.forEach(function (subItem) {
                                var searchValue = "conditions[" + i + "].criterias[" + index + "].value"
                                temp = (index == 0 ? "(" : "") + self._generateQuery(subItem, searchValue) + (index == condition.criterias.length - 1 ? ")" : "");
                                temp = (subItem.joinoperator == null || typeof subItem.joinoperator == 'undefined' ? '' : subItem.joinoperator) + temp;
                                strCondition += temp;
                                index++;
                            })

                        } else {
                            var searchValue = "conditions[" + i + "].value";
                            
                            strCondition += (condition.joinoperator == null || typeof condition.joinoperator == 'undefined' ? '' : condition.joinoperator) + self._generateQuery(condition, searchValue);
                        }

                        i++;
                    })

                    isValid = eval(strCondition);

                    if (isValid == true)
                        result.push(item);
                });

                if ($.isFunction(callback))
                    callback(result);

            },
            _getFilterCondition: function (row) {
                var self = this;
                var result = [];
                var sel_con = row.find("[name='conditions']");
                var sel_val = row.find("[name='value']");
                var sel_operator = row.find("[name='Operator']");
                var searchedValue = sel_val.val();

                if (sel_val.hasClass('date')) {
                    searchedValue = sel_val.data('kendoDatePicker').value();
                }
                else if (sel_val.hasClass('datetime')) {
                    searchedValue = sel_val.data('kendoDatePicker').value();
                }

                //var searchvalue = { operator: sel_operator.val(), value: searchedValue, key: sel_con.val() };
                var filter = { value: searchedValue, field: sel_con.val() };
                filter.operator = $.isFunction(self.search) ? $.grep(self.conditionItems, function (item) {
                    return item.value == sel_operator.val();
                })[0].operator : sel_operator.val();

                var condiItem = $.grep(self.conditions, function (item) {
                    return item.field == filter.field;
                });

                if (condiItem.length > 0) {
                    filter.valueType = condiItem[0].dataType;
                    filter.utc = condiItem[0].utc == null ? true : condiItem[0].utc;
                    switch (condiItem[0].dataType.toLowerCase()) {
                        case "date":
                        case "datetime":
                            searchedValue = searchedValue == null ? new Date('1800-01-01') : searchedValue;
                            filter.value = searchedValue.toISOString();
                            break;
                        case "int":
                            filter.value = isNaN(parseInt(filter.value)) ? 0 : parseInt(filter.value);
                            break;
                        case "float":
                        case "decimal":
                        case "double":
                            filter.value = isNaN(parseFloat(filter.value)) ? 0.00 : parseFloat(filter.value);
                            break;
                    }

                    if ($.isFunction(self.handlers.dataTransform))
                        self.handlers.dataTransform(filter);

                    if (i > 0) {
                        var sel_join = row.find("[name='join']");
                        //searchvalue.joinoperator = sel_join.val();
                        filter.joinoperator = $.isFunction(self.search) ? sel_join.children("option").filter(":selected").text() : sel_join.val();
                    }

                    if (condiItem[0].type.toLowerCase() == "date") {
                        filter.value = new Date(filter.value);
                        switch (filter.operator) {
                            case "==":
                                var firstFilter = utils.cloneModel(filter);
                                firstFilter.operator = ">=";
                                result.push(firstFilter);
                                filter.operator = "<";
                                filter.joinoperator = $.isFunction(self.search) ? "And" : "&&";
                                filter.value.setDate(filter.value.getDate() + 1)
                                break;
                            case ">":
                                filter.operator = ">=";
                                filter.value.setDate(filter.value.getDate() + 1)
                                break;
                        }
                        filter.value = filter.value.toISOString();
                    } else if (condiItem[0].type.toLowerCase() == "listvalue") {
                        if ((filter.value == null || filter.value.length==0) && filter.operator == "==")
                            filter.field = null;
                    }

                    result.push(filter);
                }

                return result;
            },
            onSearch: function (handler) {
                var self = this;
                var btn_run = $("#" + self.Id).find('a.k-button:first');

                btn_run.click(function () {
                    var table = $("#" + self.Id).find('table[name="searchcontrol"]');
                    var rows = table.find('tr');

                    // var conditions = [];
                    //var filters = rows.length == 0 ? null : { logic: null, filters: [] };
                    var filters = [];
                    for (var i = 0; i < rows.length; i++) {

                        var groupId = $(rows[i]).attr("data-group-id");
                        if (groupId != null) {
                            var grouprows = table.find("tr[data-group-id='" + groupId + "']");
                            var sel_join = $(rows[i]).find("[name='join']");
                            var filter = { criterias: [] };
                            for (var j = 0; j < grouprows.length; j++) {
                                var groupFilter = self._getFilterCondition($(grouprows[j]), filters);
                                filter.criterias = $.merge(filter.criterias, groupFilter);
                                i = i + j;
                            }

                            if (sel_join != null)
                                filter.joinoperator = $.isFunction(self.search) ? sel_join.children("option").filter(":selected").text() : sel_join.val();

                            filters.push(filter);
                        } else {
                            var temp = self._getFilterCondition($(rows[i]), filters);
                            filters = $.merge(filters, temp);
                        }

                    }
                    console.log('search filters', filters);
                    //console.log('search conditions', conditions);
                    self.query = filters;//$.isFunction(self.search) ? filters : conditions;
                    self.filter = handler;
                    self.executeQuery();
                })
            },
            executeQuery: function () {
                var self = this;
                if ($.isFunction(self.search)) {
                    self.search(self.query)
                }
                else
                    self.filterData(self.data, self.query, function (result) {
                        if ($.isFunction(self.filter))
                            self.filter(result);
                    })
            },
            setData: function (data) {
                this.data = data;
            },
            show: function () {
                $("#" + this.Id).show();
            },
            hide: function () {
                $("#" + this.Id).hide()
            },
            setDataTransformHandler: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.dataTransform = handler;
            }

        })

        provider.kendo.Notification = Class.extend({
            init: function (options, id) {
                var html = '<span class="notification" style="display:none;"></span>';

                if (id != null && id.length > 0)
                    html = '<span id=' + id + ' class="notification" style="display:none;"></span>';

                $(utils.defaultContainer).append(html);
                this.selector = id == null ? ".notification" : '#' + id;
                this.options = options == null ? { autoHideAfter: 3000 } : options;
                this.notification = $(this.selector).kendoNotification(this.options).data("kendoNotification");
            },
            info: function (message) {
                this.notification.info(utils.getLocaleLabel(message));
            },
            warning: function (message) {
                this.notification.warning(utils.getLocaleLabel(message));
            },
            error: function (message) {
                this.notification.error(utils.getLocaleLabel(message));
            }
        });

        provider.kendo.Tabstrip = provider.kendo.Page.extend({
            init: function (id, model, containerselector, template) {
                var pageTemplate = template == null ? { html: "<div class='tabstrip'><ul class='tab'></ul></div>" } : template;
                this._super(id, model, pageTemplate, containerselector);
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {

                    var ul = $("#" + self.Id).find("ul.tab");
                    var tabstrip = $("#" + self.Id).find(".tabstrip");
                    if (ul.length) {
                        var i = 0;
                        self.model.tabs.forEach(function (tab) {
                            ul.append("<li>" + utils.getLocaleLabel(tab.title) + "</li>");
                            var tabId = self.Id + "_tab_" + i;
                            tabstrip.append("<div><div class='tabpage' id='" + tabId + "'></div></div>");
                            tab.page.params = [self.Id + "-" + tab.page.Id, "#" + tabId];
                            self.loadPage(tab.page);
                            i++;
                        });
                    }

                    tabstrip.kendoTabStrip({
                        select: function (e) {
                            var index = $(e.item).index();

                            $.each(self.pages, function (key, page) {
                                page.parent = self;
                                if (key === self.model.tabs[index].page.Id)
                                    page.display();
                                else
                                    page.hide();
                            })
                        }
                    }).data("kendoTabStrip").select(0);

                    if ($.isFunction(callback))
                        callback(self);

                }, isReplace);
            }

        });

        provider.kendo.iframe = provider.kendo.Page.extend({
            init: function (id, model, template, containerselector) {
                var pageTemplate = template == null ? { html: '<iframe frameborder="0" style="width:100%; height:100%"></iframe>' } : template;
                this._super(id, model, pageTemplate, containerselector);
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {
                    var iframeElm = $('#' + self.Id).find("iframe");

                    if (iframeElm.length)
                        iframeElm.attr("src", self.model.data);

                    if ($.isFunction(callback))
                        callback(self);

                }, isReplace);
            }


        });

        provider.kendo.lrsplitpanel = basepage.extend({
            init: function (id, model, containerselector, template) {
                var pageTemplate = template != null ? template : { Id: "splitpanel" };
                this._super(id, model, pageTemplate, containerselector);
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {

                    var splitter = $("#" + self.Id).find('.split').kendoSplitter({
                        orientation: "horizontal",
                        panes: [
                            { collapsible: true, size: self.model.leftPanelSize },
                            { collapsible: false }
                        ],
                        resize: function (e) {
                            var selector = $('#' + self.Id).find('.content_panel');
                            selector.width(selector.width() - 30);
                        }

                    }).data("kendoSplitter");

                    var height = window.innerHeight - 55;
                    splitter.wrapper.height(height);
                    splitter.resize();
                    $('#' + self.Id).css('border-style', 'none');

                    if (self.model.leftPanel != null) {
                        var selector = $('#' + self.Id).find('.top_panel');
                        self.bindPanel(self.model.leftPanel, selector);
                    }


                    if (self.model.rightPanel != null) {
                        var selector = $('#' + self.Id).find('.content_panel');
                        self.bindPanel(self.model.rightPanel, selector);
                    }

                    if ($.isFunction(callback))
                        callback(self);

                }, isReplace);
            },
            _afterLoadData: function (data) {
                var self = this;
                $.each(self.pages, function (Id, page) {
                    var panel = self.model.leftPanel != null && self.model.leftPanel.Id == Id ? self.model.leftPanel : (self.model.rightPanel != null && self.model.rightPanel.Id == Id ? self.model.rightPanel : null);
                    if (!$.isFunction(page.handlers.loadDataHandler) && panel != null) {
                        var dataSource = panel.dataSourceField != null && panel.dataSourceField.length > 0 ? data[panel.dataSourceField] : data;
                        page.setData(dataSource);
                    }


                    if (panel.displayParams != null)
                        page.display.apply(page, panel.displayParams);
                    else
                        page.display();
                })
            },
            bindPanel: function (panel, selector) {
                if (panel == null)
                    return;

                panel.Id = panel.Id.search(this.Id + '-') == 0 ? panel.Id : this.Id + '-' + panel.Id;

                panel.params = $.isArray(panel.params) ? $.merge([panel.Id, selector], panel.params) : [panel.Id, selector];
                this.loadPage(panel);

            },
            resize: function () {
                var splitter = $("#" + this.Id).find('.split').data("kendoSplitter");
                splitter.size(".k-pane:first", this.model.leftPanelSize);
            }
        });

        provider.kendo.Canvas = basepage.extend({
            init: function (id, model, containerselector, template) {
                var pageTemplate = template != null ? template : { html: '<div class="surface" style="width:100%;height:710px"></div>' };
                this._super(id, model, pageTemplate, containerselector);
            },
            _afterLoadData: function (data) {
                var self = this;
                if (data == null || $.isArray(data) == false)
                    return;
                this.model.data = data;
                this.draw(data);

            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {
                    var surface = $('#' + self.Id).find('.surface');
                    var draw = kendo.drawing;
                    self.canvas = draw.Surface.create(surface);
                    var containerElm = (typeof this.selector == 'string') ? $(self.selector) : self.selector
                    self.centerPoint = containerElm.width() / 2;

                    if ($.isFunction(callback))
                        callback(self);

                    if (isReplace == true)
                        this.canvas.clear();
                }, isReplace);
            },
            drawTip: function (point, size, tip) {
                if (tip != null && tip.text != null && tip.text.length > 0) {
                    var draw = kendo.drawing;
                    var geom = kendo.geometry;
                    var circlPt = [point[0] + size[0] - 10, point[1] + 10]
                    var circleGeometry = new geom.Circle(circlPt, 10);
                    var circle = new draw.Circle(circleGeometry);
                    var stroke = tip.stroke == null ? { color: 'red', width: 2 } : tip.stroke;
                    circle.stroke(stroke.color, stroke.width);
                    circle.fill(stroke.color);
                    this.canvas.draw(circle);
                    tip.pos = tip.pos == null ? [10 * tip.text.length / 3, 8] : tip.pos;
                    var position = new geom.Point(circlPt[0] - tip.pos[0], circlPt[1] - tip.pos[1]);
                    var text = utils.getLocaleLabel(tip.text);
                    var tipText = new draw.Text(text, position).stroke("white", 2);
                    this.canvas.draw(tipText);
                }
            },
            drawImage: function (point, size, imageUrl, content, isActive, tip) {
                var draw = kendo.drawing;
                var geom = kendo.geometry;
                var rect = new geom.Rect(point, size);

                if (isActive) {
                    var circlPt = [point[0] + size[0] / 2, point[1] + size[1] / 2]
                    var circleGeometry = new geom.Circle(circlPt, size[0] / 2);

                    var circle = new draw.Circle(circleGeometry);
                    circle.stroke("#00FF00", 3);
                    this.canvas.draw(circle);
                }

                var image = new draw.Image(imageUrl, rect);
                this.canvas.draw(image);
                this.drawTip(point, size, tip)

                if (content != null && content.text != null && content.text.length > 0) {
                    var contentText = content.text;
                    content.pos = content.pos == null ? [0, 0] : content.pos;
                    if ($.isArray(contentText) == false) {
                        contentText = utils.getLocaleLabel(content.text);
                        var position = new geom.Point(point[0] + content.pos[0], point[1] + size[1] + content.pos[1]);
                        var text = new draw.Text(contentText, position);
                        this.canvas.draw(text);
                        content.height = 15;
                    }
                    else {
                        var i = 0;
                        var self = this;
                        contentText.forEach(function (word) {
                            var position = new geom.Point(point[0] + content.pos[0], point[1] + size[1] + content.pos[1] + i * 15);
                            word = utils.getLocaleLabel(word);
                            var text = new draw.Text(word, position);
                            self.canvas.draw(text);
                            content.height = 15 + i * 15;
                            i++;
                        })
                    }
                }



            },
            drawLine: function (points, stroke, fillcolor, content) {
                var draw = kendo.drawing;
                var geom = kendo.geometry;
                var path = new draw.Path();

                if (stroke != null)
                    path = new draw.Path({ stroke: stroke });

                var i = 0;
                points.forEach(function (point) {
                    if (i == 0)
                        path.moveTo(point[0], point[1]);
                    else
                        path.lineTo(point[0], point[1]);
                    i++;
                });



                if (fillcolor != null)
                    path.fill(fillcolor);

                this.canvas.draw(path);

                if (content != null) {
                    var position = new geom.Point(points[content.index][0] + content.pos[0], points[content.index][1] + content.pos[1]);
                    var text = new draw.Text(content.text, position).stroke(stroke.color, 0.1);
                    this.canvas.draw(text);
                }

            },
            drawLineWithArrow: function (points, content, stroke) {
                var draw = kendo.drawing;
                var geom = kendo.geometry;
                var stroke = stroke == null ? { color: '#10BC55', width: 4 } : stroke;
                var path = new draw.Path({ stroke: stroke });


                for (var i = 0; i < points.length; i++) {
                    if (i == 0)
                        path.moveTo(points[i][0], points[i][1]);
                    else {
                        path.lineTo(points[i][0], points[i][1]);
                    }
                }

                var x1 = points[points.length - 2][0];
                var y1 = points[points.length - 2][1];
                var x2 = points[points.length - 1][0];
                var y2 = points[points.length - 1][1];

                //path = new draw.Path().moveTo(x1, y1).lineTo(x2, y2).stroke(stroke.color,stroke.width);
                //  path.stroke(stroke.color, stroke.width);
                this.canvas.draw(path);

                //var startRadians = Math.atan((this.y2 - this.y1) / (this.x2 - this.x1));
                //startRadians += ((this.x2 > this.x1) ? -90 : 90) * Math.PI / 180;
                var endRadians = Math.atan((y2 - y1) / (x2 - x1));
                endRadians += ((x2 >= x1) ? 90 : -90) * Math.PI / 180;

                var path2 = new draw.Path().moveTo(0, 0).lineTo(5, 10).lineTo(-5, 10).lineTo(0, 0);
                var tr = new geom.Transformation();
                tr.translate(x2, y2);
                tr.rotate(endRadians * 180 / Math.PI);
                path2.transform(tr);
                path2.fill(stroke.color).stroke(stroke.color, 1);
                this.canvas.draw(path2);

                if (content != null) {
                    var position = new geom.Point(points[content.index][0] + content.pos[0], points[content.index][1] + content.pos[1]);
                    var text = new draw.Text(content.text, position).stroke(stroke.color, 0.3);
                    this.canvas.draw(text);
                }

            },
            draw: function (data, isRedraw) {
                var self = this;
                isRedraw = isRedraw == null ? false : isRedraw;
                if (isRedraw == true)
                    this.canvas.clear();
                data.forEach(function (obj) {
                    switch (obj.type) {
                        case "image":
                            self.drawImage(obj.point, obj.size, obj.url, obj.content, obj.isActive, obj.tip);
                            break;
                        case "line":
                            self.drawLine(obj.points, obj.stroke, obj.fillcolor, obj.content);
                            break;
                        case "linearrow":
                            self.drawLineWithArrow(obj.points, obj.content, obj.stroke);
                    }
                });
            }
        });

        provider.kendo.WorkflowCanvas = provider.kendo.Canvas.extend({
            init: function (id, model, containerselector, template) {
                this._super(id, model, containerselector, template);
                this.imageClickHandlers = {};
                this.model.activeStepIndex = 0;
            },
            setLoadCompletedHandler: function (handler) {
                var self = this;
                if ($.isFunction(handler))
                    this.handlers.loadCompletedHandler = function (data) {
                        self.draw(data);
                        handler(data);
                    }
            },
            draw: function (data, isRedraw) {
                var self = this;
                isRedraw = isRedraw == null ? true : isRedraw;

                var result = utils.cloneModel(data);
                if (!$.isArray(result)) {
                    result = [];
                    console.warn('workflow diagram data should be array', data);
                }

                var i = 0;
                result.forEach(function (obj) {
                    if (obj.type == "linearrow" && obj.points == null) {
                        var textHeight = (data[obj.starIndex].content == null ? 0 : ($.isArray(data[obj.starIndex].content.text) == true ? 15 * data[obj.starIndex].content.text.length : 15));
                        var endIndexTextHeight = (data[obj.endIndex].content == null ? 0 : ($.isArray(data[obj.endIndex].content.text) == true ? 15 * data[obj.endIndex].content.text.length : 15));
                        var x1 = data[obj.starIndex].point[0] == data[obj.endIndex].point[0] ? data[obj.starIndex].point[0] + data[obj.starIndex].size[0] / 2 : data[obj.starIndex].point[0] + (data[obj.starIndex].point[0] < data[obj.endIndex].point[0] ? data[obj.starIndex].size[0] : 0);
                        var y1 = data[obj.starIndex].point[1] == data[obj.endIndex].point[1] ? data[obj.starIndex].point[1] + data[obj.starIndex].size[1] / 2 : data[obj.starIndex].point[1] + (data[obj.starIndex].point[1] < data[obj.endIndex].point[1] ? data[obj.starIndex].size[1] + textHeight : 0);
                        var x2 = data[obj.starIndex].point[0] == data[obj.endIndex].point[0] ? x1 : data[obj.endIndex].point[0] + (data[obj.starIndex].point[0] > data[obj.endIndex].point[0] ? data[obj.endIndex].size[0] : 0);
                        var y2 = data[obj.starIndex].point[1] == data[obj.endIndex].point[1] ? y1 : (data[obj.starIndex].point[0] == data[obj.endIndex].point[0] ? data[obj.endIndex].point[1] + (data[obj.starIndex].point[1] > data[obj.endIndex].point[1] ? data[obj.endIndex].size[1] + endIndexTextHeight : 0) : data[obj.endIndex].point[1] + data[obj.endIndex].size[1] / 2);

                        obj.points = [[x1, y1], [x2, y2]];
                    }
                    if (obj.type == 'image') {

                        if (self.model.activeStepIndex == i)
                            obj.isActive = true;
                        else
                            obj.isActive = false;

                        i++;
                    }
                });

                this._super(result, isRedraw);
            },
            _afterLoadData: function (data) {
                var self = this;
                var isNew = $.isEmptyObject(self.pages);

                //var defaultPage = null;
                this.model.data = data;
                var j = 0;
                var imageObjs = $.grep(data, function (obj) {
                    if (obj.page != null && self.pages[obj.page.Id] == null) {
                        var params = [self.Id + '-' + obj.page.Id, self.model.pageSelector];
                        obj.page.params = $.isArray(obj.page.params) ? $.merge(params, obj.page.params) : params;
                        self.loadPage(obj.page);
                        var childPage = self.pages[obj.page.Id];
                        if (childPage != null)
                            childPage.wfPageId = self.Id;
                    }

                    if (self.model.activeStepIndex == j && obj.type == 'image') {
                        obj.isActive = true;
                        j++;
                    }

                    if (obj.page != null)
                        self.defaultPage = self.defaultPage == null && obj.isActive == true ? obj.page : self.defaultPage;

                    return obj.type == 'image';
                });

                var i = 0;
                var images = $('#' + this.Id).find('image');
                imageObjs.forEach(function (obj) {
                    var index = i;
                    var indexName = i.toString();
                    $(images[i]).click(function () {
                        self.model.data.forEach(function (item) {
                            if (item.type == "image")
                                item.isActive = false;
                        })

                        self.model.activeStepIndex = index;
                        obj.isActive = true;
                        if (obj.page != null) {
                            $.each(self.pages, function (id, page) {
                                if (id != obj.page.Id)
                                    page.destroy();//page.hide();
                                else {
                                    var currentPage = self.pages[obj.page.Id];
                                    if (currentPage != null)
                                        if ($.isArray(obj.page.displayParams))
                                            currentPage.display.apply(currentPage, obj.page.displayParams);
                                        else
                                            currentPage.display();
                                }


                            });
                        }

                        self.display();

                        //click handler
                        if ($.isFunction(self.imageClickHandlers[indexName]))
                            self.imageClickHandlers[indexName]();
                    });
                    i++;
                });


                if (self.defaultPage != null && isNew) {
                    var defaultPage = self.pages[self.defaultPage.Id]
                    if ($.isArray(self.defaultPage.displayParams))
                        defaultPage.display.apply(defaultPage, self.defaultPage.displayParams);
                    else
                        defaultPage.display();
                }
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {
                    var surface = $('#' + self.Id).find('.surface');
                    var draw = kendo.drawing;
                    self.canvas = draw.Surface.create(surface);
                    var containerElm = (typeof this.selector == 'string') ? $(self.selector) : self.selector;

                    if (self.handlers.loadCompletedHandler == null)
                        self.handlers.loadCompletedHandler = function (data) { self.draw(data) };

                    if ($.isFunction(callback))
                        callback(self);

                    if (isReplace == true)
                        this.canvas.clear();
                }, isReplace);


            },
            onStepClick: function (index, handler) {
                this.imageClickHandlers[index] = handler;
            },
            navigateTo: function (index) {
                var images = $('#' + this.Id).find('image');
                if (images.length > 0)
                    $(images[index]).click();
            },
            show: function () {
                $("#" + this.Id).show();
                console.info('show page:' + this.Id);
            },

        });

        provider.kendo.Map = provider.kendo.Page.extend({
            init: function (id, model, containerselector, template) {
                var template = template == null ? { html: "<div class ='map'></div>" } : template;
                this._super(id, model, template, containerselector);
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {
                    var mapArea = $('#' + self.Id).find('.map');
                    mapArea.kendoMap(self.model.options);

                    if ($.isFunction(callback))
                        callback(self);
                }, isReplace);
            },
            _afterLoadData: function (data) {
                this.model.data = data == null ? {} : data;
                if (this.model.type == "geocode") {
                    if (this.model.markField == null)
                        this.refreshMarks(this.model.data);
                    else
                        this.refreshMarks(this.model.data[this.model.markField]);
                }


                this.setData(data);

            },
            clearMarks: function () {
                var mapArea = $('#' + this.Id).find('.map');
                var map = mapArea.data("kendoMap");
                map.layers[1].clear();
            },
            refreshMarks: function (data) {
                if (data.length > 0) {
                    var mapArea = $('#' + this.Id).find('.map');
                    var map = mapArea.data("kendoMap");
                    map.layers[1].dataSource.data(data);
                }
            },
            setOptions: function (options) {
                var mapArea = $('#' + this.Id).find('.map');
                var map = mapArea.data("kendoMap");
                map.setOptions(options);
            }

        });

        provider.kendo.Scheduler = provider.kendo.Page.extend({
            init: function (id, model, containerselector, template) {
                var template = template == null ? { html: "<div class ='scheduler'></div>" } : template;
                this._super(id, model, template, containerselector);
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {
                    var schedulerElm = $('#' + self.Id).find(".scheduler");

                    if (self.model.templateId != null)
                        self.model.option.editable = {
                            template: $(self.model.templateId).html(),
                            window: self.model.window
                        }

                    if (self.model.eventTemplateId != null)
                        self.model.option.eventTemplate = $(self.model.eventTemplateId).html();

                    var defaultHeight = window.innerHeight - schedulerElm[0].getBoundingClientRect().top - 20;
                    if (self.model.option.height == null)
                        self.model.option.height = defaultHeight;

                    self.model.option.date = new Date(self.model.currentDate);
                    schedulerElm.kendoScheduler(self.model.option);
                    var scheduler = schedulerElm.data("kendoScheduler");
                    if ($.isFunction(self.handlers.saveHandler))
                        scheduler.bind("save", self.handlers.saveHandler);

                    if ($.isFunction(self.handlers.navigateHandler))
                        scheduler.bind("navigate", self.handlers.navigateHandler);

                    if ($.isFunction(self.handlers.removeHandler))
                        scheduler.bind("remove", self.handlers.removeHandler);

                    if ($.isFunction(self.handlers.dataSourceChangeHandler))
                        scheduler.dataSource.bind("change", self.handlers.dataSourceChangeHandler);



                    if ($.isFunction(callback))
                        callback(self);
                }, isReplace);
            },
            setSaveHandler: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.saveHandler = handler;
            },
            setDataSourceChangeHandler: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.dataSourceChangeHandler = handler;
            },
            setNavigateHandler: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.navigateHandler = handler;
            },
            setRemoveHandler: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.removeHandler = handler;
            },
            getScheduler: function () {
                var schedulerElm = $('#' + this.Id).find(".scheduler");
                return schedulerElm.data("kendoScheduler");
            },
            _afterLoadData: function (data) {
                var self = this;
                var scheduler = this.getScheduler();
                var result = scheduler.resources.length > 0 ? (data == null ? {} : data) : (data == null ? [] : data);
                var scheduleData = scheduler.resources.length > 0 ? data[this.model.eventField] : data;
                scheduleData = scheduleData == null ? [] : scheduleData;

                if (self.model.eventStartField != null || self.model.eventEndField != null || self.model.titleField != null)
                    scheduleData = scheduleData.map(function (item) {
                        if (self.model.titleField != null)
                            item.title = item[self.model.titleField];
                        if (self.model.eventStartField != null)
                            item.start = item[self.model.eventStartField];
                        if (self.model.eventEndField != null)
                            item.end = item[self.model.eventEndField];
                        return item;
                    });

                scheduler.dataSource.data(scheduleData);

                if (scheduler.resources.length > 0)
                    scheduler.resources[0].dataSource.data(data[this.model.resourceField]);

                //this.model.data = data == null ? {} : data;
                //var scheduler = this.getScheduler();
                //scheduler.dataSource.data(data[this.model.eventField]);
                // scheduler.resources[0].dataSource.data(data[this.model.resourceField]);

                this.setData(result);

            },
            setData: function (data) {
                this.model.data = data;
                if (this.validator != null)
                    this.validator.hideMessages();

                if (this.observable == null) {
                    var bindElm = $("#" + this.Id).find('.form');
                    if (bindElm.length > 0) {
                        this.observable = kendo.observable(this.model);
                        kendo.bind(bindElm, this.observable);
                    }
                }
                else {
                    this.observable.set("data", data);
                }
            },
            resize: function () {
                var schedulerElm = $('#' + this.Id).find(".scheduler");
                var top = schedulerElm[0].getBoundingClientRect == null ? 0 : schedulerElm[0].getBoundingClientRect().top;
                var widget = schedulerElm.data("kendoScheduler");
                var height = (widget.height != null ? widget.height : window.innerHeight) - top - 40;
                height = height > this.model.minHeight ? height : this.model.minHeight;
                // Size the widget to take the whole view.
                widget.element.height(height);
                widget.resize(true);
            }
        });

        provider.kendo.TreeView = basepage.extend({
            init: function (id, model, containerselector, template) {
                var pageTemplate = template == null ? { html: "<div><h3 style='margin-left:5px;margin-top:5px;margin-bottom:5px;font-size:16px;'></h3></div><div class='treeview'></div>" } : template;
                this._super(id, model, pageTemplate, containerselector);
            },
            _loadTemplate: function (callback, isReplace) {
                var self = this;
                this._super(function () {

                    var curPage = $("#" + self.Id);
                    var title = curPage.find('h3');
                    title.html(self.model.title);
                    //create list
                    self.model.treeOptions = {
                        dataSource: self.model.dataSource
                    };


                    self.model.treeOptions.select = function (e) {
                        var treeView = e.sender;
                        var dataItem = treeView.dataItem(e.node);
                        e.dataItem = dataItem;
                        if (dataItem != null && dataItem.page != null && dataItem.page.url != null) {
                            $.each(self.pages, function (id, page) {
                                if (id != dataItem.page.Id)
                                    page.destroy();
                                else {
                                    var currentPage = self.pages[dataItem.page.Id];
                                    if (currentPage != null)
                                        if ($.isArray(dataItem.displayParams)) // dataItem.page.displayParams
                                            currentPage.display.apply(currentPage, dataItem.displayParams);
                                        else
                                            currentPage.display();
                                }
                            })

                        }
                        if ($.isFunction(self.handlers.select))
                            self.handlers.select(e);
                    }
                    var tree = $("#" + self.Id).find('.treeview');
                    //tree.kendoTreeView(self.model.treeOptions);
                    self.treeView = tree.tmTreeView(self.model.treeOptions)


                    if ($.isFunction(callback))
                        callback(self);
                }, isReplace);
            },
            _afterLoadData: function (data) {
                var self = this;
                var data = data != null ? data : this.model.data;
                data.forEach(function (item) {
                    if (item.page != null && item.page.url != null) {
                        var params = [self.Id + '-' + item.page.Id, self.model.pageSelector];
                        item.page.params = $.isArray(item.page.params) ? $.merge(params, item.page.params) : params;
                        self.loadPage(item.page);
                    }
                    else {
                        var childField = self.model.dataSource.schema != null ? self.model.dataSource.schema.model.children : 'items';
                        if ($.isArray(item[childField]))
                            item[childField].forEach(function (subItem) {
                                if (subItem.page != null && subItem.page.url != null) {
                                    var params = [self.Id + '-' + subItem.page.Id, self.model.pageSelector];
                                    subItem.page.params = $.isArray(subItem.page.params) ? $.merge(params, subItem.page.params) : params;
                                    self.loadPage(subItem.page);
                                }
                            })

                    }

                })
                var treeViewData = $.isArray(data) ? data : (this.model.dataSourceField != null ? data[this.model.dataSourceField] : []);
                this.refreshData(treeViewData);

                this._super(data);
            },
            _getTreeView() {
                return this.treeView;
            },
            refreshData: function (data) {
                var tree = this._getTreeView();
                var self = this;
                if (this.dataSource == null) {
                    this.dataSource = {
                        data: data,
                        schema: self.model.dataSource.schema
                    }

                    tree.setDataSource(this.dataSource);
                } else {
                    //tree.dataSource.data(data);
                    tree.setData(data);

                }


            },
            convertLocaleModel: function () {
                var self = this;
                this.getLocaleLabels('title');
            },
            setSelectHandler: function (handler) {
                if ($.isFunction(handler))
                    this.handlers.select = handler;
            }
        });
    }
    
    return provider;
})



   






