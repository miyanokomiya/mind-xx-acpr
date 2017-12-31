import { storiesOf } from '@storybook/vue'

import InviteUserDialog from '@/components/organisms/InviteUserDialog'

storiesOf('organisms/InviteUserDialog', module)
  .add('view', () => {
    return {
      components: { InviteUserDialog },
      template: `
    <v-app>
      <InviteUserDialog
        :publicFile="publicFile"
        :publicReadOnly="publicReadOnly"
      />
    </v-app>
    `,
      data: () => ({
        publicFile: false,
        publicReadOnly: false
      })
    }
  })
  .add('cannnot edit public settings', () => {
    return {
      components: { InviteUserDialog },
      template: `
    <v-app>
      <InviteUserDialog
        :publicFile="publicFile"
        :publicReadOnly="publicReadOnly"
        :canEditPublic="false"
      />
    </v-app>
    `,
      data: () => ({
        publicFile: true,
        publicReadOnly: false
      })
    }
  })
