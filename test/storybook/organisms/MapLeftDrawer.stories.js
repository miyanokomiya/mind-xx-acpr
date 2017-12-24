import { storiesOf } from '@storybook/vue'
import MapLeftDrawer from '@/components/organisms/MapLeftDrawer'

import { ROOT_NODE } from '@/constants'
import { createNode } from '@/utils/model'

storiesOf('organisms/MapLeftDrawer', module).add('view', () => {
  return {
    components: { MapLeftDrawer },
    template: `
    <v-app>
      <v-navigation-drawer
        fixed
        clipped
        app
        v-model="drawer"
      >
        <MapLeftDrawer
          :nodes="nodes"
          :nodeColor="nodeColor"
          :textColor="textColor"
          @changeNodeColor="val => nodeColor = val"
          @changeTextColor="val => textColor = val"
        />
      </v-navigation-drawer>
    </v-app>
    `,
    data: () => ({
      drawer: true,
      nodes: {
        [ROOT_NODE]: createNode()
      },
      nodeColor: '#87cefa',
      textColor: '#000000'
    })
  }
})
