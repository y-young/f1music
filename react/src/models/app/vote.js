import pathToRegexp from "path-to-regexp";
import { routerRedux } from "dva/router";
import { message } from "antd";
import { Songs, Vote, Report, Status } from "services/vote";

export default {
  namespace: "vote",
  state: {
    time: 1,
    songs: [],
    skipVoted: true,
    onSubmitted: "continue",
    onEnded: "pause",
    isDesktop: window.innerWidth > 993,
    status: {}
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    toggleSkipVoted(state, { payload }) {
      if (typeof window.localStorage !== "undefined") {
        window.localStorage.skipVoted = !state.skipVoted;
      }
      return { ...state, skipVoted: !state.skipVoted };
    },
    saveOnSubmitted(state, { payload: value }) {
      if (typeof window.localStorage !== "undefined") {
        window.localStorage.onSubmitted = value;
      }
      return { ...state, onSubmitted: value };
    },
    saveOnEnded(state, { payload: value }) {
      if (typeof window.localStorage !== "undefined") {
        window.localStorage.onEnded = value;
      }
      return { ...state, onEnded: value };
    },
    updateVote(state, { payload: { id, rate } }) {
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
    *fetchList({ payload: time }, { call, put }) {
      const data = yield call(Songs, time);
      yield put({ type: "updateState", payload: { songs: data.songs } });
    },
    *fetchStatus(_, { call, put }) {
      const data = yield call(Status);
      yield put({ type: "updateState", payload: { status: data.status } });
    },
    *vote({ payload: { id, rate } }, { call, put }) {
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
    *report({ payload: { id, reason } }, { call, put }) {
      if (!reason) {
        message.error("请填写反馈内容");
        return false;
      }
      const res = yield call(Report, { id: id, reason: reason });
      if (res.error === 0) {
        message.success("提交成功");
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
          dispatch({ type: "fetchList", payload: time });
          dispatch({ type: "fetchStatus" });
          const storage = window.localStorage;
          if (typeof storage !== "undefined") {
            const skipVoted = storage.skipVoted === "false" ? false : true;
            const onSubmitted =
              storage.onSubmitted === "forward" ? "forward" : "continue";
            const onEnded = storage.onEnded === "forward" ? "forward" : "pause";
            dispatch({
              type: "updateState",
              payload: { skipVoted, onSubmitted, onEnded }
            });
          }
        }
      });
    }
  }
};
