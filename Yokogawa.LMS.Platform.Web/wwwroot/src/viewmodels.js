define(["app/services" + platForm.fileExtension, "app/models" + platForm.fileExtension], function (services,models) {
    var config, ui, uiServices, uiModel, uiProfile, utils;
    var eworkspace = null;

    var exportViewModel = function (name, viewmodel) {
        if (!$.isFunction(eworkspace.ViewModel[name]) && $.isFunction(viewmodel))
            eworkspace.ViewModel[name] = viewmodel;
    }
    
    var ViewModels = function (appConfig,instance,profile) {
        config = appConfig;
        uiModel = models;
        uiProfile = profile;
        ui = this;
        eworkspace = instance.exportCore();
        utils = eworkspace.utils;
        instance.registerComponent("eworkspace.ViewModel", this);
        uiServices = new services(config, uiProfile, instance, utils);
        /*exportViewModel("info", ui.info);
        exportViewModel("warning", ui.warning);
        exportViewModel("error", ui.error);*/
        exportViewModel("SelectContactDialog", ui.SelectContactDialog);
        exportViewModel("SelectApproverDialog", ui.SelectApproverDialog);
    }

    ViewModels.prototype = {
        init: function (callback) {
            utils.getTemplate(eworkspace.framework.template.url, function (html) {
                console.info('platform UI retrieved')
                $('body').append(html);

                if ($.isFunction(callback))
                    callback();
            });
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
        Default: function (id, selector) {
            var template = { html: '<hr/>' }
            var model = { data: null };
            var page = new eworkspace.framework.NPage(id, model, template, selector);
            return page;
        },
        UserList: function (id, selector) {
            var userList = new eworkspace.framework.ListPage(id, uiModel.UserList, selector);

            userList.setView = function (userType) {
                userList.view = userType;
                switch (userList.view) {
                    case 'eworkspace':
                        userList.setLoadDataHandler(uiServices.getUserList);
                        break;
                    case 'ad':
                        userList.setLoadDataHandler(uiServices.getADUserList);
                        break;
                }
            }

            userList.initView = function () {
                var btnNew = userList._getButton("new");
                var btnEdit = userList._getButton("edituser");
                var btnEditAD = userList._getButton("editaduser");
                var btnNewAD = userList._getButton("newaduser");
                switch (userList.view) {
                    case 'eworkspace':
                        btnNew.show();
                        btnEdit.show();
                        btnEditAD.hide();
                        btnNewAD.hide();
                        break;
                    case 'ad':
                        btnNew.hide();
                        btnEdit.hide();
                        btnEditAD.show();
                        btnNewAD.show();
                        break;
                }
            }

            userList.setView("eworkspace");
            
            userList.setLoadCompletedHandler(function (data) {
                var filter = userList._getfilter('userType').data("kendoDropDownList");
                if (filter.value() != userList.view) {
                    filter.value(userList.view);
                    userList.initView()
                }
            });

            userList.onButtonClickById('new', function (page) {
                //page.previous = userList;
                page.navigate("id=null");
            });

            userList.onButtonClickById('newaduser', function (page) {
                page.navigate("id=null");
            });

            userList.onButtonClickById('edituser', function (page) {
                //page.previous = userList;
                var data = userList.getSelectedRow();
                
                if (data != null)
                {
                    page.navigate("id="+data.Id);
                }
                else {
                    ui.warning('Please select a record');
                    userList.show();
                }
            });
            userList.onButtonClickById('editaduser', function (page) {
                //page.previous = userList;
                var data = userList.getSelectedRow();

                if (data != null)
                {
                    page.navigate("id=" + data.Id);//page.display(data.Id);
                }
                else {
                    ui.warning('Please select a record');
                    userList.show();
                }
            });
            userList.onButtonClickById('delete', function (page) {
                var data = userList.getSelectedRow();

                if (data != null) {
                    if (data.Id == 1) {
                        ui.warning("Cannot delete system admin account");
                        return;
                    }
                        
                    var btnEditAD = userList._getButton("editaduser");
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        if (btnEditAD.is(":visible") === true)
                            uiServices.deleteADUser(data.Id, function () {
                                userList.display();
                                ui.info('Successfully delete the record!');
                            })
                        else
                            uiServices.deleteUser(data.Id, function () {
                                userList.display();
                                ui.info('Successfully delete the record!');
                            });
                      
                    })

                }
                else {
                    ui.warning('Please select a record');
                    userList.show();
                }
            });
            userList.onFilterById('userType', function (e) {
                var value = this.value();
                userList.setView(value);
                userList.initView();
                /*var btnNew = userList._getButton("new");
                var btnEdit = userList._getButton("edituser");
                var btnEditAD = userList._getButton("editaduser");
                var btnNewAD = userList._getButton("newaduser");
                switch (value) {
                    case 'eworkspace':
                        userList.setLoadDataHandler(uiServices.getUserList);
                        btnNew.show();
                        btnEdit.show();
                        btnEditAD.hide();
                        btnNewAD.hide();
                        break;
                    case 'ad':
                        userList.setLoadDataHandler(uiServices.getADUserList);
                        btnNew.hide();
                        btnEdit.hide();
                        btnEditAD.show();
                        btnNewAD.show();
                        break;
                }*/
                userList.display();
            });

            userList.setEventHandler(function () {
                var gridSelect = function (e) {
                    var selectedRows = this.select();
                    var dataItem = this.dataItem(selectedRows[0]);
                    userList.setButtonVisibleById("delete", dataItem.IsSystemDefined==false);
                }
                var grid = userList._getGrid();
                grid.bind("change", gridSelect);
          
            })
     
            return userList;
        },
        MaintainUser: function (id, selector) {
            //var model = utils.cloneModel(uiModel.MaintainUser);
            var maintainUser = new eworkspace.framework.WorkflowPage(id, uiModel.MaintainUser, selector);
            maintainUser.setLoadDataHandler(uiServices.getUserDetails);
            maintainUser.setLoadCompletedHandler(function (data) {
                maintainUser.toggleNavigationbar(2, data.SFASettings.length > 0)
                maintainUser.setButtonVisible("DELETE", data.IsSystemDefined ==false);
                var pg = maintainUser.getNavigationPage(0);
                pg.model.IsAdUser = false;
                    
            });

            maintainUser.onToolBarItemClick(0, function () {
                maintainUser.navigate("id=null");
            });
            maintainUser.onToolBarItemClick(1, function () {
                var page = maintainUser.pages[maintainUser.model.navigation[0].page.Id];
   
                page.saveUser(function (user) {
                    user.RoleIds = maintainUser.model.data.RoleIds;
                    user.SFASettings = maintainUser.model.data.SFASettings;

                    uiServices.saveUser(user, function (data) {
                        ui.info("Save the record!");
                        //maintainUser.display(data.Id);
                        maintainUser.navigate("id="+data.Id);
                        
                    })
                })

            });
            maintainUser.onToolBarItemClick(2, function () {
                //maintainUser.previous.display();
                maintainUser.parent.setView('eworkspace');
                maintainUser.parent.navigate();
            });
            maintainUser.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainUser.model.data.Id;
                    uiServices.deleteUser(id, function () {
                        //maintainUser.previous.display();
                        maintainUser.parent.navigate();
                        ui.info('Successfully delete the record!');
                    })
                })
            })
     
            return maintainUser;
        },
        MaintainADUser: function (id, selector) {
            var model = uiModel.MaintainADUser;// utils.cloneModel(uiModel.MaintainADUser);
            var maintainUser = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainUser.setLoadDataHandler(uiServices.getADUserDetails);
            
            maintainUser.setLoadCompletedHandler(function (data) {
                maintainUser.toggleNavigationbar(2, data.SFASettings.length > 0)
                var pg = maintainUser.getNavigationPage(0);
                pg.model.IsAdUser = true;
            });

            maintainUser.onToolBarItemClick(0, function () {
                var page = maintainUser.pages[maintainUser.model.navigation[0].page.Id];

                page.saveUser(function (user) {
                    user.RoleIds = maintainUser.model.data.RoleIds;
                    user.SFASettings = maintainUser.model.data.User2FAList;
                    uiServices.saveADUser(user, function (data) {
                        ui.info("Save the record!");
                        maintainUser.display(user.Id);

                    })

           
                })

            });
            maintainUser.onToolBarItemClick(1, function () {
                maintainUser.parent.setView('ad')
                maintainUser.parent.navigate();//maintainUser.previous.display();
            });
            maintainUser.onToolBarItemClick(2, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var userId = maintainUser.model.data.UserId;
                    uiServices.deleteADUser(userId, function () {
                        maintainUser.parent.navigate();//maintainUser.previous.display();
                        ui.info('Successfully delete the record!');
                        
                    })
                })
            })

            return maintainUser;
        },
        UserDetails: function (id, selector) {
            var template = { Id: 'userform', url: "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: null };
            var details = new eworkspace.framework.Form(id, model, template, selector);
            details.setLoadCompletedHandler(function (data) {
                var iptUserId = $('#' + details.Id).find("input[name='User Id']");
                if (iptUserId.length || details.model.IsAdUser == true) {
                    if (data.Id > 0) {
                        iptUserId.prop('disabled', true);
                    } else {
                        iptUserId.prop('disabled', false)
                    }
                }

                var iptPassword = $('#' + details.Id).find("input[type='password']");
                if (details.model.IsAdUser == true) {
                    $('#' + details.Id).find("span.password").hide();
                    iptPassword.attr('disabled', 'disabled');
                }
                else {
                    $('#' + details.Id).find("span.password").show();
                    iptPassword.removeAttr('disabled');
                }
            });
            details.setValidatorOptions({
                rules: {
                    email: function (input) {
                        var isValid = true;
                        if (input.is("[data-email-msg]") && input.val() != "") {
                            var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                            isValid = filter.test(input.val());
                        }
                        return isValid;
                    },
                    password: function (input) {
                        var isValid = true;
                        if (input.is("[data-password-msg]") && input.val() != "") {
                            var pwd = input.val();

                            isValid = pwd.length >= 8;

                            if (isValid) {
                                var regx = /^[\d]*[a-z_@][a-z\d_@]*$/gi //^[A-Za-z0-9 _.-]+$/;
                                isValid = regx.test(pwd);
                            }
                        }
                        return isValid;
                    },
                    confirmPassword: function (input) {
                        var isValid = true;
                        if (input.is("[data-confirmpassword-msg]") && input.val() != "") {
                            var pwd = $("[name='" + input.data("confirmpassword-field") + "']").val();
                            isValid = pwd === input.val();
                        }
                        return isValid;
                    }
                }
            });
            details.saveUser = function (callback) {

                if (details.validator.validate() == false) {
                    ui.error('Please enter the required fields');
                    return;
                }

                var user = utils.cloneModel(details.observable.get('data'));
                user.Password = window.btoa(user.NewPassword);
                if ($.isFunction(callback))
                    callback(user);
            }

            return details;
        },
        AssignRoles: function (id, selector) {
            var model = uiModel.AssignRoles;
            var assignRolePage = new eworkspace.framework.List(id, model, selector);
            assignRolePage.setLoadDataHandler(uiServices.getRoleList);
            assignRolePage.checkedIds = {};
            assignRolePage.setLoadCompletedHandler(function (data) {
                assignRolePage.checkedIds = {};
                assignRolePage.parent.model.data.RoleIds.forEach(function (id) {
                    assignRolePage.checkedIds[id] = id;
                });
            });
            assignRolePage.setGridDataBound(function onDataBound(e) {
                var grid = assignRolePage._getGrid();
                var view = eworkspace.framework.gridAdapter.view(grid);
                var data = eworkspace.framework.gridAdapter.data(grid);
                
                var checkAll = $('#' + assignRolePage.Id).find("input[type=checkbox][name=check-all]");
                for (var i = 0; i < view.length; i++) {
                    var row = eworkspace.framework.gridAdapter.tableRow(i, grid);
             
                    if (assignRolePage.checkedIds[view[i].Id]) {
                        row.addClass("k-state-selected").find(".checkbox").attr("checked", "checked");
                    }
                    else {
                        row.removeClass("k-state-selected").find(".checkbox").attr("checked", false);
                    }
                }
                if (assignRolePage.parent.model.data.RoleIds.length == data.length && data.length>0) {
                    checkAll.prop('checked', true);
                } else {
                    checkAll.prop('checked', false);
                }
            });

            assignRolePage.setEventHandler(function () {
                //on dataBound event restore previous selected rows:
                function selectRow() {
                    var grid = assignRolePage._getGrid();
                    var checked = this.checked,row = $(this).closest("tr"),dataItem = grid.dataItem(row);
                    var data = eworkspace.framework.gridAdapter.data(grid);
          
                    if (checked) {
                        //-select the row
                        row.addClass("k-state-selected");
                        assignRolePage.checkedIds[dataItem.Id] = dataItem.Id;

                    } else {
                        //-remove selection
                        row.removeClass("k-state-selected");
                        if (assignRolePage.checkedIds[dataItem.Id])
                            delete assignRolePage.checkedIds[dataItem.Id];
                    }

                    var roles = []
                    $.each(assignRolePage.checkedIds, function (id, item) {
                        roles.push(item);
                    })

                    assignRolePage.parent.model.data.RoleIds = roles;
                    if (assignRolePage.parent.model.data.RoleIds.length == data.length) {
                        checkAll.prop('checked', true);
                    } else {
                        checkAll.prop('checked', false);
                    }
                };
                var grid = assignRolePage._getGrid();
                var table = eworkspace.framework.gridAdapter.table(grid);
                table.on("click", ".checkbox", selectRow);
                //grid.hideColumn("Id");
                var checkAll = $('#' + assignRolePage.Id).find("input[type=checkbox][name=check-all]");
                //select all
                checkAll.click(function () {
                    var checkboxs = $('#' + assignRolePage.Id).find('.checkbox');

                    if (checkAll.is(':checked')) {
                        checkboxs.prop('checked', true);
                        assignRolePage.model.data.forEach(function (role) {
                            assignRolePage.checkedIds[role.Id] = role.Id;
                        })
                    } else {
                        checkboxs.prop('checked', false);
                        assignRolePage.checkedIds = {};
                    }
                    var roles = []
                    $.each(assignRolePage.checkedIds, function (id, item) {
                        roles.push(item);
                    })
                    assignRolePage.parent.model.data.RoleIds = roles;
                });
                //on click of the checkbox:
                
                $('#' + assignRolePage.Id).css('margin-top', 30);
            })


            return assignRolePage;
        },
        AssignRolesToMenu: function (id, selector) {
            var page = new ui.AssignRoles(id, selector);
            page.setLoadDataHandler(uiServices.getNormalRoles);
            return page;
        },
        User2FASetting: function (id, selector) {
            var template = { Id: 'User2FAform', url: "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: [] };
            var details = new eworkspace.framework.Form(id, model, template, selector);
           
            details.setFormLoadedHandler(function () {
                $("#" + details.Id).find('button.generate').click(function (e) {
                    var providerId = (e.currentTarget.id).split("_")[1];
                    var settings = $.grep(details.model.data, function (item) { return item.ProviderId == providerId });
                    uiServices.generateUserSecret(settings[0], function (result) {
                        details.model.data.forEach(function (item) {
                            if (item.ProviderId == result.ProviderId) {
                                item.Secret = result.Secret;
                            }
                            
                            details.replace();
                            ui.info("New Secret Generated");  
                        })
                    });
                    
                })
            })

            return details;
        },
        MenuList: function (id, selector) {
            var menuList = new eworkspace.framework.ListPage(id, uiModel.MenuList, selector);
            menuList.setLoadDataHandler(uiServices.getMenuList);

            //create menu
            menuList.onButtonClick(1, function (page) {
                //page.previous = menuList;
                page.navigate("id=null");
            });
            //edit menu
            menuList.onButtonClick(2, function (page) {
                page.previous = menuList;
                var grid = menuList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null)
                    page.navigate("id="+data.Id);//page.display(data.Id);
                else {
                    ui.warning('Please select a record');
                    menuList.show();
                }
            });
            //delete menu
            menuList.onButtonClick(3, function (page) {
                var grid = menuList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    if (data.Id == 1) {
                        ui.warning("Cannot delete system predefined menus");
                        return;
                    }
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deleteMenu(data.Id, function () {
                            menuList.display();
                            ui.info('Successfully delete the record!');
                        })
                    })

                }
                else {
                    ui.warning('Please select a record');
                    menuList.show();
                }
            })
            menuList.setEventHandler(function () {
                var gridSelect = function (e) {
                    var selectedRows = this.select();
                    var dataItem = this.dataItem(selectedRows[0]);
                    menuList.setButtonVisible(3, dataItem.IsChecked);
                }
                var grid = menuList._getGrid();
                grid.bind("change", gridSelect);

            })

            return menuList;
        },
        MaintainMenu: function (id, selector) {
            var model = uiModel.MaintainMenu;// utils.cloneModel(uiModel.MaintainMenu);
            var maintainMenu = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainMenu.setLoadDataHandler(uiServices.getMenuDetails);

            maintainMenu.setLoadCompletedHandler(function (data) {
                var parents = [];
                maintainMenu.parent.model.data.forEach(function (menu) {
                    if (data.Id !== menu.Id)
                        parents.push({Id:menu.Id,Name: (menu.ParentName.length?menu.ParentName+" > ":"") +menu.Name})
                })

                data.Parents = parents.sort(function (a, b) {
                    if (a.Name < b.Name)
                        return -1;
                    if (a.Name > b.Name)
                        return 1;
                    return 0;
                    
                });

                //data.Parents.unshift({ Id: 0, Name: 'Select Option' });
                maintainMenu.setButtonVisible("DELETE", data.IsChecked);
                maintainMenu._setNavigationMenuVisible(1, data.IsUserLevel)

            });

            maintainMenu.onToolBarItemClick(0, function () {
                maintainMenu.display(null);
            });
            maintainMenu.onToolBarItemClick(1, function () {
                var page = maintainMenu.pages[maintainMenu.model.navigation[0].page.Id];
                page.Save(function (menu) {
                    menu.RoleIds = maintainMenu.model.data.RoleIds;
                    //save data
                    uiServices.saveMenu(menu, function (data) {
                        ui.info("Save the record!");
                        maintainMenu.display(data.Id);
                    })
                })
               
            });
            maintainMenu.onToolBarItemClick(2, function () {
                maintainMenu.parent.navigate();
            });
            maintainMenu.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainMenu.model.data.Id;
                    uiServices.deleteMenu(id, function () {
                        ui.info('Successfully delete the record!');
                        maintainMenu.parent.navigate();
                    })
                })
            });

            return maintainMenu;
        },
        MenuDetails: function (id, selector) {
            var template = { Id: 'menuform', url: "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: null };
            var details = new eworkspace.framework.Form(id, model, template, selector);
            details.Save = function (callback) {
                if (details.validator.validate() == false) {
                    ui.error('Please enter the required fields');
                    return;
                }
                var menu = utils.cloneModel(details.getData());
                if ($.isFunction(callback))
                    callback(menu);
            }
            return details;
        },
        DashboardList: function (id, selector) {
            var model = utils.cloneModel(uiModel.DashboardList);
            var dashboardList = new eworkspace.framework.ListPage(id, model, selector);
            dashboardList.setLoadDataHandler(uiServices.getDashboards);

            dashboardList.onButtonClick(1, function (page) {
                //page.previous = dashboardList;
                //page.display(null);
                page.navigate("id=null");
            });


            dashboardList.onButtonClick(2, function (page) {
                page.previous = dashboardList
                var grid = dashboardList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);
                if (data != null)
                    page.navigate("id="+data.Id);//page.display(data.Id);
                else {
                    ui.warning('Please select a record');
                    dashboardList.show();
                }

            });


            dashboardList.onButtonClick(3, function (page) {
                var grid = dashboardList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deleteDashboard(data.Id, function () {
                            dashboardList.display();
                            ui.info('Successfully delete the record!');
                        })
                    })

                }
                else {
                    ui.warning('Please select a record');
                    dashboardList.show();
                }
            })

            return dashboardList;
        },
        MaintainDashboard: function (id, selector) {
            var model = utils.cloneModel(uiModel.MaintainDashboard);

            var maintainDashboard = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainDashboard.setLoadDataHandler(uiServices.getDashboard);
     
            maintainDashboard.setEventHandler(function () {
                $("#" + maintainDashboard.Id).find(".pages").css('min-width', '680px');
            })

            maintainDashboard.onToolBarItemClick(0, function () {
                //maintainDashboard.display(null);
                maintainDashboard.navigate("id=null");
            });

            maintainDashboard.onToolBarItemClick(1, function () {
                var index = maintainDashboard._getSelectedTabIndex();
                var page = maintainDashboard.pages[maintainDashboard.model.navigation[0].page.Id];

                page.save(function (dashboard) {
                    dashboard.RoleIds = maintainDashboard.model.data.RoleIds;
                    dashboard.UserIds = maintainDashboard.model.data.UserIds;

                    uiServices.saveDashboard(dashboard, function (data) {
                        maintainDashboard.display(data.Id);
                        ui.info("Save the record!");
                    });
                })

            });

            maintainDashboard.onToolBarItemClick(2, function () {
                maintainDashboard.parent.navigate();//.display();
            });

            maintainDashboard.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainDashboard.model.data.Id;
                    uiServices.deleteDashboard(id, function () {
                        //maintainDashboard.display();
                        maintainDashboard.parent.navigate();
                        ui.info('Successfully delete the record!');
                    })

                })
            })

            return maintainDashboard;
        },
        DashboardDetails: function (id, selector) {
            var template = { Id: 'dashboardsettings', url: "src/view/framework_" + platForm.provider + ".html" }
            var model = {
                data: null,
                defaultOptions: [{ text: "No", value: false }, { text: "Yes", value: true }]
            };

            var details = new eworkspace.framework.Form(id, model, template, selector);
            details.setLoadCompletedHandler(function (data) {
                var row = data.Layout > 3 ? 2 : 0;
                var col = row > 0 ? data.Layout - 4 : data.Layout - 1;
                var td = $("#" + details.Id).find(".layout tr:eq(" + row + ") td:eq(" + col + ")");
                td.click();
            })

            details.setEventHandler(function () {
                var layoutselector = $("#" + details.Id).find(".layout");
                var views = $("#" + details.Id).find(".views");
                var tds = layoutselector.find("td");
                tds.click(function () {
                    tds.removeClass("tdhover");
                    $(this).addClass("tdhover");
                    var $tr = $(this).closest('tr');
                    var row = $tr.index() > 0 ? 1 : 0;
                    var layoutType = row * 3 + $(this).index() + 1;
                    var layouthtml = $(this).find(".item").html();
                    views.html(layouthtml);
                    var content = '<div class="content"></div>';
                    $(views).find(".colgrid").replaceWith(content);

                    if (layoutType == 6) {
                        var col = $($(views).find(".content")[0]);
                        col.css("margin-right", "5px");
                        col.height(270);
                    }

                    if (layoutType == 5) {
                        var col = $($(views).find(".col-xs-4"));
                        col.css("padding-left", "1px");
                        col.css("padding-right", "1px");
                    }

                    var cols = $(views).find(".content");
                    for (i = 0; i < cols.length; i++) {
                        var width = $(cols[i]).width() - 5;
                        var html = '<table style="height:100%;width:100%"><tr><td style="vertical-align:middle"><select style="width:' + width + 'px"></select></td></tr></table>';
                        $(cols[i]).append(html);
                    }


                    details.model.data.Layout = layoutType;
                    details.display(function (data) {
                        var ddls = views.find("select");

                        for (i = 0; i < ddls.length; i++) {
                            data["ViewId" + i] = i < data.ViewIds.length ? data.ViewIds[i] : '';
                            $(ddls[i]).kendoDropDownList({
                                optionLabel:"Select View",
                                dataTextField: "Description",
                                dataValueField: "Id",
                                dataSource: data.ViewSource,
                            });

                            if (data["ViewId" + i].length > 0) {
                                var dropdownlist = $(ddls[i]).data("kendoDropDownList");
                                dropdownlist.value(data["ViewId" + i]);
                            }
                            
                           
                        }

                    });

                });

                details.handlers.loadCompletedHandler(details.model.data);
            });

            details.save = function (callback) {
                if (!details.validator.validate())
                {
                    ui.error("Please enter the required fields");
                    return;
                }

                var dashboard = utils.cloneModel(details.getData());
             
                ddls = $("#" + details.Id).find('.views').find('select');
                var viewIds = [];
                for (i = 0; i < ddls.length; i++) {
                    var dropdownlist = $(ddls[i]).data("kendoDropDownList");
                    dashboard["ViewId" + i] = dropdownlist.value();
                    if (dashboard["ViewId" + i] != null && dashboard["ViewId" + i] !== "") {
                        viewIds.push(dashboard["ViewId" + i]);
                    }
                }
                dashboard.ViewIds = viewIds;
                if ($.isFunction(callback))
                    callback(dashboard);
            }

            return details;
        },
        ShareDashboard: function (id, selector) {
            var model = utils.cloneModel(uiModel.AssignRoles);
            model.title = "Share To:";

            var sharePage = new eworkspace.framework.List(id, model, selector);
            sharePage.pagetemplate.html += "<button style='margin-top:10px;margin-bottom:20px;float:right;width:80px;height:25px' class='k-primary publish' data-bind='visible: isVisible'></button>"
            sharePage.setLoadDataHandler(uiServices.getRoleList);
            sharePage.checkedIds = {};

            sharePage.setLoadCompletedHandler(function (data) {
                var button = $("#" + sharePage.Id).find("button.publish");
                var grid = sharePage._getGrid();
                if (sharePage.parent.model.data != null && sharePage.parent.model.data.Id !== "") {
                    sharePage.model.isVisible = true;
                    grid.showColumn("Id");
                }
                else {
                    sharePage.model.isVisible = false;
                    grid.hideColumn("Id");
                }

                var btnText = sharePage.parent.model.data.IsPublish ? "Unpublish" : 'Publish';
                button.text(utils.getLocaleLabel(btnText));
          
                sharePage.checkedIds = {};
                sharePage.parent.model.data.RoleIds.forEach(function (roleId) {
                    sharePage.checkedIds[roleId] = roleId;
                });

                var checkAll = $('#' + sharePage.Id).find("input[type=checkbox][name=check-all]");
                checkAll.prop('checked', false);

        
            })

            sharePage.setEventHandler(function () {
                //on dataBound event restore previous selected rows:
                var grid = sharePage._getGrid();
                grid.table.on("click", ".checkbox", selectRow);
                grid.hideColumn("Id");
                var checkAll = $('#' + sharePage.Id).find("input[type=checkbox][name=check-all]");
                //select all
                checkAll.click(function () {
                    var checkboxs = $('#' + sharePage.Id).find('.checkbox');

                    if (checkAll.is(':checked')) {
                        checkboxs.prop('checked', true);
                        sharePage.model.data.forEach(function (role) {
                            sharePage.checkedIds[role.Id] = role.Id;
                        })

                    } else {
                        checkboxs.prop('checked', false);
                        sharePage.checkedIds = {};
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
                        sharePage.checkedIds[dataItem.Id] = dataItem.Id;//checked;

                    } else {
                        //-remove selection
                        row.removeClass("k-state-selected");
                        if (sharePage.checkedIds[dataItem.Id])
                            delete sharePage.checkedIds[dataItem.Id];
                    }

                    var roles = []
                    $.each(sharePage.checkedIds, function (id, item) {
                        roles.push(id);
                    })

                    sharePage.parent.model.data.RoleIds = roles;
                };

                function onDataBound(e) {
                    var view = this.dataSource.view();

                    for (var i = 0; i < view.length; i++) {
                        if (sharePage.checkedIds[view[i].Id]) {
                            this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected")
                            .find(".checkbox")
                            .attr("checked", "checked");
                        }
                        else {
                            this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                            .removeClass("k-state-selected")
                            .find(".checkbox")
                            .attr("checked", false);

                        }

                    }
                };


                grid.bind("dataBound", onDataBound);

                var button = $("#" + sharePage.Id).find("button.publish");
                button.click(function () {
                    uiServices.publishDashboard(sharePage.parent.model.data.Id, function (result) {
                        sharePage.parent.model.data.IsPublish = result;
                        sharePage.parent.observable.set("data.IsPublish", result);
                        ui.info('Successfully ' + (result ? 'publish' : 'unpublish') + ' dashboard.')
                        var title = result ? 'Unpublish' : 'Publish';
                        title = utils.getLocaleLabel(title);
                        button.text(title);

                    })
                })

                $('#' + sharePage.Id).css('margin-top', 30);
            })
            return sharePage;
        },
        ShareDashboardToUser: function (id, selector) {
            var model = utils.cloneModel(uiModel.AssignUsersToRole);
            model.gridDataSourceField = 'Users';
            model.title = "Share To:";
            var page = new ui.AssignRoleToUsers(id, selector, model);
            page.pagetemplate.html += "<button style='margin-top:10px;margin-bottom:20px;float:right;width:80px;height:25px' class='k-primary publish' data-bind='visible: isVisible'></button>";
            page.onToolBarItemClick(1, function () {
                var gview = page._getGrid();
                var selectedUser = gview.dataItem(gview.select());
                var data = gview.dataSource.data();
                if (selectedUser != null) {
                    data = $.grep(data, function (item) {
                        return item.UserId != selectedUser.UserId;
                    });
                    page.setDataByField("Users", data);
                    page.refreshgridData(data);
                }
                else {
                    alert('Please select a user');
                }
            });
            page.onToolBarItemClick(2, function () {
                var data = [];
                page.setDataByField("Users",data);
                page.refreshgridData(data);
            });
            page.setGridDataBound(function onDataBound(e) {
                var grid = page._getGrid();
                var data = grid.dataSource.data();
                var users = JSON.parse(JSON.stringify(data));

                if (users.length > 0) {
                    var userIds = data.map(function (item) { return item.UserId });
                    page.setDataByField("UserIds", userIds);
                    page.parent.model.data.UserIds = userIds;
                }
            });

            page.setEventHandler(function () {
                var button = $("#" + page.Id).find("button.publish");
                button.click(function () {
                    uiServices.publishDashboard(sharePage.parent.model.data.Id, function (result) {
                        page.parent.model.data.IsPublish = result;
                        page.parent.observable.set("data.IsPublish", result);
                        ui.info('Successfully ' + (result ? 'publish' : 'unpublish') + ' dashboard.')
                        var title = result ? 'Unpublish' : 'Publish';
                        title = utils.getLocaleLabel(title);
                        button.text(title);

                    })
                })
            })
            return page;
        },
        Contacts: function (id, selector) {
            var model = utils.cloneModel(uiModel.Contacts);
            var contactsPage = new eworkspace.framework.List(id, model, selector);
            contactsPage.setLoadDataHandler(uiServices.getContactList);
            return contactsPage;
        },
        ContactList: function (id, selector) {
            var model = utils.cloneModel(uiModel.ContactList);
            var contactList = new eworkspace.framework.ListPage(id, model, selector);
            contactList.setLoadDataHandler(uiServices.getContactList);

            contactList.onButtonClick(1, function (page) {
                page.previous = contactList;
                page.display(null);
            })


            contactList.onButtonClick(2, function (page) {
                page.previous = contactList;
                var grid = contactList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    page.display(data.Id);
                }
                else {
                    ui.warning('Please select a record');
                    contactList.show();
                }
            });


            contactList.onButtonClick(3, function (page) {
                var grid = contactList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deleteContact(data.Id, function () {
                            contactList.display();
                            ui.info('Successfully delete the record!');
                        })
                    })

                }
                else {
                    ui.warning('Please select a record');
                    contactList.show();
                }
            })
            return contactList;
        },
        MaintainContact: function (id, selector) {
            var model = utils.cloneModel(uiModel.MaintainContact);
            var maintainContact = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainContact.setLoadDataHandler(uiServices.getContactDetails);

            maintainContact.onToolBarItemClick(0, function () {
                maintainContact.display(null);
            });

            maintainContact.onToolBarItemClick(1, function () {
                var pageId = maintainContact.model.content[0].items[0].page.Id;
                var page = maintainContact.pages[pageId];
                if (!page.validator.validate()) {
                    ui.error("Please enter the required fields");
                    return;
                }

                var contact = utils.cloneModel(page.getData());
                    
                //save data
                uiServices.saveContact(contact, function (data) {
                    ui.info("Save the record!");
                    maintainContact.display(data.Id);
                })
                
            });

            maintainContact.onToolBarItemClick(2, function () {
                maintainContact.previous.display();
            });

            maintainContact.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainContact.model.data.Id;
                    uiServices.deleteContact(id, function () {
                        maintainContact.display(0);
                        ui.info('Successfully delete the record!');
                    })
                })
            });

            maintainContact.onToolBarItemClick(4, function () {
                var pageId = maintainContact.model.content[0].items[0].page.Id;
                var page = maintainContact.pages[pageId];
                var dialog = new ui.SelectContactDialog('retrieve-contact', page);
                dialog.show();
            })

            return maintainContact;
        },
        SelectContactDialog: function (id,parent) {
            var model = {
                title: "Select User",
                width: 800,
                content: { url: "eworkspace.ViewModel.AssignRoleToUserList", Id: "AssignRoleToUserList" }
            }
            var dialog = new eworkspace.framework.DialogWindow(id, model);
            var ok = function () {
                var contentPage = dialog.getContentPage();
                var rows = contentPage.model.selectedItems;
                if (rows.length > 0)
                {
                    var selectedItem = rows[0];
                    parent.observable.set("data.ContactId", selectedItem.UserId);
                    parent.observable.set("data.ContactName", selectedItem.UserName);
                    parent.observable.set("data.ContactEmail", selectedItem.Email);
                    parent.observable.set("data.Company", selectedItem.Company);

                }

                dialog.close();
            }
            var cancel = function () {
                dialog.close();
            }
            dialog.model.buttons = [{ text: "OK", onClick: ok }, { text: "CANCEL", onClick: cancel }]
            return dialog;
        },
        ContactDetails: function (id, selector) {
            var template = { Id: 'contactform', url:  "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: null };
            var contactDetails = new eworkspace.framework.Form(id, model, template, selector);
            contactDetails.setValidatorOptions({
                rules: {
                    email: function (input) {
                        var isValid = true;
                        if (input.is("[data-email-msg]") && input.val() != "") {
                            var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                            isValid = filter.test(input.val());
                        }

                        return isValid;
                    }
                }
            });

            return contactDetails;
        },
        RoleList: function (id, selector) {
            var roleList = new eworkspace.framework.ListPage(id, uiModel.RoleList, selector);
        
            roleList.setLoadDataHandler(uiServices.getRoleList);
            roleList.setEventHandler(function () {
                var gridSelect = function (e) {
                    var selectedRows = this.select();
                    var dataItem = this.dataItem(selectedRows[0]);
                    roleList.setButtonVisible(3, dataItem.IsSystemDefined == false)
                }
                var grid = roleList._getGrid();
                grid.bind("change", gridSelect);
            })

            //create role
            roleList.onButtonClick(1, function (page) {
                //page.previous = roleList;
                page.navigate("id=null");
            });
            //edit role
            roleList.onButtonClick(2, function (page) {
                //page.previous = roleList;
                var grid = roleList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null)
                   page.navigate("id="+data.Id);// page.display(data.Id);
                else {
                    ui.warning('Please select a record');
                    roleList.show();
                }
            });
            //delete role
            roleList.onButtonClick(3, function (page) {
                var grid = roleList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    if (data.Id == 1)
                    {
                        ui.warning("Cannot delete system admin role");
                        return;
                    }
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deleteRole(data.Id, function () {
                            roleList.display();
                            ui.info('Successfully delete the record!');
                        })
                    })
                }
                else {
                    ui.warning('Please select a record');
                    roleList.show();
                }
            })
            return roleList;
        },
        MaintainRole: function (id, selector) {
            var model = utils.cloneModel(uiModel.MaintainRole);
            var maintainRole = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainRole.setLoadDataHandler(uiServices.getRoleById);
            maintainRole.setLoadCompletedHandler(function (data) {
                maintainRole.setButtonVisible("DELETE", data.IsSystemDefined == false);
                maintainRole.toggleNavigationbar(maintainRole.model.navigation.length - 1, data.Permissions.length>0);
            })
            maintainRole.onToolBarItemClick(0, function () {
                //maintainRole.display(null);
                maintainRole.navigate("id=null");
            });
            maintainRole.onToolBarItemClick(1, function () {
                var page = maintainRole.getNavigationPage(0);
                var permissionPage = maintainRole.getNavigationPage(maintainRole.model.navigation.length - 1);
                permissionPage.save();
                page.saveRole(function (role) {
                    role.Users = maintainRole.model.data.Users;
                    role.SFAProviderIds = maintainRole.model.data.SFAProviderIds;
                    role.WidgetSettings = maintainRole.model.data.WidgetSettings;
                    role.ModulePermissions = maintainRole.model.data.ModulePermissions;
                    alert(JSON.stringify(role.ModulePermissions))

                    role.Permissions.forEach(function (permission) {
                        delete permission.id;
                        delete permission.parentId;
                    })

                    //save data
                    uiServices.saveRole(role, function (data) {
                        ui.info('Save the record!');
                        maintainRole.model.IsInit = true;
                        maintainRole.display(data.Id);
                    })
                })

                
            });
            maintainRole.onToolBarItemClick(2, function () {
                var pg = maintainRole.pages[maintainRole.model.navigation[0].page.Id];
                pg.model.data = null;
                maintainRole.parent.navigate();
            });
            maintainRole.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainRole.model.data.Id;
                    uiServices.deleteRole(id, function () {
                        //maintainRole.previous.display();
                        maintainRole.parent.navigate();
                       ui.info('Successfully delete the record!');
                    })
                })
            });
      

            maintainRole.onPageTabClick(3, function (pg) {
                pg.convertData(maintainRole.model.data);
                pg.model.data = maintainRole.model.data;
                pg.display();

            });
            return maintainRole;
        },
        RoleDetails: function (id, selector) {
            var template = {
                html: "<div class='form'><span class='textbox' style='width:450px'>" +
                                   "<label><span data-i18n='Name:'>Name:</span><font color='red'>*</font></label>" +
                                   "<input type='text' name='Name' placeholder='Click to Enter' required validationmessage='Enter {0}' data-bind='value:data.Name'/>" +
                                   "</span>" +
                                   "<span class='textbox' style='width:450px'>" +
                                   "<label data-i18n='Description:'>Description:</label>" +
                                   "<input type='text' name='Description' placeholder='Click to Enter' data-bind='value:data.Description'/>" +
                                   "</span></div>" +
                                   "<h3 style='margin-left:5px;margin-top:5px;margin-bottom:5px;font-size:16px;' data-bind='visible:data.IsVisible'></h3>" +
                      "<div class='treelist' style='border-width:1px 0px 1px 0px' data-bind='visible:data.IsVisible'></div>"
            };

            var model = utils.cloneModel(uiModel.Permission);
            model.gridDataSourceField = 'Permissions';
            /*model.dataSource = new kendo.data.TreeListDataSource({
                data: null
            });*/

            var details = new eworkspace.framework.TreeList(id, model, selector, template);
        
            details.setLoadCompletedHandler(function (data) {
                details.checkedIds = [];
                data.PermissionIds.forEach(function (Id) {
                    details.checkedIds.push(Id);
                });
                data.IsVisible = data.Permissions.length > 0;
            })

            details.setEventHandler(function () {
                //on dataBound event restore previous selected rows:
                var grid = details._getGrid();
                grid.content.on("click", ".checkbox", selectRow);
                
                //on click of the checkbox:
                function selectRow() {
                    var checked = this.checked,
                    row = $(this).closest("tr"),
                    dataItem = grid.dataItem(row);
                    var children = grid.dataSource.childNodes(dataItem);
                    var parent = grid.dataSource.parentNode(dataItem);

                    if (checked) {
                        //-select the row
                        row.addClass("k-state-selected");
                        if (details.checkedIds.indexOf(dataItem.Id) == -1) {
                            details.checkedIds.push(dataItem.Id);
                        }
                        if (children.length > 0) {
                            children.forEach(function (item) {
                                rowUID = item.uid;
                                $('[data-uid="' + rowUID + '"]').find("input[type=checkbox]").prop('checked', true);
                                if (details.checkedIds.indexOf(item.Id) == -1) {
                                    details.checkedIds.push(item.Id);
                                }
                            });
                        }
                        if (parent != undefined) {
                            $('[data-uid="' + parent.uid + '"]').find("input[type=checkbox]").prop('checked', true);
                            if (details.checkedIds.indexOf(parent.Id) == -1) {
                                details.checkedIds.push(parent.Id);
                            }
                        }
                    } else {
                        //-remove selection
                        row.removeClass("k-state-selected");
                        if (details.checkedIds.indexOf(dataItem.Id) != -1) {
                            details.checkedIds.splice(details.checkedIds.indexOf(dataItem.Id), 1);
                        }
                        if (children.length > 0) {
                            children.forEach(function (item) {
                                rowUID = item.uid;
                                $('[data-uid="' + rowUID + '"]').find("input[type=checkbox]").prop('checked', false);
                                details.checkedIds.splice(details.checkedIds.indexOf(item.Id), 1);
                            });
                        }
                        if (parent != undefined) {
                            $('[data-uid="' + parent.uid + '"]').find("input[type=checkbox]").prop('checked', false);
                            details.checkedIds.splice(details.checkedIds.indexOf(parent.Id), 1);
                            var checkChildren = grid.dataSource.childNodes(parent);
                            if (checkChildren.length > 0) {
                                checkChildren.forEach(function (item) {
                                    if (details.checkedIds.indexOf(item.Id) != -1) {
                                        $('[data-uid="' + parent.uid + '"]').find("input[type=checkbox]").prop('checked', true);
                                        if (details.checkedIds.indexOf(parent.Id) == -1) {
                                            details.checkedIds.push(parent.Id);
                                        }
                                    }
                                });
                            }
                        }
                    }
                    var permissions = []
                    if (details.checkedIds.length > 0) {
                        details.checkedIds.forEach(function (id) {
                            permissions.push(id);
                        })
                    }
                    details.model.data.PermissionIds = permissions;
                    details.setDataByField('PermissionIds', details.model.data.PermissionIds);

                    if (details.model.data.Permissions.length == details.checkedIds.length) {
                        $('.checkAll').prop('checked', true);
                    } else {
                        $('.checkAll').prop('checked', false);
                    }
                };
                //select all
                $('.checkAll').click(function (event) {
                    details.checkedIds = [];
                    var checked = this.checked;
                    if (checked) {
                        //-select the row
                        $('.checkbox').each(function () {
                            row = $(this).closest("tr"),
                            dataItem = grid.dataItem(row);
                            this.checked = true;
                            row.addClass("k-state-selected");
                            details.checkedIds.push(dataItem.Id);
                        });
                    } else {
                        //-remove selection
                        $('.checkbox').each(function () {
                            row = $(this).closest("tr"),
                            dataItem = grid.dataItem(row);
                            this.checked = false;
                            row.removeClass("k-state-selected");
                            details.checkedIds = [];
                        });
                    }
                    var permissions = []
                    $.each(details.checkedIds, function (id, item) {
                        permissions.push(item);
                    })

                    details.model.data.PermissionIds = permissions;
                    details.setDataByField('PermissionIds', details.model.data.PermissionIds);
                });
                $('#' + details.Id).css('margin-top', 30);
                $('#' + details.Id).css('margin-bottom', 30);
                details.ValidateInit('div.form');
            })
            function onDataBound(e) {
                var grid = details._getGrid();
                var view = eworkspace.framework.gridAdapter.view(grid);//grid.dataSource.view();

                for (var i = 0; i < view.length; i++) {
                    if (details.model.data.PermissionIds.indexOf(view[i].Id) != -1) {
                        eworkspace.framework.gridAdapter.tableRow(i, grid).addClass("k-state-selected").find(".checkbox").prop('checked', true);
                        /*grid.content.find("tr[data-uid='" + view[i].uid + "']")
                            .addClass("k-state-selected");*/

                    }
                    else {
                        eworkspace.framework.gridAdapter.tableRow(i, grid).removeClass("k-state-selected").find(".checkbox").prop('checked', false);
                        /*grid.content.find("tr[data-uid='" + view[i].uid + "']")
                            .removeClass("k-state-selected");*/
                    }
                }
                if (details.model.data.Permissions.length >0 && details.model.data.Permissions.length == details.model.data.PermissionIds.length) {
                    $('.checkAll').prop('checked', true);
                } else {
                    $('.checkAll').prop('checked', false);
                }


            };
            details.setGridDataBound(onDataBound);

            details.saveRole = function (callback) {
                if (details.validator.validate() == false) {
                    ui.error('Please enter the required fields');
                    return;
                }

                var role = utils.cloneModel(details.observable.get('data'));
                if ($.isFunction(callback))
                    callback(role);
            }
            return details;
        },
        AssignRoleToUsers: function (id, selector) {
            var model = utils.cloneModel(uiModel.AssignUsersToRole);
            model.gridDataSourceField = 'Users';
          
            var assignRoleToUsersPage = new eworkspace.framework.List(id, model, selector);
            $('#' + assignRoleToUsersPage.Id).css('margin-top', 5);
            assignRoleToUsersPage.onToolBarItemClick(0, function () {
                var pop_window = new ui.SelectUserDialog('select-users', assignRoleToUsersPage);
                pop_window.display();
            });
            assignRoleToUsersPage.onToolBarItemClick(1, function () {
                var roleId = assignRoleToUsersPage.model.data.Id;
                var gview = assignRoleToUsersPage._getGrid();
                var selectedUser = gview.dataItem(gview.select());

                if (selectedUser != null) {
                    /*var data = $.grep(assignRoleToUsersPage.model.data.Users, function (item) {
                        return item.UserId != selectedUser.UserId;
                    });
                    assignRoleToUsersPage.setData(data);
                    assignRoleToUsersPage.refreshgridData(data);*/
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete User", "Are you sure to delete current selected user?", function () {
                        uiServices.deleteUserRole(roleId, selectedUser.UserId, function (data) {
                            assignRoleToUsersPage.refreshgridData(data);
                            ui.info('Successfully remove user!');
                        })
                    })
                }
                else {
                    alert('Please select a user');
                }
            });
            assignRoleToUsersPage.onToolBarItemClick(2, function () {
                var roleId = assignRoleToUsersPage.model.data.Id;

                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete User", "Are you sure to delete all user?", function () {
                    uiServices.deleteUserRole(roleId, "", function (data) {
                        assignRoleToUsersPage.refreshgridData(data);
                        ui.info('Successfully remove users!');
                    })
                })
            });
            assignRoleToUsersPage.setGridDataBound(function onDataBound(e) {
                var grid = assignRoleToUsersPage._getGrid();
                var data = grid.dataSource.data();
                var users = JSON.parse(JSON.stringify(data));

                if (users.length > 0) {
                    //assignRoleToUsersPage.model.data.Users = users;
                    assignRoleToUsersPage.setDataByField("Users", users);
                    assignRoleToUsersPage.parent.model.data.Users = users;
                }
            });
            return assignRoleToUsersPage;
        },
        ViewList: function (id, selector) {
            var model = utils.cloneModel(uiModel.ViewList);
            var viewList = new eworkspace.framework.ListPage(id, model, selector);
            viewList.setLoadDataHandler(uiServices.getViewList);

            viewList.onButtonClick(1, function (page) {
                //page.previous = viewList;
                //page.display(null);
                page.navigate("id=null");
            });

            viewList.onButtonClick(2, function (page) {
                page.previous = viewList;
                var grid = viewList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    page.navigate("id="+data.Id);//page.display(data.Id);
                }
                else {
                    ui.info('Please select a record');
                    viewList.show();
                }
            });


            viewList.onButtonClick(3, function (page) {
                var grid = viewList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deleteView(data.Id, function () {
                            viewList.display();
                            ui.info('Successfully delete the record!');
                        })
                    })

                }
                else {
                    ui.warning('Please select a record');
                    viewList.show();
                }
            })

            return viewList;
        },
        MaintainView: function (id, selector) {
            var model = utils.cloneModel(uiModel.MaintainView);
            var maintainView = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainView.setLoadDataHandler(uiServices.getViewDetails);
            maintainView.onToolBarItemClick(0, function () {
                maintainView.navigate("id=null");
            });
            maintainView.onToolBarItemClick(1, function () {
                var pageId = maintainView.model.content[0].items[0].page.Id;
                var page = maintainView.pages[pageId];
                var modelPageId = maintainView.model.content[0].items[1].page.Id;
                var modelPage = maintainView.pages[modelPageId];
                if (!page.validator.validate())
                {
                    ui.error('Please enter requried fields');
                    return;
                }

                if (!modelPage.validator.validate()) {
                    ui.error('Please enter requried fields');
                    return;
                }

                var view = utils.cloneModel(page.getData());
                if (view.ViewModelType != "")
                {
                    var namespace = view.ViewModelType == "" ? "ViewModel" : "Services";
                    view.Action = view.ActionName != null && view.ActionName.length > 0? (view.Widget + "." + namespace + "." + view.ActionName):"";
                    view.Name = view.Name.replace(' ', '');
                }
                view.Model = modelPage.getModelData();
                
                //save data
                uiServices.saveView(view, function (data) {
                    maintainView.display(data.Id);
                    ui.info("Save the record!");
                })


            });

            maintainView.onToolBarItemClick(2, function () {
                //maintainView.previous.display();
                maintainView.parent.navigate();
            });

            maintainView.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainView.model.data.Id;
                    uiServices.deleteView(id, function () {
                        ui.info('Successfully delete the record!');
                        maintainView.parent.navigate();
                        //maintainView.previous.display();
                    })
                })
            })
  
            return maintainView;
        },
        ViewDetails: function (id, selector) {
            var template = { Id: 'viewform', url:  "src/view/framework_" + platForm.provider + ".html" }
            
            var model = { data: null};
            var viewDetails = new eworkspace.framework.Form(id, model, template, selector);
           // viewDetails.dropdownlists = {otherview:[],customview:[]};
            function bindWidgetViewModels(widgetId, widgetName, type,serviceUrl) {
                var namespace = type == "" ? "ViewModel" : "Services";
                /*if (viewDetails.NameListCache != null)
                {
                    viewDetails.model.data.NameList.length = 0;
                    viewDetails.NameListCache[namespace].forEach(function (item) {
                        viewDetails.model.data.NameList.push(item);
                    })
                    viewDetails.model.data.Name = widgetId > 0 && widgetId != viewDetails.model.data.WidgetId ? "" : viewDetails.model.data.Name;
                    viewDetails.setDataByField('NameList', viewDetails.model.data.NameList);
                    viewDetails.setDataByField('Name', viewDetails.model.data.Name)
                }else*/
                uiServices.loadWidget(widgetName, namespace, viewDetails.model.data.NameList, function (cache) {
                   // if (viewDetails.NameListCache == null)
                    viewDetails.NameListCache = cache;
                    viewDetails.model.data.Name = widgetId > 0 && widgetId != viewDetails.model.data.WidgetId ? "" : viewDetails.model.data.Name;
                    viewDetails.setDataByField('NameList', viewDetails.model.data.NameList);
                    viewDetails.setDataByField('Name', viewDetails.model.data.Name)
                }, serviceUrl)
            }

            viewDetails.setLoadCompletedHandler (function (data) {
                viewDetails.model.setControlstates(data.ViewModelType);                
            })

            viewDetails.model.onWidgetListChange = function (e) {
                var widgetId = e.sender.value();
                var type = viewDetails.getDataByField('ViewModelType');
                type = type == null ? viewDetails.model.data.ViewModelType : type;
                var widgetName =e.sender.text();
                viewDetails.setDataByField('Widget', widgetName);
                var serviceUrl= e.sender.dataItem().ServiceUrl;

                if (widgetId.length>0)
                    bindWidgetViewModels(widgetId, widgetName, type, serviceUrl);
                else {
                    viewDetails.model.data.NameList.length = 0;
                    viewDetails.setDataByField('NameList',viewDetails.model.data.NameList)
                }
            }

            viewDetails.model.onViewTypeChange = function (e) {
                var type = e.sender.value();
                var widgetId = viewDetails.getDataByField("WidgetId");
                var widgetName = viewDetails.getDataByField("Widget");
                bindWidgetViewModels(widgetId, widgetName, type);
                viewDetails.model.setControlstates(type);
                var modelPg = viewDetails.parent.getContentPage(0,1);
                modelPg.model.data.ViewModelType = type;
                modelPg.display();

            }

            viewDetails.model.setControlstates = function (type) {
                if (viewDetails.otherddl == null)
                {
                    viewDetails.otherddl = $('#' + viewDetails.Id).find("input[name='otherview']");
                    viewDetails.customddl = $('#' + viewDetails.Id).find("input[name = 'customview']");
                }
     
                var otherList = $(viewDetails.otherddl).data("kendoDropDownList");
                var customList = $(viewDetails.customddl).data("kendoDropDownList");
                
                
                if (otherList!=null)
                    otherList.enable(type == "");
                else
                    viewDetails.otherddl.prop("disabled", type != "");

                if (customList!=null)
                    customList.enable(type != "")
                else
                    viewDetails.customddl.prop("disabled", type == "");
         
                if (type == "") {
                    $('#' + viewDetails.Id).find('span.customview').hide();
                    $('#' + viewDetails.Id).find('span.otherview').show();
                } else {
                    $('#' + viewDetails.Id).find('span.customview').show();
                    $('#' + viewDetails.Id).find('span.otherview').hide();
                   // if (type != viewDetails.model.data.ViewModelType)
                     //   viewDetails.setDataByField('Name', '');
                }
                
            }

            return viewDetails;
        },
        ModelForm: function (id, selector) {
            var template = { Id: 'modelform', url: "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: null, disabled: false };
            var modelDetails = new eworkspace.framework.Form(id, model, template, selector);
            modelDetails.listModel = utils.cloneModel(uiModel.List);
            modelDetails.chartModel = utils.cloneModel(uiModel.Chart);

            /*modelDetails.model.onSave = function (e) {
                if (modelDetails.model.data.ViewModelType === "eworkspace.framework.Chart") {
                    modelDetails.model.data.ChartItems.data(e.sender.dataSource.data());
                    modelDetails.model.data.CModel = modelDetails.observable.get("CModel");
                    modelDetails.setData(modelDetails.model.data);
                    //modelDetails.observable.set("data.ChartItems", modelDetails.model.data.ChartItems);
                }
                else {
                    modelDetails.model.data.Items.data(e.sender.dataSource.data());
                    modelDetails.observable.set("data.Items", modelDetails.model.data.Items);
                }
            };*/

            modelDetails.model.onRemove = function (e) {
                if (modelDetails.model.data.ViewModelType === "eworkspace.framework.Chart") {
                    var data = modelDetails.model.data.ChartItems.data();
                    var result = $.grep(data, function (item) {
                        return (item.name === e.model.name && item.field === e.model.field)
                    }, true);
                    modelDetails.model.data.ChartItems.data(result);
                    modelDetails.observable.set("data.ChartItems", modelDetails.model.data.ChartItems);

                }
                else {
                    var data = modelDetails.model.data.Items.data();
                    var result = $.grep(data, function (item) {
                        return (item.title === e.model.title && item.field === e.model.field)
                    },
                        true);
                    modelDetails.model.data.Items.data(result);
                    modelDetails.observable.set("data.Items", modelDetails.model.data.Items);
                }


            }

            modelDetails.setLoadCompletedHandler(function (data) {
                if (modelDetails.observable == null)
                    modelDetails.model.CModel = data.CModel;
                else
                    modelDetails.observable.set("CModel", data.CModel);
                modelDetails.model.displayModelForm(data.ViewModelType);
            })

            modelDetails.setFormLoadedHandler(function () {
                modelDetails.convertLocaleGrid('.grid');
            })

            modelDetails.model.displayModelForm = function (type) {
                if (modelDetails.model.data.ViewModelType != type)
                    modelDetails.model.data.Model = ""

                modelDetails.model.data.ViewModelType = type;
                var chartForm = $('#' + modelDetails.Id).find('div.chartmodel');
                var listForm = $('#' + modelDetails.Id).find('div.listmodel');
                var disabled = type != 'eworkspace.framework.Chart';
                $('#' + modelDetails.Id).find('input[name="CategoryAxis"]').prop('disabled', disabled);

                if (type == 'eworkspace.framework.List') {
                    modelDetails.show();
                    listForm.show();
                    chartForm.hide();
                    modelDetails.model.data.CModel = modelDetails.listModel;
                } else if (type == 'eworkspace.framework.Chart') {
                    listForm.hide();
                    chartForm.show();
                    modelDetails.show();
                    modelDetails.model.data.CModel = modelDetails.chartModel;

                } else {
                    modelDetails.hide();
                }

                modelDetails.setData(modelDetails.model.data);
            }
            modelDetails.getModelData = function () {
                var model = modelDetails.getData();
                model.Model = "";
                if (model.ViewModelType == "eworkspace.framework.Chart") {
                    var temp = modelDetails.observable.get("CModel");
                    model.CModel.title = model.Title;
                    model.CModel.categoryField = temp.categoryField;
                    model.CModel.chartType = temp.chartType.value != null ? temp.chartType.value : temp.chartType;
                    model.CModel.chartOptions.series = [];
                    model.CModel.chartOptions.seriesDefaults = model.CModel.chartOptions.seriesDefaults == null ? {} : model.CModel.chartOptions.seriesDefaults;
                    model.CModel.chartOptions.seriesDefaults.type = temp.chartType;
                    model.CModel.chartOptions.seriesColors = [];
                    if (model.serieColorList == null || model.serieColorList.length == 0)
                        delete model.CModel.chartOptions.seriesColors;
                    else {
                        var list = model.serieColorList.split(',');
                        list.forEach(function (color) {
                            if (color != null && color.length > 0)
                                model.CModel.chartOptions.seriesColors.push(color);
                        });
                    }

                    model.Items.forEach(function (item) {
                        model.CModel.chartOptions.series.push({ name: item.title, field: item.field })
                    })
                }
                else if (model.ViewModelType == "eworkspace.framework.List") {
                    model.CModel.title = model.Title;
                    model.CModel.gridOptions.columns = model.Items;
                }


                model.Model = model.ViewModelType.length > 0 ? JSON.stringify(model.CModel) : "";
                return model.Model;

            }


            return modelDetails;

        },
        PageList: function (id, selector) {
            var model = utils.cloneModel(uiModel.PageList);
            var pageList = new eworkspace.framework.ListPage(id, model, selector);
            pageList.setLoadDataHandler(uiServices.getPageList);
            //new
            pageList.onButtonClick(1, function (page) {
                //page.previous = pageList;
                page.navigate("id=null");
                //page.display(0);
            })
            //edit
            pageList.onButtonClick(2, function (page) {
                //page.previous = pageList;
                var grid = pageList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    //page.display(data.Id);
                    page.navigate("id="+data.Id)
                }
                else {
                    ui.warning('Please select a record');
                    pageList.show();
                }
            });
            //delete
            pageList.onButtonClick(3, function (page) {
                var grid = pageList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);
                if (data != null) {
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deletePage(data.Id, function () {
                            pageList.display();
                            ui.info('Successfully delete the record!');
                        })
                    })
                }
                else {
                    ui.info('Please select a record');
                    pageList.show();
                }
            })
            pageList.setEventHandler(function () {
                var gridSelect = function (e) {
                    var selectedRows = this.select();
                    var dataItem = this.dataItem(selectedRows[0]);
                    pageList.setButtonVisible(3, dataItem.IsSystemMenu !== 1)
                }
                var grid = pageList._getGrid();
                grid.bind("change", gridSelect);
            })
            return pageList;
        },
        MaintainPage: function (id, selector) {
            var model = utils.cloneModel(uiModel.MaintainPage);
            var maintainPage = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainPage.setLoadDataHandler(uiServices.getPageDetails);
            maintainPage.setLoadCompletedHandler(function (data) {
                maintainPage.setButtonVisible("DELETE", data.IsSystemMenu == 0);
            });
            //new
            maintainPage.onToolBarItemClick(0, function () {
                maintainPage.display(null);
            });
            //save
            maintainPage.onToolBarItemClick(1, function () {
                var pageId = maintainPage.model.content[0].items[0].page.Id;
                var page = maintainPage.pages[pageId];
                page.save(function (pageDto) {
                    uiServices.savePage(pageDto, function (data) {
                        ui.info('Save the record!')
                        maintainPage.model.IsInit = true;
                        maintainPage.display(data.Id);
                    })
                })
       
            });
            //close
            maintainPage.onToolBarItemClick(2, function () {
                //maintainPage.parent.display();
                maintainPage.parent.navigate();
            });
            //delete
            maintainPage.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainPage.model.data.Id;
                    uiServices.deletePage(id, function () {
                        maintainPage.display(null);
                        ui.info('Successfully delete the record!');
                    })
                })
            })
            return maintainPage;
        },
        PageDetails: function (id, selector) {
            var template = { Id: 'pageform', url:  "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: null };
            var pageDetails = new eworkspace.framework.Form(id, model, template, selector);

            pageDetails.setLoadCompletedHandler(function (data) {
                if (data.Id == "") {
                    $('#' + pageDetails.Id).find('input[name="Id"]').prop("disabled", false).removeClass("k-state-disabled");
                } else {
                    $('#' + pageDetails.Id).find('input[name="Id"]').prop("disabled", true).addClass("k-state-disabled");
                }
                
            });

            pageDetails.model.onWidgetChange = function (e) {
                var widgetId = e.sender.value();
                var widgetName = e.sender.text();
                uiServices.loadWidget(widgetName, "ViewModel", pageDetails.model.data.NameList, function () {
                    pageDetails.setDataByField('NameList', pageDetails.model.data.NameList);
                })
            }

          
            pageDetails.save = function (callback) {
                if (!pageDetails.validator.validate()) {
                    ui.error("Please enter the required fields");
                    return;
                }
                var page = utils.cloneModel(pageDetails.getData())
                if ($.isFunction(callback))
                    callback(page)
            }
            return pageDetails;
        },
        WidgetList: function (id, selector) {
            var model = utils.cloneModel(uiModel.WidgetList);
            var widgetList = new eworkspace.framework.ListPage(id, model, selector);
            widgetList.setLoadDataHandler(uiServices.getWidgetList);
            //new
            widgetList.onButtonClick(1, function (page) {
                //page.previous = widgetList;
                page.navigate("id=null");
                //page.display(0);
            })
            //edit
            widgetList.onButtonClick(2, function (page) {
                page.previous = widgetList;
                var grid = widgetList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    page.navigate("id="+data.Id);// page.display(data.Id);
                }
                else {
                    ui.warning('Please select a record');
                    widgetList.show();
                }
            });
            //delete
            widgetList.onButtonClick(3, function (page) {
                var grid = widgetList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);
                if (data != null) {
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deleteWidget(data.Id, function () {
                            widgetList.display();
                            ui.info('Successfully delete the record!');
                        })
                    })
                }
                else {
                    ui.warning('Please select a record');
                    widgetList.show();
                }
            })
            return widgetList;
        },
        MaintainWidget: function (id, selector) {
            var model = utils.cloneModel(uiModel.MaintainWidget);
            var maintainWidget = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainWidget.setLoadDataHandler(uiServices.getWidgetDetails);
            //new
            maintainWidget.onToolBarItemClick(0, function () {
                maintainWidget.display(null);
            });
            //save
            maintainWidget.onToolBarItemClick(1, function () {
                var pageId = maintainWidget.model.content[0].items[0].page.Id;
                var page = maintainWidget.pages[pageId];

                page.save(function (widget) {
                    var resources = maintainWidget.model.data.NewResources;
                    uiServices.saveWidget(widget, function (data) {
                        maintainWidget.display(data.Id);
                        
                        if (page.model.files.length > 0)
                            uiServices.saveResourceFile(resources, function (json) {
                                ui.info("Save the record!");
                                page.refreshFileUploadList();
                                maintainWidget.model.data.Resources = json;
                                maintainWidget.refreshResourceFiles();
                            })
                        else
                            ui.info("Save the record!");
                    })
                })
      
            });
            //close
            maintainWidget.onToolBarItemClick(2, function () {
                $(".k-widget.k-upload").find("ul").remove();
                //$(".k-upload-files.k-reset").find("li").remove();
                //maintainWidget.previous.display();
                maintainWidget.parent.navigate();
            });
            //delete
            maintainWidget.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainWidget.model.data.Id;
                    uiServices.deleteWidget(id, function () {
                        maintainWidget.display(null);
                        ui.info('Successfully delete the record!');
                    })
                })
            });
            maintainWidget.refreshResourceFiles= function () {
                var pageId = maintainWidget.model.content[0].items[1].page.Id;
                var rspg = maintainWidget.pages[pageId];
                rspg.refreshgridData(maintainWidget.model.data.Resources);
            }

            maintainWidget.loadTemplateResourceFiles = function (data) {
                var pageId = maintainWidget.model.content[0].items[1].page.Id;
                var rspg = maintainWidget.pages[pageId];
                rspg.refreshgridData(data);
                rspg.setGridMode(false);
            }


            return maintainWidget;
        },
        WidgetDetails: function (id, selector) {
            var template = { Id: 'widgetform', url:  "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: null,files:[]};
          
            var widgetDetails = new eworkspace.framework.Form(id, model, template, selector);
            widgetDetails.setLoadCompletedHandler(function (data) {
                widgetDetails.model.data.IsHide= data.IsTemplate || data.GlobalScope;
                widgetDetails._enableControl(".form", !data.UseTemplate, 'input[name!="existingModule"][name!="ServiceUrl"][name!="Description"]');
                if (data.UseTemplate)
                    widgetDetails.parent.loadTemplateResourceFiles(data.Resources)
            })

            widgetDetails.setValidatorOptions({
                rules: {
                    serviceurl: function (input) {
                        var isValid = true;
                        if (input.is("[data-serviceurl-msg]") && input.val() != "") {
                            var filter = /^\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/;
                            isValid = filter.test(input.val());
                        }
                        return isValid;
                    }
                }
            });
            widgetDetails.setEventHandler(function () {
                $('#' + widgetDetails.Id).find("input[name='imagefiles']").kendoUpload({
                    async: {},
                    select: onSelectImage
                });
                $('#' + widgetDetails.Id).find("input[name='sourcefiles']").kendoUpload({
                    select: onSelectScript,
                    remove: onRemove
                });

                $('#' + widgetDetails.Id).find("input[name='otherfiles']").kendoUpload({
                    async: {},
                    select: onOtherFiles
                });

                function onOtherFiles(e) {
                    if (widgetDetails.model.data.Id == utils.getEmptyGUID()) {
                        ui.warning('Please save widget first');
                        e.files.length = 0;
                        return;
                    }

                    e.files.forEach(function (file) {
                        var fileType = file.extension.toLowerCase();
                        if (fileType != ".txt" && fileType != ".pdf" && fileType != ".doc" && fileType != ".docx") {
                            e.preventDefault();
                            ui.warning("Only txt,pdf and word files are allowed!");
                            return false;
                        } /*else if (widgetDetails.model.data.Id > 0) {
                            widgetDetails.parent.model.data.Resources.push({ FileName: file.name, WidgetId: widgetDetails.model.data.Id, DefaultWebsiteId: uiProfile.WebsiteId, File: file })
                        } else
                            ui.warning('Please save widget first');*/
                       //widgetDetails.model.files.push(file);
                    })
                

                    /*if (widgetDetails.model.data.Id > 0)
                        uiServices.saveResourceFile(widgetDetails.parent.model.data.Resources, function (json) {
                            ui.info('resource files uploaded');
                            widgetDetails.parent.display(widgetDetails.model.data.Id);
                        });*/
                };
                function onSelectImage(e) {
                    if (widgetDetails.model.data.Id == utils.getEmptyGUID()) {
                        ui.warning('Please save widget first');
                        e.files.length = 0;
                        return;
                    }
                    
                    e.files.forEach(function (file) {
                        var fileType = file.extension.toLowerCase();
                        if (fileType.extension != ".jpg" && fileType.extension != ".png" && fileType.extension != ".gif" && fileType.extension != ".tif") {
                            e.preventDefault();
                            ui.warning("Only Image file is allowed!");
                            return false;
                        } /*else if (widgetDetails.model.data.Id > 0) {
                            widgetDetails.parent.model.data.Resources.push({ FileName: file.name, WidgetId: widgetDetails.model.data.Id, DefaultWebsiteId: uiProfile.WebsiteId, File: file, DefaultWebsiteId: uiProfile.WebsiteId, File: file })
                        } */

                        //widgetDetails.model.files.push(file);
                   
                    })
                
                    /*if (widgetDetails.model.data.Id > 0)
                        uiServices.saveResourceFile(widgetDetails.parent.model.data.Resources, function (json) {
                            ui.info('images uploaded');
                            widgetDetails.parent.refreshResourceDetails();
                        });*/
             
                };
                function onSelectScript(e) {
                    if (widgetDetails.model.data.Id == utils.getEmptyGUID()) {
                        ui.warning('Please save widget first');
                        e.files.length = 0;
                        return;
                    }

                    e.files.forEach(function (file) {
                        var fileExtension = file.extension.toLowerCase();

                        if (fileExtension != ".js" && fileExtension != ".html" && fileExtension != ".json") {
                            e.preventDefault();
                            ui.error("Please upload js and/or html files");
                            return false;
                        } else if (widgetDetails.model.data.Id != utils.getEmptyGUID())  {
                            if (fileExtension == ".js")
                                widgetDetails.setDataByField("SourceFileName", file.name.replace('.js',''));
                           // else
                             //   widgetDetails.setDataByField("TemplateFileName", file.name);
                            //widgetDetails.parent.model.data.Resources.push({ FileName: file.name, WidgetId: widgetDetails.model.data.Id });
                        } /*else
                            ui.warning('Please save widget first');*/
                    })
                      
                    /*if (widgetDetails.model.data.Id > 0)
                        uiServices.saveResourceFile(widgetDetails.parent.model.data.Resources, function (json) {
                            ui.info('Source files uploaded');
                            widgetDetails.parent.display(widgetDetails.model.data.Id);
                        });*/
          
                };
                function onRemove(e) {
                    if (widgetDetails.model.data.Id > 0)
                        return;

                    var widget = widgetDetails.model.data;
                    e.files.forEach(function (file) {
                        if (file.extension.toLowerCase() == ".js" && file.name == widgetDetails.getDataByField('SourceFileName'))
                            widgetDetails.setDataByField("SourceFileName", widgetDetails.model.data.SourceFileName);
                        //else if (file.extension.toLowerCase() == ".html" && file.name == widgetDetails.getDataByField('TemplateFileName'))
                          //  widgetDetails.setDataByField("TemplateFileName", widgetDetails.model.data.TemplateFileName);

                        widgetDetails.model.files = $.grep(widgetDetails.model.files, function (item) {
                            return item.name !== file.name;
                        })
                    })
      
                }
            })
            widgetDetails.save = function (callback) {

                if (!widgetDetails.validator.validate())
                {
                    ui.error("Please enter the required fields");
                    return;
                }
                var widget = utils.cloneModel(widgetDetails.getData());
          
                if (widgetDetails.validator.validate()) {
      
                    //save data
                    widgetDetails.addNewUpload('sourcefiles');
                    widgetDetails.addNewUpload('imagefiles');
                    widgetDetails.addNewUpload('otherfiles');

                    widget.SourceFilePath = "app/components/" + widget.Name;
                    widget.TemplateFileFolder = "/src/view/"; //+ widget.TemplateFileName;
                    //widget.DateCreate = new Date();
                    widgetDetails.parent.model.data.NewResources = [];
                    widgetDetails.model.files.forEach(function (file) {
                        widgetDetails.parent.model.data.NewResources.push({
                            FileName: file.name,
                            WidgetId: widget.Id,
                            DefaultWebsiteId: uiProfile.WebsiteId,
                            File: file,
                        })
                    })
                    if ($.isFunction(callback)) {
                        callback(widget);
                    }
                }
            }

            widgetDetails.addNewUpload = function (name) {
                var sourceFiles = $('#' + widgetDetails.Id).find("input[name='" + name + "']").data("kendoUpload").wrapper.find("input[type='file']");
                var newFiles = $.grep(sourceFiles[0].files, function (item) {
                    return $.grep(widgetDetails.model.files, function (fileItem) {
                        return fileItem.name == item.name;
                    }).length == 0;
                })

                widgetDetails.model.files = $.merge(widgetDetails.model.files, newFiles);
            }

            widgetDetails.clearFiles = function (name) {
                var sourceFile = $('#' + widgetDetails.Id).find("input[name='" + name + "']").data("kendoUpload");
                sourceFile.clearAllFiles();
            }
            widgetDetails.refreshFileUploadList = function () {
                widgetDetails.model.files.length = 0;
                widgetDetails.clearFiles('sourcefiles');
                widgetDetails.clearFiles('imagefiles');
                widgetDetails.clearFiles('otherfiles');
            }

            widgetDetails.model.onScopeChange = function (e) {
                if (!e.target.checked)
                    widgetDetails.setDataByField("DefaultWebsiteId", uiProfile.WebsiteId);
                widgetDetails.setDataByField("IsHide", widgetDetails.model.data.IsTemplate || e.target.checked);
            }

            widgetDetails.model.onSearchModule = function (e) {
                if (e.target.checked) {
                    var widgetName = widgetDetails.getDataByField("Name");
                    uiServices.getWidgetByName(widgetName, function (data) {
                        if (data == null || data.Id == widgetDetails.model.data.Id) {
                            ui.info('Cannot find widget, please check widget name');
                            widgetDetails.setDataByField("UseTemplate", false)
                        } else {
                            widgetDetails.observable.set("data.EnableGlobalWidget", false);
                            widgetDetails.setDataByField("GlobalScope", false);
                            widgetDetails.setDataByField("Name", data.Name)
                            widgetDetails.setDataByField("InstanceName", data.InstanceName);
                            widgetDetails.setDataByField("Description", data.Description);
                            widgetDetails.setDataByField("SourceFileName", data.SourceFileName);
                            widgetDetails.setDataByField("TemplateId", data.Id);
                            widgetDetails.setDataByField("TemplateWebsiteName", data.WebsiteName);
                            widgetDetails.parent.loadTemplateResourceFiles(data.Resources);
                            widgetDetails._enableControl(".form", false, 'input[name!="existingModule"][name!="ServiceUrl"][name!="Description"]');
                        }
                       
                        
                    })
                } else {
                    widgetDetails.setDataByField("TemplateId", null);
                    widgetDetails.setDataByField("TemplateWebsiteName", '');
                    widgetDetails.setDataByField("EnableGlobalWidget", widgetDetails.model.data.EnableGlobalWidget);
                    widgetDetails._enableControl(".form", true, 'input[name!="existingModule"][name!="ServiceUrl"][name!="Description"]');
                }

                
            }

            return widgetDetails;
        },
        ResourceFileDetails: function (id, selector) {
            var model = utils.cloneModel(uiModel.ResourceDetails);
            var resourceDetails = new eworkspace.framework.List(id, model, selector);
         
            resourceDetails.setEventHandler(function () {
                $('#' + resourceDetails.Id).css('display', 'none');
                $('#' + resourceDetails.Id).addClass('d-md-block');
                var grid = resourceDetails._getGrid();
                grid.bind('remove', function (e) {
                    uiServices.deleteResourceFile(e.model.Id, function () {
                        resourceDetails.parent.model.data.Resources = $.grep(resourceDetails.parent.model.data.Resources, function (item) {
                            return item.Id != e.model.Id;
                        });
                        ui.info('Resource file is successfully deleted!')
                    })
                })
            })
            return resourceDetails;

        },
        LogList: function (id, selector) {
            var model = utils.cloneModel(uiModel.LogList);
            if (uiProfile.AuditTrailConfig != null)
                model.filters[0].items.unshift(uiProfile.AuditTrailConfig);

            var logList = new eworkspace.framework.ListPage(id, model, selector);
            function dataTransform(item) {
                if (item.field == "TableName")
                    if (item.operator.toLowerCase() == "endswith")
                        item.value = item.value + "_" + uiProfile.WebsiteId
            }
            logList.setFilterDataTransformHandler(dataTransform);

            var getWebsiteLogList = function (options, callback, failcallback) {
                uiServices.getLogList(logList.model.LogServiceURL, options, callback, failcallback);
            }
            logList.setLoadDataHandler(getWebsiteLogList);
            logList.checkedIds = [];
            logList.onFilterById('module', function (e) {
                var value = this.value();
                if (value != null && value.length>0)
                    logList.model.LogServiceURL = value;
                else
                    logList.model.LogServiceURL = null;
                logList.display();
            });
            //delete menu
            logList.onButtonClick(1, function (page) {
                var data = logList.checkedIds;
                alert(JSON.stringify(registeredWidgets));
                if (data != null) {
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deleteLog(data, function () {
                            logList.display();
                            logList.checkedIds.length = 0;
                            ui.info('Successfully delete the record!');
                        })
                    })
                }
                else {
                    ui.warning('Please select a record');
                    logList.show();
                }
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
        },
        WebsiteList: function (id, selector) {
            var model = utils.cloneModel(uiModel.WebsiteList);
            var websiteList = new eworkspace.framework.ListPage(id, model, selector);
            websiteList.setLoadDataHandler(uiServices.getWebsiteList);
            //new
            websiteList.onButtonClick(1, function (page) {
                //page.previous = websiteList;
                //page.display(null);
                page.navigate("id=null");
            })
            //edit
            websiteList.onButtonClick(2, function (page) {
                //page.previous = websiteList;
                var grid = websiteList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);

                if (data != null) {
                    page.navigate("id="+data.Id);
                    //page.display(data.Id);
                }
                else {
                    ui.warning('Please select a record');
                    websiteList.display();
                }
            });
            //delete
            websiteList.onButtonClick(3, function (page) {
                var grid = websiteList._getGrid();
                var row = grid.select();
                var data = grid.dataItem(row);
                if (data != null) {
                    var dialog = new eworkspace.framework.ConfirmationDialog();
                    dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                        uiServices.deleteWebsite(data.Id, function () {
                            websiteList.display();
                            ui.info('Successfully delete record!');
                        })
                    })
                }
                else {
                    ui.warning('Please select a record');
                    websiteList.display();
                }
            });

            websiteList.setEventHandler(function () {
                var gridSelect = function (e) {
                    var selectedRows = this.select();
                    var dataItem = this.dataItem(selectedRows[0]);
                    websiteList.setButtonVisible(3, dataItem.IsSystemDefined == false);
                }
                var grid = websiteList._getGrid();
                grid.bind("change", gridSelect);

            })
            return websiteList;
        },
        MaintainWebsite: function (id, selector) {
            var model = utils.cloneModel(uiModel.MaintainWebsite);
            var maintainWebsite = new eworkspace.framework.WorkflowPage(id, model, selector);
            maintainWebsite.setLoadDataHandler(uiServices.getWebsiteDetails);
            maintainWebsite.setLoadCompletedHandler(function (data) {
                maintainWebsite.setButtonVisible("DELETE", data.IsSystemDefined == false);
            })
   
            //new
            maintainWebsite.onToolBarItemClick(0, function () {
                maintainWebsite.display(null);
            });
            //save
            maintainWebsite.onToolBarItemClick(1, function () {
                var pageId = maintainWebsite.model.content[0].items[0].page.Id;
                var page = maintainWebsite.pages[pageId];
                page.save(function (website) {
                    uiServices.saveWebsite(website, function (data) {
                        ui.info("Save the record!");
                        maintainWebsite.display(data.Id);
                    })
                })
               
            });
            //close
            maintainWebsite.onToolBarItemClick(2, function () {
                //maintainWebsite.previous.display();
                maintainWebsite.parent.navigate();
            });
            //delete
            maintainWebsite.onToolBarItemClick(3, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var id = maintainWebsite.model.data.Id;
                    uiServices.deleteWebsite(id, function () {
                        maintainWebsite.display(0);
                        ui.info('Successfully delete the record!');
                    })
                })
            })
            return maintainWebsite;
        },
        WebsiteDetails: function (id, selector) {
            var template = { Id: 'websiteform', url:  "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: null };
            var websiteDetails = new eworkspace.framework.Form(id, model, template, selector);
            websiteDetails.save = function (callback) {
                if (!websiteDetails.validator.validate())
                {
                    ui.error("Please enter the required fields");
                    return;
                }

                var website = utils.cloneModel(websiteDetails.getData());
                //website.DateCreate = new Date();

                if ($.isFunction(callback))
                    callback(website);
            }

            websiteDetails.setValidatorOptions({
                rules: {
                    serviceurl: function (input) {
                        var isValid = true;
                        if (input.is("[data-serviceurl-msg]") && input.val() != "") {
                            var filter = /^\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/;
                            isValid = filter.test(input.val());
                        }
                        return isValid;
                    }
                }
            });

            return websiteDetails;
        },
        SelectUserDialog: function (id, parent) {
            var model = {
                title: "Select User",
                width: 800,
                content: { url: "eworkspace.ViewModel.AssignRoleToUserList", Id: "AssignRoleToUserList" }
            }
            var dialog = new eworkspace.framework.DialogWindow(id, model);
            var ok = function () {
                var contentPage = dialog.getContentPage();
                var selectedUserList = contentPage.model.selectedItems;
                var userList = parent.getgridData();
                var parentData = {};
                userList.forEach(function (item) {
                    parentData[item.UserId] = item;
                })

                var result = utils.cloneModel(userList);
                selectedUserList.forEach(function (item) {
                    if (parentData[item.UserId] == null)
                        result.push(item);
                })

                //parent grid
                parent.refreshgridData(result);
                dialog.close();
            }
            var cancel = function () {
                dialog.close();
            }
            dialog.model.buttons = [{ text: "OK", onClick: ok }, { text: "CANCEL", onClick: cancel }]
            return dialog;
        },
        AssignRoleToUserList: function (id, selector) {
            var template = {
                html: "<div id='searchBar'>" +
                        "<span style='display:inline;'>" +
                        "<label data-i18n='Search:'>Search:</label>" +
                        "</span>" +
                        "<span style='display:inline;'>" +
                        "<select id='domainDDL' data-role='dropdownlist' data-text-field='Name' data-value-field='LocationId' data-bind='source: data.Domains'></select>" +
                        "</span>" +
                        "<span style='display:inline;'>" +
                        "<select id='fieldTypeDDL' data-role='dropdownlist' data-bind='value:data.FieldType'  >" +
                        "<option value='NAME' data-i18n='User Name'>User Name</option>" +
                        "<option value='ID' data-i18n='User Id'>User Id</option>" +
                        "</select>" +
                        "</span>" +
                        "<span style='display:inline;'>" +
                        "<input id='txtSearchText' type='text' name='searchText' style='width:200px;' autocomplete='off'/>" +
                        "</span>" +
                        "<span class='searchUser fas fa-search-plus' style='display:inline;margin-left: 10px;cursor: pointer;'></span>" +
                      "</div><br/>" +
                      "<h3 style='margin-left:5px;margin-top:5px;margin-bottom:5px;font-size:16px;'></h3><div class='grid' style='border-width:1px 0px 0px 0px'></div>"
            };
            var model = utils.cloneModel(uiModel.AssignRoleToUserList);
            model.gridDataSourceField = 'Users';
            var assignRoleToUserList = new eworkspace.framework.List(id, model, selector, template);
            assignRoleToUserList.model.selectedItems = [];
            assignRoleToUserList.setLoadDataHandler(uiServices.getOrganizationList);      
            assignRoleToUserList.setEventHandler(function () {
                $('#searchBar').on("click", ".searchUser", function () {
                    var domain = $("#domainDDL").data("kendoDropDownList").dataItem();
                    var fieldType = $("#fieldTypeDDL").data("kendoDropDownList").value();
                    var searchText = $('#txtSearchText').val();
                    uiServices.searchUsers(domain, fieldType, searchText, function (data) {
                        assignRoleToUserList.refreshgridData(data);
                    })
                });

                var grid = assignRoleToUserList._getGrid();
                grid.content.on("click", ".checkbox", selectRow);

                //on click of the checkbox:
                function selectRow() {
                    var checked = this.checked,
                    row = $(this).closest("tr"),
                    dataItem = grid.dataItem(row);
                    
                    if (checked) {
                        //-select the row
                        row.addClass("k-state-selected");
                        var checkedUser = utils.cloneModel(dataItem);
                        checkedUser.DisplayName = checkedUser.UserName;
                        assignRoleToUserList.model.selectedItems.push(checkedUser);
                    } else {
                        //-remove selection
                        row.removeClass("k-state-selected");
                        assignRoleToUserList.model.selectedItems = $.grep(assignRoleToUserList.model.selectedItems, function (item) {
                            return item.Id != dataItem.Id
                        })
                    }
                };
            })
            return assignRoleToUserList;
        },
        Assign2FAToRole: function (id, selector) {
            var template = { Id: '2FAform', url:  "src/view/framework_" + platForm.provider + ".html" }
            var model = { data: null };
            var details = new eworkspace.framework.Form(id, model, template, selector);
            details.setLoadCompletedHandler(function (data) {
                details.checkedIds = {};

                $('#' + details.Id).find("input[type=checkbox]").prop("checked", false);
                data.SFAProviderIds.forEach(function (id) {
                    details.checkedIds[id] = id;
                    $('#' + details.Id).find("input[type=checkbox][value=" + id + "]").prop("checked", true);
                })
              
            })

            details.setEventHandler(function (data) {
                var data = details.model.data.SFAproviders;
                if (data.length > 0) {
                    for (i = 0; i < data.length; i++) {
                        var name = utils.getLocaleLabel(data[i].Name);
                        $('#' + details.Id).find(".checkBoxList").append("<input type='checkbox'  name='SFAProvider' value='" + data[i].Id + "' style='margin-left: 30px;'><label style='margin-left: 5px;'>" + name + "</label><br>");
                        if (details.checkedIds[data[i].Id] != null)
                            $('#' + details.Id).find("input[type=checkbox][value=" + data[i].Id + "]").prop("checked", true);

                    }  
                }

                $('input:checkbox').change(function () {
                    var checked = this.checked
                    if (checked) {
                        //-select the row
                        details.checkedIds[this.value] = this.value;//checked;
                    } else {
                        //-remove selection
                        if (details.checkedIds[this.value])
                            delete details.checkedIds[this.value];
                    }
                    var SFAproviders = []
                    $.each(details.checkedIds, function (id, item) {
                        SFAproviders.push(parseInt(id));
                    })

                    details.setDataByField("SFAProviderIds", SFAproviders);
                    details.parent.model.data.SFAProviderIds = SFAproviders;
                });
            });
           
            return details;
        },
        MaintainWidgetSettings: function (id, selector) {
            var template = { Id: 'widgetSettingsForm', url:  "src/view/framework_" + platForm.provider + ".html" };
            
            var model = { data: null };
            var widgetSetting = new eworkspace.framework.Form(id, model, template, selector);
           /* widgetSetting.setLoadCompletedHandler(function (data) {
                var widgetSettings = data.WidgetSettings != null && data.WidgetSettings.length ? data.WidgetSettings : [];
                var widgetId = data.WidgetSettings != null && data.WidgetSettings.length ? data.WidgetSettings[0].WidgetId : 0;
                var result = { SelectedWidgetId: widgetId, WidgetSettings: widgetSettings, parameters: [] };

                if (result.WidgetSettings.length > 0 && result.WidgetSettings[0].JSONParameter != null && result.WidgetSettings[0].JSONParameter.length) {
                    var json_param = data.WidgetSettings[0].JSONParameter == null ? {}: JSON.parse(data.WidgetSettings[0].JSONParameter);
                    var parameters = [];
                    if (json_param != null)
                        $.each(json_param, function (name, value) {
                            var item = { Title: name, Value: value };
                            parameters.push(item);
                        });

                    result.parameters = parameters;
                }
                
                data.SelectedWidgetId = result.SelectedWidgetId;
                data.parameters = result.parameters;
                result.parameters.forEach(function (param) {
                    data.parameters.push(param);
                })
                 
                data.WidgetSettings = result.WidgetSettings;
            });*/
            
            widgetSetting.convertData = function (data) {
                var widgetSettings = data.WidgetSettings != null && data.WidgetSettings.length ? data.WidgetSettings : [];
                var widgetId = data.WidgetSettings != null && data.WidgetSettings.length ? data.WidgetSettings[0].WidgetId : 0;
                var result = { SelectedWidgetId: widgetId, WidgetSettings: widgetSettings, parameters: [] };

                if (result.WidgetSettings.length > 0 && result.WidgetSettings[0].JSONParameter != null && result.WidgetSettings[0].JSONParameter.length) {
                    var json_param = data.WidgetSettings[0].JSONParameter == null ? {} : JSON.parse(data.WidgetSettings[0].JSONParameter);
                    var parameters = [];
                    if (json_param != null)
                        $.each(json_param, function (name, value) {
                            var item = { Title: name, Value: value };
                            parameters.push(item);
                        });

                    result.parameters = parameters;
                }

                data.SelectedWidgetId = result.SelectedWidgetId;
                data.parameters = result.parameters;
                data.WidgetSettings = result.WidgetSettings;
            }
            widgetSetting.setEventHandler(function () {
                var dpWidget = $('#' + widgetSetting.Id).find('.Widgets');
                dpWidget.change(function () {
                    var selectedId = $('#' + widgetSetting.Id).find('select option:selected').val();

                    if (selectedId == widgetSetting.model.data.SelectedWidgetId)
                        return;
                    var parameters = [];
                    widgetSetting.model.data.WidgetSettings.forEach(function (widget) {
                        if (widget.WidgetId == selectedId) {
                            var json_param = widget.JSONParameter == null ? null : JSON.parse(widget.JSONParameter);

                            var parameters = [];
                            if (json_param != null)
                                $.each(json_param, function (name, value) {
                                    var item = { Name: name, Value: value };
                                    parameters.push(item);
                                });

                            widgetSetting.model.data.SelectedWidgetId = selectedId;
                            widgetSetting.model.data.parameters = parameters;
                            widgetSetting.setData(widgetSetting.model.data);
                        }
                    });

                });
                var grid = $("#"+widgetSetting.Id).find('.grid').data("kendoGrid");

                grid.bind("saveChanges", function (e) {
                    var data = grid.dataSource.data();
                    
                    widgetSetting.model.data.WidgetSettings.forEach(function (widget) {
                        var selectedId = $('#' + widgetSetting.Id).find('select option:selected').val();
                        if (widget.WidgetId == selectedId) {
                            var json_params = {};
                            data.forEach(function (item) {
                                json_params[item.Title] = item.Value;
                            });
                               
                            widget.JSONParameter =JSON.stringify(json_params);
                            widgetSetting.model.data.parameters = data;
                        }
                    })

                    if (data.length == 0)
                        widgetSetting.model.data.WidgetSettings.length = 0;
                    
                    ui.info('Parameter Saved!');
                    widgetSetting.parent.model.data.WidgetSettings = widgetSetting.model.data.WidgetSettings;
                    e.preventDefault();
                });

                widgetSetting.convertLocaleGrid('.grid');
            });
            //widgetSetting.setLoadDataHandler(uiServices.getOrganizationList);
            return widgetSetting;
        },
        MaintainModulePermssions: function (id, selector) {
            var template = { Id: 'modulePermissionForm', url: "src/view/framework_" + platForm.provider + ".html" };

            var model = utils.cloneModel(uiModel.ModulePermission);
            model.gridDataSourceField = 'ModulePermissions';


            var details = new eworkspace.framework.TreeList(id, model, selector, template);
            details.setGridDataBound(function (e) {           
                e.sender.items().each(function () {
                    var dataItem = e.sender.dataItem(this);
                    var readChbx = $(this).find('.checkbox.read');
                    var writeChbox = $(this).find('.checkbox.write');
                    readChbx.prop("checked", dataItem.ReadPermission);
                    writeChbox.prop("checked", dataItem.WritePermission);
       
                });
                var allReadChbox = e.sender.thead.find('.checkAll.read');
                var allWriteChbox = e.sender.thead.find('.checkAll.write');
                var totalCheckedRead = $.grep(details.model.data.ModulePermissions, function (item) { return item.ReadPermission == true }).length;
                var totalCheckedWrite = $.grep(details.model.data.ModulePermissions, function (item) { return item.WritePermission == true }).length;
                allReadChbox.prop("checked", totalCheckedRead>0 && totalCheckedRead == details.model.data.ModulePermissions.length);
                allWriteChbox.prop("checked", totalCheckedWrite>0&&totalCheckedWrite == details.model.data.ModulePermissions.length)
               
            })

            details.save = function () {
                details.parent.model.data.ModulePermissions = details.model.data.ModulePermissions.filter(o => {
                    return  (o.ResourceTypeId == 0 && (o.ReadPermission || o.WritePermission)) || o.ResourceTypeId >1 && !(o.ReadPermission && o.WritePermission)
                });

            }

            details.setEventHandler(function () {
                var dpWidget = $('#' + details.Id).find('.Widgets');
                dpWidget.change(function () {
                    var selectedId = $('#' + details.Id).find('select option:selected').val();
                    if (selectedId == "") {
                        details.refreshgridData(details.model.data.ModulePermissions);
                    } else {
                        details.model.data.WidgetSettings.forEach(function (widget) {
                            if (widget.WidgetId == selectedId) {
                                uiServices.getWidgetResources({ Id: widget.WidgetId, url: widget.PermissionFileUrl }, function (data) {
                                    var checkedPermissions = $.grep(details.model.data.ModulePermissions, function (item) { return item.WidgetId == widget.WidgetId || item.WidgetId == null });
                                    checkedPermissions.forEach(function (item) {
                                        $.grep(data, function (res) {
                                            if (res.ResourceTypeId == 2 && res.parentName == item.Name) {
                                                res.ReadPermission = item.ReadPermission;
                                                //res.WritePermission = item.WritePermission;
                                            }

                                            if (res.Name == item.Name && res.ResourceTypeId == item.ResourceTypeId){
                                                res.ReadPermission = item.ReadPermission;
                                                res.WritePermission = item.WritePermission;
                                            }
                                            return true;
                                        });
                                    })
                                    details.refreshgridData(data);
                                }, function () {
                                        details.refreshgridData([]);
                                        $('#' + details.Id).find('.checkAll').prop("checked", false);
                                })
                            }
                        });
                    }
                 

                });

                var grid = details._getGrid();
                grid.content.on("click", ".checkbox", selectRow);

                function selectRow() {
                    var checked = this.checked,
                        row = $(this).closest("tr"),
                        dataItem = grid.dataItem(row);
                    var isRead = $(this).hasClass('read');
                    var className = isRead ? ".read" : (checked ? "" : ".write");

                    var children = grid.dataSource.childNodes(dataItem);
                    var parent = grid.dataSource.parentNode(dataItem);

                    if (isRead)
                        dataItem.ReadPermission = checked;
                    else {
                        dataItem.ReadPermission = checked ? checked : dataItem.ReadPermission;
                        dataItem.WritePermission = checked;
                        if (checked)
                          row.find('.checkbox.read').prop('checked', checked);
                    }

                    var findParent = false;
                    var temp = $.grep(details.model.data.ModulePermissions, function (item) {
                        if (item.Name == dataItem.Name && item.ResourceTypeId == dataItem.ResourceTypeId) {
                            item.ReadPermission = dataItem.ReadPermission;
                            item.WritePermission = dataItem.WritePermission;
                            item.Description = dataItem.Description;
                        }
                        findParent = findParent ? findParent : (dataItem.WidgetId != null && item.Id == dataItem.WidgetId);
                        return item.Name == dataItem.Name;

                    })

                    if (temp.length == 0) {
                        var newItem = { Id: utils.generateUUID(), Name: dataItem.Name, Description: dataItem.Description, ResourceTypeId: dataItem.ResourceTypeId, ResourceType: dataItem.ResourceType, WidgetId: dataItem.WidgetId, ReadPermission: dataItem.ReadPermission, WritePermission: dataItem.WritePermission } 
                        newItem.parentId = dataItem.WidgetId
                        if (dataItem.WidgetId == null || findParent)
                           details.model.data.ModulePermissions.push(newItem);
                    } 

                    if (dataItem.ResourceTypeId > 0) {
                        var parentItem = null;
                        var isChecked = false;
                        details.model.data.ModulePermissions.forEach(function (item) {
                            parentItem = item.Id == dataItem.WidgetId ? item : parentItem;
                            isChecked = item.parentId == dataItem.WidgetId ? (isChecked || (isRead ? item.ReadPermission : item.WritePermission)) : isChecked;
                            if (parentItem != null) {
                                if (isRead)
                                    parentItem.ReadPermission = isChecked;
                                else {
                                    parentItem.ReadPermission = isChecked ? isChecked : parentItem.ReadPermission;
                                    parentItem.WritePermission = isChecked;
                                }
                                
                            }
                        });
                    }
                 
                    if (checked) {
                        //-select the row
                        row.addClass("k-state-selected");          
                    } else {
                        //-remove selection
                        row.removeClass("k-state-selected");
                    }

                    if (children.length > 0 && dataItem.ResourceTypeId ==null) {
                        children.forEach(function (item) {
                            rowUID = item.uid;
                            $('[data-uid="' + rowUID + '"]').find("input[type=checkbox]" + className).prop('checked', checked);
                            details.model.data.ModulePermissions.forEach(function (perItem) {
                                if (item.Name == perItem.Name && item.WidgetId == perItem.WidgetId && item.ResourceTypeId == perItem.ResourceTypeId) {
                                    
                                    if (isRead)
                                        perItem.ReadPermission = checked;
                                    else {
                                        perItem.ReadPermission = checked ? checked : perItem.ReadPermission;
                                        perItem.WritePermission = checked;
                                    }
                                }
                            })
                        });
                    }
                    if (parent != undefined) {
                        var parentItem = null;
                        var isChecked = false;
                        if (checked || parent.ResourceTypeId == null && $.grep(details.model.data.ModulePermissions, function (item) {
                            parentItem = item.id == parent.id ? item : parentItem;
                            if (item.id != parent.id && item.WidgetId == parent.id)
                                isChecked = isChecked || (isRead ? item.ReadPermission : item.WritePermission);

                            if (parentItem != null) {
                                if (isRead)
                                    parentItem.ReadPermission = isChecked;
                                else {
                                    parentItem.ReadPermission = checked ? isChecked : parentItem.ReadPermission;
                                    parentItem.WritePermission = isChecked;    
                                }
                            }

                            if (item.WidgetId == parent.id) {
                                if (isRead)
                                    return item.ReadPermission;
                                else
                                    return item.WritePermission;
                            } else
                                return false;
                        }).length == 0) {
                            $('[data-uid="' + parent.uid + '"]').find("input[type=checkbox]" + className).prop('checked', checked);
    
                        }
                        
                    }
                };

                $('#' + details.Id).find('.checkAll').click(function (event) {
                    var checked = this.checked;
                    var isRead = $(this).hasClass('read');
                    var className = isRead ? ".read" : (checked?"":".write");
                    if (!isRead && checked) {
                        $('#' + details.Id).find('.checkAll.read').prop('checked', true);
                    }

                    $('#' + details.Id).find('.checkbox'+className).each(function () {
                        var row = $(this).closest("tr"),dataItem = grid.dataItem(row);
                        this.checked = checked;
                        if (this.checked)
                            row.addClass("k-state-selected");
                        else
                            row.removeClass("k-state-selected");

                        if (isRead)
                            dataItem.ReadPermission = checked;
                        else {
                            dataItem.ReadPermission = checked ? checked : dataItem.ReadPermission;
                            dataItem.WritePermission = checked;
                        }

                        var findParent = false;
                        var temp = $.grep(details.model.data.ModulePermissions, function (item) {
                            if (item.Name == dataItem.Name && item.ResourceTypeId == dataItem.ResourceTypeId) {
                                item.ReadPermission = dataItem.ReadPermission;
                                item.WritePermission = dataItem.WritePermission;
                                item.Description = dataItem.Description;
                            }
                            findParent = findParent?findParent: (dataItem.WidgetId != null && item.Id == dataItem.WidgetId);
                            return item.Name == dataItem.Name;

                        });

                        if (temp.length == 0) {
                            var newItem = { Id: utils.generateUUID(), Name: dataItem.Name, Description: dataItem.Description, ResourceTypeId: dataItem.ResourceTypeId, WidgetId: dataItem.WidgetId, ResourceType: dataItem.ResourceType, ReadPermission: dataItem.ReadPermission, WritePermission: dataItem.WritePermission }
                            newItem.parentId = dataItem.WidgetId
                            if (dataItem.WidgetId == null || findParent )
                               details.model.data.ModulePermissions.push(newItem);
                        }

                    });
                    
                });
            });
            
            return details;
        },
        SearchContacts: function (id, selector) {
            var template = {
                html: "<div id='searchBar'>" +
                        "<span style='display:inline;'>" +
                        "<label>Search:</label>" +
                        "</span>" +
                        "<span style='display:inline;'>" +
                        "<select id='domainDDL' data-role='dropdownlist' data-text-field='Name' data-value-field='Domain' data-bind='source: data.Domains'></select>" +
                        "</span>" +
                        "<span style='display:inline;'>" +
                        "<select id='fieldTypeDDL' data-role='dropdownlist' data-bind='value:data.FieldType'>" +
                        "<option value='UserId'>User Id</option>" +
                        "<option value='UserName'>User Name</option>" +
                        "</select>" +
                        "</span>" +
                        "<span style='display:inline;'>" +
                        "<input id='txtSearchText' type='text' name='searchText' style='width:200px;'/>" +
                        "</span>" +
                        "<span class='searchUser glyphicon glyphicon-search' style='display:inline;margin-left: 10px;cursor: pointer;'></span>" +
                      "</div><br/>" +
                      "<h3 style='margin-left:5px;margin-top:5px;margin-bottom:5px;font-size:16px;'></h3><div class='grid' style='border-width:1px 0px 0px 0px'></div>"
            };
            var model = utils.cloneModel(uiModel.AssignRoleToUserList);
            model.gridDataSourceField = 'Users';
            model.selectedItems = [];
            var assignRoleToUserList = new eworkspace.framework.List(id, model, selector, template);
            assignRoleToUserList.setLoadDataHandler(uiServices.getContactsForSearch);
            assignRoleToUserList.setLoadCompletedHandler(function (data) {
                model.selectedItems.length = 0;
            })

            
            assignRoleToUserList.setEventHandler(function () {
                var grid = assignRoleToUserList._getGrid();
                $('#searchBar').on("click", ".searchUser", function () {
                    var domain = $("#domainDDL").data("kendoDropDownList").value();
                    var fieldType = $("#fieldTypeDDL").data("kendoDropDownList").value();
                    var searchText = $('#txtSearchText').val();
                    if (domain == null || domain.length == 0) {
                        if (searchText != null && searchText.length > 0) {
                            var data = grid.dataSource.data();
                            data = $.grep(data, function (item) {
                                return item[fieldType] == searchText;
                            });
                            assignRoleToUserList.refreshgridData(data);
                           
                        }
                        else
                            assignRoleToUserList.display();
                    }
                    else {
                        uiServices.searchADUser(domain, fieldType, searchText, function (data) {
                            assignRoleToUserList.refreshgridData(data);
                        })
                    }
                    
                });

                grid.content.on("click", ".checkbox", selectRow);

                //on click of the checkbox:
                function selectRow() {
                    var checked = this.checked,
                    row = $(this).closest("tr"),
                    dataItem = grid.dataItem(row);

                    if (checked) {
                        //-select the row
                        row.addClass("k-state-selected");
                        var checkedUser = utils.cloneModel(dataItem);
                        checkedUser.DisplayName = checkedUser.UserName;
                        assignRoleToUserList.model.selectedItems.push(checkedUser);
                    } else {
                        //-remove selection
                        row.removeClass("k-state-selected");
                        assignRoleToUserList.model.selectedItems = $.grep(assignRoleToUserList.model.selectedItems, function (item) {
                            return item.Id != dataItem.Id
                        })
                    }
                };
            })
            return assignRoleToUserList;
        },
        SelectApprovers: function (id, selector,request) {
            var model = {
                title: "Select Users:",
                checkedIds: {},
                gridOptions: {
                    dataSource: {
                        data: [],
                        pageSize: 5
                    },
                    height: 300,
                    selectable: true,
                    filterable: true,
                    scrollable: true,
                    sortable: true,
                    pageable: true,
                    columns: [
                    { template: "<input type='checkbox' class='checkbox' />", width: "50px", headerTemplate: '<input type="checkbox" name"check-all" />' },
                    { field: "UserId", title: 'Id' },
                    { field: "Name", title: 'Name' },
                    { field: "Email", title: 'Email' },
                    { field: "Role", title: 'Title' },
                    ]
                }
            }
            //model.gridDataSourceField = 'Users';
            model.selectedItems = [];
            var approverList = new eworkspace.framework.List(id, model, selector);
            approverList.setLoadDataHandler(uiServices.getApprovers);
            approverList.setLoadCompletedHandler(function (data) {
                model.selectedItems.length = 0;
            })

            approverList.setEventHandler(function () {
                var grid = approverList._getGrid();
                grid.content.on("click", ".checkbox", selectRow);

                //on click of the checkbox:
                function selectRow() {
                    var checked = this.checked,
                    row = $(this).closest("tr"),
                    dataItem = grid.dataItem(row);

                    if (checked) {
                        //-select the row
                        row.addClass("k-state-selected");
                        checkedUser = JSON.parse(JSON.stringify(dataItem));
                        approverList.model.selectedItems.push(JSON.parse(JSON.stringify(dataItem)));
                    } else {
                        //-remove selection
                        row.removeClass("k-state-selected");
                    }
                };
            })
            return approverList;
        },
        SelectApproverDialog: function (id, request, callback) {
            var params = request == null ? null : [];
            if (request != null)
                params.push(request)

            var model = {
                title: "User List",
                width: 800,
                content: { url: "eworkspace.ViewModel.SelectApprovers", Id: id + "-approvers", displayParams: params },
                selectedRequestorList: []
            }

            var selectRequestordialog = new eworkspace.framework.DialogWindow(id, model);
            var ok = function () {
                var pageId = selectRequestordialog.model.content.Id;
                var contactPage = utils.pages[pageId];

                var selectedRequestorList = contactPage.model.selectedItems;
                var selectedRequestor = { UserId: "", UserName: "", Email: '' };

                if (selectedRequestorList.length != 0) {
                    selectedRequestorList.forEach(function (requestor) {
                        selectedRequestor.UserId += (selectedRequestor.UserId.length > 0 ? ';' : '') + requestor.UserId;
                        selectedRequestor.UserName += (selectedRequestor.UserName.length > 0 ? '\r\n' : '') + requestor.UserName;
                        selectedRequestor.Email += (selectedRequestor.Email.length > 0 ? ';' : '') + requestor.Email;
                    })

                    if ($.isFunction(callback))
                        callback(selectedRequestorList);
                }

                selectRequestordialog.close();
            }
            var cancel = function () {
                selectRequestordialog.close();
            }
            selectRequestordialog.model.buttons = [{ text: "ok", onClick: ok }, { text: "cancel", onClick: cancel }]
            return selectRequestordialog;
        },
        MaintainClient: function (id, selector, callback) {
            var model = utils.cloneModel(uiModel.MaintainClient);
            var maintainClient = new eworkspace.framework.WorkflowPage(id, model, selector);
            var getClients = function (callback) {
                uiServices.getClientSettings('0', callback);
            }
            maintainClient.setLoadDataHandler(getClients);

            maintainClient.setLoadCompletedHandler(function (data) {
                maintainClient.setButtonVisible("DELETE", data.IsSystemDefined == false);
            });

            maintainClient.onToolBarItemClick(0, function () {
                maintainClient.display();
            })

            maintainClient.onToolBarItemClick(1, function () {
                //save
                var page = maintainClient.pages[maintainClient.model.content[0].items[0].page.Id];
                page.save();
            })

            maintainClient.onToolBarItemClick(2, function () {
                var dialog = new eworkspace.framework.ConfirmationDialog();
                dialog.show("Delete Record", "Are you sure to delete the record?", function () {
                    var page = maintainClient.pages[maintainClient.model.content[0].items[0].page.Id];
                    var id = page.model.data.Id;
                    uiServices.deleteClient(id, function () {
                        maintainClient.display();
                        ui.info('Successfully delete the record!');
                    })
                })
            })

            maintainClient.onToolBarItemClick(3, function () {
                uiServices.exportClientSettings(function (content) {
                    var array = new Array();
                    array.push(content);

                    var blob = new Blob(array, { type: 'text/xml' });
                    var fileName = "clients.xml"
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        var url = URL.createObjectURL(blob);
                        window.open(url);
                        URL.revokeObjectURL(url);
                    }

                })
            })
            return maintainClient;
            
            
        },
        ClientDetails: function (id, selector, callback) {
            var template = { Id: 'clientform', url:  "src/view/framework_" + platForm.provider + ".html" };

            var model = utils.cloneModel(uiModel.ClientDetails);
            var clientDetails = new eworkspace.framework.List(id, model, selector, template);
            clientDetails.setEventHandler(function () {
                clientDetails.ValidateInit(".form");
                var grid_change = function () {
                    var grid = clientDetails._getGrid();
                    var row = grid.select();
                    var data = grid.dataItem(row);
                    clientDetails.model.data.Id = data.ClientId;
                    clientDetails.model.data.Name = data.Name;
                    clientDetails.model.data.AllowOrignal = data.AllowOrignal;
                    clientDetails.model.data.RefreshTokenLifeTime = data.RefreshTokenLifeTime;
                    clientDetails.model.data.TokenLifeTime = data.TokenLifeTime;
                    clientDetails.model.data.HashSecret = data.HashSecret;
                    clientDetails.model.data.EnableSSO = data.EnableSSO;
                    clientDetails.model.data.Enable2FA = data.Enable2FA;
                    clientDetails.model.data.EnableRefreshToken = data.EnableRefreshToken;
                    clientDetails.model.data.LastModifiedByName = data.LastModifiedByName;
                    clientDetails.model.data.LastModifiedOn = utils.toDateString(new Date(data.LastModifiedOn), "dd MMM yyyy, hh:mm");
                    clientDetails.model.data.IsSystemDefined = data.IsSystemDefined;
                    clientDetails.parent.rebindData(clientDetails.model.data);
                    clientDetails.setData(clientDetails.model.data);
                    clientDetails.parent.setButtonVisible("DELETE", data.IsSystemDefined == false);
                }
                var grid = clientDetails._getGrid();
                grid.bind("change", grid_change);

            })

            clientDetails.save = function () {
                //var request = clientDetails.getData('data');
                if (clientDetails.validator.validate() == false) {
                    ui.error('Please enter the required fields')
                    return;
                }
                /*var client = {
                    Id: request.Id,
                    Name: request.Name,
                    AllowOrignal: request.AllowOrignal,
                    RefreshTokenlifeTime: request.RefreshTokenLifeTime
                }*/
                var client = utils.cloneModel(clientDetails.getData('data'));
                utils.showProcessbar(true);
                uiServices.saveClient(client, function (data) {
                    utils.showProcessbar(false);
                    clientDetails.parent.display();
                    ui.info('Save the record!');
                })
            }
            return clientDetails;
        }
    }

    return ViewModels;
});