import pathToRegexp from "path-to-regexp";
import { routerRedux } from "dva/router";
import { message } from "antd";
import { Songs, Vote } from "services/vote";
import { config } from "utils";

const { voteTexts } = config;

export default {
  namespace: "vote",
  state: {
    time: 1,
    songs: [],
    auto: true,
    isDesktop: window.innerWidth > 993
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    toggleAuto(state, { payload }) {
      return { ...state, auto: !state.auto };
    },
    updateVoteText(
      state,
      {
        payload: { id, rate }
      }
    ) {
      const songs = state.songs;
      const newSongs = songs.filter(item => {
        if (item.id === id) {
          let record = item;
          record.vote = voteTexts[rate];
          return record;
        } else {
          return item;
        }
      });
      return {
        ...state,
        songs: [...newSongs]
      };
    }
  },

  effects: {
    *fetch({ payload: time }, { call, put }) {
      const data = yield call(Songs, time);
      yield put({ type: "save", payload: { songs: data.songs } });
    },
    *vote(
      {
        payload: { id, rate }
      },
      { call, put, select }
    ) {
      if (rate === 0) {
        message.error("请选择评价");
        return false;
      }
      const res = yield call(Vote, { id: id, vote: rate });
      if (res.error === 0) {
        yield put({ type: "updateVoteText", payload: { id: id, rate: rate } });
      }
      return res.error === 0;
    },
    *redirect({ payload: time }, { put }) {
      yield put(routerRedux.push("/vote/" + time));
    },
    *report(
      {
        payload: { id, reason }
      },
      { call, put }
    ) {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp("/vote/:time").exec(pathname);
        if (match) {
          const time = match[1];
          dispatch({ type: "save", payload: { time: time } });
          dispatch({ type: "fetch", payload: time });
        }
      });
    }
  }
};
