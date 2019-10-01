import Vue from 'vue'
import Router from 'vue-router'
import AppCommonLayout from '@/components/pages/AppCommonLayout'
import MapCanvasContainer from '@/components/containers/MapCanvasContainer'
import MapMenu from '@/components/containers/MapMenu'
import HeaderTitle from '@/components/containers/HeaderTitle'
import MapLeftDrawerContainer from '@/components/containers/MapLeftDrawerContainer'
import WorkSpaceContainer from '@/components/containers/WorkSpaceContainer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: AppCommonLayout,
      props: {
        needAuth: false,
        hideLedfDrawer: true,
      },
      children: [
        {
          path: '',
          name: 'Top',
          components: {
            content: () => import('@/components/organisms/TopPage'),
            headerTitle: HeaderTitle,
          },
        },
      ],
    },
    {
      path: '/map',
      component: AppCommonLayout,
      props: {
        needAuth: false,
        hideLedfDrawer: false,
      },
      children: [
        {
          path: ':fileKey',
          name: 'Map',
          components: {
            content: MapCanvasContainer,
            headerTitle: HeaderTitle,
            headerIconList: MapMenu,
            leftDrawer: MapLeftDrawerContainer,
          },
          props: {
            content: true,
          },
        },
      ],
    },
    {
      path: '/workspace',
      component: AppCommonLayout,
      props: {
        needAuth: true,
        hideLedfDrawer: true,
      },
      children: [
        {
          path: '',
          name: 'WorkSpace',
          components: {
            headerTitle: HeaderTitle,
            content: WorkSpaceContainer,
          },
        },
      ],
    },
  ],
})
