import { Songs, TrashedSongs } from "services/admin/songs";
import { message } from "antd";

export default {
  namespace: "songs",
  state: {
    type: "",
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
    *fetch(_, { call, put, select }) {
      const type = yield select(state => state.songs.type);
      let data;
      if (type === "trashed") {
        data = yield call(TrashedSongs);
      } else {
        data = yield call(Songs);
      }
      yield put({ type: "save", payload: { list: data.songs } });
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
    },
    *trash(
      {
        payload: id
      },
      { call, put }
    ) {
       //const response = yield call(Trash, payload: id);
      message.success("操作成功");
      yield put({ type: "reduce", payload: id });
    },
    *restore(
      {
        payload: id
      },
      { call, put }
    ) {
       //const response = yield call(Restore, payload: id);
      message.success("操作成功");
      yield put({ type: "reduce", payload: id });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/songs") {
          dispatch({ type: "save", payload: { type: "" } });
          dispatch({ type: "fetch" });
        }
        if (pathname === "/songs/trashed") {
          dispatch({ type: "save", payload: { type: "trashed" } });
          dispatch({ type: "fetch" });
        }
      });
    }
  }
};
