import { storiesOf } from '@storybook/vue'

import MapCanvas from '@/components/organisms/MapCanvas'

const createNode = obj =>
  Object.assign(
    {},
    {
      text: 'abcd',
      x: 0,
      y: 0,
      children: []
    },
    obj
  )

storiesOf('organisms/MapCanvas', module).add('story', () => {
  const root = createNode({
    children: ['a', 'b']
  })
  return {
    components: { MapCanvas },
    template: `
      <MapCanvas
        :nodes="nodes"
        :selectKeys="selectKeys"
        @updateNode="updateNode"
      />
    `,
    data: () => ({
      nodes: {
        root,
        a: createNode({ x: 20, y: 30 }),
        b: createNode({ x: 20, y: 60 })
      },
      selectKeys: {}
    }),
    methods: {
      updateNode (nextNodes) {
        this.nodes = Object.assign({}, this.nodes, nextNodes)
      }
    }
  }
})
