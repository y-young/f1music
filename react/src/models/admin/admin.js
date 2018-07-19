import { routerRedux } from "dva/router";

export default {
  namespace: "admin",
  state: {
    title: "首页",
    siderFolded: false,
    isDesktop: window.innerWidth > 993,
    navOpenKeys: []
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
        case "/songs":
          title = "曲目";
          break;
        case "/songs/trashed":
          title = "曲目 - 回收站";
          break;
        case "/files":
          title = "文件";
          break;
        case "/reports":
          title = "举报";
          break;
        case "/rank":
          title = "投票结果";
          break;
        default:
          title = "404";
          break;
      }
      yield put({ type: "updateState", payload: { title: title } });
      document.title = title + " - 福州一中校园音乐征集 管理系统 ";
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
