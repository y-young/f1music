import { request } from "utils/admin";
import { api } from "utils/admin/config";

const { reports } = api;

export async function Reports() {
  return request({
    url: reports,
    method: "get",
  });
}

export async function Delete(id) {
  return request({
    url: reports,
    method: "delete",
    data: { id },
  });
}
