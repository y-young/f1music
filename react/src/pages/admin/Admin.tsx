import { useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { default as AdminLayout } from "../../layouts/Admin";
import { SWRConfig, SuspenseLoading } from "components";

const Admin = () => {
  return (
    <AdminLayout>
      <SuspenseLoading>
        <SWRConfig>
          {useRoutes(routes.filter((route) => route.path === "manage"))}
        </SWRConfig>
      </SuspenseLoading>
    </AdminLayout>
  );
};

export default Admin;
