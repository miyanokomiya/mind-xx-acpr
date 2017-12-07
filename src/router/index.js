import Vue from 'vue'
import Router from 'vue-router'
import AppMaps from '@/components/pages/AppMaps'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'AppMaps',
      component: AppMaps
    }
  ]
})
