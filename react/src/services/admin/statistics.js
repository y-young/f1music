import { request, config } from "utils/admin";

const { api } = config;
const { statistics } = api;

export async function Statistics() {
  return request({
    url: statistics,
    method: "get"
  });
}
