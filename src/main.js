import { createApp } from 'vue';
import VueCookies from 'vue3-cookies';
import App from './App.vue';
import router from './router';
import store from './store';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
app.use(VueCookies, {
  expireTimes: '30d',
  path: '/',
  domain: '',
  secure: true,
  sameSite: 'None',
});

// createApp(App).use(store).use(router).mount('#app')
//   .use(VueCookies);
