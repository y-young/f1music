import { useRoutes } from "react-router-dom";

import AdminLayout from "../../layouts/Admin";

import { SWRConfig, SuspenseLoading } from "components";
import routes from "~react-pages";

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
