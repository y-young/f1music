import { Reports, Delete } from "services/admin/reports";
import { message } from "antd";

export default {
  namespace: "reports",
  state: {
    list: []
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    reduce(state, { payload: id }) {
      const list = state.list;
      const newList = list.filter(item => {
        return id.indexOf(item.id) === -1;
      });
      return {
        ...state,
        list: newList
      };
    }
  },

  effects: {
    *fetch(_, { call, put }) {
      const data = yield call(Reports);
      yield put({ type: "updateState", payload: { list: data.reports } });
    },
    *delete({ payload: id }, { call, put }) {
      const res = yield call(Delete, id);
      if (res.error === 0) {
        message.success("操作成功");
        yield put({ type: "reduce", payload: id });
      }
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
