/* eslint-disable react/jsx-no-bind */
import React, { FC, useCallback, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Menu } from "antd";
import { useHistory, useLocation } from "react-router-dom";
// import { MenuFold, MenuUnfold } from "@baidu/xicon-react";
// import { selectApp, toggleCollapse } from "@/store/slices/app";
// import { MenuConfig } from "./components/MenuList";
const { SubMenu } = Menu;

const Sider: FC<any> = ({ menuConfig }) => {
  // const dispatch = useDispatch();
  const history = useHistory();
  const pathname = useLocation().pathname;

  const currentKeys = useMemo(() => {
    return pathname.split("/").slice(1);
  }, [pathname]);

  const handleClick = useCallback(
    (e: any) => {
      const pathStr = `/${e.keyPath.reverse().join("/")}`;
      history.push(pathStr);
    },
    [history]
  );

  const renderMenuItem = useCallback((data: any[]) => {
    return data.map((item) => {
      const Icon = item.icon || null;
      if (item.children && item.children.length) {
        return (
          <SubMenu key={item.key} title={item.title} icon={Icon && <Icon />}>
            {renderMenuItem(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key} icon={Icon && <Icon />}>
          {item.title}
        </Menu.Item>
      );
    });
  }, []);

  // const onToggleCollapse = () => {
  //   dispatch(toggleCollapse());
  // };

  const renderTriggerButton = () => {
    return (
      <div
        // onClick={onToggleCollapse}
        style={{
          borderTop: "1px solid rgba(8,15,26,.1)",
          borderRight: "1px solid #f0f0f0",
          textAlign: "left",
          paddingLeft: "16px",
          fontSize: 14,
          height: 40,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {/* {collapsed ? (
          <MenuUnfold xiconStyle={{ position: "relative", left: 5 }} />
        ) : (
          <span>
            <MenuFold
              xiconStyle={{ position: "relative", top: -1, marginRight: 8 }}
            />
            展开/收起
          </span>
        )} */}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        height: "100%",
        boxShadow: "0 2px 8px 0 rgba(7, 12, 20, .12)",
        zIndex: 1001,
      }}
    >
      <Menu
        mode="inline"
        onClick={handleClick}
        defaultOpenKeys={currentKeys.slice(0, -1)}
        selectedKeys={currentKeys}
        style={{
          fontSize: 14,
          height: "100%",
          width: 180,
          overflow: "auto",
        }}
        className="sider"
        // inlineCollapsed={collapsed}
      >
        {renderMenuItem(menuConfig || [])}
      </Menu>
      {renderTriggerButton()}
    </div>
  );
};

export default Sider;
