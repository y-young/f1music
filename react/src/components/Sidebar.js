import React from "react";
import classnames from "classnames";
import { Link } from "dva/router";
import { Menu } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UploadOutlined,
  FormOutlined
} from "@ant-design/icons";
import styles from "./Sidebar.css";

const SubMenu = Menu.SubMenu;

const Sidebar = props => {
  const sidebarClass = classnames({
    [styles.sidebar]: true,
    [styles.show]: !props.collapsed
  });

  return (
    <div className={sidebarClass}>
      <header className={styles.logo}>福州一中 校园音乐征集</header>
      <Menu
        className={styles.nav}
        mode="inline"
        selectedKeys={[props.location.pathname]}
        defaultOpenKeys={["/vote"]}
      >
        <Menu.Item key="/">
          <Link to="/">
            <HomeOutlined />
            首页
          </Link>
        </Menu.Item>
        <Menu.Item key="/login">
          <Link to={props.loggedIn ? "/logout" : "/login"}>
            {props.loggedIn ? (
              <span>
                <LogoutOutlined />
                登出
              </span>
            ) : (
              <span>
                <LoginOutlined />
                登录
              </span>
            )}
          </Link>
        </Menu.Item>
        <Menu.Item key="/upload">
          <Link to="/upload">
            <UploadOutlined />
            上传
          </Link>
        </Menu.Item>
        <SubMenu
          key="/vote"
          title={
            <span>
              <FormOutlined />
              <span>投票</span>
            </span>
          }
        >
          <Menu.Item key="/vote/1">
            <Link to="/vote/1">6:30 起床铃</Link>
          </Menu.Item>
          <Menu.Item key="/vote/2">
            <Link to="/vote/2">7:00 早出门</Link>
          </Menu.Item>
          <Menu.Item key="/vote/3">
            <Link to="/vote/3">13:45 午出门</Link>
          </Menu.Item>
          <Menu.Item key="/vote/4">
            <Link to="/vote/4">18:40 晚出门</Link>
          </Menu.Item>
          <Menu.Item key="/vote/5">
            <Link to="/vote/5">21:35 晚自习结束</Link>
          </Menu.Item>
          <Menu.Item key="/vote/6">
            <Link to="/vote/6">22:30 熄灯铃</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
};

export default Sidebar;
