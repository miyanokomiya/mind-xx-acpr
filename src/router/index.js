import Vue from 'vue'
import Router from 'vue-router'
// import AppMaps from '@/components/pages/AppMaps'
import AppCommonLayout from '@/components/pages/AppCommonLayout'
import MapCanvasContainer from '@/components/containers/MapCanvasContainer'
import MapHelpDialog from '@/components/organisms/MapHelpDialog'
import MapLeftDrawerContainer from '@/components/containers/MapLeftDrawerContainer'
import WorkSpaceContainer from '@/components/containers/WorkSpaceContainer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: AppCommonLayout,
      children: [
        {
          path: '',
          name: 'WorkSpace',
          components: {
            content: WorkSpaceContainer
            // headerIconList: MapHelpDialog,
            // leftDrawer: MapLeftDrawerContainer
          }
        },
        {
          path: 'map/:fileKey',
          name: 'Map',
          components: {
            content: MapCanvasContainer,
            headerIconList: MapHelpDialog,
            leftDrawer: MapLeftDrawerContainer
          },
          props: {
            content: true
          }
        }
      ]
    }
  ]
})
