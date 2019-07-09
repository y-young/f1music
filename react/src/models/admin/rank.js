import { Rank } from "services/admin/rank";

export default {
  namespace: "rank",
  state: {
    voteResult: []
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  },

  effects: {
    *fetch(_, { call, put }) {
      const data = yield call(Rank);
      yield put({ type: "updateState", payload: { voteResult: data.rank } });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/rank") {
          dispatch({ type: "fetch" });
        }
      });
    }
  }
};
