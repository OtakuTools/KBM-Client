import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
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
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Page_draftInfo.vue')
    },
    {
      path: '/listAll',
      name: 'listAll',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Page_mainPage.vue')
    },
    {
      path: '/adminControl',
      name: 'adminControl',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Page_systemAdmin.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.requireAuth) {
    if(router.app.$cookies && router.app.$cookies.isKey("token") && router.app.$cookies.get("token") != "") {
      next()
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
})

export default router