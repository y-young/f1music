import { request } from "utils";
import { api } from "config";

const { list, report, vote, status } = api;

export async function Songs(time) {
  return request({
    url: list,
    method: "post",
    data: { time },
  });
}

export function Report(params) {
  return request({
    url: report,
    method: "post",
    data: params,
  });
}

export async function Vote(params) {
  return request({
    url: vote,
    method: "post",
    data: params,
  });
}

export async function Status() {
  return request({
    url: `${status}/vote`,
    method: "get",
  });
}
