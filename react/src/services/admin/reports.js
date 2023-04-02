import { request } from "utils/admin";
import { removeById } from "utils";
import { api } from "utils/admin/config";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const { reports } = api;

export const useReports = () => {
  const swr = useSWR(reports, () =>
    request({
      url: reports,
      method: "get"
    }).then((data) => data.reports)
  );

  const del = useSWRMutation(reports, async (_, { arg: id }) =>
    request({
      url: reports,
      method: "delete",
      data: { id }
    }).then(() => {
      swr.mutate((data) => removeById(data, id), { revalidate: false });
    })
  );

  return { ...swr, del };
};
