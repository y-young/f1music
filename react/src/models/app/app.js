import { routerRedux } from "dva/router";
import { checkLogin } from "services/app";

export default {
  namespace: "app",
  state: {
    title: "首页",
    siderFolded: false,
    isDesktop: window.innerWidth > 993,
    navOpenKeys: [],
    loggedIn: checkLogin()
  },

  subscriptions: {
    setup({ dispatch, history }) {
      //alert(checkLogin())
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({ type: "mobileCollapse" });
        }, 300);
      };
      history.listen(({ pathname }) => {
        dispatch({ type: "updateTitle", payload: pathname });
        window.scrollTo(0, 0);
        dispatch({ type: "mobileCollapse" });
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
        default:
          title = "404";
          break;
      }
      yield put({ type: "updateState", payload: { title: title } });
      document.title = title + " - 福州一中 校园音乐征集";
    },
    *logout({ payload }, { call, put }) {
      /*const data = yield call(logout, parse(payload))
      if (data.error == 0) {*/
      yield put({
        type: "updateState",
        payload: {
          loggedIn: false
        }
      }); /*} else {
        throw (data)
      }*/
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
    },
    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys
      };
    }
  }
};
