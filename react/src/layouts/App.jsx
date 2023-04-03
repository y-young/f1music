import { Sidebar } from "components";
import Layout from "./Layout";

const App = ({ children }) => (
  <Layout renderSidebar={({ collapsed }) => <Sidebar collapsed={collapsed} />}>
    {children}
  </Layout>
);

export default App;
