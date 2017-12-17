import { storiesOf } from '@storybook/vue'
import MapHelpDialog from '@/components/organisms/MapHelpDialog'

storiesOf('organisms/MapHelpDialog', module).add('', () => {
  return {
    components: { MapHelpDialog },
    template: `
    <v-app>
      <MapHelpDialog/>
    </v-app>
    `
  }
})
