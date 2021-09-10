import { createRouter, createWebHistory } from "vue-router";

import AuthLayout from "@/layout/AuthLayout";
import DashLayout from "@/layout/DashLayout";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import OAuth2Consent from "../views/OAuth2Consent.vue";

import UIHome from "../views/UIHome.vue";
import UIUserProfile from "../views/UIUserProfile.vue";
import UIAuthentication from "../views/UIAuthentication.vue";
import UICredentials from "../views/UICredentials.vue";
import UIClients from "../views/UIClients.vue";

const routes = [
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: Login,
      },
      {
        path: "/login/mail/:emailtoken",
        name: "loginconfirmmail",
        component: Login,
      },
      {
        path: "/login/:logininst",
        name: "loginwithinst",
        component: Login,
      },
      {
        path: "/register",
        name: "register",
        component: Register,
      },
      {
        path: "/register/confirm/:emailtoken",
        name: "registerconfirm",
        component: Register,
      },
      {
        path: "/oauth2consent/:consenttoken",
        name: "oauth2consent",
        component: OAuth2Consent,
      },
    ],
  },
  {
    path: "/ui",
    redirect: "/ui/home",
    component: DashLayout,
    beforeEnter: requireAuth,
    children: [
      {
        path: "/ui/home",
        name: "home",
        component: UIHome,
      },
      {
        path: "/ui/userprofile",
        name: "userprofile",
        component: UIUserProfile,
      },
      {
        path: "/ui/authentication",
        name: "authentication",
        component: UIAuthentication,
      },
      {
        path: "/ui/credentials",
        name: "credentials",
        component: UICredentials,
      },
      {
        path: "/ui/clients",
        name: "clients",
        component: UIClients,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes,
});

function requireAuth(to, from, next) {
  const { $cookies } = router.app.config.globalProperties;
  if ($cookies.get("authenticated") == "True") {
    next();
  } else {
    next("/login");
  }
}

export default router;
