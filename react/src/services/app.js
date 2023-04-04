import { api } from "config";
import { request } from "utils";

const { login, status } = api;

export async function Login(data) {
  return request({
    url: login,
    method: "post",
    data,
  });
}

export async function Status() {
  return request({
    url: `${status}/home`,
    method: "get",
  });
}

export function getCookie() {
  const match = document.cookie.match(/(^| )f1music_auth=([^;]+)/);
  if (match) { return match[2]; }
  else { return null; }
}

export function checkLogin() {
  return getCookie() !== null;
}
