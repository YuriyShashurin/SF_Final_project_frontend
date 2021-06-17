<template>
  <div class="container">
    <result-data :msg='infoText'></result-data>
    <router-link to="/user_area/surveys">Проверьте другие доступные опросы</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import ResultData from '../components/ResultData.vue';

const BASE_API_URL = 'http://localhost:8080/api';

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
    setComleteStatus() {
      this.infoText = 'Поздравляем. Вы успешно завершили данное интервью';
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
          if (this.completeCode === status) {
            this.setComleteStatus();
          } else {
            this.infoText = 'Обнаружено несоотвествие. Ответы не засчитаны.';
          }
        });
    },
  },
  created() {
    this.infoText = '';
    this.completeCode = '';
    this.checkCompleteStatus();
  },
};
</script>

<style scoped>

</style>
