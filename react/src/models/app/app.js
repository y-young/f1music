import { routerRedux } from "dva/router";
import { checkLogin, Login } from "services/app";
import { getPageQuery } from "utils/utils";

export default {
  namespace: "app",
  state: {
    title: "首页",
    siderFolded: false,
    isDesktop: window.innerWidth > 993,
    loggedIn: false
  },

  subscriptions: {
    setup({ dispatch, history }) {
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({ type: "mobileCollapse" });
        }, 300);
      };
      history.listen(({ pathname }) => {
        if (pathname === "/logout") {
          window.location.href = "/logout";
        }
        dispatch({ type: "updateTitle", payload: pathname });
        window.scrollTo(0, 0);
        dispatch({ type: "mobileCollapse" });
        dispatch({ type: "updateState", payload: { loggedIn: checkLogin() } });
      });
    }
  },

  effects: {
    *updateTitle({ payload: pathname }, { put }) {
      let title;
      switch (pathname) {
        case "/":
          title = "首页";
          break;
        case "/upload":
          title = "上传";
          break;
        case "/vote/1":
        case "/vote/2":
        case "/vote/3":
        case "/vote/4":
        case "/vote/5":
        case "/vote/6":
          title = "投票";
          break;
        case "/login":
          title = "登录";
          break;
        case "/logout":
          title = "登出";
          break;
        case "/result":
          title = "投票结果";
          break;
        default:
          title = "404";
          break;
      }
      yield put({ type: "updateState", payload: { title: title } });
      document.title = title + " - 福州一中 校园音乐征集";
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
    },
    *mobileCollapse(action, { call, put }) {
      const isDesktop = window.innerWidth > 993;
      yield put({
        type: "updateState",
        payload: {
          siderFolded: !isDesktop
        }
      });
    }
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    toggleSider(state) {
      return {
        ...state,
        siderFolded: !state.siderFolded
      };
    }
  }
};
