<template>
  <h3>Статистика прохождения опроса №{{ projectNumber}}</h3>
  <div class="row">
    <div class="col-6">
      <h3 class="mt-4 mb-3">Ваши результаты:</h3>
      <div>
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Время прохождения</th>
            <th scope="col">Баллов получено</th>
            <th scope="col">Результат опроса</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{time}}</td>
            <td>{{projectScore}}</td>
            <td>{{answerScore}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-6">
      <h3 class="mt-4 mb-3">Сравненительная статистика:</h3>
      <ul class="list-group">
        <li class="list-group-item">Вы прошли интервью быстрее, чем
          <span style="color: #ED7D31" class="font-weight-bold">{{ moreTime }}%</span>
          ответивших
        </li>
        <li class="list-group-item">Ваш результат опроса выше, чем у
          <span style="color: #ED7D31" class="font-weight-bold">{{ moreAnswersScore }}%</span>
          ответивших
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';

const BASE_API_URL = `${process.env.VUE_APP_BASE_API_URL}/project_status`;
const BASE_STATS_URL = process.env.VUE_APP_BASE_STATS_URL;

export default {
  name: 'PersonalStats',
  props: {
    userId: Number,
    project: Number,
  },
  data() {
    return {
      projectNumber: null,
      respStatus: null,
      totalCompletes: 0,
      time: 0,
      moreTime: 0,
      moreAnswersScore: 0,
      getConfig: null,
      projectScore: null,
      answerScore: null,
    };
  },
  methods: {
    getOthersComplete() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getjwtAccess}`,
        },
      };
      axios.get(`${BASE_STATS_URL}/time_stats/${this.projectNumber}/${this.time}`, config)
        .then((response) => {
          this.moreTime = response.data.more_answers_time_persent;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.getOthersComplete();
            }
          }
        });
      axios.get(`${BASE_STATS_URL}/score_stats/${this.projectNumber}/${this.answerScore}`, config)
        .then((response) => {
          this.moreAnswersScore = response.data.more_answers_score_persent;
          console.log(this.moreAnswersScore);
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.getOthersComplete();
            }
          }
        });
    },
    getCurrentStatus() {
      this.projectNumber = this.project;
      const apiId = `${this.projectNumber}_${this.userId}`;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getjwtAccess}`,
        },
      };
      axios.get(`${BASE_API_URL}/${apiId}/`, config)
        .then((response) => {
          this.respStatus = response.data;
          this.time = this.respStatus.time;
          this.projectScore = this.respStatus.project_score;
          this.answerScore = this.respStatus.answer_score;
          this.getOthersComplete();
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.getCurrentStatus();
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
    this.projectNumber = this.project;
    this.getCurrentStatus();
  },
  updated() {
    if (this.projectNumber !== this.project) {
      this.getCurrentStatus();
    }
  },
};
</script>

<style scoped>

</style>
