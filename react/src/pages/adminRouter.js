import React from "react";
import { Router, Route, Switch } from "dva/router";
import Admin from "../layouts/Admin";
import { Home, Songs, Files, Reports, Rank } from "routes/admin";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Admin>
        <Switch>
          <Route path="/" exact component={Home} key="Home" />
          <Route path="/songs" exact component={Songs} key="Songs" />
          <Route path="/songs/trashed" exact component={Songs} key="TrashedSongs" />
          <Route path="/files" exact component={Files} key="Files" />
          <Route path="/reports" exact component={Reports} key="Reports" />
          <Route path="/rank" exact component={Rank} key="Rank" />
        </Switch>
      </Admin>
    </Router>
  );
}

export default RouterConfig;
