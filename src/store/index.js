import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from 'axios';

import cookie from 'vue-cookies';

export default createStore({
  state: {
    username: null,
    userID: null,
    isLoggedIn: false,
    isStaff: null,
    jwtAccess: null,
    jwtRefresh: null,
  },
  mutations: {
    loginSuccess(state, payload) {
      state.username = payload.username;
      state.userID = payload.userID;
      state.isLoggedIn = true;
      state.isStaff = payload.status;
      state.jwtAccess = payload.jwtAccess;
      state.jwtRefresh = payload.jwtRefresh;
    },
    logoutUser(state) {
      state.username = null;
      state.userID = null;
      state.isLoggedIn = false;
      state.isStaff = null;
      state.jwtAccess = null;
      state.jwtRefresh = null;
    },
    updateAccessToken(state, newToken) {
      state.jwtAccess = newToken;
      state.isLoggedIn = true;
    },
  },
  actions: {
    login: ({ commit }, payload) => {
      commit('loginSuccess', payload);
    },
    logout: ({ commit }) => {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_token_refresh');
      commit('logoutUser');
    },
    refreshToken: ({ commit }, refreshToken) => {
      console.log('refresh');
      console.log(refreshToken);
      const requestData = {
        refresh: refreshToken,
      };
      console.log(requestData);
      const config = {
        headers: {
          'X-CSRFToken': cookie.get('csrftoken'),
        },
      };
      const REFRESH_TOKEN_URL = process.env.VUE_APP_REFRESH_TOKEN_URL;
      axios.post(REFRESH_TOKEN_URL, requestData, config)
        .then((response) => {
          console.log('access');
          const newToken = response.data.access;
          localStorage.setItem('jwt_token', newToken);
          commit('updateAccessToken', newToken);
        }).catch((e) => {
          console.log('fail');
          console.log(e.response.status);
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('jwt_token_refresh');
          commit('logoutUser');
        });
    },
  },
  modules: {
  },
  getters: {
    getUserName: (state) => state.user,
    getUserId: (state) => state.userID,
    getIsLoggedIn: (state) => state.isLoggedIn,
    getIsStaff: (state) => state.isStaff,
  },
  plugins: [createPersistedState()],
});
