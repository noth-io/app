import { createRouter, createWebHistory } from "vue-router";

/*import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

import Dashboard from "../views/Dashboard.vue";
import Icons from "../views/Icons.vue";
import Maps from "../views/Maps.vue";
import Profile from "../views/UserProfile.vue";
import Tables from "../views/Tables.vue";
import Clients from "../views/Clients.vue";
import NewClient from "../views/NewClient.vue";
import Credentials from "../views/Credentials.vue";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import RegisterConfirm from "../views/RegisterConfirm.vue";
import AuthMailConfirm from "../views/AuthMailConfirm.vue";*/
import AuthLayout from "@/layout/AuthLayout";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

import Dashboard from "../views/Dashboard.vue";

const routes = [
    /*path: "/",
    redirect: "/dashboard",
    component: DashboardLayout,
    beforeEnter: requireAuth,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        components: { default: Dashboard },
      },
      {
        path: "/icons",
        name: "icons",
        components: { default: Icons },
      },
      {
        path: "/maps",
        name: "maps",
        components: { default: Maps },
      },
      {
        path: "/profile",
        name: "profile",
        components: { default: Profile },
      },
      {
        path: "/tables",
        name: "tables",
        components: { default: Tables },
      },
      {
        path: "/clients",
        name: "clients",
        components: { default: Clients },
      },
      {
        path: "/clients/new",
        name: "newclient",
        components: { default: NewClient },
      },
      {
        path: "/credentials",
        name: "credentials",
        components: { default: Credentials },
      },
    ],
  },
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        components: { default: Login },
      },
      {
        path: "/login/mail/:emailtoken",
        name: "authemailconfirm",
        component: AuthMailConfirm,
      },
      {
        path: "/register",
        name: "register",
        components: { default: Register },
      },
      {
        path: "/register/confirm/:emailtoken",
        name: "registerconfirm",
        component: RegisterConfirm,
      },
    ],*/
  {    
    path: "/",
    redirect: "login",
    component: AuthLayout,
    //beforeEnter: requireAuth,
    children: [
      {
        path: "/login",
        name: "login",
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
    ]
  },
  {    
    path: "/",
    redirect: "dashboard",
    component: AuthLayout,
    beforeEnter: requireAuth,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes,
});

function requireAuth(to, from, next) {
  const { $cookies } = router.app.config.globalProperties;
  if ($cookies.get("authenticated") == "true") {
    next();
  } else {
    next("/login");
  }
}

export default router;
