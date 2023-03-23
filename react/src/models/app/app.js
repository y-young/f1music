import { routerRedux } from "dva/router";
import { checkLogin, Login, Status } from "services/app";
import { getPageQuery } from "utils/utils";

export default {
  namespace: "app",
  state: {
    loggedIn: false,
    status: {
      upload: {},
      vote: {}
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/logout") {
          window.location.href = "/logout";
        }
        if (pathname === "/") {
          dispatch({ type: "fetchStatus" });
        }
        dispatch({ type: "updateState", payload: { loggedIn: checkLogin() } });
      });
    }
  },

  effects: {
    *fetchStatus(_, { call, put }) {
      const data = yield call(Status);
      yield put({ type: "updateState", payload: { status: data.status } });
    },
    *login({ payload }, { put, call }) {
      const res = yield call(Login, payload);
      if (res.error === 0) {
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          redirect = redirect.substr(redirectUrlParams.origin.length);
          if (redirect.startsWith("/#")) {
            redirect = redirect.substr(2);
          }
        }
        yield put(routerRedux.push(redirect || "/"));
      }
    },
    *logout({ payload }, { call, put }) {
      yield put({
        type: "updateState",
        payload: {
          loggedIn: false
        }
      });
    }
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
