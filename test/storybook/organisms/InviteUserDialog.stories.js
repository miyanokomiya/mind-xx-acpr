import { storiesOf } from '@storybook/vue'

import InviteUserDialog from '@/components/organisms/InviteUserDialog'
import { createUser } from '@/utils/model'

const user = createUser({ uid: 'user' })

storiesOf('organisms/InviteUserDialog', module)
  .add('view', () => {
    return {
      components: { InviteUserDialog },
      template: `
    <v-app>
      <InviteUserDialog
        :publicFile="publicFile"
        :publicReadOnly="publicReadOnly"
        :user="user"
      />
    </v-app>
    `,
      data: () => ({
        publicFile: false,
        publicReadOnly: false,
        user
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
        :user="user"
      />
    </v-app>
    `,
      data: () => ({
        publicFile: true,
        publicReadOnly: false,
        user
      })
    }
  })
  .add('users list', () => {
    return {
      components: { InviteUserDialog },
      template: `
    <v-app>
      <InviteUserDialog
        :publicFile="publicFile"
        :publicReadOnly="publicReadOnly"
        :userAuthorities="userAuthorities"
        :users="users"
        :user="user"
      />
    </v-app>
    `,
      data: () => ({
        publicFile: false,
        publicReadOnly: false,
        userAuthorities: {
          a: { write: true, owner: true },
          b: { write: false },
          c: { write: true }
        },
        users: {
          a: createUser({ uid: 'a', displayName: 'aa aa', email: 'aa@aa' }),
          b: createUser({ uid: 'b', displayName: 'bb bb', email: 'bb@bb' }),
          c: createUser({ uid: 'c', displayName: 'cc cc', email: 'cc@cc' })
        },
        user
      })
    }
  })
