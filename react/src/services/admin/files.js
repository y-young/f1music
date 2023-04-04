import { request } from "utils/admin";
import { api } from "utils/admin/config";

const { files } = api;

export async function Files() {
  return request({
    url: files,
    method: "get",
  });
}
