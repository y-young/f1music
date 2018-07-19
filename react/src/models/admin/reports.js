import { message } from "antd";

export default {
  namespace: "reports",
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
//      const data = yield call(Reports);
//      yield put({ type: "save", payload: { list: data.reports } });
    },
    *trash(
      {
        payload: id
      },
      { call, put, select }
    ) {
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/reports") {
          dispatch({ type: "fetch" });
        }
      });
    }
  }
};
