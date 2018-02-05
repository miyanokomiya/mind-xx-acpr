import { storiesOf } from '@storybook/vue'

import CommentList from '@/components/organisms/CommentList'
import { createUser, createComment } from '@/utils/model'

storiesOf('organisms/CommentList', module).add('view', () => {
  return {
    components: { CommentList },
    template: `
    <v-app>
      <CommentList
        :comments="comments"
        :users="users"
      />
    </v-app>
    `,
    data: () => ({
      comments: {
        a: createComment({ uid: 'a', text: 'aaa\naaa' }),
        b: createComment({ uid: 'b', text: 'bbb' })
      },
      users: {
        a: createUser({ displayName: 'aabb' }),
        b: createUser({ displayName: 'bbaa' })
      }
    })
  }
})
