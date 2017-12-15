import { storiesOf } from '@storybook/vue'

import ScaleToolBox from '@/components/molecules/ScaleToolBox'

storiesOf('molecules/ScaleToolBox', module).add('story', () => {
  return {
    components: { ScaleToolBox },
    template: `
      <v-app>
        <ScaleToolBox
          :scaleRate="scaleRate"
          @changeScaleRate="val => scaleRate = val"
          @clearZoom="scaleRate = 1"
        />
        <p>{{scaleRate}}</p>
      </v-app>
    `,
    data: () => ({
      scaleRate: 1
    }),
    methods: {}
  }
})
