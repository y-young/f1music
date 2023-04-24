import classnames from "classnames";
import { ConfigProvider, Layout } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import zhCN from "antd/es/locale/zh_CN";
import useSidebar from "hooks/useSidebar";

import styles from "./Layout.module.less";

import { ErrorBoundary, Footer, Header } from "components";

const { Content } = Layout;

const CommonLayout = ({ children, renderSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, toggleSidebar] = useSidebar(location);

  const appClass = classnames({
    [styles.app]: true,
    [styles.withSidebar]: !sidebarCollapsed,
  });

  return (
    <ConfigProvider locale={zhCN}>
      <div className={appClass}>
        {renderSidebar({ collapsed: sidebarCollapsed })}
        <div className={styles.overlay} onClick={toggleSidebar} />
        <div className={styles.container}>
          <div className={styles.containerInner}>
            <Header
              sidebarCollapsed={sidebarCollapsed}
              toggleSidebar={toggleSidebar}
            />
            <Content className={styles.content}>
              <div className={styles.contentInner}>
                <ErrorBoundary onReset={() => navigate(0)}>
                  {children}
                </ErrorBoundary>
              </div>
            </Content>
            <Footer />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CommonLayout;
