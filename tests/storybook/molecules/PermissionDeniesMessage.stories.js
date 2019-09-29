import { storiesOf } from '@storybook/vue'

import PermissionDeniedMessage from '@/components/molecules/PermissionDeniedMessage'

storiesOf('molecules/PermissionDeniedMessage', module).add('story', () => {
  return {
    components: { PermissionDeniedMessage },
    template: `
      <v-app>
        <PermissionDeniedMessage/>
      </v-app>
    `,
    data: () => ({}),
    methods: {}
  }
})
