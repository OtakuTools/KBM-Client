import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./views/Page_login.vue')
    },
    {
      path: '/draft',
      name: 'draft',
      component: () => import('./views/Page_draftInfo.vue')
    },
    {
      path: '/listAll',
      name: 'listAll',
      component: () => import('./views/Page_mainPage.vue')
    },
    {
      path: '/adminControl',
      name: 'adminControl',
      component: () => import('./views/Page_systemAdmin.vue')
    }
  ]
})
