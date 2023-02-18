
requirejs(["core"], function () {
    var startup = new tangram.Core({
        defaultContainer: "#content",
        Debug: true,
        components: {},
        widgets: []
    });
    var eworkspace = startup.exportCore();
    var utils = eworkspace.utils;
    var components = eworkspace.components;   
    var config = null;
    var appInstance = {
        ViewModel: null,
        Services: null,
        //components: [],
        profile: {},
        azureAuthMode: platForm.azureAuthMode,
        onAuthenticated: function (callback,failCallback) {
            appInstance.Services.getUserProfile(function () {
                requirejs(["app/framework." + platForm.provider + platForm.fileExtension, "ViewModels"], function (framework,viewmodels) {
                    framework.create(eworkspace);
                    framework.createSession(config);
                    startup.registerRouter(framework.createRouter, framework.navigate, framework.setRoute);
                    startup.setRouterParams(appInstance.profile.WebsiteId, appInstance.profile.Websites);
                    startup.registerPlatformProvider(framework[platForm.provider]);

                    startup.registerViewModel("info", appInstance.ViewModel.info);
                    startup.registerViewModel("warning", appInstance.ViewModel.warning);
                    startup.registerViewModel("error", appInstance.ViewModel.error);
                    
                    console.info('create app viewmodels')
                   var configurationUI = new viewmodels(utils.cloneModel(config), startup, appInstance.profile);
                    configurationUI.init();
                    appInstance.pathname = window.location.pathname.toLowerCase().replace("default.html", "");

                    var masterPage = new appInstance.ViewModel.Main();
                    var websiteId = masterPage.setRedirectUrl();
                    websiteId = websiteId != null ? websiteId : appInstance.profile.WebsiteId;

                    var isAccessible = $.grep(appInstance.profile.Websites, function (website) {
                        return websiteId == website.Id
                    }).length>0;
                 
                    if (isAccessible) {
                        masterPage.display(websiteId);
                    }
                    else
                        masterPage.displayDenypage("inaccessable for specified website");

                    startup.registerInitView(masterPage);
                    masterPage.setFormLoadedHandler(function () {
                        var relativeUrl = utils.getRelativeUrl();
                        relativeUrl = relativeUrl.replace('#', '');
                        startup.navigateTo(relativeUrl)
                    });
                    
                    if ($.isFunction(callback))
                      callback();
                });
           
            }, failCallback)
  
        }
    };
    
    var service = function () {
        this.isUpdateToken = false;
        this.sessionName = startup.createSessionName(config.ClientId);
        $.ajaxSetup({ cache: false });
    }
    service.prototype = {
        createSession: function (json) {
            localStorage.setItem(this.sessionName, JSON.stringify({
                expireDate: json.expireDate,
                access_token: json.access_token,
                refresh_token: json.refresh_token,
                refresh_token_expires_in: json.refresh_token_expires_in,
                require2FA: json.require2FA,
                SFAProviders: json.SFAProviders
            }))
        },
        getSession: function () {
            var obj = localStorage.getItem(this.sessionName);
            obj = obj != null && obj.length > 0 ? JSON.parse(obj) : null;
            return obj;
        },
        callApi: function (options) {
            appInstance.Services.getToken(function (token) {
                options.headers = options.headers || {};
                options.headers["Authorization"] = "bearer " + token;
                $.ajax(options);
            });
        },
        logout: function (callback, failCallback) {
            var options = {
                type: "DELETE",
                url: config.serviceUrl + 'users/signout/' + config.ClientId,
                success: function (json) {
                    if ($.isFunction(callback))
                        callback();

                    if (appInstance.authService != null)
                        appInstance.authService.signOut();
                },
                error: function (xhr) {
                    console.error("logout fails:" + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback();
                    if (appInstance.authService != null)
                        appInstance.authService.signOut();
                },
                processData: false
            };
            appInstance.Services.callApi(options);
            console.log('clear local storage');
            localStorage.clear();
        },
        login: function (user, callback, failCallback) {
            var self = this;
            $.ajax({
                type: "POST",
                url: config.AuthorizationUrl + 'token',
                data: "grant_type=password&username=" + user.userId + "&password=" + user.password + "&domain=" + user.domain + "&client_id=" + config.ClientId,
                global: false,
                success: function (json) {
                    json.expireDate = new Date(json.expires); 
                    json.SFAProviders = json.require2FA == true ? JSON.parse(json.SFAProviders) : null;
                    appInstance.profile = json
                    
                    self.createSession(json); 
            
                    if ($.isFunction(callback))
                        callback();
                },
                error: function (xhr) {
                    if (xhr.status==0 || xhr.responseText.length == 0) {
                        alert('fails to connect to oauth server');

                    } else {

                        var errorObj = JSON.parse(xhr.responseText);
                        alert(errorObj.Message);
                    }
                    if ($.isFunction(failCallback))
                        failCallback();
        
                },
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                processData: false
            });
        },
        getAccessToken: function (refreshtoken, callback, failCallback) {
            var self = this;
            self.isUpdateToken = true;
            console.info("start to get access token by refreshtoken");

            $.ajax({
                type: "POST",
                url: config.AuthorizationUrl + 'token',
                data: "grant_type=refresh_token&refresh_token=" + refreshtoken + "&client_id="+ config.ClientId, 
                global: false,
                success: function (json) {
                    json.expireDate = new Date(json.expires);
                    self.createSession(json);
                    console.info("new access token. Expired Date:" + utils.toDateString(json.expireDate, "dd MMM yyyy, hh:mm:ss"));
                    if ($.isFunction(callback))
                        callback(json.access_token);
                },
                error: function (xhr) {
                    if (xhr.status == 0)
                        alert('fails to connect to oauth server');
                    else
                        alert(xhr.responseText);

                    self.isUpdateToken = false;
                    localStorage.clear();
                    window.open(utils.getBaseUrl());
                },
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                processData: false
            });
        },
        getAccessTokenByAzureToken: function (token, callback,failCallback) {
            var self = this;
            console.info("start to get access token by id token");

            $.ajax({
                type: "POST",
                url: config.AuthorizationUrl + 'token',
                data: "grant_type=azure_token&client_id=" + config.ClientId,
                headers: {
                    Authorization: "Bearer "+token
                },
                global: false,
                success: function (json) {
                    json.expireDate = new Date(json.expires);
                    self.createSession(json);
                    console.info("new access token. Expired Date:" + utils.toDateString(json.expireDate, "dd MMM yyyy, hh:mm:ss"));
                    if ($.isFunction(callback))
                        callback(json.access_token);
                },
                error: function (xhr) {
                    if (xhr.status == 0)
                        alert('fails to connect to oauth server');
                    else
                        alert(xhr.responseText);
                   
                    if ($.isFunction(failCallback))
                        failCallback();
                    localStorage.clear();
                },
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                processData: false
            });
        },
        getToken: function (callback) {
            if (appInstance.Services.sessionName == null && appInstance.Services.sessionName.length == 0) {
                callback(null);
                return;
            }

            /*var obj = localStorage.getItem(appInstance.Services.sessionName);
            obj = obj != null && obj.length > 0 ? JSON.parse(obj) : null;*/
            var obj = this.getSession();
            if (obj == null) {
                callback(null);
                return;
            }
            
            var current = new Date();
            var checkedTime = new Date(current.setSeconds(current.getSeconds() + 10));
            var checkedRefreshTime = new Date(current.setMinutes(current.getMinutes() + 5));
            obj.expireDate = new Date(obj.expireDate);
            obj.refresh_token_expiresDate = new Date(obj.refresh_token_expires_in);

            if (obj.expireDate > checkedTime) {
                if (obj.expireDate <= checkedRefreshTime && !appInstance.Services.isUpdateToken && obj.refresh_token != null)
                    appInstance.Services.getAccessToken(obj.refresh_token, callback);
                else
                    callback(obj.access_token);
            } else if (obj.refresh_token_expiresDate > checkedTime) {
                if (!appInstance.Services.isUpdateToken && obj.refresh_token != null)
                    appInstance.Services.getAccessToken(obj.refresh_token, callback);
            } else
                callback(null);
        }, 
        getUserProfile: function (callback, failCallback) {
            var options = {
                type: "GET",
                url: config.serviceUrl + 'users/profile',
                success: function (json) {
                    appInstance.profile = json;
                    if (json.RoleIds.length == 0) {
                        startup.displayDenypage();
                        appInstance.Services.logout();
                        console.warn('no roles with login user')
                    }
                    else if ($.isFunction(callback))
                        callback();
                   

                },
                error: function (xhr) {
                    alert('Service Error(get user profile):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback();
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }
            appInstance.Services.callApi(options);
           
        },
        verifyOTP: function (pincode, otpType, callback, faillcallback) {
            if (pincode == null || pincode.length < 6) {
                alert('Invalid pin');
                if ($.isFunction(faillcallback))
                    faillcallback();

                return;
            }
            var self = this;
            appInstance.Services.getToken(function (token) {
                if (token == null) {
                    alert('Invalid token, please login system first');
                    if ($.isFunction(faillcallback))
                        faillcallback();
                } else {
                    $.ajax({
                        type: "POST",
                        url: config.AuthorizationUrl + 'token',
                        headers: { "Authorization": "Bearer " + token, "X-OTP": pincode, "X-OTP-TYPE": otpType },
                        data: "grant_type=OTP&client_id=" + config.ClientId,
                        global: false,
                        success: function (json) {
                            json.expireDate = new Date(json.expires);
                            self.createSession(json);
                            appInstance.profile = json

                            if ($.isFunction(callback))
                                callback();
                        },
                        error: function (xhr) {
                            alert('Service Error(verify otp):' + xhr.responseText);
                            if ($.isFunction(faillcallback))
                                faillcallback();
                        },
                        dataType: 'json',
                        contentType: 'application/x-www-form-urlencoded',
                        processData: false
                    });
                }

               
            });
        },
        sendOTP: function (callback) {
            var options = {
                type: "POST",
                url: (config.AuthorizationUrl + 'api/Account/sendotp'),
                success: function (json) {
                    if (json.length)
                        alert(json);
                },
                error: function (xhr) {
                    alert('Service Error(send otp):' + xhr.responseText);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            };
            appInstance.Services.callApi(options);
        },
        getPortal: function (websiteId, callback, failCallback) {
            var options = {
                type: "GET",
                url: (config.serviceUrl + 'users/website?websiteId=' + websiteId),
                cache: false,
                success: function (json) {
                    appInstance.profile.WebsiteId = websiteId;
                    if (json.AuditTrailAPI != null && json.AuditTrailAPI.length>0)
                        appInstance.profile.AuditTrailConfig = { text: json.name, value: window.location.protocol+"//"+json.AuditTrailAPI }

                    json.profile = {
                        displayName: appInstance.profile.DisplayName,
                        websites: appInstance.profile.Websites,
                        websiteId: websiteId
                    };

                    json.components.forEach(function (component) {
                        config.components.push(component);
                    })

                    requirejs(config.components, function () {
                        //create widget instance
                        json.widgets.forEach(function (widget) {
                            var viewModelName = widget.Name + "." + widget.InstanceName;
                            widget.ServiceUrl = window.location.protocol + "//" + widget.ServiceUrl;
                            
                            var module = eval(widget.Name);
                            module = $.isFunction(module[widget.Name]) ? module[widget.Name] : module;
                            if ($.isFunction(module))
                                module = new module({
                                    viewModelName: viewModelName,
                                    profile: appInstance.profile,
                                    serviceUrl: widget.ServiceUrl,
                                    TemplateFileFolder: widget.TemplateFileFolder,
                                    pathname: appInstance.pathname
                                });

                            var viewModel = module[widget.InstanceName];
                            var serviceName = widget.Name + ".Services";
                            if (module != null) {
                                if ($.isFunction(module.setProfile)) {
                                    module.setProfile(appInstance.profile);
                                }

                                if ($.isFunction(module.setCore))
                                    module.setCore(startup.exportCore());

                                if (viewModel == null && $.isFunction(module.exportViewModel)) {
                                    var obj = module.exportViewModel();
                                    viewModel = $.isFunction(obj) ? new obj() : obj;
                                }

                                if ($.isFunction(module.exportServices))
                                    module["Services"] = module.exportServices();

                                startup.registerComponent(viewModelName, viewModel);
                                startup.registerComponentServices(serviceName, module["Services"]);

                                if (module.RoleSettings == null)
                                    module.RoleSettings = widget.RoleSettings;

                                if (module.DisableResources == null)
                                    module.DisableResources = widget.DisableResources;
                                module.widgetId = widget.Id;
                            }

                        });

                        json.dashboards.forEach(function (dashboard) {
                            dashboard.model = { data: [] };
                            var CViewModel = {};

                            dashboard.Views.forEach(function (view) {
                                var defaultNamespace = view.Model !== '' ? "eworkspace.CViewModel." : "";

                                if (view.Model != null) {
                                    var pageViewModel = appInstance.Services.createView(view);
                                    CViewModel[view.ViewName] = function (id, selector) {
                                        if ($.isFunction(pageViewModel))
                                            return pageViewModel(id, selector);
                                    }
                                }

                                dashboard.model.data.push({ title: view.Title, page: { url: defaultNamespace + view.ViewName }, isReplace: true });

                            });

                            dashboard.model.layout = dashboard.Layout;

                            var dashboardViewModel = appInstance.Services.createDashboard(JSON.stringify(dashboard.model));
                            CViewModel[dashboard.ViewModelName] = function (id, selector) {
                                return dashboardViewModel(id, selector);
                            }

                            startup.registerComponent("eworkspace.CViewModel", CViewModel);
                        });


                        if ($.isFunction(callback))
                            callback(json);
                    });


                },
                error: function (xhr) {
                    alert('Service Error(get portal):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback(xhr);
                },
                dataType: 'json',
                contentType: 'application/json',
                processData: false
            }

            appInstance.Services.callApi(options);
        },
        changePassword: function (oldPwd, newPwd, callback, failCallback) {
            var user = {
                UserId: appInstance.profile.UserId,
                Domain: appInstance.profile.Domain,
                Password: window.btoa(oldPwd),
                NewPassword: window.btoa(newPwd)
            }
            var options = {
                type: "POST",
                url: (config.serviceUrl + 'users/changePassword'),
                data: JSON.stringify(user),
                success: function () {
                    if ($.isFunction(callback))
                        callback();
                },
                error: function (xhr) {
                    alert('Service Error(change password):' + xhr.responseText);
                    if ($.isFunction(failCallback))
                        failCallback();
                },
                contentType:'application/json',
                processData: false
            };
            appInstance.Services.callApi(options);
        },
        createDashboard: function (strModel) {
            var func = function (id,selector) {
                var model = JSON.parse(strModel);
                var page = new eworkspace.components.Dashboard(id, model, selector);
                return page;
            }

            return func;
        },
        createView: function (view) {
            var params = view.ViewModelType.trim() === "eworkspace.framework.Chart" ? "(id,model,null,selector)" : "(id,model,selector)";
            var content = "var model = JSON.parse('" + view.Model + "'); var page=new " + view.ViewModelType + params + "; ";

            if (view.Action == null)
                return null;

            var namespace = view.Action.split('.');

            if (namespace.length < 2)
                return null;

            var serviceName = '';
            var methodName = namespace.length ? namespace[namespace.length - 1] : view.Action;

            for (i = 0; i < namespace.length - 1; i++) {
                serviceName += (serviceName === "" ? "" : ".") + namespace[i];
            }

            var viewService = startup.exportComponentServices(serviceName);
            
            if (!$.isFunction(viewService))
                content += " page.setLoadDataHandler(viewService." + methodName + ");";
            else {
                var args = view.ServiceUrl == null ? "" : view.ServiceUrl;
                content += " page.setLoadDataHandler(function(callback,failcallback) { var service = new viewService('" + args  + "');";
                content += "service." + methodName + "(callback,failcallback);    });";
            }

            content += " return page;";

            var func = new Function('eworkspace', 'viewService', "return function(id,selector) { " + content + " }")(eworkspace, viewService);
            return func;
        },
    }

    var viewmodel = function () {
        appInstance.profile = {};
        appInstance.Services = new service();
        appInstance.ViewModel = this;
        eworkspace.Services.getToken = appInstance.Services.getToken;
        eworkspace.Services.callApi = appInstance.Services.callApi;
    }
    viewmodel.prototype = {
        WindowsLogin: function () {
        },
        TFALogin: function (id, selector) {
            var model = {
                tabs: []
            };

            appInstance.profile.SFAProviders.forEach(function (item) {
                model.tabs.push({ title: item.Name, page: { url: item.Url, Id: item.Id } });
            });

            var login = new eworkspace.components.TabstripContainer(id, model, selector);
            login.setEventHandler(function () {
                $('body').css("background-color", "#E7E6E6");
            })

            login.close = function () {
                login.hide();
                $('body').css("background-color", "");

            }
            return login;
        },
        LoginByEmail: function (id, selector) {
            var model = {};
            var template = { html: "<p style='margin-top:40px'>Step 1: Click <button style='margin-left:5px;margin-right:5px' class='k-button t-primary' style='margin-left:5px'>Send</button> to receive 6-digit pin from your email</p><p style='margin-bottom:40px'>Step 2: Enter 6 digital Pin <input type='password' class='k-textbox' /><button style='margin-left:5px' class='k-button t-primary'>Submit</button></p>" }
            var tokenpage = new eworkspace.components.Basepage(id, model, template, selector);
            tokenpage.setEventHandler(function () {
                var buttons = $('#' + tokenpage.Id).find("button");
                var input = $('#' + tokenpage.Id).find("input");
                $(buttons[0]).click(function () {
                    appInstance.Services.sendOTP();
                });
                $(buttons[1]).click(function () {
                    var pincode = input.val();
                    if (pincode != null && pincode.length)
                        appInstance.Services.verifyOTP(pincode, "email", function () {
                            appInstance.onAuthenticated(function () {
                                appInstance.progress.hide();
                                tokenpage.parent.close();
                            }, function () {
                                appInstance.progress.hide();
                            })
                        });
                    else
                        alert('Please input one-time password')
                });
            });
            return tokenpage;
        },
        LoginWithToken: function (id, selector) {
            var model = {};
            var template = { html: "<p style='margin-top:40px'>Step 1: Lanuch Google Authenicator <img src='img/authenticator.jpg' style='width:40px'> on your mobile Device</p><p style='margin-bottom:40px'>Step 2: Enter 6 digital Pin <input type='password' class='k-textbox' /><button style='margin-left:5px' class='k-button t-primary'>Submit</button></p></div>" }
            
            var tokenpage = new eworkspace.components.Basepage(id, model, template, selector);

            tokenpage.setEventHandler(function () {
                var buttons = $('#' + tokenpage.Id).find("button");
                var input = $('#' + tokenpage.Id).find("input");
                $(buttons[0]).click(function () {
                    appInstance.progress.show();
                    var pincode = input.val();
                    if (pincode != null && pincode.length)
                        appInstance.Services.verifyOTP(pincode, "etoken", function () {
                            appInstance.onAuthenticated(function () {
                                appInstance.progress.hide();
                                tokenpage.parent.close();
                            }, function () {
                                    appInstance.progress.hide();
                            })

                        }, function () {
                                appInstance.progress.hide();
                        });
                    else
                        alert('Please input one-time password')
                });

                $(buttons[1]).click(function () {

                    input.val('');
                })
            });
            return tokenpage;
        },
        Login: function () {
            var template = { Id: 'loginForm', url: "src/view/masterpage_" + config.Layout + ".html" }
            var model = { data: appInstance.profile };

            var login = new eworkspace.components.Basepage("userlogin", model, template, 'body');
            $('body').addClass("bg-login-image");

            const msalConfig = {
                auth: {
                    clientId: "034e7652-d76e-4ded-8dea-0e0ee30e7eae", // This is the ONLY mandatory field that you need to supply.
                    authority: "https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/",
                    redirectUri: "https://localhost:5002/default.html", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.href
                },
                cache: {
                    cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
                    storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
                }
            };

            if (appInstance.azureAuthMode != null && appInstance.azureAuthMode.length > 0) {
                appInstance.authService = appInstance.azureAuthMode.toLowerCase() == "popup" ? initAzureAuthPopup(msalConfig) : initAzureAuthRedirect(msalConfig);
                appInstance.authService.setAuthenticateSuccessHandler(function (response) {
                    appInstance.progress.show();
                    login.hide();
                    $('body').removeClass("bg-login-image");
                    appInstance.Services.getAccessTokenByAzureToken(response.accessToken, function () {
                        appInstance.onAuthenticated(function () {
                            appInstance.progress.hide();
                            login.hide();
                        });
                    }, function () {
                            appInstance.progress.hide();
                            appInstance.authService.signOut();
                    })
                })

                appInstance.authService.setAuthenticateFailureHandler(function (error) {
                    login.hide();
                    $('body').removeClass("bg-login-image");
                    startup.displayDenypage();
                })
            }
            

            login.setEventHandler(function () {
                if (appInstance.azureAuthMode!=null && appInstance.azureAuthMode.toLowerCase() == "redirect")
                {
                    $('#' + login.Id).find('.card-body').hide();
                }
                else {
                    $('#' + login.Id).find('span.bigsystemicon').after(config.PortalName);
                    btnLogin = $("#" + login.Id).find(':button');
                    btnLogin.click(function () {

                        var UserId = $("#" + login.Id).find("[name='userId']").val();
                        var Password = $("#" + login.Id).find("[name='password']").val();
                        var Domain = $("#" + login.Id).find("[name='domain']").val();

                        appInstance.progress.show();
                        appInstance.Services.login({ userId: UserId, password: Password, domain: Domain }, function () {
                            login.hide();
                            $('body').removeClass("bg-login-image");
                            if (appInstance.profile.require2FA) {
                                var page = new appInstance.ViewModel.TFALogin('tfsLogin', 'body');
                                page.display(function () {
                                    appInstance.progress.hide();
                                    $('#' + page.Id).addClass("tfsloginTabs");
                                });
                            } else {
                                appInstance.onAuthenticated(function () {
                                    appInstance.progress.hide();
                                    login.hide();
                                });
                            }

                        }, function () { appInstance.progress.hide(); })
                    })

                    var domainLogin = $('#' + login.Id).find('#customCheck');
                    var domainInput = $("#" + login.Id).find("[name='domain']");
                    if (domainLogin.length > 0) {
                        domainLogin.change(function () {
                            if (this.checked)
                                domainInput.show();
                            else
                                domainInput.hide();
                        });
                    }

                    if (appInstance.authService != null) {
                        $('#' + login.Id).find('a.signin').click(function () {
                            appInstance.authService.signIn();
                        })
                    } else {
                        $('#' + login.Id).find('a.signin').hide();
                    }
                   
                }
               
            })

            return login;
        },
        Main: function () {
            var master = new startup.createMasterPageSideBar();
            master.setLoadDataHandler(appInstance.Services.getPortal);
            master.setEventHandler(function () {
                var pwdForm = $('#passwordModal');
                function clearPasswordInputs() {
                    pwdForm.find('input[name="oldpassword"]').val('');
                    pwdForm.find('input[name="newpassword"]').val('')
                    pwdForm.find('input[name="confirmpassword"]').val('')
                }
                pwdForm.find('a.submitPwd').on('click', function (e) {
                    var oldPassword = pwdForm.find('input[name="oldpassword"]').val();
                    var newPassword = pwdForm.find('input[name="newpassword"]').val();
                    var confirmPassword = pwdForm.find('input[name="confirmpassword"]').val();
                    if (oldPassword.length == 0) {
                        ui.warning('Please input password');
                        return;
                    } else if (newPassword.length == 0) {
                        ui.warning('Please input new password');
                        return;
                    } else if (confirmPassword != newPassword) {
                        ui.warning("Confirmed Password doesn't tally with new password");
                        return;
                    }

                    var regx = /^[\d]*[a-z_@][a-z\d_@]*$/gi;//^[A-Za-z0-9 _.-]+$/; 
                    isValid = regx.test(newPassword) && newPassword.length > 7;
                    if (!isValid) {
                        ui.warning("password must be at lease 8 characters long and contain alphanumeric");
                        return;
                    }
                    appInstance.Services.changePassword(oldPassword, newPassword, function () {
                        ui.info("Password is changed!");
                        clearPasswordInputs();
                    }, function () {
                            clearPasswordInputs();
                    })
                });
                pwdForm.find('button.cancelPwd').on('click', function () {
                    clearPasswordInputs();
                })
                var logoutForm = $("#logoutModal");
                logoutForm.find('a.logout').on('click', function (e) {
                    var url = window.location.origin.toString() + window.location.pathname;
                    appInstance.Services.logout(function () {
                            location.assign(url);
                    }, function () {
                            location.assign(url);
                    });
                })
            })
            return master;
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
      
    };

    startup.onAppCreated = function () {
        appInstance.progress.show();
        console.log('Start create App instance...');
        startup.loadConfig("appConfig.json", function (data) {
            config = data;
            appInstance.ViewModel = new viewmodel();
            startup.registerComponent("eworkspace.ui", appInstance.ViewModel);

            appInstance.Services.getToken(function (token) {
                appInstance.progress.hide();
                if (token == null) {
                    if (window.getLogin != null) {
                        new appInstance.ViewModel.WindowsLogin();
                    }
                    else {

                        var loginPage = new appInstance.ViewModel.Login();
                        loginPage.display();
                    }
                } else {
                    appInstance.profile = appInstance.Services.getSession();
                    if (appInstance.profile.require2FA) {
                        var page = new appInstance.ViewModel.TFALogin('tfsLogin', 'body');
                        page.display(function () {
                            appInstance.progress.hide();
                            $('#' + page.Id).addClass("tfsloginTabs");
                        });
                    }
                    else 
                        appInstance.onAuthenticated();
                    
                }
            });
        })
    }


    $(document).ready(function () {
        appInstance.progress = eworkspace.widgets.PageLoadingBar({ isShow: false });    
        startup.createApp();
    });
})


