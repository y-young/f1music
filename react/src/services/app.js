import { request, config } from "utils";

const { api } = config;
const { login } = api;

export async function Login(data) {
  return request({
    url: login,
    method: "post",
    /*headers: {
      'Content-type': 'application/json'
    },*/
    data: data
  });
}

export async function getCookie() {
  var match = document.cookie.match(
    new RegExp("(^| )MusicAuth=([^;]+)")
  );
  if (match) return match[2];
  else return null;
}

export async function checkLogin() {
  return getCookie() !== null;
}
