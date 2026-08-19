import { matchRoutes } from "react-router-dom";

const routes = [
  {
    path: "login",
    children: [
      {
        path: "",
        children: [
          { path: "", element: "LoginView" },
          { path: "forgot-password" },
        ]
      },
      {
        path: "",
        children: [
          { path: "team/select" },
          { path: "team/invite" },
        ]
      }
    ]
  },
  { path: "*", element: "404" }
];

console.log(matchRoutes(routes, "/login/team/invite"));
console.log(matchRoutes(routes, "/login"));
