<template>
  <div class="login">
    <div class="container d-flex flex-column">
      <h4>Вы действительно хотите выйти из учетной записи?</h4>
      <div class="d-flex flex-row justify-content-center">
        <button class="btn btn-info m-3" style="width: 20%" @click="submitLogout">ДА</button>
        <button class="btn btn-info m-3" style="width: 20%" @click="cancelLogout">НЕТ</button>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router';

export default {
  name: 'Logout',
  methods: {
    submitLogout() {
      this.$store.dispatch('logout');
      router.push('/login');
    },
    cancelLogout() {
      router.push('/');
    },
  },
};
</script>

<style scoped>

</style>
