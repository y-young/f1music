import React from 'react';
import styles from './Login.css';
import { Link } from 'dva/router';
import { Form, Icon, Button, Input, Alert } from 'antd';
const FormItem = Form.Item;

const Login = () => {
  return (
    <div>
      <div className={styles.login}>
        <div style={{ width: "300px", margin: "auto" }}>
          <div style={{ "font-size": "30px", "text-align": "center", "margin-bottom": "20px" }}><b>登录</b></div>
            <div>
              <Alert title="登录成功，正在跳转..." type="success" /><br/>
            </div>
            <div>
              <Alert title="errorMsg" type="error" /><br/>
            </div>
            <Form>
              <FormItem prop="stuId">
                <Input placeholder="学号" />
              </FormItem>
              <FormItem prop="password">
                <Input type="password" placeholder="校园网密码" />
              </FormItem>
              <FormItem>
                <Button type="primary">登录</Button>
              </FormItem>
            </Form>
            <Link to="/" style={{ "font-size": "13px", color: "#777" }}><Icon type="arrow-left" /> 返回首页</Link>
          </div>
        </div>
        <canvas width="1080" height="1608" id="curve"></canvas>
    </div>
  );
};

export default Login;
