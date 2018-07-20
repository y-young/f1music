import React from "react";
import { Link } from "dva/router";
import { Icon } from "antd";

const NotFound = () => {
  return (
    <div>
      <h1 style={{ color: "#777" }}>404 Page Not Found</h1>
      <Link to="/" style={{ fontSize: "13px", color: "#777" }}>
        <Icon type="arrow-left" /> 返回首页
      </Link>
    </div>
  );
};

export default NotFound;
