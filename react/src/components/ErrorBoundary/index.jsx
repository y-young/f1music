import { ApiOutlined } from "@ant-design/icons";
import { Button, Result, message } from "antd";
import { ErrorBoundary as BaseErrorBoundary } from "react-error-boundary";

const Fallback = ({ error, resetErrorBoundary }) => {
  const props = {
    status: "error",
    title: "出错了",
    subTitle: "请刷新页面重试，如果错误依旧存在，请联系我们"
  };

  if (
    error.message.indexOf("Failed to fetch dynamically imported module") !== -1
  ) {
    props.icon = <ApiOutlined />;
    props.title = "加载失败，请检查网络";
    props.subTitle = "请检查网络连接是否正常，然后刷新页面重试";
  }

  return (
    <div>
      <Result
        {...props}
        extra={[
          <Button type="primary" onClick={resetErrorBoundary}>
            刷新页面
          </Button>
        ]}
      >
        {import.meta.env.DEV && error.message}
      </Result>
    </div>
  );
};

class _ErrorBoundary extends BaseErrorBoundary {
  constructor() {
    super();
  }

  promiseRejectionHandler = (event) => {
    const error = event.reason;
    if (error.type === "notice") {
      return;
    }
    message.error("出错了，请刷新页面重试");
  };

  componentDidCatch(error, info) {
    this.props.onError?.(error, info);
  }

  componentDidMount() {
    window.addEventListener("unhandledrejection", this.promiseRejectionHandler);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "unhandledrejection",
      this.promiseRejectionHandler
    );
  }
}

const ErrorBoundary = ({ children, onReset }) => (
  <_ErrorBoundary
    FallbackComponent={Fallback}
    onError={(error, { componentStack }) => {
      console.log(error);
      console.log(componentStack);
    }}
    onReset={onReset}
  >
    {children}
  </_ErrorBoundary>
);

export default ErrorBoundary;
