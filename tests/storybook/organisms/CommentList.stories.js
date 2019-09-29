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
        :user="user"
      />
    </v-app>
    `,
    data: () => ({
      comments: {
        a: createComment({ uid: 'a', text: 'aaa\naaa', created: 1 }),
        aa: createComment({ uid: 'aa', text: 'aaa\naaa', created: 5 }),
        b: createComment({ uid: 'b', text: 'bbb', created: 2 }),
      },
      users: {
        a: createUser({ displayName: 'aabb' }),
        b: createUser({ displayName: 'bbaa' }),
      },
      user: createUser({ uid: 'a', displayName: 'aabb' }),
    }),
  }
})
