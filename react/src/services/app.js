import { request } from "utils";
import { api } from "config";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const { login, logout, status } = api;

export const useLogin = () =>
  useSWRMutation(login, (_, { arg }) =>
    request({
      url: login,
      method: "post",
      data: arg
    })
  );

export const useLogout = () =>
  useSWRMutation(logout, () =>
    request({
      url: logout,
      method: "post"
    })
  );

export const useStatus = () =>
  useSWR(status, () =>
    request({
      url: status + "/home",
      method: "get"
    }).then((data) => data.status)
  );

export const getCookie = () => {
  var match = document.cookie.match(new RegExp("(^| )f1music_auth=([^;]+)"));
  if (match) return match[2];
  else return null;
};

export const checkLogin = () => getCookie() !== null;
