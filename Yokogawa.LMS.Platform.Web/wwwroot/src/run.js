var platForm = {
    fileExtension: "",
    provider: "kendo",
    azureAuthMode: "popup",
    azureAuthPath: "azure/authPopup"
}



requirejs.config({
    urlArgs: function(id, url) {
        var args = '';
        if (url.indexOf('jquery') === -1 && url.indexOf('kendo') === -1) {
            args = 'v=1'
            return (url.indexOf('?') === -1 ? '?' : '&') + args;
        }

        return args;
        
    },
    baseUrl: '.',
    paths: {
        bootstrap: './libs/bootstrap',
        "kendo.all.min": './libs/telerik/kendo.all.min',
        jquerylibs: './libs/jquery',
        yokogawa: './libs/yokogawa',
        azure:'./libs/azure',
        main: './src/main' + platForm.fileExtension,
       // polyfill: './libs/polyfill',
        /*react: './libs/react/react.min',
        reactDom: './libs/react/react-dom.min',
        htmlReactParser: './libs/react/html-react-parser.min',*/
        app: './src',
        core: './src/Tangram.Core' + platForm.fileExtension,
        ViewModels: './src/viewmodels' + platForm.fileExtension
    },
    shim: {
        main: {
            deps: ["jquerylibs/jquery.min", "bootstrap/bootstrap.bundle.min", "jquerylibs/jquery.i18n", platForm.azureAuthPath]
        },
        core: {
            deps: ['jquerylibs/jquery.i18n.messagestore', 'jquerylibs/jquery.i18n.parser', 'jquerylibs/jquery.i18n.fallbacks', 'jquerylibs/jquery.i18n.language',
                'jquerylibs/jquery.i18n.emitter', 'jquerylibs/jquery.i18n.emitter.bidi']
        }
    }
 }); 


requirejs(["main"]);
