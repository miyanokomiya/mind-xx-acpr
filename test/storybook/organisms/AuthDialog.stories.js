import { storiesOf } from '@storybook/vue'

import AuthDialog from '@/components/organisms/AuthDialog'

storiesOf('organisms/AuthDialog', module).add('view', () => {
  return {
    components: { AuthDialog },
    template: `
    <v-app>
      <AuthDialog :value="value"/>
    </v-app>
    `,
    data: () => ({
      value: true
    })
  }
})
