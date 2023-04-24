import classnames from "classnames";
import { Menu } from "antd";
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  ExceptionOutlined,
  FileOutlined,
  HomeOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "../Sidebar/index.module.less";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
      navigate(`/manage${key}`);
    }
  };

  return (
    <div className={sidebarClass}>
      <header className={styles.logo}>FZYZ校园音乐征集 管理系统</header>
      <Menu
        className={styles.nav}
        mode="inline"
        selectedKeys={[location.pathname.replace(/^\/manage\/?/, "/")]}
        defaultOpenKeys={["/song"]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default Sidebar;
