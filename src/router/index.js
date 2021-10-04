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
    path: '/logout',
    name: 'Logout',
    component: () => import(/* webpackChunkName: "about" */ '../views/Logout.vue'),
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
  {
    path: '/complete_survey/:id',
    name: 'SuccessPoll',
    component: () => import(/* webpackChunkName: "about" */ '../views/SuccessPoll.vue'),
  },
  {
    path: '/yet_complete',
    name: 'YetComplete',
    component: () => import(/* webpackChunkName: "about" */ '../views/YetComplete.vue'),
  },
  {
    path: '/admin-area/main',
    name: 'MainAdminArea',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin-area/Main.vue'),
  },
  {
    path: '/admin-area/project/:id',
    name: 'ProjectDetails',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin-area/ProjectDetail.vue'),
  },
  {
    path: '/admin-area/create_project',
    name: 'CreateNewProject',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin-area/CreateNewProjects.vue'),
  },
  {
    path: '/admin-area/users',
    name: 'Users',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin-area/Users.vue'),
  },
  {
    path: '/admin-area/questions',
    name: 'Questions',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin-area/Questions.vue'),
  },
  {
    path: '/admin-area/question_details/:id',
    name: 'QuestionDetails',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin-area/QuestionDetails.vue'),
  },
  {
    path: '/admin-area/add_question',
    name: 'AddQuestion',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin-area/AddQuestion.vue'),
  },
  {
    path: '/admin-area/add_ready_question',
    name: 'AddReadyQuestion',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin-area/AddReadyQuestion.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
