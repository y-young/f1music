import { Files } from "services/admin/files";

export default {
  namespace: "files",
  state: {
    list: [],
    page: 1,
    total: 0
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  },

  effects: {
    *fetch({ payload: page = 1 }, { call, put }) {
      const data = yield call(Files, page);
      yield put({
        type: "updateState",
        payload: { list: data.files.data, page: page, total: data.files.total }
      });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/files") {
          dispatch({ type: "fetch" });
        }
      });
    }
  }
};
