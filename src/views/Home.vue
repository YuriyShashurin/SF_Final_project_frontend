<template>
  <div class="home">
    <h3>Главная страница</h3>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-cycle
import router from '../router';

export default {
  name: 'Home',
  mounted() {
    if (!this.$store.state.username) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_token_refresh');
      router.push({ path: '/login' });
    }
  },
};

</script>
