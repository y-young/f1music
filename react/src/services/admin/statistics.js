import { request } from "utils/admin";
import { api } from "utils/admin/config";
import useSWR from "swr";

const { statistics } = api;

export const useStatistics = () =>
  useSWR(statistics, () =>
    request({
      url: statistics,
      method: "get"
    }).then((data) => data.data)
  );
