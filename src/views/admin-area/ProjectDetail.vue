<template>
  <div class="container">
    <form class="d-flex flex-row">
      <div class="mt-2 mr-5" style="width: 50%">
        <label for="title" class="form-label">Название проекта</label>
        <input type="text" v-model="title" class="form-control" id="title">
        <label for="description" class="form-label mt-3">Описание проекта</label>
        <input style="height: 190px" type="text"
               v-model="description"
               class="form-control"
               id="description">
      </div>
      <div class="d-flex flex-column mt-4">
        <div class="d-flex flex-row">
          <label for="publicationDate" class="form-label mr-5 text-sm-left" style="width: 40%">
            Дата начала
          </label>
          <input type="date" v-model="publicationDate" class="form-control" id="publicationDate">
        </div>
        <div class="d-flex flex-row mt-2">
          <label for="closingDate" class="form-label mr-5 text-sm-left" style="width: 40%">
            Дата окончания
          </label>
          <input type="date"
                 v-model="closingDate"
                 class="form-control"
                 id="closingDate">
        </div>
        <div class="d-flex flex-row mt-4">
          <p class="mr-1 text-sm-left" style="width: 40%">Код завершения</p>
          <small>{{ completeCode }}</small>
        </div>
        <div class="d-flex flex-row mt-2">
          <label for="lifeTimeValue" class="form-label mr-5 text-sm-left" style="width: 40%">
            Время прохождения опроса
          </label>
          <input type="number" v-model="lifeTimeValue" class="form-control" id="lifeTimeValue">
        </div>
        <div class="d-flex flex-row mt-2">
          <label for="isActive" class="form-label mr-5 text-sm-left" style="width: 40%">
            Статус проекта
          </label>
          <select class="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                  v-model="isActive"
                  name="isActive"
                  id="isActive"
                  form="isActive"
                  style="width: 100%; height: 100%">
            <option value="true">Открыт</option>
            <option value="false">Закрыт</option>
          </select>
        </div>
      </div>
    </form>
    <div class="d-flex flex-row justify-content-around">
      <button v-on:click="saveChanges" class="btn btn-info mt-4">Сохранить изменения</button>
    </div>
    <div class="d-flex flex-row justify-content-start mt-4">
      <button v-if="showQuestions === false"
              @click="showQuestionsDiv(true)"
              class="btn btn-secondary mr-3">
        Показать список вопросов
      </button>
      <button v-else
              @click="showQuestionsDiv(false)"
              class="btn btn-danger mr-3">
        Скрыть список вопросов
      </button>
      <button v-if="showStats === false"
              @click="showStatsDiv(true)"
              class="btn btn-secondary mr-3">
        Показать статистику проекта
      </button>
      <button v-else
              @click="showStatsDiv(false)"
              class="btn btn-danger mr-3">
        Скрыть статистику проекта
      </button>
      <router-link class="mr-3"
        :to="{ name: 'SelectedSurvey', params: { id: projectId }, query: { usetest: true} }">
        <button v-on:click="saveChanges" class="btn btn-secondary">Пройти тестовую анкету</button>
      </router-link>
    </div>
    <project-stats v-bind:id="projectId" v-if="showStats === true" class="mt-5"></project-stats>
    <div v-if="showQuestions === true">
      <div class="d-flex flex-row mt-5 justify-content-between mb-3">
        <h4>Список вопросов в опросе</h4>
        <div class="d-flex flex-row">
          <router-link :to="{ name: 'AddQuestion', query: { ProjectId: id, ProjectTitle: title } }">
            <button type="button" class="btn btn-secondary btn-sm">
              Добавить новый вопрос
            </button>
          </router-link>
          <router-link
            :to="{ name: 'AddReadyQuestion', query: { ProjectId: id, ProjectTitle: title } }">
            <button type="button" class="btn btn-secondary btn-sm ml-4">
              Добавить шаблонный вопрос
            </button>
          </router-link>
        </div>
      </div>
      <table class="table table-hover">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Название вопроса</th>
          <th scope="col">Тип вопроса</th>
          <th scope="col">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="question in questions" :key="question.id">
          <th scope="row"> {{question.id }}</th>
          <td scope="row"> {{question.title}}</td>
          <td scope="row"> {{question.type}}</td>
          <td scope="row">
            <div class="d-flex flex-row justify-content-around">
              <router-link
                :to="{ name: 'QuestionDetails', params: { id: question.id} }">
                <button type="button"
                        class="btn btn-info btn-sm">
                  Редактировать вопрос
                </button>
              </router-link>
              <button type="button"
                      class="btn btn-danger btn-sm"
                      v-on:click="deleteQuestionInProject(question.id)">
                Удалить вопрос из опроса
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../../router';
import ProjectStats from '../../components/ProjectStats.vue';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'ProjectDetail',
  components: { ProjectStats },
  data() {
    return {
      id: null,
      owner: '',
      title: '',
      description: '',
      completeCode: '',
      publicationDate: null,
      closingDate: null,
      lifeTimeValue: null,
      isActive: false,
      questions: [],
      answersOfQuestion: [],
      projectId: null,
      showQuestions: true,
      showStats: false,
      userId: null,
    };
  },
  methods: {
    showQuestionsDiv(boolen) {
      this.showStats = false;
      this.showQuestions = boolen;
    },
    showStatsDiv(boolen) {
      this.showQuestions = false;
      this.showStats = boolen;
    },
    deleteQuestionInProject(questionId) {
      const projectID = this.projectId;
      const question = questionId;
      const Id = `${projectID}_${question}`;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getjwtAccess}`,
        },
      };
      axios.delete(`${BASE_API_URL}/surveys/${Id}/`, config)
        .then(() => {
          this.getProjectData();
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.deleteQuestionInProject(questionId);
            }
          }
        });
    },
    getProjectData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getjwtAccess}`,
        },
      };
      axios.get(`${BASE_API_URL}/projects/${this.$route.params.id}/`, config)
        .then((response) => {
          this.id = response.data.id;
          this.owner = response.data.owner;
          this.title = response.data.title;
          this.description = response.data.description;
          this.completeCode = response.data.complete_code;
          this.publicationDate = response.data.publication_date;
          this.closingDate = response.data.closing_date;
          this.lifeTimeValue = response.data.life_time_value;
          this.isActive = response.data.is_active;
          this.questions = response.data.question;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.getProjectData();
            }
          }
        });
    },
    saveChanges() {
      this.userId = this.$store.getters.getUserId;
      const changedProjectData = {
        id: this.id,
        owner_id: this.userId,
        owner: this.owner,
        title: this.title,
        description: this.description,
        complete_code: this.completeCode,
        publication_date: this.publicationDate,
        closing_date: this.closingDate,
        life_time_value: this.lifeTimeValue,
        is_active: this.isActive,
        question: this.question,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getjwtAccess}`,
          'X-CSRFToken': this.$cookies.get('csrftoken'),
        },
      };
      axios.put(`${BASE_API_URL}/projects/${this.$route.params.id}/`, changedProjectData, config)
        .then(() => {
          router.push('/admin-area/main');
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.saveChanges();
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
    this.projectId = this.$route.params.id;
    this.getProjectData();
  },
};
</script>

<style scoped>

</style>
