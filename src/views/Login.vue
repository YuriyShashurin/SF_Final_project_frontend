<template>
  <div class="login">
    <div class="container d-flex flex-column align-items-center">
      <h2 class="mb-3">Войдите в систему:</h2>
      <div class="text-danger"> {{ errorText }}</div>
      <div class="text-danger"> {{ info }}</div>
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

const AUTH_URL = process.env.VUE_APP_AUTH_URL;

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      decode_data: [],
      errorText: '',
      info: '',
    };
  },
  methods: {
    onSubmit(event) {
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
          console.log(response.data);
          const jwtAccess = response.data.access;
          const jwtRefresh = response.data.refresh;
          localStorage.setItem('jwt_token', jwtAccess);
          console.log(jwtRefresh);
          localStorage.setItem('jwt_token_refresh', jwtRefresh);
          const decodeToken = jwtDecode(response.data.access);
          const username = decodeToken.name;
          const userID = decodeToken.user_id;
          const status = decodeToken.isStaff;
          const payload = {
            username,
            status,
            userID,
            jwtAccess,
            jwtRefresh,
          };
          this.$store.dispatch('login', payload);
          if (status === false) {
            router.push({ path: '/user_area/surveys' });
          } else {
            router.push({ path: '/admin-area/main' });
          }
        }).catch((e) => {
          if (e.status === 404) {
            this.errorText = 'Пользователь с такими данным не найден';
          } else {
            this.errorText = 'Системая ошибка. Попробуйте позже';
          }
        });
      this.username = '';
      this.password = '';
    },
  },
  mounted() {
    if (!this.$store.state.user) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_token_refresh');
      router.push({ path: '/login' });
    }
    if (this.$route.query.text === 'true') {
      this.info = 'Ваш сеанс авторизации истек. Войдите заново';
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
