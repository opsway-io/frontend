import { matchRoutes } from "react-router-dom";

const routes = [
  {
    path: "login",
    children: [
      {
        children: [
          { index: true },
          { path: "forgot-password" },
        ]
      },
      {
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
