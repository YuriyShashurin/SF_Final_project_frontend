<template>
  <div class="card">
    <h4 class="card-header text-white">
      Доступные опросы
    </h4>
    <div class="card-body survey_card"
         v-for="survey in survey_list"
         :key="survey.id">
      <h5 class="card-title">Новый опрос: {{survey.title}}</h5>
      <p class="card-text">{{survey.description}}</p>
      <router-link :to="{ name: 'SelectedSurvey', params: { id: survey.id }}"
                   class="btn btn-primary">
        Начать опрос
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api';

export default {
  name: 'Surveys',
  data() {
    return {
      survey_list: {},
    };
  },
  methods: {
    getSurveyList() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      axios.get(`${BASE_API_URL}/projects/`, config).then((response) => {
        this.survey_list = response.data;
        console.log(response.data);
        console.log('data', this.survey_list);
      });
    },
  },
  created() {
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
