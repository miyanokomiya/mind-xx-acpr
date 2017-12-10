import { storiesOf } from '@storybook/vue'

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
        b: createNode({ text: 'bbbb' }),
        c: createNode({ text: 'cccc' }),
        d: createNode({ text: 'dddd' })
      },
      selectKeys: {}
    }),
    methods: {
      updateNode (nextNodes) {
        this.nodes = Object.assign({}, this.nodes, nextNodes)
      },
      createNode (createNodes) {
        this.nodes = Object.assign({}, this.nodes, createNodes)
      }
    }
  }
})
