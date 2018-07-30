import {
  Songs,
  TrashedSongs,
  Save,
  Trash,
  Restore
} from "services/admin/songs";
import { message } from "antd";

export default {
  namespace: "songs",
  state: {
    type: "",
    list: []
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    saveSong(state, { payload }) {
      const list = state.list;
      const { id, playtime, name, origin } = payload;
      const songs = list.filter(item => {
        if (item.id === id) {
          let song = item;
          song.playtime = playtime;
          song.name = name;
          song.origin = origin;
          return payload;
        } else {
          return item;
        }
      });
      return {
        ...state,
        list: [...songs]
      };
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
      yield put({ type: "updateState", payload: { list: data.songs } });
    },
    *save({ payload }, { call, put }) {
      //const response = yield call(Save, payload);
      message.success("操作成功");
      yield put({ type: "saveSong", payload });
      return true;
    },
    *delete({ payload: id }, { call, put }) {
      //const response = yield call(Delete, payload: id);
      message.success("操作成功");
      yield put({ type: "reduce", payload: id });
    },
    *trash({ payload: id }, { call, put }) {
      //const response = yield call(Trash, payload: id);
      message.success("操作成功");
      yield put({ type: "reduce", payload: id });
    },
    *restore({ payload: id }, { call, put }) {
      //const response = yield call(Restore, payload: id);
      message.success("操作成功");
      yield put({ type: "reduce", payload: id });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/songs") {
          dispatch({ type: "updateState", payload: { type: "" } });
          dispatch({ type: "fetch" });
        }
        if (pathname === "/songs/trashed") {
          dispatch({ type: "updateState", payload: { type: "trashed" } });
          dispatch({ type: "fetch" });
        }
      });
    }
  }
};
