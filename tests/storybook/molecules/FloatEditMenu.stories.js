import { storiesOf } from '@storybook/vue'
import FloatEditMenu from '@/components/molecules/FloatEditMenu'

storiesOf('molecules/FloatEditMenu', module).add('story', () => {
  return {
    components: { FloatEditMenu },
    template: `
    <v-app>
      <div style="position: relative;">
        <FloatEditMenu
          :check="check"
          @toggleCheck="check = !check"
        />
      </div>
    </v-app>
    `,
    data: () => ({
      text: 'text',
      check: false
    }),
    methods: {}
  }
})
