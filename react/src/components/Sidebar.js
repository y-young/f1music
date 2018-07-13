import React from 'react';
import classnames from 'classnames';
import { Link } from 'dva/router';
import { Menu, Icon, Layout } from 'antd';
import styles from './Sidebar.css';

const SubMenu = Menu.SubMenu;
const { Header } = Layout;

const Sidebar = (props) => {

  const sidebarClass = classnames({
    [styles.sidebar]: true,
    [styles.show]: !props.collapsed
  })

  const openKeys = () => {
    if(props.location.pathname == "/vote")
      return ["/vote"];
    else return [];
  }

  return (
    <div className={sidebarClass}>
      <Header className={styles.logo}>福州一中 校园音乐征集</Header>
      <Menu className={styles.nav} mode="inline" selectedKeys={[props.location.pathname]} defaultOpenKeys={ props.desktop ? ["/vote"] : [] }>
        <Menu.Item key="/">
          <Link to="/"><Icon type="home" />首页</Link>
        </Menu.Item>
        <Menu.Item key="/login">
          <Link to={ props.loggedIn ? "/logout" : "/login" }><Icon type={ props.loggedIn ? "logout" : "login" } />{ props.loggedIn ? "登出" : "登录" }</Link>
        </Menu.Item>
        <Menu.Item key="/upload">
          <Link to="/upload"><Icon type="upload" />上传</Link>
        </Menu.Item>
        <SubMenu key="/vote" title={<span><Icon type="form" /><span>投票</span></span>}>
          <Menu.Item key="/vote/1">
            <Link to="/vote/1">6:30</Link>
          </Menu.Item>
          <Menu.Item key="/vote/2">
            <Link to="/vote/2">7:00</Link>
          </Menu.Item>
          <Menu.Item key="/vote/3">
            <Link to="/vote/3">13:45</Link>
          </Menu.Item>
          <Menu.Item key="/vote/4">
            <Link to="/vote/4">18:40</Link>
          </Menu.Item>
          <Menu.Item key="/vote/5">
            <Link to="/vote/5">21:35</Link>
          </Menu.Item>
          <Menu.Item key="/vote/6">
            <Link to="/vote/6">22:30</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
};

export default Sidebar;
