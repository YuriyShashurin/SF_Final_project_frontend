<template>
  <div class="container d-flex flex-column align-items-start">
    <button class="btn btn-info">
      <router-link class="text-white" to="/admin-area/create_project">
        Создать новый проект
      </router-link>
    </button>
    <h3 class="mt-3">Список опросов</h3>
  </div>
  <div class="d-flex flex-column">
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Название</th>
          <th scope="col">Владелец</th>
          <th scope="col">Дата старта</th>
          <th scope="col">Дата окончания</th>
          <th scope="col">Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="survey in survey_list"
             :key="survey.id" style="height: 40px; cursor: pointer;">
          <th scope="row">
            <router-link :to="{ name: 'ProjectDetails', params: { id: survey.id } }"
                         style="text-decoration: none; color: black">
              {{survey.id}}
            </router-link>
          </th>
          <td scope="row">
            <router-link :to="{ name: 'ProjectDetails', params: { id: survey.id } }"
                         style="text-decoration: none; color: black">
              {{survey.title}}
            </router-link>
          </td>
          <td scope="row">
            <router-link :to="{ name: 'ProjectDetails', params: { id: survey.id } }"
                         style="text-decoration: none; color: black">
              {{ survey.owner.username }}
            </router-link>
          </td>
          <td scope="row">
            <router-link :to="{ name: 'ProjectDetails', params: { id: survey.id } }"
                         style="text-decoration: none; color: black">
              {{ survey.publication_date }}
            </router-link>
          </td>
          <td scope="row">
            <router-link :to="{ name: 'ProjectDetails', params: { id: survey.id } }"
                         style="text-decoration: none; color: black">
              {{ survey.closing_date }}
            </router-link>
          </td>
          <td scope="row">
            <router-link :to="{ name: 'ProjectDetails', params: { id: survey.id } }"
                         style="text-decoration: none; color: black">
              <div v-if="survey.is_active === true">
                <p style="color: #42b983">Открыт</p>
              </div>
              <div v-else>
                <p class="text-danger">Закрыт</p>
              </div>
            </router-link>
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
  name: 'Main',
  data() {
    return {
      survey_list: {},
    };
  },
  methods: {
    getSurveyList() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      axios.get(`${BASE_API_URL}/projects/`, config)
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.getSurveyList();
            }
          }
        })
        .then((response) => {
          this.survey_list = response.data;
        });
    },
  },
  mounted() {
    const isLogIn = this.$store.getters.getIsLoggedIn;
    if (isLogIn !== true) {
      console.log('не авторизован');
      this.$store.dispatch('logout');
      router.push({ path: '/login', query: { text: 'true' } });
    }
    this.getSurveyList();
  },
};
</script>

<style scoped>

</style>
