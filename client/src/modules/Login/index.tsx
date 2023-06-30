import React, { useCallback, useState } from "react";
import styles from "./index.module.less";
import { Button, Checkbox, Form, Input } from "antd";
import { PostLogIn } from "../../protocol/post/PostLogIn";
import { useHistory } from "react-router";

interface LoginForm {
  loginEmail: string;
  password: string;
  autoLogin: boolean;
}

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const history = useHistory();

  const handleLogin = useCallback((values: LoginForm) => {
    const { loginEmail, password, autoLogin } = values;

    const logInApi = new PostLogIn();
    logInApi.loginEmail = loginEmail.trim();
    logInApi.password = password.trim(); // encrypt
    logInApi.autoLogin = autoLogin;

    setIsLoading(true);
    logInApi
      .post()
      .then(() => {
        history.push("/");
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="loginContainer">
      <div className={styles.leftContainer}></div>
      <div className={styles.rightContainer}>
        <Form onFinish={handleLogin}>
          <Form.Item
            name="loginEmail"
            required
            rules={[
              { required: true, message: "Please input your email" },
              { pattern: /^(.+)@(.+)$/, message: "Please input valid email" },
            ]}
          >
            <Input placeholder="Please Input your Email" />
          </Form.Item>
          <Form.Item name="password" required>
            <Input.Password placeholder="Please input your password" />
          </Form.Item>
          <Form.Item name="autoLogin" required={false} valuePropName="checked">
            <Checkbox>Auto Login</Checkbox>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Log In
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
