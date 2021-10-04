<template>
  <div class="d-flex flex-row justify-content-between mb-3">
    <h3>Просмотр вопроса</h3>
    <router-link to="/admin-area/questions">Вернуться к списку вопросов -> </router-link>
  </div>

  <div class="d-flex flex-column align-content-start">
    <div class="mb-5">
      <div class="d-flex flex-column align-items-start mb-3">
        <h4 class="mb-2">{{ title }}</h4>
        <small class="mb-1">{{ help_desc}}</small>
        <small class="mb-3 text-danger">{{ type_display}}</small>
      </div>
      <div>
        <div v-if="type ==='single'">
          <form>
            <div class="mb-2 d-flex flex-row"
                 v-for="answer in answerOption"
                 :key="answer.value">
              <div>
                <input class="mr-2" type="radio" :id="answer.value"
                       name="contact" :value="answer.value">
                <label :for="answer.value" class="text-dark">
                  {{ answer.text }} (Значение - {{answer.value}}
                </label>
              </div>
            </div>
          </form>
        </div>
        <div v-else>
          <form>
            <div class="mb-2 d-flex flex-row"
                 v-for="answer in answerOption"
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
</template>

<script>
import axios from 'axios';
import router from '../../router';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'QuestionsDetails',
  data() {
    return {
      title: '',
      type: '',
      help_desc: '',
      answerOption: [],
      type_display: '',
      jwt: null,
      getConfig: {},
    };
  },
  methods: {
    getQuestionData() {
      axios.get(`${BASE_API_URL}/questions/${this.$route.params.id}/`, this.getConfig)
        .then((response) => {
          this.title = response.data.title;
          this.type = response.data.type;
          this.help_desc = response.data.help_desc;
          this.answerOption = response.data.answer_option;
          this.type_display = response.data.type_display;
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
              this.getQuestionData();
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
    this.jwt = localStorage.getItem('jwt_token');
    this.getConfig = {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    };
    this.getQuestionData();
  },
};
</script>

<style scoped>

</style>
