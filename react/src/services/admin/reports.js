import { request, config } from "utils/admin";

const { api } = config;
const { reports } = api;

export async function Reports() {
  return request({
    url: reports,
    method: "get"
  });
}

export async function Delete(id) {
  return request({
    url: reports,
    method: "delete",
    data: id
  });
}
