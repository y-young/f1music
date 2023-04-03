import { useEffect, useState } from "react";
import useIsDesktop from "./useIsDesktop";

const useSidebar = (location) => {
  const isDesktop = useIsDesktop();
  const [collapsed, setCollapsed] = useState(!isDesktop);

  useEffect(() => {
    // When switching between portrait and landscape mode
    setCollapsed(!isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    // TODO
    window.scrollTo(0, 0);
    // Collapse sidebar after navigating to another page on mobile
    if (!isDesktop) {
      setCollapsed(true);
    }
  }, [location]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return [collapsed, toggle];
};

export default useSidebar;
