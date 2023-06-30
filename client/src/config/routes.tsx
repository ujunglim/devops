import { lazy } from "react";

const routes = [
  {
    path: "/login",
    exact: true,
    component: lazy(() => import("../modules/Login")),
  },
  {
    path: "/",
    name: "",
    title: "Process List",
    exact: true,
    component: lazy(() => import("../modules/ProcessList")),
  },
  {
    path: "/detail/:name",
    name: "detail",
    title: "",
    exact: true,
    hideInMenu: true,
    component: lazy(() => import("../modules/ProcessDetail")),
  },
  {
    path: "/other",
    name: "other",
    title: "Other",
    exact: true,
    component: lazy(() => import("../modules/ProcessList")),
  },
];

export default routes;
