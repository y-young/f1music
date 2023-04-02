import { request } from "utils/admin";
import { removeById } from "utils";
import { api } from "utils/admin/config";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import produce from "immer";

const { songs, trashedSongs, trashSongs, restoreSongs } = api;

export const useSongs = (trashed = false) => {
  const url = trashed ? trashedSongs : songs;
  const swr = useSWR(url, () =>
    request({
      url,
      method: "get"
    }).then((data) => data.songs)
  );

  const save = useSWRMutation(url, async (_, { arg }) =>
    request({
      url: songs,
      method: "put",
      data: arg
    }).then(() => {
      swr.mutate(
        (data) =>
          produce(data, (draft) => {
            const index = draft.findIndex((song) => song.id === arg.id);
            if (index !== -1) {
              draft[index] = { ...draft[index], ...arg };
            }
          }),
        { revalidate: false }
      );
      return true;
    })
  );

  const trash = useSWRMutation(songs, async (_, { arg: id }) =>
    request({
      url: trashSongs,
      method: "post",
      data: { id }
    }).then(() => {
      swr.mutate((data) => removeById(data, id), { revalidate: false });
    })
  );

  const restore = useSWRMutation(trashedSongs, async (_, { arg: id }) =>
    request({
      url: restoreSongs,
      method: "post",
      data: { id }
    }).then(() => {
      swr.mutate((data) => removeById(data, id), { revalidate: false });
    })
  );

  const del = useSWRMutation(trashedSongs, async (_, { arg: id }) =>
    request({
      url: songs,
      method: "delete",
      data: { id }
    }).then(() => {
      swr.mutate((data) => removeById(data, id), { revalidate: false });
    })
  );

  return { ...swr, save, trash, restore, del };
};
