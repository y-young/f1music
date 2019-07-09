import { message } from "antd";
import { Search, Mp3, Upload, View } from "services/upload";

export default {
  namespace: "upload",
  state: {
    searchResult: [],
    songs: []
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateMp3(
      state,
      {
        payload: { row, url }
      }
    ) {
      const result = state.searchResult;
      const records = result.filter(item => {
        if (item.id === row.id) {
          let record = item;
          record.mp3 = url;
          return record;
        } else {
          return item;
        }
      });
      return {
        ...state,
        searchResult: [...records]
      };
    }
  },

  effects: {
    *fetch(_, { call, put }) {
      const data = yield call(View);
      yield put({ type: "updateState", payload: { songs: data.songs } });
    },
    *search({ payload: keyword }, { call, put }) {
      const data = yield call(Search, keyword);
      if (data.error === 0)
        yield put({
          type: "updateState",
          payload: { searchResult: JSON.parse(data.result) }
        });
    },
    *fetchMp3({ payload: row }, { call, put }) {
      const data = yield call(Mp3, row.id);
      yield put({ type: "updateMp3", payload: { row, url: data.url } });
    },
    *upload({ payload }, { call, put }) {
      const data = yield call(Upload, payload);
      if (data.error === 0) {
        message.success("上传成功");
        yield put({ type: "fetch" });
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === "/upload") {
          dispatch({ type: "fetch" });
        }
      });
    }
  }
};
