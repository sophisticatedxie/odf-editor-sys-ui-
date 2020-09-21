/*
 * @Author: xiejiarong
 * @Date: 2020-07-24 11:52:25
 * @LastEditTime: 2020-08-20 16:10:43
 * @LastEditors: Please set LastEditors
 * @Description: 主入口
 * @FilePath: \odf-editor-ui\src\main.js
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import router from './router'
import VueContextMenu from 'vue-contextmenu'
import vcolorpicker from 'vcolorpicker'
import store from './store'
import rest from '@/util/rest'
import ajax from '@/mixins/ajax'
import 'element-ui/lib/theme-chalk/index.css';
import common from '@/util/common'
import transform from '@/mixins/Transform'
import x2js from 'x2js'
Vue.prototype.$x2js = new x2js()
import {
  codemirror
} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(codemirror)
Vue.config.productionTip = false
Vue.use(rest)
Vue.use(VueContextMenu)
Vue.use(vcolorpicker)
Vue.mixin(ajax)
Vue.use(common)
import element from '@/elementui'
import ant from '@/ant-design'
Vue.use(element)
Vue.use(ant)
Vue.mixin(transform)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>',
})
