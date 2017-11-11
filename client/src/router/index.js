import VueRouter from 'vue-router';

import Home from '../components/Home';
import BusinessList from '../components/BusinessList';
import Signup from '../components/Signup';
import Login from '../components/Login';
import LoginError from '../components/LoginError';
import PageNotFound from '../components/PageNotFound';

/* eslint-disable no-undef */
const routes = [
  {
    path: '/',
    component: Home,
    meta: {title: 'Colornight | Welcome'}
  },
  {
    path: '/bars',
    component: BusinessList,
    meta: {title: 'Colornight | Bars'}
  },
  {
    path: '/signup',
    component: Signup,
    meta: {title: 'Colornight | Sign up'}
  },
  {
    path: '/login',
    component: Login,
    meta: {title: 'Colornight | Log in'}
  },
  {
    path: '/login-error',
    component: LoginError,
    meta: {title: 'Colornight | Error'}
  },
  {
    path: '*',
    component: PageNotFound,
    meta: {title: 'Colornight | Page not found'}
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export { router };
