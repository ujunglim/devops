/**
 * @file layout header
 */
import React, { useCallback } from "react";
import { Layout } from "antd";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.less";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const handleLogout = useCallback(() => {}, []);
  const handleResetPWD = useCallback(() => {}, []);
  const user = {
    username: "zhangsan",
  };
  const menu = (
    <Menu>
      <Menu.Item onClick={handleResetPWD}>
        <span style={{ cursor: "pointer" }}>修改密码</span>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        <span style={{ cursor: "pointer" }}>退出登录</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className={styles.header}>
      <Link to="/" className={styles.logo}></Link>
      <div>
        {user && user.username && (
          <Dropdown overlay={menu} trigger={["click"]}>
            <span>
              {/* {app.user.userName} */}
              <DownOutlined style={{ marginLeft: 10 }} />
            </span>
          </Dropdown>
        )}
      </div>
    </Layout.Header>
  );
};
export default Header;
