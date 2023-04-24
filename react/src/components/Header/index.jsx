import { memo } from "react";
import { Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { useTitle } from "../../hooks/useTitle";

import styles from "./index.module.less";

const Header = ({ sidebarCollapsed, toggleSidebar }) => {
  const title = useTitle();

  return (
    <Layout.Header className={styles.header}>
      {sidebarCollapsed ? (
        <MenuUnfoldOutlined
          className={styles.trigger}
          onClick={toggleSidebar}
        />
      ) : (
        <MenuFoldOutlined className={styles.trigger} onClick={toggleSidebar} />
      )}
      <span className={styles.title}>{title}</span>
    </Layout.Header>
  );
};

export default memo(Header);
