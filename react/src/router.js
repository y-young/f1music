import React from "react";
import { Router, Route, Switch } from "dva/router";
import Login from "./routes/Login";
import App from "./layouts/App";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
