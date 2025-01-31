import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserView from '../views/UserView.vue'
import CreatorView from '../views/CreatorView.vue'
import AboutView from '../views/AboutView.vue'
import AccountView from '../views/AccountView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import VerifiedAccountView from '../views/VerifiedAccountView.vue'

import { useToast } from "vue-toast-notification";

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    name: 'home',
    component: UserView,
    meta: { requiresAuth: true }
  },
  {
    path: '/creator',
    name: 'creator',
    component: CreatorView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView
  },
  {
    path: '/verified-account',
    name: 'verified-account',
    component: VerifiedAccountView
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const $toast = useToast();

function isLoggedIn() {
  return localStorage.getItem('authToken') !== null;
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: 'login' })
    $toast.warning('You must be logged in to access this page.', { position: "bottom" });
  } else {
    next()
  }
})

export default router;
