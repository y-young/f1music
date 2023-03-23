export default {
  namespace: "admin",
  state: {
    title: "首页"
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        dispatch({ type: "updateTitle", payload: pathname });
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
      yield put({ type: "updateState", payload: { title: title } });
      document.title = title + " - 福州一中校园音乐征集 管理系统 ";
    }
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
