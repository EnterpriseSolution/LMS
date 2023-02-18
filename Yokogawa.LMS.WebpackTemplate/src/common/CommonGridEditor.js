export let CommonGridEditors = {};

CommonGridEditors.CustomerEditor = function (container, options) {
    $('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoComboBox({
            filter: "contains",
            autoBind: false,
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        //ajax call
                        var service = new MasterDataService(TLSVP.ServiceDomain);
                        service.getCustomerList(function (result) {
                            options.success(result);
                        });
                    }
                }
            }
        });
};

CommonGridEditors.ProductEditor = function (container, options) {
    $('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoComboBox({
            filter: "contains",
            autoBind: false,
            dataTextField: "ProductName",
            dataValueField: "Id",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        //ajax call
                        var service = new MasterDataService(TLSVP.ServiceDomain);
                        service.getProudctList(function (result) {
                            options.success(result);
                        });
                    }
                }
            }
        });
};

CommonGridEditors.UOMEditor = function (container, options) {
    $('<input required name="' + options.field + '"' + ' validationmessage="Uom is required." ' + '/>')
        .appendTo(container)
        .kendoComboBox({
            filter: "contains",
            autoBind: false,
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        //ajax call
                        var result = VesselOrder.Model.UomList;
                        options.success(result);
                    }
                }
            }
        });
};

CommonGridEditors.OrderTypeEditor = function (container, options) {
    $('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        var result = [
                            { Id: 1, Name: 'Loading' },
                            { Id: 2, Name: 'Discharge' }
                        ];
                        options.success(result);
                    }
                }
            }
        });
};

