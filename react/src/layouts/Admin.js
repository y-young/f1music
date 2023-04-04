import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { ConfigProvider, Layout } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import classnames from "classnames";
import { Footer, Sidebar } from "components/admin";
import { connect } from "dva";
import { withRouter } from "dva/router";
import React from "react";
import "antd/dist/antd.css";

import styles from "./App.css";

const { Header, Content } = Layout;

const Admin = ({ children, dispatch, admin, location }) => {
  const { title, siderFolded, isDesktop } = admin;

  const toggle = () => {
    dispatch({ type: "admin/toggleSider" });
  };

  const appClass = classnames({
    [styles.app]: true,
    [styles.withSidebar]: !siderFolded,
  });

  return (
    <ConfigProvider locale={zhCN}>
      <div className={appClass}>
        <Sidebar
          collapsed={siderFolded}
          location={location}
          desktop={isDesktop}
        />
        <div className={styles.overlay} onClick={toggle} />
        <div className={styles.container}>
          <div className={styles.containerInner}>
            <Header className={styles.header}>
              {siderFolded
                ? (
                  <MenuUnfoldOutlined
                    className={styles.trigger}
                    onClick={toggle}
                  />
                )
                : <MenuFoldOutlined className={styles.trigger} onClick={toggle} />}
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

export default withRouter(connect(({ admin }) => ({ admin }))(Admin));
