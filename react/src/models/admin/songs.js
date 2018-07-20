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
    *trash(
      {
        payload: id
      },
      { call, put, select }
    ) {
      //message.success("操作成功");
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
