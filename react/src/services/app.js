import { request } from "utils";
import { api } from "config";

const { login, status } = api;

export async function Login(data) {
  return request({
    url: login,
    method: "post",
    data: data
  });
}

export async function Status() {
  return request({
    url: status + "/home",
    method: "get"
  });
}

export function getCookie(name) {
  var match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  if (match) return match[2];
  else return null;
}

export function checkLogin() {
  return (
    getCookie("f1music_user") !== null || getCookie("f1music_auth") !== null
  );
}
