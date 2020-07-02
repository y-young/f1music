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

const { Header, Content } = Layout;

const App = ({ children, dispatch, app, location }) => {
  const { title, siderFolded, loggedIn, isDesktop } = app;

  const toggle = () => {
    dispatch({ type: "app/toggleSider" });
  };

  const appClass = classnames({
    [styles.app]: true,
    [styles.withSidebar]: !siderFolded
  });

  return (
    <ConfigProvider locale={zhCN}>
      <div className={appClass}>
        <Sidebar
          collapsed={siderFolded}
          location={location}
          desktop={isDesktop}
          loggedIn={loggedIn}
        />
        <div className={styles.overlay} onClick={toggle} />
        <div className={styles.container}>
          <div className={styles.containerInner}>
            <Header className={styles.header}>
              {siderFolded ? (
                <MenuUnfoldOutlined
                  className={styles.trigger}
                  onClick={toggle}
                />
              ) : (
                <MenuFoldOutlined className={styles.trigger} onClick={toggle} />
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
