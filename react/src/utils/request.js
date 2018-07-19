import axios from "axios";
import { routerRedux } from "dva/router";
import store from "../pages/app";

const errorMsg = {
  401: "请先登录",
  500: "Oops!出错了,我们会尽快修复这一问题~",
  429: "操作过于频繁,请稍后再试"
};

// 设置全局参数
axios.defaults.timeout = 5000;
axios.defaults.baseURL = '/api';
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
      // >>>>>>>>>>>>>> 请求成功 <<<<<<<<<<<<<<
      console.log(
        `【${opt.method} ${opt.url}】请求成功，响应数据：%o`,
        response
      );

      // 打印错误提示
      if (response.data && response.data.error !== 0) {
        const error = new Error();
        error.type = "notice"; //用户操作引起的错误而非程序错误
        error.message = response.data.msg;
        throw error;
      }

      return { ...response.data };
    })
    .catch(error => {
      // >>>>>>>>>>>>>> 请求失败 <<<<<<<<<<<<<<
      // 请求配置发生的错误
      if (!error.response) {
        return Promise.reject({ type: "notice", message: error.message });
      }

      // 响应时状态码处理
      const status = error.response.status;
      const errortext = errorMsg[status] || "加载失败了╭(╯ε╰)╮";

      // 存在请求，但是服务器的返回一个状态码，它们都在2xx之外
      const { dispatch } = store;

      if (status === 401) {
        dispatch(routerRedux.push("/login"));
      } else if (status >= 404 && status < 422) {
        dispatch(routerRedux.push("/404"));
      }

      // 开发时使用
      console.log(
        `【${opt.method} ${opt.url}】请求失败，响应数据：%o`,
        error.response
      );

      return Promise.reject({ type: "notice", code: status, message: errortext });
    });
}
