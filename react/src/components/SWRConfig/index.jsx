import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { SWRConfig as BaseConfig, useSWRConfig } from "swr";

const SWRConfig = ({ children, value = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onErrorRetry } = useSWRConfig();

  return (
    <BaseConfig
      value={{
        onError: (error, key) => {
          if (error.type === "notice") {
            message.error(error.message);
            if (error.status === 401) {
              navigate(
                `/login?redirect=${encodeURIComponent(location.pathname)}`
              );
              return;
            }
          } else {
            // 程序错误不提示
            message.error("出错了,请刷新重试");
            console.log(error, key);
          }
        },
        onErrorRetry: (error, _, config, revalidate, opts) => {
          if (error.type === "notice") {
            return;
          }
          onErrorRetry(error, _, config, revalidate, opts);
        },
        ...value
      }}
    >
      {children}
    </BaseConfig>
  );
};

export default SWRConfig;
