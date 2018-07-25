import { Files } from "services/admin/files";

export default {
  namespace: "files",
  state: {
    list: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  },

  effects: {
    *fetch(_, { call, put }) {
      const data = yield call(Files);
      yield put({ type: "save", payload: { list: data.files } });
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
