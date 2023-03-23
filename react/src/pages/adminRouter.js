import React from "react";
import { Router, Route, Switch } from "dva/router";
import Admin from "../layouts/Admin";
import { Home, Songs, Files, Reports, Rank, Statistics } from "routes/admin";
import { TitleContext } from "../hooks/useTitle";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <TitleContext suffix=" - 福州一中校园音乐征集 管理系统">
        <Admin>
          <Switch>
            <Route path="/" exact component={Home} key="Home" />
            <Route path="/songs" exact component={Songs} key="Songs" />
            <Route
              path="/songs/trashed"
              exact
              component={Songs}
              key="TrashedSongs"
            />
            <Route path="/files" exact component={Files} key="Files" />
            <Route path="/reports" exact component={Reports} key="Reports" />
            <Route path="/rank" exact component={Rank} key="Rank" />
            <Route
              path="/statistics"
              exact
              component={Statistics}
              key="Statistics"
            />
          </Switch>
        </Admin>
      </TitleContext>
    </Router>
  );
}

export default RouterConfig;
