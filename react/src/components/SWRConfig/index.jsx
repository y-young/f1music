import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { SWRConfig as BaseConfig, useSWRConfig } from "swr";

const SWRConfig = ({ children, value = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onErrorRetry } = useSWRConfig();

  const onError = (error, key) => {
    if (error.type === "notice") {
      message.error(error.message);
      if (error.status === 401) {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
        return;
      }
    } else {
      message.error("出错了，请刷新页面重试");
      console.log(error, key);
    }
  };

  const handleErrorRetry = (error, _, config, revalidate, opts) => {
    if (!error.retry) {
      return;
    }
    onErrorRetry(error, _, config, revalidate, opts);
  };

  return (
    <BaseConfig
      value={{
        onError,
        onErrorRetry: handleErrorRetry,
        ...value
      }}
    >
      {children}
    </BaseConfig>
  );
};

export default SWRConfig;
