import React from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import styles from './IndexPage.css';
import Sidebar from '../components/Sidebar';
import { Layout, Icon } from 'antd';
const { Header, Content, Footer } = Layout;

class Index extends React.Component
{
  constructor() {
    super();
    this.state = {
      collapsed: false
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  
  render() {
    const appClass = classnames({
      [styles.app]: true,
      [styles.withsidebar]: !this.state.collapsed
    })
    return (
      <div className={appClass}>
        <Sidebar collapsed={this.state.collapsed}/>
        {/* className={ this.state.collapsed ? styles.container : styles.container.sidebar } */}
        <div className={styles.container}>
        <div className={styles.containerinner}>
          <Header className={styles.header} >
            <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
          </Header>
          <Content className={styles.content}>
            <div className={styles.contentinner}>
              content
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
          Copyright ©2007-2018 Created by Googleplex
          </Footer>
        </div>
        </div>
      </div>
    );
  }
};
export default connect()(Index);
