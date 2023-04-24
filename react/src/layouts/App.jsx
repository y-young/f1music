import Layout from "./Layout";

import { Sidebar } from "components";

const App = ({ children }) => (
  <Layout renderSidebar={({ collapsed }) => <Sidebar collapsed={collapsed} />}>
    {children}
  </Layout>
);

export default App;
