import React from "react";
import styles from "./login.module.less";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, Input, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import Title from "hooks/useTitle";
import { useLogin } from "services/app";
import useUser from "hooks/useUser";

const FormItem = Form.Item;

const Login = () => {
  const login = useLogin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate } = useUser();

  const handleSubmit = (values) =>
    login
      .trigger(values)
      .then(() => {
        mutate();
        message.success("登录成功", 3);
        const redirect = searchParams.get("redirect");
        if (!redirect || !redirect.startsWith("/")) {
          navigate("/");
        } else {
          navigate(redirect);
        }
      })
      .catch(() => {});

  return (
    <>
      <Title>登录</Title>
      <div className={styles.login}>
        <div style={{ width: "300px", margin: "auto" }}>
          <div className={styles.title}>
            <b>登录</b>
          </div>
          <Form onFinish={handleSubmit}>
            <FormItem
              name="stuId"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                { required: true, message: "请输入学号" },
                {
                  min: 10,
                  message: "学号应为10或11位",
                  validateTrigger: "onBlur"
                },
                {
                  max: 11,
                  message: "学号应为10或11位",
                  validateTrigger: "onBlur"
                }
              ]}
            >
              <Input
                placeholder="学号"
                prefix={<UserOutlined className={styles.inputIcon} />}
              />
            </FormItem>
            <FormItem
              name="password"
              rules={[
                { required: true, message: "请输入密码" },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") !== "123456") {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "为保证投票质量禁止使用校网初始密码登录,请更改密码"
                    );
                  }
                })
              ]}
            >
              <Input.Password
                placeholder="校园网密码"
                prefix={<LockOutlined className={styles.inputIcon} />}
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                loading={login.isMutating}
                htmlType="submit"
                block
              >
                登录
              </Button>
            </FormItem>
          </Form>
          <Link to="/" style={{ fontSize: "13px", color: "#777" }}>
            <ArrowLeftOutlined /> 返回首页
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
