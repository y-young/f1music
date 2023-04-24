import { Sidebar } from "components/admin";

import Layout from "./Layout";

const Admin = ({ children }) => (
  <Layout renderSidebar={({ collapsed }) => <Sidebar collapsed={collapsed} />}>
    {children}
  </Layout>
);

export default Admin;
