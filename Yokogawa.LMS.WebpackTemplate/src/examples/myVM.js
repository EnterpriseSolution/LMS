import React from "react";
import ReactDOM from 'react-dom';
import { getNavigationPage, getAppConfig} from './global'
import { Navigate } from "./routerexample";
import { BrowserRouter as Router } from "react-router-dom";

let NavigationPage = null;
let AppConfig = null;

export default class ViewModels {
    constructor(config) {
        NavigationPage = getNavigationPage();
        AppConfig = getAppConfig();
    }
    routerTest(id, selector) {
        const model = {
            props: {
                url: AppConfig.pathname+"dashboard"
            }
        };

        let page = new NavigationPage(id, model, null, selector); //new TangramViewModel(props);//new eworkspace.components.ReactPage(props);
        page._path = "/dashboard";
        let App = (props) => {
            return (<div>
                <Navigate url={props.url} />
                <hr />
            </div>)
        }

        //const App1 = <div><Navigate url={props.url} /><hr /></div>;

        page.setRenderHandler(function (props) {
            
            return (<Router><App url={props.url} /></Router>); //<App url={props.url} />; 
        });
        return page;

    }
    routerTest2(id, selector) {
  
        const model = {
            props: {
                url: AppConfig.pathname +"topics"
            }
        };

        let page = new NavigationPage(id, model, null, selector);
        page._path = "/topics";
  
        //const App = <div><Navigate url={props.url} /><hr /></div>;
        let App = (props) => {
            return (<div>
                <Navigate url={props.url} />
                <hr />
            </div>)
        }

        page.setRenderHandler(function (props) {
            return (<Router><App url={props.url} /></Router>); //<App url={props.url} />; 
        });
        return page;

    }
}

