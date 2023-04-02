import { useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { default as AppLayout } from "../../layouts/App";
import "./App.css";
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
