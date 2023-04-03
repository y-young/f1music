import classnames from "classnames";
import { Menu } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UploadOutlined,
  FormOutlined
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.less";
import { checkLogin } from "services/app";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = checkLogin();

  const sidebarClass = classnames({
    [styles.sidebar]: true,
    [styles.show]: !collapsed
  });

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: "首页" },
    {
      key: loggedIn ? "/logout" : "/login",
      icon: loggedIn ? <LogoutOutlined /> : <LoginOutlined />,
      label: loggedIn ? "登出" : "登录"
    },
    { key: "/upload", icon: <UploadOutlined />, label: "上传" },
    {
      key: "/vote",
      icon: <FormOutlined />,
      label: "投票",
      children: [
        { key: "/vote/1", label: "6:40 起床铃" },
        { key: "/vote/2", label: "7:10 早出门" },
        { key: "/vote/3", label: "13:45 午出门" },
        { key: "/vote/4", label: "18:10 晚出门" },
        { key: "/vote/5", label: "21:55 晚自习结束" },
        { key: "/vote/6", label: "22:40 熄灯铃" }
      ]
    }
  ];

  return (
    <div className={sidebarClass}>
      <header className={styles.logo}>福州一中 校园音乐征集</header>
      <Menu
        className={styles.nav}
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={["/vote"]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </div>
  );
};

export default Sidebar;