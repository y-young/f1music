import { useEffect } from "react";
import { Skeleton, Spin } from "antd";
import { useNavigate } from "react-router-dom";

import Title from "hooks/useTitle";
import { useLogout } from "services/app";
import useUser from "hooks/useUser";

const Logout = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { mutate } = useUser();

  useEffect(() => {
    logout.trigger().then(() => {
      mutate();
      navigate("/login");
    });
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
