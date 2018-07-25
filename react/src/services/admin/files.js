import { request, config } from "utils/admin";

const { api } = config;
const { files } = api;

export async function Files() {
  return request({
    url: files,
    method: "get"
  });
}
