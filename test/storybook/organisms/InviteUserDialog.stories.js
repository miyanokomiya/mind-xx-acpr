import { storiesOf } from '@storybook/vue'

import InviteUserDialog from '@/components/organisms/InviteUserDialog'

storiesOf('organisms/InviteUserDialog', module).add('view', () => {
  return {
    components: { InviteUserDialog },
    template: `
    <v-app>
      <InviteUserDialog/>
    </v-app>
    `,
    data: () => ({})
  }
})
