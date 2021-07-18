<template>
  <div class="container d-flex flex-column align-items-start">
    <h3 class="mt-3">Список готовых вопросов</h3>
  </div>
  <div class="d-flex flex-column">
    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Название</th>
        <th scope="col">Тип</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="question in questionsList"
          :key="question.id" style="height: 40px; cursor: pointer;">
        <th scope="row">
          <router-link :to="{ name: 'QuestionDetails', params: { id: question.id } }"
                       style="text-decoration: none; color: black">
            {{question.id}}
          </router-link>
        </th>
        <td scope="row">
          <router-link :to="{ name: 'QuestionDetails', params: { id: question.id } }"
                       style="text-decoration: none; color: black">
            {{question.title}}
          </router-link>
        </td>
        <td scope="row">
          <router-link :to="{ name: 'QuestionDetails', params: { id: question.id } }"
                       style="text-decoration: none; color: black">
            {{ question.type }}
          </router-link>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api';

export default {
  name: 'Questions',
  data() {
    return {
      questionsList: [],
    };
  },
  methods: {
    getQuestionsData() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      axios.get(`${BASE_API_URL}/questions/`, config)
        .catch((e) => {
          console.log('error', e);
        })
        .then((response) => {
          this.questionsList = response.data;
          console.log(this.questionsList);
        });
    },
  },
  mounted() {
    this.getQuestionsData();
  },
};
</script>

<style scoped>

</style>
