import axios from "axios";

const errorMsg = {
  500: "Oops!出错了",
  403: "您没有此操作权限",
  404: "404 资源未找到"
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
        error.message = response.data.msg;
        error.type = "notice";
        throw error;
      }

      return { ...response.data };
    })
    .catch(error => {
      // >>>>>>>>>>>>>> 请求失败 <<<<<<<<<<<<<<
      // 请求配置发生的错误
      if (!error.response) {
        return Promise.reject({ message: error.message });
      }

      // 响应时状态码处理
      const status = error.response.status;
      const errortext = errorMsg[status] || status;

      // 开发时使用
      console.log(
        `【${opt.method} ${opt.url}】请求失败，响应数据：%o`,
        error.response
      );

      return Promise.reject({ code: status, message: errortext });
    });
}
