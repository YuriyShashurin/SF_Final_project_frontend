import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    isLoggedIn: false,
    isStaff: null,
  },
  mutations: {
    loginSuccess(state, payload) {
      state.user = payload.username;
      state.isLoggedIn = true;
      state.isStaff = payload.status;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isStaff = null;
    },
  },
  actions: {
    login: ({ commit }, payload) => {
      console.log(payload);
      commit('loginSuccess', payload);
    },
  },
  modules: {
  },
});
