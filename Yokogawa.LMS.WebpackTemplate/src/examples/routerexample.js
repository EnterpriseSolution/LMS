import React from "react";
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import { getAppConfig } from './global'


// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynamic segments in other
// popular web frameworks like Rails and Express.
/*export default function BasicExample() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                </ul>

                <hr />
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}*/

// You can think of these components as "pages"
// in your app.

function Navigate(props) {
    const appConfig = getAppConfig();
    return (<div> <Redirect to={props.url} />
        <Switch>
            <Route path={appConfig.pathname + "home"}>
                <Home />
            </Route>
            <Route path={appConfig.pathname + "about"}>
                <About />
            </Route>
            <Route path={appConfig.pathname + "dashboard"}>
                <Dashboard />
            </Route>
            <Route path={appConfig.pathname + "topics"}>
                <Topics />
            </Route>
        </Switch>
    </div>);
    /*const getPage = function () {
        let elm = <Home />;
        switch (props.url) {
            case "/tangram.web/about":
                elm = <About />;
                break;
            case "/tangram.web/dashboard":
                elm = <Dashboard />;
                break;
            default:
                break;
        }
        return elm;
    }
    return (<div>{getPage()}</div>);*/
}

function Home(props) {
    return (
        <div>
            <h2>Home</h2>
        </div>
    ); 
}

function About() {
    return (
        <div>
            <h2>About</h2>
        </div>
    );
}

function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
        </div>
    );
}

function Topics() {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let { path, url } = useRouteMatch();

    return (
        <div>
            <h2>Topics</h2>
            <ul>
                <li>
                    <Link to={`${url}/rendering`}>Rendering with React</Link>
                </li>
                <li>
                    <Link to={`${url}/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`${url}/props-v-state`}>Props v. State</Link>
                </li>
            </ul>

            <Switch>
                <Route exact path={path}>
                    <h3>Please select a topic.</h3>
                </Route>
                <Route path={`${path}/:topicId`}>
                    <Topic />
                </Route>
            </Switch>
        </div>
    );
}

function Topic() {
    // The <Route> that rendered this component has a
    // path of `/topics/:topicId`. The `:topicId` portion
    // of the URL indicates a placeholder that we can
    // get from `useParams()`.
    let { topicId } = useParams();

    return (
        <div>
            <h3>{topicId}</h3>
        </div>
    );
}

export { Home, About, Dashboard, Navigate,Topics}