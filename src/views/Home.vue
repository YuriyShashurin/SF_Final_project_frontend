<template>
  <div class="home">
  </div>
</template>

<script>
// eslint-disable-next-line import/no-cycle
import router from '../router';

export default {
  mounted() {
    const isLogIn = this.$store.getters.getIsLoggedIn;
    if (isLogIn !== true) {
      console.log('не авторизован');
      this.$store.dispatch('logout');
      router.push({ path: '/login', query: { text: 'true' } });
    } else {
      const status = this.$store.getters.getIsStaff;
      if (status === false) {
        router.push({ path: '/user_area/surveys' });
      } else {
        router.push({ path: '/admin-area/main' });
      }
    }
  },
};
</script>
