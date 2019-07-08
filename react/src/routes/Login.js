import React from "react";
import { connect } from "dva";
import styles from "./Login.css";
import { Link } from "dva/router";
import { Form, Icon, Button, Input } from "antd";

const FormItem = Form.Item;

const Login = ({
  app,
  loading,
  dispatch,
  form: { getFieldDecorator, validateFieldsAndScroll }
}) => {
  const handleSubmit = () => {
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        dispatch({ type: "app/login", payload: values });
      }
    });
  };

  const validatePassword = (rule, value, callback) => {
    if (value === "123456") {
      callback("为保证投票质量禁止使用校网初始密码登录,请更改密码");
    }
    callback();
  };

  return (
    <div>
      <div className={styles.login}>
        <div style={{ width: "300px", margin: "auto" }}>
          <div className={styles.title}>
            <b>登录</b>
          </div>
          <Form>
            <FormItem>
              {getFieldDecorator("stuId", {
                validate: [
                  {
                    trigger: "onChange",
                    rules: [{ required: true, message: "请输入学号" }]
                  },
                  {
                    trigger: "onBlur",
                    rules: [
                      { min: 10, message: "学号应为10或11位" },
                      { max: 11, message: "学号应为10或11位" }
                    ]
                  }
                ]
              })(
                <Input
                  placeholder="学号"
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  onPressEnter={handleSubmit}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "请输入密码" },
                  { validator: validatePassword }
                ]
              })(
                <Input
                  type="password"
                  placeholder="校园网密码"
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  onPressEnter={handleSubmit}
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading.effects["app/login"]}
                block
              >
                登录
              </Button>
            </FormItem>
          </Form>
          <Link to="/" style={{ fontSize: "13px", color: "#777" }}>
            <Icon type="arrow-left" /> 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
};

export default connect(({ app, loading }) => ({ app, loading }))(
  Form.create()(Login)
);
