<template>
  <div>
    <div class="d-flex flex-row justify-content-between mb-3">
      <h4>Добавление готового вопроса в опрос</h4>
      <router-link :to="{ name: 'ProjectDetails', params: { id: $route.query.ProjectId } }">
        Вернуться на страницу опроса ->
      </router-link>
    </div>
    <small class="text-danger mt-2"> {{accessText}} </small>
    <div>
      <form>
        <select class="form-select" required aria-label="select example" v-model="selectedQuestion">
          <option value="" disabled selected>Выберите вопрос</option>
          <option v-for="question in questionsList"
                  v-bind:value="question"
                  :key="question.id">
            {{ question.id }} - {{ question.title }} -{{ question.type }}
          </option>
        </select>
      </form>
      <div>
        <h4 class="mt-4">Просмотр вопроса</h4>
        <div v-if="selectedQuestion">
          <div class="d-flex flex-column align-content-start">
            <div class="mb-5">
              <div class="d-flex flex-column align-items-start mb-3">
                <h5 class="mb-2">{{ selectedQuestion.title }}</h5>
                <small class="mb-1">{{ selectedQuestion.help_desc}}</small>
                <small class="mb-3 text-danger">{{ selectedQuestion.type_display}}</small>
              </div>
              <div>
                <div v-if="selectedQuestion.type ==='single'">
                  <form>
                    <div class="mb-2 d-flex flex-row"
                         v-for="answer in selectedQuestion.answer_option"
                         :key="answer.value">
                      <div>
                        <input class="mr-2" type="radio" :id="answer.value"
                               name="contact" :value="answer.value">
                        <label :for="answer.value" class="text-dark">
                          {{ answer.text }} (Значение - {{answer.value}})
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
                <div v-else>
                  <form>
                    <div class="mb-2 d-flex flex-row"
                         v-for="answer in selectedQuestion.answer_option"
                         :key="answer.value">
                      <div>
                        <input class="mr-2" type="checkbox" :id="answer.id"
                               name="contact" :value="answer.id">
                        <label :for="answer.id">{{ answer.text }}</label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-row justify-content-start mt-4">
            <label class="mr-3" :for="weight">Установить вес вопроса</label>
            <input class="mr-2" type="number" :id="weight"
                   name="weight" v-model="weight">
          </div>
          <button @click="addQuestionInSurvey" class="btn btn-primary">Добавить вопрос</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../../router';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'AddReadyQuestion',
  data() {
    return {
      selectedQuestion: null,
      questionsList: [],
      csrf: null,
      jwt: null,
      getConfig: {},
      accessText: '',
      weight: null,
      projectId: null,
    };
  },
  methods: {
    getQuestionData() {
      axios.get(`${BASE_API_URL}/questions/`, this.getConfig)
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.getQuestionData();
            }
          }
        })
        .then((response) => {
          this.questionsList = response.data;
        });
    },
    addQuestionInSurvey() {
      const questionId = this.selectedQuestion.id;
      const surveyData = {
        project: this.projectId,
        question: questionId,
        weight: this.weight,
      };
      axios.post(`${BASE_API_URL}/surveys/`, surveyData, this.getConfig)
        .then(() => {
          this.selectedQuestion = null;
          this.weight = null;
          this.accessText = `Вопрос id ${questionId} добавлен в опрос с id ${this.projectId}`;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.addQuestionInSurvey();
            }
          }
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
    this.projectId = this.$route.query.ProjectId;
    this.csrf = this.$cookies.get('csrftoken');
    this.jwt = localStorage.getItem('jwt_token');
    this.getConfig = {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        'X-CSRFToken': this.csrf,
      },
    };
    this.getQuestionData();
  },
};
</script>

<style scoped>

</style>
