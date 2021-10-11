<template>
  <h4 class="mb-2">{{projectName}}</h4>
  <h5 class="mb-3 text-danger">{{ testtext }}</h5>
  <div class="progress mb-4">
    <div class="progress-bar"
         role="progressbar"
         :style="'width: ' + setProgressPercent()+ '%;'"
         :aria-valuenow="startNumber"
         aria-valuemin="0"
         :aria-valuemax="maxNumber">
      {{progressBar}}%
    </div>
  </div>
  <div>Вам необходимо завершить интервью через <span class="text-danger">{{timer}}</span></div>
  <div class="d-flex flex-column align-content-start">
    <h5 class="text-danger">{{ error_text }}</h5>
    <div v-for="question in limitedQuestions" :key="question.id" class="mb-5">
      <div class="mt-3 d-flex flex-row justify-content-start mb-3">
        <div class="badge bg-info text-wrap text-white mr-3" style="width: 6rem;">
          <span> {{ showWeight }}</span> балла за ответ
        </div>
        <div class="badge bg-info text-wrap text-white mb-3" style="width: 6rem;">
          <span> {{ totalWeight }}</span> баллов получено
        </div>
        <div class="badge bg-info text-wrap text-white mb-3" style="width: 6rem;">
          <span> {{ answerScore }}</span> баллов получено
        </div>
      </div>
      <div class="d-flex flex-column align-items-start mb-3">
        <h4 class="mb-2">{{ question.title}}</h4>
        <small class="mb-1">{{ question.help_desc}}</small>
        <small class="mb-3 text-danger">{{ question.type_display}}</small>
      </div>
      <div>
        <div v-if="question.type ==='single'">
          <form>
            <div class="mb-2 d-flex flex-row"
                 v-for="answer in question['answer_option']"
                 :key="answer.value">
              <div>
                <input class="mr-2" type="radio" :id="answer.id"
                       name="contact" :value="answer" v-model="radioAnswer">
                <label :for="answer.id" class="text-dark">{{ answer.text }}</label>
              </div>
            </div>
            <button @click="getAnswerData(question.id, radioAnswer, question.type)"
                    class="btn btn-info">
              Далее
            </button>
          </form>
        </div>
        <div v-else>
          <form>
            <div class="mb-2 d-flex flex-row"
                 v-for="answer in question['answer_option']"
                 :key="answer.id">
              <div>
                <input class="mr-2" type="checkbox" :id="answer.id"
                       name="contact" :value="answer" v-model="checkboxAnswers">
                <label :for="answer.id">{{ answer.text }}</label>
              </div>
            </div>
            <button @click="getAnswerData(question.id, checkboxAnswers, question.type)"
                    class="btn btn-info">
              Далее
            </button>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'Poll',
  props: ['id'],
  computed: {
    limitedQuestions() {
      const currentQuestion = this.surveyData.slice(this.startNumber, this.limitNumber);
      return currentQuestion;
    },
    showWeight() {
      this.setQuestionWeight();
      return this.weight;
    },
  },
  data() {
    return {
      projectName: '',
      surveyData: [],
      radioAnswer: null,
      checkboxAnswers: [],
      startNumber: 0,
      limitNumber: 1,
      maxNumber: null,
      error_text: '',
      completeCode: '',
      surveyId: null,
      userId: null,
      projectStatus: [],
      usetest: false,
      testtext: '',
      lifeTime: null,
      currentLifeTime: null,
      timer: null,
      timerStatus: false,
      progressBar: null,
      currentQuestionId: null,
      weight: null,
      totalWeight: 0,
      jwt: null,
      getConfig: null,
      postConfig: null,
      answerScore: 0,
      time: 0,
      timerRun: true,
    };
  },
  methods: {
    setQuestionWeight() {
      const questionId = this.surveyData[this.startNumber];
      axios.get(`${BASE_API_URL}/surveys/?question=${questionId.id}&project=${this.$route.params.id}`, this.getConfig)
        .then((response) => {
          const data = response.data[0];
          this.weight = data.weight;
        }).catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.setQuestionWeight();
            }
          }
        });
    },
    setTimer() {
      if (this.lifeTime > 0) {
        if (this.timerStatus) {
          setTimeout(() => {
            this.lifeTime -= 1;
            this.time += 1;
            this.timer = new Date(this.lifeTime * 1000).toISOString().substr(11, 8);
            this.setTimer();
          }, 1000);
        }
      } else {
        router.push({ name: 'SuccessPoll', query: { q: this.completeCode, resp: this.userId, timeout: 'timeout' } });
      }
    },
    setProgressPercent() {
      const progress = this.startNumber / this.maxNumber;
      let percent = progress * 100;
      percent = percent.toFixed(1);
      this.progressBar = percent;
      return percent;
    },
    getSurveyData() {
      axios.get(`${BASE_API_URL}/projects/${this.$route.params.id}/`, this.getConfig).then((response) => {
        this.surveyData = response.data.question;
        this.projectName = response.data.title;
        this.maxNumber = this.surveyData.length;
        this.completeCode = response.data.complete_code;
        this.surveyId = response.data.id;
        if (this.currentLifeTime) {
          this.lifeTime = this.currentLifeTime;
        } else {
          this.lifeTime = response.data.life_time_value;
        }
        this.timerStatus = true;
        this.setTimer();
      }).catch((e) => {
        if (e.response.status === 401) {
          const tokenRefresh = localStorage.getItem('jwt_token_refresh');
          this.$store.dispatch('refreshToken', tokenRefresh);
          const isLogged = this.$store.getters.getIsLoggedIn;
          if (isLogged !== true) {
            router.push({ path: '/login', query: { text: 'true' } });
          } else {
            this.getSurveyData();
          }
        }
      });
    },
    sendAnswerData(questionId, answerId, value) {
      const answerData = {
        answer: answerId,
        project: this.surveyId,
        user_id: this.userId,
        question: questionId,
        time: this.time,
      };
      const surveyStatus = `${this.surveyId}_${this.userId}`;
      const respondentsAnswerData = {
        survey_status: surveyStatus,
        user_answers: answerData,
      };
      axios.post(`${BASE_API_URL}/answers_in_project/`, respondentsAnswerData, this.postConfig)
        .then(() => {
          this.answerScore += value;
        }).catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.sendAnswerData(questionId, answerId, value);
            }
          }
        });
    },
    sendMultipleAnswerData(questionId, answerId) {
      // eslint-disable-next-line no-restricted-syntax,no-unused-vars
      for (const key of Object.entries(answerId)) {
        this.sendAnswerData(questionId, key[1].id, key[1].value);
      }
    },
    addLastQuestionAndScore(startNumber) {
      console.log('addLastQuestion');
      const apiId = `${this.surveyId}_${this.userId}`;
      this.projectStatus.last_question = startNumber;
      this.projectStatus.project_score = this.totalWeight;
      this.projectStatus.answer_score = this.answerScore;
      this.projectStatus.time = this.time;
      this.projectStatus.remaining_time = this.lifeTime;
      axios.put(`${BASE_API_URL}/project_status/${apiId}/`, this.projectStatus, this.getConfig)
        .then((response) => {
          console.log('setquetion', response);
        }).catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.addLastQuestionAndScore(startNumber);
            }
          }
        });
    },
    getAnswerData(questionId, answerId, questionType) {
      console.log(questionId, answerId, questionType);
      if ((answerId === null && questionType === 'single') || (this.checkboxAnswers.length === 0 && questionType === 'multiple')) {
        this.error_text = 'Ответ не дан';
      } else {
        this.startNumber += 1;
        this.limitNumber += 1;
        this.totalWeight += this.weight;
        this.radioAnswer = null;
        this.checkboxAnswers = [];
        this.error_text = '';
        if (this.usetest === false) {
          if (questionType === 'single') {
            this.sendAnswerData(questionId, answerId.id, answerId.value);
          } else {
            this.sendMultipleAnswerData(questionId, answerId);
          }
          this.addLastQuestionAndScore(this.startNumber);
        }
        if (this.startNumber === this.maxNumber) {
          this.startNumber = 0;
          this.limitNumber = 1;
          this.maxNumber = null;
          this.timerStatus = false;
          this.surveyId = '';
          if (this.usetest === false) {
            router.push({ name: 'SuccessPoll', query: { q: this.completeCode, resp: this.userId, score: this.totalWeight } });
          } else {
            router.push({ name: 'ProjectDetails', params: { id: this.$route.params.id } });
          }
        }
      }
    },
    checkSurveyStatus() {
      const userID = this.userId;
      const projectID = this.$route.params.id;
      const apiId = `${projectID}_${userID}`;
      axios.get(`${BASE_API_URL}/project_status/${apiId}/`, this.getConfig)
        .then((response) => {
          console.log(response.data);
          if (response.data.status === 'Complete') {
            console.log('Completed');
            router.push({ name: 'YetComplete' });
          } else {
            this.projectStatus = response.data;
            this.startNumber = this.projectStatus.last_question;
            this.limitNumber = this.startNumber + 1;
            this.totalWeight = response.data.project_score;
            this.answerScore = response.data.answer_score;
            this.time = response.data.time;
            this.currentLifeTime = response.data.remaining_time;
          }
        })
        .catch((e) => {
          if (e.response.status === 404) {
            const requestData = {
              id: apiId,
              project: projectID,
              user_id: userID,
              status: 'Incomplete',
              answers: [],
              project_score: 0,
              answer_score: 0,
            };
            axios.post(`${BASE_API_URL}/project_status/`, requestData, this.postConfig)
              .then((response) => {
                console.log('Создаем статус участия');
                this.projectStatus = response.data;
              }).catch((er) => {
                if (er.response.status === 401) {
                  this.$store.dispatch('refreshToken');
                  const isLogged = this.$store.getters.getIsLoggedIn;
                  if (isLogged !== true) {
                    router.push({ path: '/login', query: { text: 'true' } });
                  } else {
                    this.checkSurveyStatus();
                  }
                }
              });
          }
        });
    },
  },
  created() {
    const isLogged = this.$store.getters.getIsLoggedIn;
    if (isLogged !== true) {
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
    this.postConfig = {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        'X-CSRFToken': this.$cookies.get('csrftoken'),
      },
    };
    this.userId = this.$store.getters.getUserId;
    if (this.$route.query.usetest) {
      this.usetest = true;
    }
    if (this.usetest === true) {
      this.testtext = 'Внимание. Вы проходите тестовую версию анкеты. Результаты не сохраняются';
    } else {
      this.checkSurveyStatus();
    }
    this.getSurveyData();
  },
  unmounted() {
    this.timerStatus = false;
  },
};
</script>

<style scoped>
</style>
