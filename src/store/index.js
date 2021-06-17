import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    username: null,
    userID: null,
    isLoggedIn: false,
    isStaff: null,
  },
  mutations: {
    loginSuccess(state, payload) {
      state.username = payload.username;
      state.userID = payload.userID;
      state.isLoggedIn = true;
      state.isStaff = payload.status;
    },
    logoutUser(state) {
      state.username = null;
      state.userID = null;
      state.isLoggedIn = false;
      state.isStaff = null;
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
  },
  modules: {
  },
  getters: {
    getUserName: (state) => state.user,
    getUserId: (state) => state.userID,
  },
  plugins: [createPersistedState()],
});
