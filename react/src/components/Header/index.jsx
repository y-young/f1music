import React, { memo } from "react";
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import styles from "./index.css";
import { useTitle } from "../../hooks/useTitle";

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
