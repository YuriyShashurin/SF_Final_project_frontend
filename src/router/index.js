import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/user_area/stats',
    name: 'Stats',
    component: () => import(/* webpackChunkName: "about" */ '../views/Stats.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import(/* webpackChunkName: "about" */ '../views/Signup.vue'),
  },
  {
    path: '/user_area/surveys',
    name: 'Surveys',
    component: () => import(/* webpackChunkName: "about" */ '../views/Surveys.vue'),
  },
  {
    path: '/user_area/surveys/:id',
    name: 'SelectedSurvey',
    component: () => import(/* webpackChunkName: "about" */ '../views/Poll.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
