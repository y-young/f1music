import { request, config } from "utils/admin";

const { api } = config;
const { reports } = api;

export async function Reports() {
  return request({
    url: reports,
    method: "get",
  });
}