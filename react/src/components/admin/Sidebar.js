import React from "react";
import classnames from "classnames";
import { Link } from "dva/router";
import { Menu, Icon, Layout } from "antd";
import styles from "../Sidebar.css";

const SubMenu = Menu.SubMenu;
const { Header } = Layout;

const Sidebar = props => {
  const sidebarClass = classnames({
    [styles.sidebar]: true,
    [styles.show]: !props.collapsed
  });

  return (
    <div className={sidebarClass}>
      <Header className={styles.logo}>FZYZ 校园音乐征集管理系统</Header>
      <Menu
        className={styles.nav}
        mode="inline"
        selectedKeys={[props.location.pathname]}
        defaultOpenKeys={["/song"]}
      >
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" />首页
          </Link>
        </Menu.Item>
        <SubMenu
          key="/song"
          title={
            <span>
              <Icon type="play-circle-o" />
              <span>曲目</span>
            </span>
          }
        >
          <Menu.Item key="/songs">
            <Link to="/songs">所有曲目</Link>
          </Menu.Item>
          <Menu.Item key="/songs/trashed">
            <Link to="/songs/trashed">回收站</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="/files">
          <Link to="/files">
            <Icon type="file" />文件
          </Link>
        </Menu.Item>
        <Menu.Item key="/reports">
          <Link to="/reports">
            <Icon type="exception" />举报
          </Link>
        </Menu.Item>
        <Menu.Item key="/rank">
          <Link to="/rank">
            <Icon type="profile" />投票结果
          </Link>
        </Menu.Item>
        <Menu.Item key="back">
          <a href="/"><Icon type="arrow-left" />返回前台</a>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
