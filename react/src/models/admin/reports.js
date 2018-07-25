import { Reports } from "services/admin/reports";
import { message } from "antd";

export default {
  namespace: "reports",
  state: {
    list: []
  },

  reducers: {
    save(state, { payload }) {
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
      yield put({ type: "save", payload: { list: data.reports } });
    },
    *delete(
      {
        payload: id
      },
      { call, put }
    ) {
       //const response = yield call(Delete, payload: id);
      message.success("操作成功");
      yield put({ type: "reduce", payload: id });
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
