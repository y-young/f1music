import React from "react";
import { Layout } from "antd";
import styles from "./Footer.css";

const Footer = () => {
  const Year = () => {
    const date = new Date();
    return date.getFullYear();
  };

  return (
    <Layout.Footer className={styles.footer}>
      Copyright © 2009-
      {Year()} FZYZ SCAN & 7HMakers. All rights reserved.
      <br />
      Author: <a href="https://github.com/y-young/f1music">Googleplex</a>
      <br />
      v1.x(2009-2016) Author: <a href="https://www.upsuper.org">Upsuper</a>
      <br />
      Past Maintainers: <a href="https://blog.robotshell.org">Robot</a>&nbsp;
      <a href="http://blog.miskcoo.com">Miskcoo</a>&nbsp;
      <a href="https://mengxiaolin.me/">linmx0130</a>
    </Layout.Footer>
  );
};

export default Footer;
