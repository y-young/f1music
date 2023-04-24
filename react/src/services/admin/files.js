import { request } from "utils/admin";
import { api } from "utils/admin/config";
import useSWR from "swr";

const { files } = api;

export const useFiles = () =>
  useSWR(files, () =>
    request({
      url: files,
      method: "get",
    }).then((data) => data.files)
  );
