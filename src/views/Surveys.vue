<template>
  <div class="card">
    <h4 class="card-header text-white">
      Доступные опросы
    </h4>
    <div
         v-for="survey in survey_list"
         :key="survey.id">
      <div class="card-body survey_card"
        v-if="survey.publication_date <= currentDate() && survey.is_active === true">
        <h5 class="card-title"> {{survey.id}} - Новый опрос: {{survey.title}}</h5>
        <p class="card-text">{{survey.description}}</p>
        <router-link :to="{ name: 'SelectedSurvey', params: { id: survey.id } }"
                     class="btn btn-primary">
          Начать опрос
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'Surveys',
  data() {
    return {
      survey_list: {},
      userId: null,
      current: null,
      completedProjects: [],
    };
  },
  methods: {
    currentDate() {
      const current = new Date();
      let day = current.getDate();
      let month = current.getMonth() + 1;
      if (month < 10) {
        month = `0${month}`;
      }
      if (day < 10) {
        day = `0${day}`;
      }
      const date = `${current.getFullYear()}-${month}-${day}`;
      return date;
    },
    getSurveyList() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      axios.get(`${BASE_API_URL}/projects/?available=true&user_id=${this.userId}`, config).then((response) => {
        this.survey_list = response.data;
      }).catch((e) => {
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
      });
    },
  },
  created() {
    const isLogIn = this.$store.getters.getIsLoggedIn;
    if (isLogIn !== true) {
      console.log('не авторизован');
      this.$store.dispatch('logout');
      router.push({ path: '/login', query: { text: 'true' } });
    }
    this.userId = this.$store.getters.getUserId;
    this.getSurveyList();
  },
};
</script>

<style scoped>
  .survey_card {
    border-bottom: solid 1px #ED7D31;
    padding: 1em 0em 1em 1em;
  }
  .card-header {
    background-color: #ED7D31;
  }
</style>
