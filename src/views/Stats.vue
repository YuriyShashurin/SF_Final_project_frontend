<template>
  <div class="container">
    <h3>Cтатистика по пройденным опросам</h3>
    <div class="row mb-3">
      <div class="mb-4 mt-4 col-6 d-flex flex-column align-items-center">
        <h4 class="mb-3">Количество пройденных опросов</h4>
        <h1 class="font-weight-bold " style="color: #ED7D31">{{ maxNumber }} </h1>
      </div>
      <div class="mb-4 mt-4 col-6 d-flex flex-column align-items-center">
        <h4 class="mb-3">Количество полученных баллов за опросы</h4>
        <h1 class="font-weight-bold " style="color: #ED7D31">{{ totalSurveysScores }}</h1>
      </div>
    </div>
    <div class="col-12 d-flex flex-column align-content-between" style="width: 100%">
      <div>
        <h3 class="mb-1">Статистика за проект</h3>
        <small>Выберите проект</small><br/>
        <small style="color: #ED7D31" class="mb-4 font-weight-bold">
          Показано {{startNumber}}-{{startNumber+10}} из {{limitNumber}} проектов
        </small>
        <div class="d-flex flex-row justify-content-around mb-3 mt-4">
          <div class="d-flex flex-column" v-for="survey in limitedSurveys" :key="survey.id">
            <label class="badge badge-primary pg" style="width: 100%; padding: 10px 30px">
              <input type="radio"
                     class="btn-check"
                     name="options"
                     id="option2"
                     :value="survey.project"
                     v-model="selectedSurvey"
              hidden>
              {{ survey.project}}
            </label>
          </div>
        </div>
        <div CLASS="mt-3 d-flex flex-row justify-content-center">
          <button class="btn btn-success mr-2" @click="back"> &lt; </button>
          <button class="btn btn-success" @click="next"> > </button>
        </div>
      </div>
      <div class="mt-4">
        <personal-stats v-if="selectedSurvey"
                        :userId="userId" :project="selectedSurvey">
        </personal-stats>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PersonalStats from '../components/PersonalStats.vue';
import router from '../router';

const BASE_API_URL = `${process.env.VUE_APP_BASE_API_URL}/project_status`;

export default {
  name: 'Stats',
  components: { PersonalStats },
  data() {
    return {
      completedSurveys: [],
      startNumber: 0,
      limitNumber: 10,
      maxNumber: null,
      jwt: null,
      userId: null,
      getConfig: null,
      selectedSurvey: null,
    };
  },
  computed: {
    totalSurveysScores() {
      let totalScore = 0;
      this.completedSurveys.forEach((key) => {
        totalScore += key.project_score;
      });
      return totalScore;
    },
    limitedSurveys() {
      const surveys = this.completedSurveys.slice(this.startNumber, this.limitNumber)
        .sort(this.sortedList);
      return surveys;
    },
  },
  methods: {
    next() {
      if (this.startNumber + 10 !== this.maxNumber) {
        this.startNumber += 10;
      }
    },
    back() {
      if (this.startNumber !== 0) {
        this.startNumber -= 10;
      }
    },
    sortedList(a, b) {
      if (a.project < b.project) {
        return 1;
      }
      if (a.project > b.project) {
        return -1;
      }
      return 0;
    },
    getCompletedInterviews() {
      const status = 'Complete';
      axios.get(`${BASE_API_URL}?status=${status}&user_id=${this.userId}`, this.getConfig)
        .then((response) => {
          this.completedSurveys = response.data;
          this.maxNumber = this.completedSurveys.length;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.getCompletedInterviews();
            }
          }
        });
    },
  },
  created() {
    const isLogIn = this.$store.getters.getIsLoggedIn;
    console.log(isLogIn);
    if (isLogIn !== true) {
      console.log('не авторизован');
      this.$store.dispatch('logout');
      router.push({ path: '/login', query: { text: 'true' } });
    }
    this.jwt = localStorage.getItem('jwt_token');
    this.userId = this.$store.getters.getUserId;
    this.getConfig = {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    };
    this.getCompletedInterviews();
  },
};
</script>

<style scoped>
.pg {
  cursor: pointer;
}
</style>
