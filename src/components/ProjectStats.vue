<template>
  <div class="container">
    <div class="d-flex flex-column mb-3 align-items-start">
      <h3 class="mb-4">Статистика проекта № {{id}}</h3>
      <div class="mb-4 d-flex flex-column align-items-start">
        <p>Всего завершенных интервью: {{ completed }} </p>
        <p>Всего незавершенных интервью: {{ incompleted }}</p>
        <p>Количество отликов: {{ response }}</p>
      </div>
      <h3 class="mb-4">Ответы респондентов </h3>
      <div class="d-flex flex-column container">
        <a :href="href" class="col-6">
          <button class="btn btn-primary">
            Выгрузить в Excel (Завершенные интервью)
          </button>
        </a>
        <div>
          <table class="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">ID Пользователя</th>
                <th scope="col">Статус</th>
                <th scope="col">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="instance in projectStatusData"
                  :key="instance.id">
                <th scope="col">{{instance.user_id}}</th>
                <td v-if="instance.status === 'Complete'" scope="col">Завершено</td>
                <td v-else scope="col">В процессе</td>
                <td scope="col">
                  <div class="d-flex flex-column align-content-center
                  justify-content-around
                  d-grid gap-2 col-8 mx-auto">
                    <a :href="defaultHref + id + '/' + instance.user_id" class="mb-2">
                      <button class="btn btn-primary btn-sm" style="width: 100%">
                          Просмотр ответов
                      </button>
                    </a>
                    <button class="btn btn-danger btn-sm"
                            v-on:click="deleteParticipation(instance.id)">
                        Удалить интервью
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api';

export default {
  name: 'ProjectStats',
  props: {
    id: Number,
  },
  data() {
    return {
      href: '',
      defaultHref: 'http://127.0.0.1:8080/download/project/',
      jwt: null,
      statusData: [],
      projectStatusData: [],
      csrf: null,
      config: null,
      response: 0,
      completed: 0,
      incompleted: 0,
    };
  },
  methods: {
    setStats() {
      this.response = this.projectStatusData.length;
      this.projectStatusData.forEach((element) => {
        if (element.status === 'Complete') {
          this.completed += 1;
        } else {
          this.incompleted += 1;
        }
      });
    },
    getInterviewsData() {
      axios.get(`${BASE_API_URL}/project_status/`, this.config)
        .catch((e) => {
          console.log('error', e);
        })
        .then((response) => {
          this.statusData = response.data;
          this.statusData.forEach((element) => {
            if (Number(this.id) === Number(element.project)) {
              this.projectStatusData.push(element);
            }
          });
          this.setStats();
        });
    },
    deleteParticipation(id) {
      axios.delete(`${BASE_API_URL}/project_status/${id}/`)
        .catch((e) => {
          console.log('error', e);
        });
    },
  },
  mounted() {
    this.href = `http://127.0.0.1:8080/download/project/${this.id}/`;
    this.csrf = this.$cookies.get('csrftoken');
    this.jwt = localStorage.getItem('jwt_token');
    this.config = {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
        'X-CSRFToken': this.csrf,
      },
    };
    this.getInterviewsData();
  },
};
</script>

<style scoped>

</style>
