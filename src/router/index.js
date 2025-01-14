import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UserView from '../views/UserView.vue'
import CreatorView from '../views/CreatorView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const $toast = useToast();

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: 'login' })
    $toast.warning('You must be logged in to access this page.')
  } else {
    next()
  }
})

function isLoggedIn() {
  return localStorage.getItem('authToken') !== null
}

export default router;
