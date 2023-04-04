import {
  ArrowLeftOutlined,
  BarChartOutlined,
  ExceptionOutlined,
  FileOutlined,
  HomeOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import classnames from "classnames";
import { withRouter } from "dva/router";
import React from "react";

import styles from "../Sidebar.css";

const Sidebar = ({ collapsed, location, history }) => {
  const sidebarClass = classnames({
    [styles.sidebar]: true,
    [styles.show]: !collapsed,
  });

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: "首页" },
    {
      key: "/song",
      icon: <PlayCircleOutlined />,
      label: "曲目",
      children: [
        { key: "/songs", label: "所有曲目" },
        { key: "/songs/trashed", label: "回收站" },
      ],
    },
    { key: "/files", icon: <FileOutlined />, label: "文件" },
    { key: "/reports", icon: <ExceptionOutlined />, label: "反馈" },
    { key: "/rank", icon: <ProfileOutlined />, label: "投票结果" },
    { key: "/statistics", icon: <BarChartOutlined />, label: "数据统计" },
    { key: "back", icon: <ArrowLeftOutlined />, label: "返回前台" },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "back") {
      window.location.href = "/";
    } else {
      history.push(key);
    }
  };

  return (
    <div className={sidebarClass}>
      <header className={styles.logo}>FZYZ校园音乐征集 管理系统</header>
      <Menu
        className={styles.nav}
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={["/song"]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default withRouter(Sidebar);
