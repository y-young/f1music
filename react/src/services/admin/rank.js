import { request } from "utils/admin";
import { api } from "utils/admin/config";
import useSWR from "swr";

const { rank } = api;

export const useRank = () =>
  useSWR(rank, () =>
    request({
      url: rank,
      method: "get"
    }).then((data) => data.rank)
  );
