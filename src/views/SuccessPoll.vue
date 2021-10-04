<template>
  <div class="container">
    <result-data :msg='infoText'></result-data>
    <router-link to="/user_area/surveys">Проверьте другие доступные опросы</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import ResultData from '../components/ResultData.vue';
import router from '../router';

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

export default {
  name: 'SuccessPoll',
  components: { ResultData },
  data() {
    return {
      infoText: '',
      completeCode: '',
    };
  },
  methods: {
    deleteComplete(config) {
      const projectID = this.$route.params.id;
      const userID = this.$route.query.resp;
      const Id = `${projectID}_${userID}`;
      axios.delete(`${BASE_API_URL}/project_status/${Id}/`, config)
        .then((res) => {
          console.log(res);
        });
    },
    setComleteStatus() {
      this.infoText = `Поздравляем. Вы успешно завершили данное интервью. Ваш результат ${this.$route.query.score} баллов`;
      const projectID = this.$route.params.id;
      const userID = this.$route.query.resp;
      const apiId = `${projectID}_${userID}`;

      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      const putData = {
        id: apiId,
        project: projectID,
        user_id: userID,
        status: 'Complete',
      };

      axios.put(`${BASE_API_URL}/project_status/${apiId}/`, putData, config)
        .then((response) => {
          console.log(response);
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
              this.setComleteStatus();
            }
          }
        });
    },
    checkCompleteStatus() {
      const status = this.$route.query.q;
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      axios.get(`${BASE_API_URL}/projects/${this.$route.params.id}/`, config)
        .then((response) => {
          this.completeCode = response.data.complete_code;
          if (this.completeCode === status && !this.$route.query.timeout) {
            this.setComleteStatus();
          } else if (this.$route.query.timeout) {
            this.infoText = 'Вы не успели пройти анкету за обозначенное время. Попробуйте пройти снова';
            this.deleteComplete(config);
          } else {
            this.infoText = 'Обнаружено несоотвествие. Ответы не засчитаны.';
            this.deleteComplete(config);
          }
        }).catch((e) => {
          if (e.response.status === 401) {
            const tokenRefresh = localStorage.getItem('jwt_token_refresh');
            this.$store.dispatch('refreshToken', tokenRefresh);
            const isLogged = this.$store.getters.getIsLoggedIn;
            if (isLogged !== true) {
              router.push({ path: '/login', query: { text: 'true' } });
            } else {
              console.log('refreshToken');
              this.checkCompleteStatus();
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

    this.infoText = '';
    this.completeCode = '';
    this.checkCompleteStatus();
  },
};
</script>

<style scoped>

</style>
