import Vue from 'vue'
import Router from 'vue-router'
// import AppMaps from '@/components/pages/AppMaps'
import AppCommonLayout from '@/components/pages/AppCommonLayout'
import MapCanvasContainer from '@/components/containers/MapCanvasContainer'
import MapHelpDialog from '@/components/organisms/MapHelpDialog'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '',
      component: AppCommonLayout,
      children: [
        {
          path: '',
          name: 'Root',
          components: {
            content: MapCanvasContainer,
            headerIconList: MapHelpDialog
          }
        }
      ]
    }
  ]
})
