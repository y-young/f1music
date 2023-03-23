import { useEffect, useState } from "react";

const checkDesktop = windowWidth => windowWidth > 768;

const useIsDesktop = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [isDesktop, setIsDesktop] = useState(checkDesktop(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      let timeout;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 300);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsDesktop(checkDesktop(window.innerWidth));
  }, [width]);

  return isDesktop;
};

export default useIsDesktop;
