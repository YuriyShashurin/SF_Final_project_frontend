<template>
  <h5>Добавление шаблонного вопроса к опросу "{{ projectId}} - {{ projectTitle }}"</h5>
  <div class="row mb-4 mt-5">
    <form class="d-flex flex-column col-4">
      <h5 class="mb-3">Параметры вопроса</h5>
      <div>
        <label for="title" class="form-label">Название вопроса</label>
        <input type="text" v-model="title" class="form-control" id="title">
      </div>
      <div>
        <label for="helpDesc" class="form-label">
          Подсказка по заполнению опроса (опционально)
        </label>
        <input type="text" v-model="helpDesc" class="form-control" id="helpDesc">
      </div>
      <div class="d-flex flex-row mt-2">
        <label for="type" class="form-label mr-5 text-sm-left" style="width: 40%">
          Тип вопроса
        </label>
        <select class="form-select form-select-sm"
                aria-label=".form-select-sm example"
                v-model="type"
                name="type"
                id="type"
                form="type">
          <option value="single">Один ответ</option>
          <option value="multiple">Возможно несколько ответов</option>
        </select>
      </div>
    </form>
    <div class="col-4">
      <h5 class="mb-4">Добавление вариантов ответов</h5>
      <form class="d-flex flex-column">
        <div>
          <label for="title" class="newText">Название вопроса</label>
          <input type="text" v-model="newText" class="form-control" id="newText">
        </div>
        <div>
          <label for="title" class="newValue">Значение (вес)</label>
          <input type="number" v-model="newValue" class="form-control" id="newValue">
        </div>
        <button @click="addAnswer" class="btn btn-sm btn-secondary mt-3">Добавить вариант</button>
      </form>
    </div>
    <div class="col-4">
      <h5 class="mb-3">Просмотр добавленных вариантов</h5>
      <div v-for="answer in addedAnswers" :key="answer.value">
        <p>{{ answer.value}} - {{ answer.text }}</p>
      </div>
    </div>
  </div>
  <button class="btn btn-primary" @click="createQuestion">Создать вопрос</button>
</template>

<script>
import axios from 'axios';
import router from '../../router';

const BASE_API_URL = 'http://localhost:8080/api';

export default {
  name: 'AddQuestion',

  data() {
    return {
      projectId: null,
      projectTitle: '',
      questionsList: [],
      title: '',
      helpDesc: '',
      type: '',
      addedAnswers: [],
      newText: '',
      newValue: null,
      questionId: null,
      type_display: '',
    };
  },
  methods: {
    getQuestionsAnwersData() {
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
        });
    },
    addQuestionInProject(questionId, config) {
      const surveyData = {
        project: this.projectId,
        question: this.questionId,
        weight: 1,
      };
      axios.post(`${BASE_API_URL}/surveys/`, surveyData, config)
        .then(() => {
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    createQuestion() {
      const csrf = this.$cookies.get('csrftoken');
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'X-CSRFToken': csrf,
        },
      };
      if (this.type === 'single') {
        this.type_display = 'Один ответ';
      } else {
        this.type_display = 'Возможно несколько ответов';
      }
      const questionData = {
        title: this.title,
        type: this.type,
        help_desc: this.helpDesc,
        answer_option: this.addedAnswers,
      };
      console.log(questionData);
      axios.post(`${BASE_API_URL}/questions/`, questionData, config)
        .then((response) => {
          this.questionId = response.data.id;
          this.addQuestionInProject(this.questionId, config);
          router.push({ name: 'ProjectDetails', params: { id: this.projectId } });
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    addAnswer() {
      const csrf = this.$cookies.get('csrftoken');
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'X-CSRFToken': csrf,
        },
      };
      const answerData = {
        text: this.newText,
        value: this.newValue,
      };
      axios.post(`${BASE_API_URL}/answers/`, answerData, config)
        .then((response) => {
          const anwerdata = {
            id: response.data.id,
            text: response.data.text,
            value: response.data.value,
          };
          this.addedAnswers.push(anwerdata);
          this.newText = '';
          this.newValue = '';
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
  },
  mounted() {
    this.projectId = this.$route.query.ProjectId;
    this.projectTitle = this.$route.query.ProjectTitle;
    this.getQuestionsAnwersData();
  },
};
</script>

<style scoped>

</style>
