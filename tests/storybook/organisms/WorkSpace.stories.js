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
        :sharedFiles="sharedFiles"
        :sharedFileAuthorities="sharedFileAuthorities"
        :user="user"
        @changeName="changeName"
        @createFile="createFile"
        @deleteFiles="deleteFiles"
        @cloneFile="cloneFile"
      />
    </v-app>
    `,
    data: () => ({
      files: {
        a: createFile({ name: 'file a' }),
        b: createFile({ name: 'file b' }),
        c: createFile({ name: 'file c'.repeat(15) }),
      },
      user: createUser({ uid: 'user' }),
      fileAuthorities: {
        a: {
          users: {
            user: { write: true },
          },
        },
        b: {
          users: {
            user: { write: true },
          },
        },
        c: {
          users: {
            user: { write: false },
          },
        },
      },
      sharedFiles: {
        d: createFile({ name: 'file d' }),
        e: createFile({ name: 'file e' }),
      },
      sharedFileAuthorities: {
        d: {
          users: {
            user: { write: true },
          },
        },
        e: {
          users: {
            user: { write: false },
          },
        },
      },
    }),
    methods: {
      changeName({ files }) {
        Object.keys(files).forEach(key => {
          Vue.set(this.files, key, files[key])
        })
      },
      createFile() {
        const key = Math.random()
        Vue.set(
          this.files,
          key,
          createFile({
            name: key,
            created: Date.now(),
            updated: Date.now(),
          }),
        )
        Vue.set(this.fileAuthorities, key, {
          users: {
            user: { write: true, owner: true },
          },
        })
      },
      deleteFiles({ files }) {
        Object.keys(files).forEach(key => {
          Vue.delete(this.files, key)
        })
      },
      cloneFile({ fileKey }) {
        const file = this.files[fileKey] || this.sharedFiles[fileKey]
        const key = Math.random()
        Vue.set(this.files, key, {
          ...file,
          name: file.name + ' clone',
          created: Date.now(),
          updated: Date.now(),
        })
        Vue.set(this.fileAuthorities, key, {
          users: {
            user: { write: true, owner: true },
          },
        })
      },
    },
  }
})
