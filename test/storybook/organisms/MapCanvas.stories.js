import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import MapCanvas from '@/components/organisms/MapCanvas'

import { createNode } from '@/utils/model'

storiesOf('organisms/MapCanvas', module).add('story', () => {
  const root = createNode({
    text: 'root',
    children: ['a', 'b', 'c']
  })
  return {
    components: { MapCanvas },
    template: `
      <MapCanvas
        :nodes="nodes"
        :selectKeys="selectKeys"
        @updateNode="updateNode"
        @createNode="createNode"
      />
    `,
    data: () => ({
      nodes: {
        root,
        a: createNode({ text: 'aaaa', children: ['d'] }),
        b: createNode({ text: 'bbbbbbbbbbbbbbbbbbbbbbbbb' }),
        c: createNode({ text: 'cccc' }),
        d: createNode({ text: 'dddd' })
      },
      selectKeys: {}
    }),
    methods: {
      updateNode (nextNodes) {
        Object.keys(nextNodes).forEach(key => {
          if (nextNodes[key]) {
            Vue.set(this.nodes, key, nextNodes[key])
          } else {
            Vue.delete(this.nodes, key)
          }
        })
      },
      createNode (createNodes) {
        this.nodes = Object.assign({}, this.nodes, createNodes)
      }
    }
  }
})
