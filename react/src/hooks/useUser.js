import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { api } from "utils/config";

const { status } = api;

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  if (match) {
    return match[2];
  }
  return null;
};

const decodeCookie = (value) => {
  if (!value) {
    return {};
  }
  try {
    const json = atob(value.replace(/%3D$/, ""));
    return JSON.parse(json);
  } catch (e) {
    // console.log(e);
    return {};
  }
};

const getUser = () => {
  const user = getCookie("f1music_user");
  const auth = getCookie("f1music_auth");
  if (user || auth) {
    return decodeCookie(user);
  }
  return null;
};

const userAtom = atom(null);

const useUser = () => {
  const [user, setUser] = useAtom(userAtom);
  const swr = useSWRConfig();

  // Clear cache when user changes, e.g. vote list
  const clearCache = () =>
    swr.mutate((key) => key !== status, undefined, { revalidate: false });

  const mutate = () => {
    setUser(getUser());
    clearCache();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => mutate(), []);

  return { user, mutate };
};

export default useUser;
