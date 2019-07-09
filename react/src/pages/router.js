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
  const Logout = () => {
    return <h1 style={{ color: "#777" }}>正在登出...</h1>;
  };
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" exact component={Login} key="Login" />
        <Route path="/">
          <App>
            <Switch>
              <Route path="/" exact component={Home} key="Home" />
              <Route path="/upload" exact component={Upload} key="Upload" />
              <Route path="/vote/:time" exact component={Vote} key="Vote" />
              <Route path="/result" exact component={Result} key="Result" />
              <Route path="/logout" exact component={Logout} key="Logout" />
              <Route path="*" component={NotFound} key="NotFound" />
            </Switch>
          </App>
        </Route>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
