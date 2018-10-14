import React from "react";
import { Layout } from "antd";

const Footer = () => {
  const Year = () => {
    const date = new Date();
    return date.getFullYear();
  };

  return (
    <Layout.Footer className="footer">
      Copyright © 2009-
      {Year()} FZYZ SCAN & 7HMakers. All rights reserved.
      <br />
      Author & Current Maintainer: Googleplex
      <br />
      v1.x Author: <a href="https://www.upsuper.org">Upsuper</a>
      <br />
      Past Maintainers: <a href="https://blog.robotshell.org">Robot</a>{" "}
      <a href="http://blog.miskcoo.com">Miskcoo</a>
    </Layout.Footer>
  );
};

export default Footer;
