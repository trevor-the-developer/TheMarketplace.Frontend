import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ConfirmEmail from '../views/ConfirmEmail.vue';
import ListingList from '../views/ListingList.vue';
import ListingDetail from '../views/ListingDetail.vue';
import CardDetail from '../views/CardDetail.vue';
import ProductDetail from '../views/ProductDetail.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/confirm-email',
    name: 'ConfirmEmail',
    component: ConfirmEmail,
    meta: { requiresAuth: false }
  },
  {
    path: '/listings',
    name: 'Listings',
    component: ListingList,
    meta: { requiresAuth: true }
  },
  {
    path: '/listing/:id',
    name: 'ListingDetail',
    component: ListingDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/card/:id',
    name: 'CardDetail',
    component: CardDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;