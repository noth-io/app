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
import DashLayout from "@/layout/DashLayout";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

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
      },      {
        path: "/ui/credentials",
        name: "credentials",
        component: UICredentials,
      }, 
      {
        path: "/ui/clients",
        name: "clients",
        component: UIClients,
      },
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
