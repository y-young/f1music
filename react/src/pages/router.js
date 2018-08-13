import React from "react";
import dynamic from "dva/dynamic";
import { Router, Route, Switch } from "dva/router";
import { Home, Login, Upload, Vote, NotFound } from "routes";
import App from "../layouts/App";

function RouterConfig({ history, app }) { 
  const Result = dynamic({
    app,
    component: () => import("../routes/Result")
  });
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" exact component={Login} key="Login" />
        <Route path="/">
          <App>
            <Switch>
              <Route path="/" exact component={Home} key="Home" />
              <Route
                path="/upload"
                exact
                component={Upload}
                key="Upload"
              />
              <Route
                path="/vote/:time"
                exact
                component={Vote}
                key="Vote"
              />
              <Route
                path="/result"
                exact
                component={Result}
                key="Result"
              />
              <Route path="*" component={NotFound} key="NotFound" />
            </Switch>
          </App>
        </Route>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
