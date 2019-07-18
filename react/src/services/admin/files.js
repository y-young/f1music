import { request, config } from "utils/admin";

const { api } = config;
const { files } = api;

export async function Files(page) {
  return request({
    url: files + '?page=' + page,
    method: "get"
  });
}
