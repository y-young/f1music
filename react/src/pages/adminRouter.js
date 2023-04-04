import { Route, Router, Switch } from "dva/router";
import { Files, Home, Rank, Reports, Songs, Statistics } from "routes/admin";

import Admin from "../layouts/Admin";

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
          <Route path="/statistics" exact component={Statistics} key="Statistics" />
        </Switch>
      </Admin>
    </Router>
  );
}

export default RouterConfig;
