import { Statistics } from "services/admin/statistics";

export default {
  namespace: "statistics",
  state: {
    data: [],
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const data = yield call(Statistics);
      yield put({ type: "updateState", payload: { data: data.data } });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/statistics") {
          dispatch({ type: "fetch" });
        }
      });
    },
  },
};
