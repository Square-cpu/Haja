import { createRouter, createWebHistory } from "vue-router";
import UserView from "../views/UserView.vue";
import CreatorView from "../views/CreatorView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: UserView,
  },
  {
    path: "/creator",
    name: "creator",
    component: CreatorView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
