import { createContext, memo, useContext, useEffect, useState } from "react";

const Context = createContext(null);

export const useTitle = () => {
  const { title } = useContext(Context);
  return title;
};

const Title = ({ children }) => {
  const { setTitle } = useContext(Context);
  useEffect(() => {
    setTitle(children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);
  return null;
};

export const TitleContext = ({
  children,
  suffix = " - 福州一中 校园音乐征集",
}) => {
  const [title, setTitle] = useState("首页");

  useEffect(() => {
    document.title = title + suffix;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return (
    <Context.Provider value={{ title, setTitle }}>{children}</Context.Provider>
  );
};

export default memo(Title);
