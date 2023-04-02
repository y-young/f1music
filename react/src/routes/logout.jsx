import { useEffect } from "react";
import { Skeleton, Spin } from "antd";
import { useNavigate } from "react-router-dom";

import Title from "hooks/useTitle";
import { useLogout } from "services/app";

const Logout = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    logout.trigger().then(() => navigate("/login"));
  }, []);

  return (
    <>
      <Title>登出</Title>
      <Spin tip="正在登出……">
        <Skeleton />
      </Spin>
    </>
  );
};

export default Logout;
