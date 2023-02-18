import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

let eworkspace = null;
let navigationPage = null;
let reactPage = null;
let AppConfig = null;

function importTangramCore(obj){
    eworkspace = obj;    
    const basepage = eworkspace.components.ReactPage;
    reactPage = basepage.extend({
        _createReactElement: function () {
            this._super();
            var containerElm = $('#' + this.Id);
            if (this.component != null)
                ReactDOM.render(this.component, containerElm[0]);
            else {
                console.error('Fails to load react component');
            }

        },
        destroy: function () {
            const elm = this.getPageDom();
            if (elm.length == 0)
                return;
            ReactDOM.unmountComponentAtNode(elm[0]);
            this._super();
        },
        setDataByField: function (fieldName, value) {
            if (this.model.data == null) {
                console.warn('model data is null');
                return;
            }

            this.model.data[fieldName] = value;
            if (this.component != null && this.component.setState != null)
                this.component.setState(this.model.data);
        },
        setData: function (data) {
            this.model.data = data;
            if (this.component != null && this.component.setState != null)
                this.component.setState({ data: data });
        },
        getData: function () {
            if (this.component != null && this.component.setState != null)
                return this.component.state.data;
            else
                return this.model.data;
        },
        getDataByField: function (fieldName) {
            if (this.component != null && this.component.setState != null)
                return this.component.state.data[fieldName];
            else
                return this.model.data[fieldName];

        }
    });

    navigationPage = reactPage.extend({
        init: function (id, model, template, containerselector) {
            this._super(id, model, template, containerselector);
            this.type = 3;//navigation page
        },
        display: function (url) {
            this.destroy();

            if (url != null && url.length>0)
              this.model.props.url = url;

            var pagename = (this.pageurl == null ? this.Id : this.pageurl);
            console.log('display page %c ' + pagename, 'color:blue')
            this.Load();
        },
        replace: function () {
            this.display();
        }

    })

    
}

function importAppConfig(config) {
    AppConfig = config;
}

function getAppConfig() {
    return AppConfig;
}

function getUtils(){
    return  eworkspace.utils;
}

function getComponents() {
    return eworkspace.components;
}

function getNavigationPage() {
    return navigationPage;
}

function getReactPage() {
    return reactPage;
}


export { importAppConfig, importTangramCore, getAppConfig, getUtils, getComponents, getNavigationPage,getReactPage}