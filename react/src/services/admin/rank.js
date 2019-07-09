import { request, config } from "utils/admin";

const { api } = config;
const { rank } = api;

export async function Rank() {
  return request({
    url: rank,
    method: "get"
  });
}
