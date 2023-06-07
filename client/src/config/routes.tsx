import { lazy } from "react";

const routes = [
  {
    path: "/",
    name: "",
    title: "Process List",
    exact: true,
    component: lazy(() => import("../modules/ProcessList")),
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
