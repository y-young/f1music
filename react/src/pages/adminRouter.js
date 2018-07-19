import React from "react";
import { Router, Route, Switch } from "dva/router";
import Admin from "../layouts/Admin";
import { Home } from "routes/admin";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Admin>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </Admin>
    </Router>
  );
}

export default RouterConfig;
