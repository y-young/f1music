import pathToRegexp from "path-to-regexp";
import { routerRedux } from "dva/router";
import { message } from "antd";
import { Songs, Vote, Report } from "services/vote";

export default {
  namespace: "vote",
  state: {
    time: 1,
    songs: [],
    auto: window.localStorage.auto === "false" ? false : true,
    isDesktop: window.innerWidth > 993
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    toggleAuto(state, { payload }) {
      if (typeof window.localStorage !== "undefined") {
        window.localStorage.auto = !state.auto;
      }
      return { ...state, auto: !state.auto };
    },
    updateVote(
      state,
      {
        payload: { id, rate }
      }
    ) {
      const songs = state.songs;
      const newSongs = songs.filter(item => {
        if (item.id === id) {
          let record = item;
          record.vote = rate;
          return record;
        } else {
          return item;
        }
      });
      return {
        ...state,
        songs: [...newSongs]
      };
    },
    markListened(state, { payload: id }) {
      const songs = state.songs;
      const newSongs = songs.filter(item => {
        if (item.id === id) {
          let record = item;
          record.listened = true;
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
      yield put({ type: "updateState", payload: { songs: data.songs } });
    },
    *vote(
      {
        payload: { id, rate }
      },
      { call, put }
    ) {
      if (rate === 0) {
        message.error("请选择您的评价");
        return false;
      }
      const res = yield call(Vote, { id: id, vote: rate });
      if (res.error === 0) {
        yield put({ type: "updateVote", payload: { id, rate } });
        return true;
      }
      return false;
    },
    *redirect({ payload: time }, { put }) {
      yield put(routerRedux.push("/vote/" + time));
    },
    *report(
      {
        payload: { id, reason }
      },
      { call, put }
    ) {
      if (!reason) {
        message.error("请填写举报原因");
        return false;
      }
      const res = yield call(Report, { id: id, reason: reason });
      if (res.error === 0) {
        message.success("举报成功");
        return true;
      }
      return false;
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp("/vote/:time").exec(pathname);
        if (match) {
          const time = match[1];
          dispatch({ type: "updateState", payload: { time: time } });
          dispatch({ type: "fetch", payload: time });
        }
      });
    }
  }
};
