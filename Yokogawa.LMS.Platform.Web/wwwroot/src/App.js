(function () {
        mobileCore.onAppCreated = function () {
            mobile.UI.getAppConfig(function (config) {
                console.log('load configuration ...');
                mobile.appConfig = config;
                mobile.config.skin = config.skin;
                var mobileApp = new (createViewModels())();
                mobileCore.registerComponent("mobileApp.ViewModels", mobileApp);

                mobile.UI.initLocale(mobile.appConfig.locale, function () {
                    var login = new mobileApp.loginView('login', mobile.appConfig.container);
                    login.display();
                })
            }, function () {
                mobile.UI.error('Fails to load config');
            })
    }

    $(document).ready(function () {
        mobileCore.createApp();
    });
    
})();