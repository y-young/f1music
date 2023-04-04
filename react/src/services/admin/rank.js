import { request } from "utils/admin";
import { api } from "utils/admin/config";

const { rank } = api;

export async function Rank() {
  return request({
    url: rank,
    method: "get",
  });
}
