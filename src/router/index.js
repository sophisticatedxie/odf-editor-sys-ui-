import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'FlowDesigner',
    component: () => import('@/components/flow/designer/FlowDesigner')
  },{
    path:'/login',
    name:'login',
    component:()=>import('@/login')
  }]
})
