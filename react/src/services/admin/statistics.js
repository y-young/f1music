import { request } from "utils/admin";
import { api } from "utils/admin/config";

const { statistics } = api;

export async function Statistics() {
  return request({
    url: statistics,
    method: "get"
  });
}
