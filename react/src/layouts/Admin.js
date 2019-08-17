import React from "react";
import { connect } from "dva";
import classnames from "classnames";
import { withRouter } from "dva/router";
import { Sidebar, Footer } from "components/admin";
import { LocaleProvider, Layout, Icon } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import styles from "./App.css";

const { Header, Content } = Layout;

const Admin = ({ children, dispatch, admin, location }) => {
  const { title, siderFolded, isDesktop } = admin;

  const toggle = () => {
    dispatch({ type: "admin/toggleSider" });
  };

  const appClass = classnames({
    [styles.app]: true,
    [styles.withSidebar]: !siderFolded
  });

  return (
    <LocaleProvider locale={zhCN}>
      <div className={appClass}>
        <Sidebar
          collapsed={siderFolded}
          location={location}
          desktop={isDesktop}
        />
        <div className={styles.container}>
          <div className={styles.containerInner}>
            <Header className={styles.header}>
              <Icon
                className={styles.trigger}
                type={siderFolded ? "menu-unfold" : "menu-fold"}
                onClick={toggle}
              />
              <span className={styles.title}>{title}</span>
            </Header>
            <span className={styles.overlay} onClick={toggle} />
            <Content className={styles.content}>
              <div className={styles.contentInner}>{children}</div>
            </Content>
            <Footer />
          </div>
        </div>
      </div>
    </LocaleProvider>
  );
};

export default withRouter(connect(({ admin }) => ({ admin }))(Admin));
