export default {
  namespace: "admin",
  state: {
    title: "首页",
    siderFolded: false,
    isDesktop: window.innerWidth > 993,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: "updateState", payload: window.innerWidth });
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({
            type: "mobileCollapse",
            payload: {
              width: window.innerWidth,
              isResize: true,
            },
          });
        }, 300);
      };
      history.listen(({ pathname }) => {
        dispatch({ type: "updateTitle", payload: pathname });
        window.scrollTo(0, 0);
        dispatch({
          type: "mobileCollapse",
          payload: {
            width: window.innerWidth,
            isResize: false,
          },
        });
      });
    },
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
          title = "反馈";
          break;
        case "/rank":
          title = "投票结果";
          break;
        case "/statistics":
          title = "数据统计";
          break;
        default:
          title = "404";
          break;
      }
      yield put({ type: "updateState", payload: { title } });
      document.title = `${title} - 福州一中校园音乐征集 管理系统 `;
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    toggleSider(state) {
      return {
        ...state,
        siderFolded: !state.siderFolded,
      };
    },
    mobileCollapse(state, { payload }) {
      const { width, isResize } = payload;
      // 移动端导航栏的收起和展开会触发window.onresize,需判断窗口宽度是否改变
      if (!isResize || width !== state.width) {
        const isDesktop = width >= 768;
        return {
          ...state,
          width,
          siderFolded: !isDesktop,
        };
      } else {
        return { ...state };
      }
    },
  },
};
