import { request } from "utils";
import { api } from "config";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import produce from "immer";

const { list, report, vote } = api;

export const useVoteList = (time) => {
  const swr = useSWR([list, time], () =>
    request({
      url: list,
      method: "post",
      data: { time }
    }).then((data) => data.songs)
  );

  const markListened = (id) => {
    const newData = produce(swr.data, (draft) => {
      const index = draft.findIndex((song) => song.id === id);
      if (index !== -1) {
        draft[index].listened = true;
      }
    });
    swr.mutate(newData, { revalidate: false });
  };

  const updateVote = (id, vote) => {
    const newData = produce(swr.data, (draft) => {
      const index = draft.findIndex((song) => song.id === id);
      if (index !== -1) {
        draft[index].vote = vote;
      }
    });
    swr.mutate(newData, { revalidate: false });
  };

  return { ...swr, markListened, updateVote };
};

export const useReport = () =>
  useSWRMutation(report, (_, { arg }) =>
    request({
      url: report,
      method: "post",
      data: arg
    })
  );

export const useVote = () =>
  useSWRMutation(vote, (_, { arg }) =>
    request({
      url: vote,
      method: "post",
      data: arg
    })
  );
