import { Layout } from "antd";
import React from "react";
import { RouteConfig } from "react-router-config";
import routes from "../config/routes";
import Header from "./Header";
import Sider from "./Sider";
import styles from "./index.less";
import ProcessList from "../modules/ProcessList";

interface MenuConfig {
  title?: string;
  key?: string;
  icon?: React.FC<any>;
  children?: MenuConfig[];
}
export const AppLayout: React.FC<{ children: any }> = ({ children }) => {
  const getMenuList = (routes: RouteConfig[]): MenuConfig[] => {
    const result: MenuConfig[] = [];
    const dataSource = routes.filter((route) => !route.hideInMenu);

    for (const route of dataSource) {
      const newRoute: MenuConfig = {
        title: route.title,
        key: route.name,
        icon: route.icon,
      };
      if (
        route.routes &&
        route.routes.find((item) => item.hideInMenu !== true)
      ) {
        const children = getMenuList(route.routes);
        children.length && result.push({ ...newRoute, children });
        continue;
      }
      result.push(newRoute);
    }
    return result;
  };

  return (
    <Layout className={styles.layout}>
      <Header />
      <Layout className={styles.body}>
        <Sider menuConfig={getMenuList(routes)} />
        <Layout.Content className={styles.content}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};
