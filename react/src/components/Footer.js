import React from "react";
import { Layout } from "antd";

const Footer = () => {
  const Year = () => {
    const date = new Date();
    return date.getFullYear();
  };

  return (
    <Layout.Footer className="footer">
      Copyright © 2007-{Year()} FZYZ SCAN & 7HMakers. All rights reserved.<br />
      Author & Current Maintainer: Googleplex<br />
      Past Maintainers: <a href="https://blog.robotshell.org">
        Robot
      </a>{" "}
      <a href="http://blog.miskcoo.com">Miskcoo</a>{" "}
      <a href="https://www.upsuper.org">Upsuper</a>
    </Layout.Footer>
  )
}

export default Footer;
