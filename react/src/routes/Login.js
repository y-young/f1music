import React from "react";
import { connect } from "dva";
import styles from "./Login.css";
import { Link } from "dva/router";
import { Form, Button, Input } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

const FormItem = Form.Item;

const Login = ({ app, loading, dispatch }) => {
  const handleSubmit = values => {
    dispatch({ type: "app/login", payload: values });
  };

  return (
    <div>
      <div className={styles.login}>
        <div style={{ width: "300px", margin: "auto" }}>
          <div className={styles.title}>
            <b>登录</b>
          </div>
          <Form onFinish={handleSubmit}>
            <FormItem
              name="stuId"
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
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                onPressEnter={handleSubmit}
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
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                onPressEnter={handleSubmit}
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                loading={loading.effects["app/login"]}
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
    </div>
  );
};

export default connect(({ app, loading }) => ({ app, loading }))(Login);
