import { storiesOf } from '@storybook/vue'

import ConfirmDialog from '@/components/organisms/ConfirmDialog'

storiesOf('organisms/ConfirmDialog', module).add('view', () => {
  return {
    components: { ConfirmDialog },
    template: `
    <v-app>
      <ConfirmDialog
        :value="value"
        title="TITLE"
        message="message message"
      />
    </v-app>
    `,
    data: () => ({
      value: true,
    }),
  }
})
