import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { Songs, Vote } from 'services/vote';
import { config } from 'utils';

const { voteTexts } = config;

export default {
  namespace: 'vote',
  state: {
    time: 1,
    songs: [],
    rate: 0,
    canVote: false,
    canSubmit: false,
    auto: true,
    reason: '',
    showReport: false,
    lastIndex: '',
    newIndex: '',
    nowIndex: '',
    isDesktop: window.innerWidth > 993
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    setNowIndex(state, { payload: nowIndex }) {
      return { ...state, nowIndex: nowIndex };
    },
    updateLastIndex(state, { payload: lastIndex }) {
      return { ...state, lastIndex: lastIndex };
    },
    updateNewIndex(state, { payload: newIndex }) {
      return { ...state, newIndex: newIndex };
    },
    setSubmit(state, { payload: canSubmit }) {
      return { ...state, canSubmit: canSubmit };
    },
    toggleAuto(state) {
      return {...state, auto: !state.auto };
    },
    toggleVote(state) {
      return {...state, canVote: true };
    },
    toggleReport(state) {
      return {...state, showReport: !state.showReport };
    },
    updateRate(state, { payload: rate }) {
      return { ...state, rate: rate, canSubmit: true };
    },
    updateVoteText(state, { payload: { id, rate } }) {
      const songs = state.songs;
      const newSongs = songs.filter((item) => {
        if(item.id === id) {
          let record = item;
          record.vote = voteTexts[rate];
          return record;
        } else {
          return item;
        }
      });
      return {
        ...state,
        songs: [
          ...newSongs
        ]
      };
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
    *vote({ payload: id }, { call, put, select }) {
      const rate = yield select(state => state.vote.rate);
      if(rate === 0) {
        message.error('请选择评价');
        return false;
      }
      const res = yield call(Vote, { 'id': id, 'vote': rate });
      if(res.error === 0) {
        yield put({ type: 'updateVoteText', payload: { id: id, rate: rate } });
        yield put({ type: 'setSubmit', payload: false });
      }
      return (res.error === 0);
    },
    *redirect({ payload: time }, { put }) {
      yield put(routerRedux.push('/vote/'+time));
    },
    *report({ payload: { id, reason } }, { call, put }) {
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/vote/:time').exec(pathname);
        if (match) {
          dispatch({ type: 'init' });
          dispatch({ type: 'setNowIndex', payload: '' });
          const time = match[1];
          dispatch({ type: 'save', payload: { time: time } });
          dispatch({ type: 'fetch', payload: time });
        }
      });
    },
  }
}
