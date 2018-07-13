import { Search, Mp3, Upload } from 'services/upload';

export default {
  namespace: 'upload',
  state: {
    searchResult: []
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    updateMp3(state, { payload: { row, url } }) {
      const result = state.searchResult;
      const records = result.filter((item) => {
        if(item.id === row.id) {
          let record = item;
          record.mp3 = url;
          return record;
        } else {
          return item;
        }
      });
      return {
        ...state,
        searchResult: [
          ...records
        ]
      };
    }
  },

  effects: {
    *search({ payload: keyword }, { call, put }) {
      const data = yield call(Search, keyword);
      if(data.error === 0)
        yield put({ type: 'save', payload: { searchResult: JSON.parse(data.result) } });
    },
    *fetchMp3({ payload: row }, { call, put }) {
      const data = yield call(Mp3, row.id);
      yield put({ type: 'updateMp3', payload: { row, url: data.url } });
    }
  }

}
