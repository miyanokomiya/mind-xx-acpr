import { storiesOf } from '@storybook/vue'

import AuthDialog from '@/components/organisms/AuthDialog'

storiesOf('organisms/AuthDialog', module)
  .add('auth', () => {
    return {
      components: { AuthDialog },
      template: `
    <v-app>
      <AuthDialog :value="value"/>
    </v-app>
    `,
      data: () => ({
        value: true,
      }),
    }
  })
  .add('reauth', () => {
    return {
      components: { AuthDialog },
      template: `
    <v-app>
      <AuthDialog :value="value" :reauth="true"/>
    </v-app>
    `,
      data: () => ({
        value: true,
      }),
    }
  })
