<template>
  <h4 class="mb-5">{{projectName}}</h4>
  <div class="d-flex flex-column align-content-start">
    <h5 class="text-danger">{{ error_text }}</h5>
    <div v-for="question in limitedQuestions" :key="question.id" class="mb-5">
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
                <input class="mr-2" type="radio" :id="answer.value"
                       name="contact" :value="answer.value" v-model="radioAnswer">
                <label :for="answer.value" class="text-dark">{{ answer.text }}</label>
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
                       name="contact" :value="answer.id" v-model="checkboxAnswers">
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

const BASE_API_URL = 'http://localhost:8080/api';

export default {
  name: 'Poll',
  props: ['id'],
  created() {
    this.userId = this.$store.getters.getUserId;
  },
  computed: {
    limitedQuestions() {
      return this.surveyData.slice(this.startNumber, this.limitNumber);
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
    };
  },
  methods: {
    getSurveyData() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.get(`${BASE_API_URL}/projects/${this.$route.params.id}/`, config).then((response) => {
        this.surveyData = response.data.question;
        console.log(this.surveyData);
        this.projectName = response.data.title;
        this.maxNumber = this.surveyData.length;
        this.completeCode = response.data.complete_code;
        this.surveyId = response.data.id;
      });
    },
    sendAnswerData(questionId, answerId) {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'X-CSRFToken': this.$cookies.get('csrftoken'),
        },
      };

      const answerData = {
        answer: answerId,
        project: this.surveyId,
        user_id: this.userId,
        question: questionId,
      };

      const surveyStatus = `${this.surveyId}_${this.userId}`;

      const respondentsAnswerData = {
        survey_status: surveyStatus,
        user_answers: answerData,
      };
      axios.post(`${BASE_API_URL}/answers_in_project/`, respondentsAnswerData, config)
        .then((response) => {
          console.log(response);
        });
    },
    sendMultipleAnswerData(questionId, answerId) {
      // eslint-disable-next-line no-restricted-syntax,no-unused-vars
      for (const [key, value] of Object.entries(answerId)) {
        this.sendAnswerData(questionId, value);
      }
    },
    addLastQuestion(startNumber) {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      const apiId = `${this.surveyId}_${this.userId}`;
      this.projectStatus.last_question = startNumber;

      axios.put(`${BASE_API_URL}/project_status/${apiId}/`, this.projectStatus, config)
        .then((response) => {
          console.log('setquetion', response);
        });
    },
    getAnswerData(questionId, answerId, questionType) {
      console.log(questionId, answerId, questionType);
      if ((answerId === null && questionType === 'single') || (this.checkboxAnswers.length === 0 && questionType === 'multiple')) {
        this.error_text = 'Ответ не дан';
      } else {
        this.startNumber += 1;
        this.limitNumber += 1;
        this.radioAnswer = null;
        this.checkboxAnswers = [];
        this.error_text = '';
        if (questionType === 'single') {
          this.sendAnswerData(questionId, answerId);
        } else {
          this.sendMultipleAnswerData(questionId, answerId);
        }
        this.addLastQuestion(this.startNumber);
        if (this.startNumber === this.maxNumber) {
          this.startNumber = 0;
          this.limitNumber = 1;
          this.maxNumber = null;
          this.surveyId = '';
          router.push({ name: 'SuccessPoll', query: { q: this.completeCode, resp: this.userId } });
        }
      }
    },
    checkSurveyStatus() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'X-CSRFToken': this.$cookies.get('csrftoken'),
        },
      };
      const userID = this.userId;
      const projectID = this.$route.params.id;
      const apiId = `${projectID}_${userID}`;

      axios.get(`${BASE_API_URL}/project_status/${apiId}/`, config)
        .then((response) => {
          if (response.data.status === 'Completed') {
            router.push({ name: 'YetComplete' });
          } else {
            console.log('Status уже присутствует');
            this.projectStatus = response.data;
            this.startNumber = this.projectStatus.last_question;
            this.limitNumber = this.startNumber + 1;
          }
        })
        .catch((e) => {
          console.log('status_code', e.response.status);
          if (e.response.status === 404) {
            const requestData = {
              id: apiId,
              project: projectID,
              user_id: userID,
              status: 'Incomplete',
              answers: [],
            };
            axios.post(`${BASE_API_URL}/project_status/`, requestData, config)
              .then((response) => {
                this.projectStatus = response.data;
              });
          }
        });
    },
  },
  mounted() {
    this.checkSurveyStatus();
    this.getSurveyData();
  },
};
</script>

<style scoped>

</style>
