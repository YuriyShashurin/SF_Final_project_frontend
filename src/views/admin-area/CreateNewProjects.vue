<template>
  <div class="container">
    <h6 class="mb-3">Создание проекта</h6>
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
    <button v-on:click="createProject" class="btn btn-info mt-4">Создать проект</button>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../../router';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'CreateNewProjects',
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
      projectId: null,
      userObject: {},
    };
  },
  methods: {
    getUserObject() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getjwtAccess}`,
        },
      };
      const userId = this.$store.getters.getUserId;
      axios.get(`${BASE_API_URL}/users/${userId}`, config)
        .then((response) => {
          this.userObject = response.data;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.getUserObject();
            }
          }
        });
    },
    createProject() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getjwtAccess}`,
        },
      };
      const NewProjectData = {
        owner: this.userObject,
        owner_id: this.userObject.id,
        title: this.title,
        description: this.description,
        publication_date: this.publicationDate,
        closing_date: this.closingDate,
        life_time_value: this.lifeTimeValue,
        is_active: this.isActive,
      };

      axios.post(`${BASE_API_URL}/projects/`, NewProjectData, config)
        .then((response) => {
          this.projectId = response.data.id;
          router.push({ name: 'ProjectDetails', params: { id: this.projectId } });
        })
        .catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              this.createProject();
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
    this.getUserObject();
  },
};
</script>

<style scoped>

</style>
