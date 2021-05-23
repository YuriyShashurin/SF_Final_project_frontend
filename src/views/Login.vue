<template>
  <div class="login">
    <div class="container d-flex flex-column align-items-center">
      <h2>Войдите в систему:</h2>
      <form style="width: 50%" class="mb-3 d-flex flex-column align-items-center"
            @submit="onSubmit" @keydown.enter="onSubmit" action="">
          <div class="mt-2" style="width: 100%">
            <label for="username" class="form-label">Введите ваш логин</label>
            <input type="text" v-model="username" class="form-control" id="username">
          </div>
          <div class="mt-2" style="width: 100%">
            <label for="username" class="form-label">Введите ваш пароль</label>
            <input type="password" v-model="password" class="form-control" id="password">
          </div>
        <button class="mt-4 btn btn-info" style="width: 50%" type="submit">
            Войти
        </button>
      </form>
      <h6 class="mb-3">Или <a href="/#/signup">зарегистрируйтесь</a></h6>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import jwtDecode from 'jwt-decode';
import router from '../router';

const AUTH_URL = 'http://localhost:8080/api/token/';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      decode_data: [],
    };
  },
  methods: {
    onSubmit(event) {
      // const username1 = this.username;
      event.preventDefault();
      const requestData = {
        username: this.username,
        password: this.password,
      };
      const config = {
        headers: {
          'X-CSRFToken': this.$cookies.get('csrftoken'),
        },
      };
      axios.post(AUTH_URL, requestData, config)
        .then((response) => {
          this.$cookies.set('jwt_token', response.data.access);
          this.$cookies.set('jwt_token_refresh', response.data.refresh);
          console.log(jwtDecode(response.data.access));
          const decodeToken = jwtDecode(response.data.access);
          console.log(decodeToken);
          const username = decodeToken.name;
          console.log(username);
          const status = decodeToken.isStaff;
          console.log(status);
          const payload = { username, status };
          this.$store.dispatch('login', payload);
          router.push({ path: '/' });
        });
      this.username = '';
      this.password = '';
    },
  },
  mounted() {
    if (!this.$store.state.user && this.$cookies.get('jwt_token')) {
      this.$cookies.remove('jwt_token');
      this.$cookies.remove('jwt_token_refresh');
    }
  },
};
</script>

<style scoped>
  a {
    font-weight: bold;
    color: #42b983;
  }

</style>
