import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { Songs, Vote } from 'services/vote';

export default {
  namespace: 'vote',
  state: {
    songs: [],
    rate: 0,
    canVote: false,
    canSubmit: false,
    auto: true,
    reason: '',
    showReport: false,
    lastIndex: '',
    newIndex: '',
    nowIndex: ''
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    toggleAuto(state) {
      return {...state, auto: !state.auto };
    },
    toggleVote(state) {
      return {...state, canVote: true };
    }
  },

  effects: {
    *fetch({ payload: time }, { call, put }) {
      const data = yield call(Songs, time);
      yield put({ type: 'save', payload: { songs: data.songs } });
    },
    *init({ payload }, { put }) {
      yield put({ type: 'save', payload: {
        rate: 0,
        reason: '',
        canVote: false,
        canSubmit: false,
        showReport: false
      } });
    },
    *vote({ payload: id }, { call, select }) {
      const rate = yield select(state => state.vote.rate);
      if(rate === 0) {
        message.error('请选择评价');
      }
      const res = yield call(Vote, { 'id': id, 'vote': rate });
      return (res.error === 0);
    },
    *report({ payload: id }, { call, put }) {
    },
    *updateRate({ payload: rate }, { put }) {
      yield put({ type: 'save', payload: { rate: rate } });
      yield put({ type: 'setSubmit', payload: true });
    },
    *setNowIndex({ payload: nowIndex }, { put }) {
      yield put({ type: 'save', payload: { nowIndex: nowIndex } });
    },
    *updateLastIndex({ payload: lastIndex }, { put }) {
      yield put({ type: 'save', payload: { lastIndex: lastIndex } });
    },
    *updateNewIndex({ payload: newIndex }, { put }) {
      yield put({ type: 'save', payload: newIndex });
    },
    *setSubmit({ payload: canSubmit }, { put }) {
      yield put({ type: 'save', payload: { canSubmit: canSubmit } });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/vote/:time').exec(pathname);
        if (match) {
          const time = match[1];
          dispatch({
            type: 'fetch',
            payload: time
          });
        }
      });
    },
  }
}
