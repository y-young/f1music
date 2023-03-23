import React from "react";
import { connect } from "dva";
import classnames from "classnames";
import { withRouter } from "dva/router";
import { Sidebar, Footer } from "components";
import { ConfigProvider, Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import zhCN from "antd/es/locale/zh_CN";
import "antd/dist/antd.css";
import styles from "./App.css";
import useSidebar from "../hooks/useSidebar";

const { Header, Content } = Layout;

const App = ({ children, app, location }) => {
  const { title, loggedIn } = app;
  const [sidebarCollapsed, toggleSidebar] = useSidebar(location);

  const appClass = classnames({
    [styles.app]: true,
    [styles.withSidebar]: !sidebarCollapsed
  });

  return (
    <ConfigProvider locale={zhCN}>
      <div className={appClass}>
        <Sidebar collapsed={sidebarCollapsed} loggedIn={loggedIn} />
        <div className={styles.overlay} onClick={toggleSidebar} />
        <div className={styles.container}>
          <div className={styles.containerInner}>
            <Header className={styles.header}>
              {sidebarCollapsed ? (
                <MenuUnfoldOutlined
                  className={styles.trigger}
                  onClick={toggleSidebar}
                />
              ) : (
                <MenuFoldOutlined
                  className={styles.trigger}
                  onClick={toggleSidebar}
                />
              )}
              <span className={styles.title}>{title}</span>
            </Header>
            <Content className={styles.content}>
              <div className={styles.contentInner}>{children}</div>
            </Content>
            <Footer />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default withRouter(connect(({ app }) => ({ app }))(App));
