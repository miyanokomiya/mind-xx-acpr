import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import WorkSpace from '@/components/organisms/WorkSpace'
import { createFile, createUser } from '@/utils/model'

storiesOf('organisms/WorkSpace', module).add('view', () => {
  return {
    components: { WorkSpace },
    template: `
    <v-app style="padding-top: 40px;">
      <WorkSpace
        :files="files"
        :fileAuthorities="fileAuthorities"
        :user="user"
        @changeName="changeName"
        @createFile="createFile"
        @deleteFiles="deleteFiles"
      />
    </v-app>
    `,
    data: () => ({
      files: {
        a: createFile({ name: 'file a' }),
        b: createFile({ name: 'file b' }),
        c: createFile({ name: 'file c' }),
        d: createFile({ name: 'file d' }),
        e: createFile({ name: 'file e' })
      },
      user: createUser({ uid: 'user' }),
      fileAuthorities: {
        a: {
          user: { write: true }
        },
        b: {
          user: { write: true }
        },
        c: { user: true },
        d: {
          user: { write: true }
        },
        e: { user: true }
      }
    }),
    methods: {
      changeName ({ files }) {
        Object.keys(files).forEach(key => {
          Vue.set(this.files, key, files[key])
        })
      },
      createFile () {
        const key = Math.random()
        Vue.set(
          this.files,
          key,
          createFile({
            name: key,
            created: Date.now().toString(),
            updated: Date.now().toString()
          })
        )
      },
      deleteFiles ({ files }) {
        Object.keys(files).forEach(key => {
          Vue.delete(this.files, key)
        })
      }
    }
  }
})
