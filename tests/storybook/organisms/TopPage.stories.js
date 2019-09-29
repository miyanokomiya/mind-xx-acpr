import { storiesOf } from '@storybook/vue'

import TopPage from '@/components/organisms/TopPage'

storiesOf('organisms/TopPage', module).add('view', () => {
  return {
    components: { TopPage },
    template: `
    <v-app>
      <TopPage />
    </v-app>
    `,
    data: () => ({
      value: true
    })
  }
})
