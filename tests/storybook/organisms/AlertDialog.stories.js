import { storiesOf } from '@storybook/vue'

import AlertDialog from '@/components/organisms/AlertDialog'

storiesOf('organisms/AlertDialog', module).add('view', () => {
  return {
    components: { AlertDialog },
    template: `
    <v-app>
      <AlertDialog
        :value="value"
        title="Info"
        message="message message"
      />
    </v-app>
    `,
    data: () => ({
      value: true
    })
  }
})
