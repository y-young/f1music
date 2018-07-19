import { routerRedux } from "dva/router";
import { Login } from "services/app";
import { getPageQuery } from "utils/utils";

export default {
  namespace: "login",
  state: {
    error: false,
    msg: ""
  },

  effects: {
    *login({ payload }, { put, call }) {
      const res = yield call(Login, payload);
      if (res.error === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          redirect = redirect.substr(redirectUrlParams.origin.length);
        }
        yield put(routerRedux.push(redirect || "/"));
      }
    }
  }
};
