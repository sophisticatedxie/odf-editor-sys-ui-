/*
 * @Author: your name
 * @Date: 2020-07-27 14:28:55
 * @LastEditTime: 2020-09-25 11:20:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \odf-editor-ui\src\store\loading\index.js
 */
const SET_LOADING = 'SET_LOADING';

export default {

  state: {
    loading: false

  },
  mutations: {
    [SET_LOADING](state, loading) {
      state.loading = loading;
    }

  },
  actions: {
    async [SET_LOADING]({
      commit
    }, payload) {
      return new Promise((resolove, reject) => {
        commit(SET_LOADING, payload);
        return resolove();
      })
    }

  },
  getters: {
    GET_LOADING: state => state.loading

  }



}
