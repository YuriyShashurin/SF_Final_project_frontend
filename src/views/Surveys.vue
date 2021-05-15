<template>
  <div>Surveys</div>
  <ul id="example-1">
    <li v-for="survey in survey_list" :key="survey.id">
      {{ survey.title }}
      {{ survey.description }}
    </li>
  </ul>
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
  mounted() {
    this.getSurveyList();
  },
};
</script>

<style scoped>

</style>
