import { storiesOf } from '@storybook/vue'

import AuthDialog from '@/components/organisms/AuthDialog'

storiesOf('organisms/AuthDialog', module)
  .add('view', () => {
    return {
      render: h => h(AuthDialog)
    }
  })
