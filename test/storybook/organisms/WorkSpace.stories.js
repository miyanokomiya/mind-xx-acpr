import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import WorkSpace from '@/components/organisms/WorkSpace'
import { createFile } from '@/utils/model'

storiesOf('organisms/WorkSpace', module).add('view', () => {
  return {
    components: { WorkSpace },
    template: `
    <v-app>
      <WorkSpace
        :files="files"
        @changeName="changeName"
      />
    </v-app>
    `,
    data: () => ({
      files: {
        a: createFile({ name: 'file a' }),
        b: createFile({ name: 'file b' }),
        c: createFile({ name: 'file c' }),
        d: createFile({ name: 'file d' }),
        e: createFile({ name: 'file e' }),
        f: createFile({ name: 'file f' }),
        g: createFile({ name: 'file g' }),
        h: createFile({ name: 'file h' })
      }
    }),
    methods: {
      changeName ({ files }) {
        Object.keys(files).forEach(key => {
          if (files[key]) {
            Vue.set(this.files, key, files[key])
          } else {
            Vue.delete(this.files, key)
          }
        })
      }
    }
  }
})
