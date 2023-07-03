import { createStore } from 'vuex'

export default createStore({
  state: {
    accessToken: null,
    refreshToken: null
  },
  getters: {

  },
  mutations: {
    setAccessToken: (state, token) => {
      state.accessToken = token;
    },
    setRefreshToken: (state, token) => {
      state.refreshToken = token;
    },
  },
  actions: {
    setAccessToken: ({commit}, token) => {
      commit('setAccessToken', token);
    },
    setRefreshToken: ({commit}, token) => {
      commit('setRefreshToken', token);
    },
  },
  modules: {
  }
})
