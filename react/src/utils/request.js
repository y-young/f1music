import axios from "axios";
import { routerRedux } from "dva/router";
import store from "../pages/app";

const errorMsg = {
  401: "请先登录",
  500: "Oops!出错了,我们会尽快修复这一问题~",
  429: "操作过于频繁,请稍后再试"
};

// 设置全局参数
axios.defaults.timeout = 7000;
axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 添加返回拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default function request(opt) {
  // 调用 axios api，统一拦截
  return axios(opt)
    .then(response => {
      if (response.data && response.data.error !== 0) {
        let error = new Error();
        error.type = "notice"; //用户操作引起的错误而非程序错误
        error.errno = response.data.error;
        error.message = response.data.msg;
        throw error;
      }

      return { ...response.data };
    })
    .catch(error => {
      if (!error.response) {
        if (error.code === "ECONNABORTED") {
          return Promise.reject({ type: "notice", message: "请求超时,请重试" });
        }
        return Promise.reject({ type: "notice", message: error.message });
      }

      const status = error.response.status;
      const errortext = errorMsg[status] || "加载失败了╭(╯ε╰)╮";

      const { dispatch } = store;

      if (status === 401) {
        dispatch(
          routerRedux.push({
            pathname: "/login",
            search: "?redirect=" + window.location.href
          })
        );
      } else if (status >= 404 && status < 422) {
        dispatch(routerRedux.push("/404"));
      }

      return Promise.reject({
        type: "notice",
        code: status,
        message: errortext
      });
    });
}
