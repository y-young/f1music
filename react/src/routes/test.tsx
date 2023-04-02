import { Skeleton, Spin } from "antd";
import React from "react";

const Test = () => {
  return (
    <div style={{ paddingTop: "1rem" }}>
      <Spin tip="加载中..." delay={500}>
        <Skeleton />
      </Spin>
    </div>
  );
};

export default Test;
