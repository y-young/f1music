import axios, { AxiosError } from "axios";

const errorMsg = {
  401: "请先登录",
  403: "您没有此操作权限",
  404: "404 资源未找到",
  429: "操作过于频繁，请稍后再试",
  500: "Oops！出错了，我们会尽快修复这一问题~"
};

// 设置全局参数
axios.defaults.timeout = 10000;
axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

const request = (opt) =>
  axios(opt)
    .then((response) => {
      if (response.data && response.data.error !== 0) {
        let error = new Error();
        error.type = "notice"; // 用户操作引起的错误而非程序错误
        error.code = response.data.error;
        error.message = response.data.msg;
        error.retry = false;
        error.response = response;
        throw error;
      }

      return { ...response.data };
    })
    .catch((error) => {
      if (error.type) {
        return Promise.reject(error);
      }
      error.type = "notice";

      if (!error.response) {
        error.retry = true;
        console.log(error);

        switch (error.code) {
          case AxiosError.ECONNABORTED:
          case AxiosError.ETIMEDOUT:
            return Promise.reject({
              ...error,
              message: "请求超时，请重试"
            });
          case AxiosError.ERR_NETWORK:
            return Promise.reject({
              ...error,
              message: "加载失败，请检查网络"
            });
        }
        return Promise.reject(error);
      }

      const status = error.response.status;
      const errortext = errorMsg[status] || "加载失败了╭(╯ε╰)╮";
      return Promise.reject({
        ...error,
        status,
        message: errortext
      });
    });

export default request;
