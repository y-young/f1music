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
      if (response.data && response.data.error !== 0) {
        const error = new Error();
        error.message = response.data.msg;
        error.type = "notice";
        throw error;
      }

      return { ...response.data };
    })
    .catch(error => {
      if (!error.response) {
        if (error.code === "ECONNABORTED") {
          return Promise.reject({ type: "notice", message: "请求超时,请重试" });
        }
        return Promise.reject({ message: error.message });
      }

      const status = error.response.status;
      const errortext = errorMsg[status] || status;

      return Promise.reject({ code: status, message: errortext });
    });
}
