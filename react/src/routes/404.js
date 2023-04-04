import { Button, Result } from "antd";
import React from "react";

const NotFound = () => {
  return (
    <div>
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
    </div>
  );
};

export default NotFound;
