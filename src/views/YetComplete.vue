<template>
  <div class="container">
    <h6>Данная анкета уже была вами пройдена</h6>
    <router-link to="/user_area/surveys">Проверьте другие доступные опросы</router-link>
  </div>
</template>

<script>
export default {
  name: 'YetComplete',
};
</script>

<style scoped>

</style>
