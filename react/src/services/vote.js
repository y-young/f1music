import { request, config } from "utils";

const { api } = config;
const { list, report, vote, status } = api;

export async function Songs(time) {
  return request({
    url: list,
    method: "post",
    data: { time: time }
  });
}

export function Report(params) {
  return request({
    url: report,
    method: "post",
    data: params
  });
}

export async function Vote(params) {
  return request({
    url: vote,
    method: "post",
    data: params
  });
}

export async function Status() {
  return request({
    url: status + "/vote",
    method: "get"
  });
}
