import React from 'react';
import classnames from 'classnames';
import { withRouter, Switch, Route } from 'dva/router';
import styles from './App.css';
import Sidebar from '../components/Sidebar';
import Index from '../routes/Index';
import Vote from '../routes/Vote';
import { Layout, Icon } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends React.Component
{
  constructor({ children, location }) {
    super();
    this.state = {
      collapsed: false
    }; 
  }
  componentDidMount = () => {
    this.setState({collapsed: !this.isDesktop()});
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  isDesktop = () => {
    return window.innerWidth > 993;
  }

  render() {
    const appClass = classnames({
      [styles.app]: true,
      [styles.withsidebar]: !this.state.collapsed
    })
    return (
      <div className={appClass}>
        <Sidebar collapsed={this.state.collapsed} location={this.props.location} desktop={this.isDesktop()}/>
        <div className={styles.container}>
        <div className={styles.containerinner}>
          <Header className={styles.header} >
            <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            <span className={styles.title}>Home</span>
          </Header>
          <Content className={styles.content}>
            <div className={styles.contentinner}>
              <Switch>
                <Route path="/" exact component={Index} />
                <Route path="/vote/:time" exact component={Vote} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
          Copyright ©2007-2018 FZYZ SCAN.All rights reserved.<br/>
          Author & Current Maintainer: Googleplex<br/>
          Past Mainainter: Robot Miskcoo Upsuper
          </Footer>
        </div>
        </div>
      </div>
    );
  }
};
export default withRouter(App);
