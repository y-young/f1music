import { message } from "antd";
import { Mp3, Search, Status, Upload, View } from "services/upload";

export default {
  namespace: "upload",
  state: {
    searchResult: [],
    songs: [],
    status: {},
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateMp3(state, { payload: { row, url } }) {
      const result = state.searchResult;
      const records = result.filter(item => {
        if (item.id === row.id) {
          const record = item;
          record.mp3 = url;
          return record;
        } else {
          return item;
        }
      });
      return {
        ...state,
        searchResult: [...records],
      };
    },
  },

  effects: {
    *fetchStatus(_, { call, put }) {
      const data = yield call(Status);
      yield put({ type: "updateState", payload: { status: data.status } });
    },
    *fetchUploads(_, { call, put }) {
      const data = yield call(View);
      yield put({ type: "updateState", payload: { songs: data.songs } });
    },
    *search({ payload: keyword }, { call, put }) {
      const data = yield call(Search, keyword);
      if (data.error === 0) {
        yield put({
          type: "updateState",
          payload: { searchResult: data.result },
        });
      }
    },
    *fetchMp3({ payload: row }, { call, put }) {
      const data = yield call(Mp3, row.id);
      if (data.error !== 0) {
        return false;
      }
      const url = `https://music.163.com/song/media/outer/url?id=${row.id}.mp3`;
      yield put({ type: "updateMp3", payload: { row, url } });
      return true;
    },
    *upload({ payload }, { call, put }) {
      const data = yield call(Upload, payload);
      if (data.error === 0) {
        message.success("上传成功");
        yield put({ type: "fetchUploads" });
        return true;
      }
      return false;
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/upload") {
          dispatch({ type: "fetchStatus" });
          dispatch({ type: "fetchUploads" });
        }
      });
    },
  },
};
