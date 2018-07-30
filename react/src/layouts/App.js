import React from "react";
import { connect } from "dva";
import classnames from "classnames";
import { withRouter, Switch, Route } from "dva/router";
import { CSSTransitionGroup } from "react-transition-group";
import { Sidebar } from "components";
import { Home, Upload, Vote, NotFound } from "routes";
import { LocaleProvider, Layout, Icon } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import styles from "./App.css";

const { Header, Content, Footer } = Layout;

const App = ({ children, dispatch, app, location }) => {
  const { title, siderFolded, loggedIn, isDesktop } = app;

  const toggle = () => {
    dispatch({ type: "app/toggleSider" });
  };
  const Year = () => {
    const date = new Date();
    return date.getFullYear();
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
          loggedIn={loggedIn}
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
            <div className={styles.main}>
              <Content>
                <div className={styles.content}>
                  <Switch>
                    <CSSTransitionGroup
                      transitionName="fade"
                      transitionEnterTimeout={500}
                      transitionLeaveTimeout={200}
                    >
                      <Route path="/" exact component={Home} key="Home" />
                      <Route
                        path="/upload"
                        exact
                        component={Upload}
                        key="Upload"
                      />
                      <Route
                        path="/vote/:time"
                        exact
                        component={Vote}
                        key="Vote"
                      />
                    </CSSTransitionGroup>
                    <Route path="*" component={NotFound} key="NotFound" />
                  </Switch>
                </div>
              </Content>
              <Footer className={styles.footer}>
                Copyright © 2007-{Year()} FZYZ SCAN & 7HMakers. All rights
                reserved.<br />
                Author & Current Maintainer: Googleplex<br />
                Past Maintainer: <a href="https://blog.robotshell.org">
                  Robot
                </a>{" "}
                <a href="http://blog.miskcoo.com">Miskcoo</a>{" "}
                <a href="https://www.upsuper.org">Upsuper</a>
              </Footer>
            </div>
          </div>
        </div>
      </div>
    </LocaleProvider>
  );
};

export default withRouter(connect(({ app }) => ({ app }))(App));
