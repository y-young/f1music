import axios from "axios";

const errorMsg = {
  401: "请先登录",
  403: "您没有此操作权限",
  404: "404 资源未找到",
  429: "操作过于频繁,请稍后再试",
  500: "Oops!出错了,我们会尽快修复这一问题~"
};

// 设置全局参数
axios.defaults.timeout = 10000;
axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加返回拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function request(opt) {
  // 调用 axios api，统一拦截
  return axios(opt)
    .then((response) => {
      if (response.data && response.data.error !== 0) {
        let error = new Error();
        error.type = "notice"; //用户操作引起的错误而非程序错误
        error.code = response.data.error;
        error.message = response.data.msg;
        throw error;
      }

      return { ...response.data };
    })
    .catch((error) => {
      if (!error.response) {
        if (error.code === "ECONNABORTED") {
          return Promise.reject({ type: "notice", message: "请求超时,请重试" });
        }
        return Promise.reject({ type: "notice", message: error.message });
      }

      const status = error.response.status;
      const errortext = errorMsg[status] || "加载失败了╭(╯ε╰)╮";

      return Promise.reject({
        type: "notice",
        status,
        message: errortext
      });
    });
}
