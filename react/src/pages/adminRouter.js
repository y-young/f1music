import React from "react";
import { Router, Route, Switch } from "dva/router";
import Admin from "../layouts/Admin";
import { Home, Songs, Reports } from "routes/admin";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Admin>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/songs" exact component={Songs} />
          <Route path="/songs/trashed" exact component={Songs} />
          <Route path="/reports" exact component={Reports} />
        </Switch>
      </Admin>
    </Router>
  );
}

export default RouterConfig;
