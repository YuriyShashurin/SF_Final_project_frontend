<template>
  <div class="container d-flex flex-column align-items-start mb-3">
    <h3>Список пользователей</h3>
  </div>
  <div>
    <table class="table table-hover mt-3">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Фамилия Имя</th>
        <th scope="col">Username</th>
        <th scope="col">Email</th>
        <th scope="col">Статус</th>
        <th scope="col">Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users"
          :key="user.id" style="height: 40px; cursor: pointer;">
        <th scope="col">{{ user.id }}</th>
        <td scope="col">{{ user.last_name }} {{ user.first_name }}</td>
        <td scope="col">{{ user.username }}</td>
        <td scope="col">{{ user.email }}</td>
        <td v-if="user.is_staff === true" scope="col" style="color: #42b983">Админ</td>
        <td v-else scope="col" style="color: #ED7D31">Пользователь</td>
        <td scope="col">
          <div class="d-flex flex-column align-content-center d-grid gap-2 col-8 mx-auto">
            <button class="btn btn-danger btn-sm"
                    v-on:click="deleteUser(user.id)">Удалить пользователя</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../../router';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'Users',
  data() {
    return {
      users: [],
    };
  },
  methods: {
    getUsersList() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      axios.get(`${BASE_API_URL}/users/`, config)
        .then((response) => {
          this.users = response.data;
          console.log(this.users);
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              console.log('refreshToken');
              this.getUsersList();
            }
          }
        });
    },
    deleteUser(userId) {
      console.log(userId);
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.delete(`${BASE_API_URL}/users/${userId}/`, config)
        .then(() => {
          this.getUsersList();
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              console.log('refreshToken');
              this.deleteUser(userId);
            }
          }
        });
    },
  },
  mounted() {
    const isLogIn = this.$store.getters.getIsLoggedIn;
    console.log(isLogIn);
    if (isLogIn !== true) {
      console.log('не авторизован');
      this.$store.dispatch('logout');
      router.push({ path: '/login', query: { text: 'true' } });
    }
    this.getUsersList();
  },
};
</script>

<style scoped>

</style>
