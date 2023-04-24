import { useRoutes } from "react-router-dom";

import AppLayout from "../../layouts/App";

import "./App.css";

import routes from "~react-pages";
import { SWRConfig, SuspenseLoading } from "components";

const App = () => {
  return (
    <AppLayout>
      <SuspenseLoading>
        <SWRConfig
          value={{ revalidateIfStale: false, revalidateOnFocus: false }}
        >
          {useRoutes(routes.filter((route) => route.path !== "manage"))}
        </SWRConfig>
      </SuspenseLoading>
    </AppLayout>
  );
};

export default App;
