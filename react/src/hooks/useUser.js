import { useAtom, atom } from "jotai";
import { useEffect } from "react";

const getCookie = (name) => {
  var match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
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
    console.log(e);
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

  useEffect(() => mutate(), []);

  const mutate = () => setUser(getUser());

  return { user, mutate };
};

export default useUser;
