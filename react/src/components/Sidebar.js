import React from 'react';
import classnames from 'classnames';
import styles from './Sidebar.css';
import { Menu, Icon } from 'antd';

const Sidebar = (props) => {
  const sidebarClass = classnames({
    [styles.sidebar]: true,
    [styles.show]: !props.collapsed
  })
  return (
    <div className={sidebarClass}>
      <div className={styles.logo}>福州一中 校园音乐征集</div>
      <Menu className={styles.nav} mode="inline" defaultSelectedKeys={['home']}>
        <Menu.Item key="home">
          <Icon type="home" />
          <span className="nav-text">首页</span>
        </Menu.Item>
        <Menu.Item key="login">
          <Icon type="login" />
          <span className="nav-text">登录</span>
        </Menu.Item>
        <Menu.Item key="upload">
          <Icon type="upload" />
          <span className="nav-text">上传</span>
        </Menu.Item>
        <Menu.Item key="vote">
          <Icon type="form" />
          <span className="nav-text">投票</span>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;