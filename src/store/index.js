/*
 * @Author: your name
 * @Date: 2020-07-27 14:27:35
 * @LastEditTime: 2020-07-30 10:45:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \odf-editor-ui\src\store\index.js
 */
import vuex from 'vuex'
import vue from 'vue'
import loading from './loading'
import template from './template'

vue.use(vuex)

export default new vuex.Store({

  modules: {
    loading,
    template
  }


})
