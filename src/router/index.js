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
    component: LoginView,
    meta: { showNavbar: false }
  },
  {
    path: '/',
    name: 'home',
    component: UserView,
    meta: { requiresAuth: true, isVerified: true }
  },
  {
    path: '/creator',
    name: 'creator',
    component: CreatorView,
    meta: { requiresAuth: true, isVerified: true }
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
    component: ResetPasswordView,
    meta: { showNavbar: false }
  },
  {
    path: '/verified-account',
    name: 'verified-account',
    component: VerifiedAccountView,
    meta: { showNavbar: false }
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

function isVerified() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.is_verified;
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: 'login' })
    $toast.warning('You must be logged in to access this page.', { position: "bottom" });
  } else if (to.meta.isVerified && !isVerified()) {
    next({ name: 'account' });
    $toast.warning('You must verify your account to access this page.', { position: "bottom" });
  } else {
    next()
  }
})

export default router;
