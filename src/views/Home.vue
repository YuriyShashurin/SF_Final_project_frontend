<template>
  <div class="home">
    <h3>Dfsdfs</h3>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-cycle
import router from '../router';

export default {
  name: 'Home',
  created() {
    if (!this.$store.state.user) {
      this.$cookies.remove('jwt_token');
      this.$cookies.remove('jwt_token_refresh');
      router.push({ path: '/login' });
    }
  },
};

</script>