/**
 * only for Customer Order TANK List => Grid => Target dropdown selection
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.TankTargetTypeEditor = function (container, options) {

    var orderType = parseFloatValue(options.model.OrderType);
    var loadingTargets = utils.cloneModel(options.model.ListEnumLoadingTankTargetTypes);
    var dischargeTargets = utils.cloneModel(options.model.ListEnumDischargeTankTargetTypes);

    $('<input required name="Target"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataTextField: "Description",
            dataValueField: "Code",
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        //var result = [
                        //   { Code: 1, Description: 'Loading' },
                        //   { Code: 2, Description: 'Discharge' }
                        //];
                        //options.success(result);

                        var result = [];
                        if (orderType === 1) {
                            result = [];
                            //loading TANK target LIST
                            $.each(loadingTargets, function (index, item) {
                                result.push(item);
                            });
                        } else if (orderType === 2) {
                            result = [];
                            // discharge TANK target List
                            $.each(dischargeTargets, function (index, item) {
                                result.push(item);
                            });
                        }

                        options.success(result);
                    }
                }
            },
            change: function (e) {
                var item = e.sender;
                var seltValue = item.value();
                var seltText = item.text();

                options.model.Target = seltValue;
                options.model.TargetName = seltText;
                options.model.TargetDisplayName = seltText;
                // Use the value of the widget
            }
        });
};

/**
 * only for Customer Order TANK List => Grid => Norminate input value validator checker
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.TankNorminateEditor = function (container, options) {
    var tankUOM = parseFloatValue(options.model.UOM);

    if (tankUOM === 7) {
        $('<input maxlength="14" required name="Norminate" data-bind="value:Norminate" oninput="NumKey_BigWeight(this,0)">')
            .appendTo(container)
            .kendoTextBox({
                change: function (e) {
                    var item = e.sender;
                    var seltValue = item.value();

                    options.model.Norminate = seltValue;
                    // Use the value of the widget
                }
            });
    } else {
        $('<input maxlength="14" required name="Norminate" data-bind="value:Norminate" oninput="NumKey_BigWeight(this,3)">')
            .appendTo(container)
            .kendoTextBox({
                change: function (e) {
                    var item = e.sender;
                    var seltValue = item.value();

                    options.model.Norminate = seltValue;
                    // Use the value of the widget
                }
            });
    }

};

/**
 * only for Customer Order => BOL Instruction Cutting Plan TANK List => Grid => Target dropdown selection
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.BillTankTargetTypeEditor = function (container, options) {

    var listTargets = utils.cloneModel(options.model.ListEnumTargets);

    $('<input required name="Target"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataTextField: "Description",
            dataValueField: "Code",
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        //var result = [
                        //   { Code: 1, Description: 'Loading' },
                        //   { Code: 2, Description: 'Discharge' }
                        //];
                        //options.success(result);

                        var result = [];
                        result = [];
                        //loading TANK target LIST
                        $.each(listTargets, function (index, item) {
                            result.push(item);
                        });

                        options.success(result);
                    }
                }
            },
            change: function (e) {
                var item = e.sender;
                var seltValue = item.value();
                var seltText = item.text();

                options.model.Target = seltValue;
                options.model.TargetName = seltText;
                options.model.TargetDisplayName = seltText;
                // Use the value of the widget
            }
        });
};


/**
 * only for Customer Order  => BOL Instruction Cutting Plan TANK List => Grid => Norminate input value validator checker
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.BillTankNorminateEditor = function (container, options) {
    var tankUOM = parseFloatValue(options.model.UOM);

    if (tankUOM === 7) {
        $('<input maxlength="14" required name="TargetQTY" data-bind="value:QtyTarget" oninput="NumKey_BigWeight(this,0)">')
            .appendTo(container)
            .kendoTextBox({
                change: function (e) {
                    var item = e.sender;
                    var seltValue = item.value();

                    options.model.QtyTarget = seltValue;
                    // Use the value of the widget
                }
            });
    } else {
        $('<input maxlength="14" required name="TargetQTY" data-bind="value:QtyTarget" oninput="NumKey_BigWeight(this,3)">')
            .appendTo(container)
            .kendoTextBox({
                change: function (e) {
                    var item = e.sender;
                    var seltValue = item.value();

                    options.model.QtyTarget = seltValue;
                    // Use the value of the widget
                }
            });
    }

};

/**
 * only for Customer Order  => BOL Instruction Cutting Plan TANK List => Grid => Actual Qty input value validator checker
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.BillTankActualEditor = function (container, options) {
    var tankUOM = parseFloatValue(options.model.UOM);

    if (tankUOM === 7) {
        $('<input maxlength="14" required name="ActualQTY" data-bind="value:QtyActual" oninput="NumKey_BigWeight(this,0)">')
            .appendTo(container)
            .kendoTextBox({
                change: function (e) {
                    var item = e.sender;
                    var seltValue = item.value();

                    options.model.QtyActual = seltValue;
                    // Use the value of the widget
                }
            });
    } else {
        $('<input maxlength="14" required name="ActualQTY" data-bind="value:QtyActual" oninput="NumKey_BigWeight(this,3)">')
            .appendTo(container)
            .kendoTextBox({
                change: function (e) {
                    var item = e.sender;
                    var seltValue = item.value();

                    options.model.QtyActual = seltValue;
                    // Use the value of the widget
                }
            });
    }

};

/**
 * only for Customer Order => BOL Instruction Cutting Plan TANK List => Grid => Is Blending dropdown selection
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.BillTankIsBlendingEditor = function (container, options) {

    var listBlendings = utils.cloneModel(options.model.ListEnumIsBlendings);

    $('<input required name="IsBlending"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataTextField: "Description",
            dataValueField: "Code",
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        //var result = [
                        //   { Code: 1, Description: 'Loading' },
                        //   { Code: 2, Description: 'Discharge' }
                        //];
                        //options.success(result);

                        var result = [];
                        result = [];
                        //loading TANK target LIST
                        $.each(listBlendings, function (index, item) {
                            result.push(item);
                        });

                        options.success(result);
                    }
                }
            },
            change: function (e) {
                var item = e.sender;
                var seltValue = item.value();
                var seltText = item.text();

                options.model.BlendingFlag = seltValue;
                options.model.BlendingFlagName = seltText;
                // Use the value of the widget
            }
        });
};


/**
 * only for Customer Order  => Sub Operations List => Grid => Qty GSV input value validator checker
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.SubOrderQtyGSVEditor = function (container, options) {
    // only for Sub Operations -> QTY GSV input value checker
    $('<input maxlength="14"  name="ActualQTY" data-bind="value:ActualQTY" oninput="NumKey_BigWeight(this,3)">')
        .appendTo(container)
        .kendoTextBox({
            change: function (e) {
                var item = e.sender;
                var seltValue = item.value();

                options.model.ActualQTY = seltValue;
                // Use the value of the widget
            }
        });
};

/**
 * only for Customer Order  => Sub Operations List => Grid => Qty MT input value validator checker
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.SubOrderQtyMTEditor = function (container, options) {
    // only for Sub Operations -> QTY MT input value checker
    $('<input maxlength="14"  name="ActualMT" data-bind="value:ActualMT" oninput="NumKey_BigWeight(this,0)">')
        .appendTo(container)
        .kendoTextBox({
            change: function (e) {
                var item = e.sender;
                var seltValue = item.value();

                options.model.ActualMT = seltValue;
                // Use the value of the widget
            }
        });
};

/**
 * only for Customer Order  => Sub Operations List => Grid => Start Time input value validator checker
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.SubOrderStartTimeEditor = function (container, options) {
    // only for Sub Operations -> Start Time input value checker
    $('<input maxlength="24"  data-interval="15" data-type="date" data-bind="value:StartTimeString">')
        .appendTo(container)
        .kendoDateTimePicker({
            change: function (e) {
                var item = e.sender;
                var seltValue = item.value();

                //var format = "yyyy-MM-ddTHH:mm:ssZ";
                //options.model.StartTimeString = kendo.parseDate(seltValue, format);

                var seltValueString = utils.toDateString(seltValue, "dd MMM yyyy, HH:mm:ss");
                options.model.StartTimeString = seltValueString;
                // Use the value of the widget
            }
        });
};

/**
 * only for Customer Order  => Sub Operations List => Grid => End Time input value validator checker
 * @param {} container 
 * @param {} options 
 * @returns {} 
 */
CommonGridEditors.SubOrderEndTimeEditor = function (container, options) {
    // only for Sub Operations -> End Time input value checker
    $('<input maxlength="24"  data-interval="15" data-type="date" data-bind="value:FinishTimeString">')
        .appendTo(container)
        .kendoDateTimePicker({
            change: function (e) {
                var item = e.sender;
                var seltValue = item.value();

                //var format = "yyyy-MM-ddTHH:mm:ssZ";
                //options.model.FinishTimeString = kendo.parseDate(seltValue, format);

                var seltValueString = utils.toDateString(seltValue, "dd MMM yyyy, HH:mm:ss");
                options.model.FinishTimeString = seltValueString;
                // Use the value of the widget
            }
        });
};

CommonGridEditors.Decimal3Editor = function (container, options) {
    $('<input name="' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            format: "{0:n3}",
            decimals: 3,
            step: 0.001
        });
};





