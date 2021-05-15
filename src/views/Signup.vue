<template>
  <div class="login">
    <div class="container d-flex flex-column align-items-center">
      <h2>Регистрация:</h2>
      <form style="width: 50%" class="mb-3 d-flex flex-column align-items-center"
            @submit="CheckForm" action="">
        <div class="mt-2" style="width: 100%">
          <label for="username" class="form-label">Введите ваш логин</label>
          <input type="text" v-model="username" class="form-control" id="username">
        </div>
        <div class="mt-2" style="width: 100%">
          <label for="email" class="form-label">Введите ваш email</label>
          <input type="email" v-model="email" class="form-control" id="email" required>
        </div>
        <div class="mt-2" style="width: 100%">
          <label for="last_name" class="form-label">Фамилия</label>
          <input type="text" v-model="last_name" class="form-control" id="last_name">
        </div>
        <div class="mt-2" style="width: 100%">
          <label for="first_name" class="form-label">Имя</label>
          <input type="text" v-model="first_name" class="form-control" id="first_name">
        </div>
        <div class="mt-2" style="width: 100%">
          <label for="password" class="form-label">Введите ваш пароль</label>
          <input type="password" v-model="password" class="form-control" id="password">
        </div>
        <div class="mt-2" style="width: 100%">
          <label for="password_check" class="form-label">Введите ваш пароль повторно</label>
          <input type="password" v-model="password_check" class="form-control" id="password_check">
        </div>
        <div class="text-danger mt-3"> {{alert_message}}</div>
        <button class="mt-4 btn btn-info" style="width: 50%" type="submit">
          Регистрация
        </button>
      </form>
      <h6 class="mb-3">Или <router-link to="/login">ввойдите</router-link> в свой аккаунт</h6>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';

const BASE_API_URL = 'http://localhost:8080/api';

export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      first_name: '',
      last_name: '',
      password: '',
      password_check: '',
      email: '',
      password_valid: true,
      alert_message: '',
      msg: [],
    };
  },
  methods: {
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    PostSignUpData() {
      const requestData = {
        username: this.username,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        is_active: false,
      };

      const csrf = this.$cookies.get('csrftoken');
      const config = {
        headers: {
          'X-CSRFToken': csrf,
        },
      };

      axios.post(`${BASE_API_URL}/users/`, requestData, config)
        .then((response) => console.log(response.data))
        .catch((e) => console.log(e.response));

      this.username = '';
      this.password_check = '';
      this.password = '';
      this.last_name = '';
      this.first_name = '';
      router.push({ path: '/' });
    },
    CheckForm(event) {
      this.alert_message = '';
      event.preventDefault();
      if (this.password !== this.password_check || this.password.length < 8) {
        this.password_valid = false;
        this.alert_message += 'Пароль не соотвествуют требованиям или не совпадают! ';
      } else if (!this.validEmail(this.email)) {
        this.alert_message += 'Укажите корректный адрес электронной почты.';
      } else {
        this.password_valid = true;
      }
      if (this.password_valid === true) {
        this.alert_message = '';
        this.PostSignUpData();
      }
    },
  },
};
</script>

<style scoped>
  a {
    font-weight: bold;
    color: #42b983;
  }
</style>
