import { Suspense } from "react";
import { Skeleton, Spin } from "antd";

const SuspenseLoading = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div style={{ paddingTop: "1rem" }}>
          <Spin tip="加载中...">
            <Skeleton />
          </Spin>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspenseLoading;
