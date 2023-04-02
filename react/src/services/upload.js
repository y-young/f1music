import { request } from "utils";
import { api } from "config";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import produce from "immer";

const { search, mp3, upload, uploads } = api;

export const useSearch = (keyword) => {
  const key = keyword ? [search, keyword] : null;
  const swr = useSWR(key, () =>
    request({
      url: search,
      method: "post",
      data: { keyword }
    }).then((data) => data.result)
  );

  const fetchMp3 = useSWRMutation(key, async (_, { arg: id }) => {
    const result = await request({
      url: mp3,
      method: "post",
      data: { id }
    })
      .then(() => true)
      .catch(() => false);
    swr.mutate(
      (data) =>
        produce(data, (draft) => {
          const index = draft.findIndex((item) => item.id === id);
          if (index !== -1) {
            draft[index].mp3 = result;
          }
        }),
      { revalidate: false }
    );
    return result;
  });

  return { ...swr, fetchMp3 };
};

export const useUpload = () =>
  useSWRMutation(upload, (_, { arg }) =>
    request({
      url: upload,
      method: "post",
      data: arg
    })
  );

export const useMyUploads = () =>
  useSWR("/api/uploads", () =>
    request({
      url: uploads,
      method: "get"
    }).then((data) => data.songs)
  );
