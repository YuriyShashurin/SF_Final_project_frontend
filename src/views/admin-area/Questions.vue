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
import router from '../../router';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'Questions',
  data() {
    return {
      questionsList: [],
    };
  },
  methods: {
    getQuestionsData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getjwtAccess}`,
        },
      };
      axios.get(`${BASE_API_URL}/questions/`, config)
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              console.log('refreshToken');
              this.getQuestionsData();
            }
          }
        })
        .then((response) => {
          this.questionsList = response.data;
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
    this.getQuestionsData();
  },
};
</script>

<style scoped>

</style>
