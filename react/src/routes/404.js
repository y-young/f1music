import React from "react";
import { Result, Button } from "antd";
import Title from "../hooks/useTitle";

const NotFound = () => {
  return (
    <>
      <Title>404</Title>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button type="primary" href="#/">
            返回首页
          </Button>
        }
      />
    </>
  );
};

export default NotFound;
