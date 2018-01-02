import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import MapCanvas from '@/components/organisms/MapCanvas'

import { createNode, createUser } from '@/utils/model'

const methods = {
  updateNodes (nextNodes) {
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
  },
  setSelectedNodes (selectedNodes) {
    this.selectedNodes = Object.keys(selectedNodes).reduce((p, c) => {
      if (selectedNodes[c]) {
        p[c] = true
      }
      return p
    }, {})
  },
  clearSelect () {
    this.selectedNodes = {}
  }
}

const user = createUser({ uid: 'user' })
const fileAuthority = {
  users: {
    user: { write: true }
  }
}

storiesOf('organisms/MapCanvas', module)
  .add('some nodes', () => {
    const root = createNode({
      text: 'root',
      children: ['a', 'b', 'c']
    })
    return {
      components: { MapCanvas },
      template: `
      <v-app>
        <div>
          <MapCanvas
            :nodes="nodes"
            :selectedNodes="selectedNodes"
            :fileAuthority="fileAuthority"
            :user="user"
            @updateNodes="updateNodes"
            @createNode="createNode"
            @setSelectedNodes="setSelectedNodes"
            @clearSelect="clearSelect"
          />
        </div>
      </v-app>
      `,
      data: () => ({
        nodes: {
          root,
          a: createNode({ text: 'aaaa', children: ['d'] }),
          b: createNode({ text: 'bbbbbbbbbbbbbbbbbbbbbbbbb' }),
          c: createNode({ text: 'cccccccccccccccccccccccccccccccccccc' }),
          d: createNode({ text: 'dddd' })
        },
        selectedNodes: {},
        user,
        fileAuthority
      }),
      methods
    }
  })
  .add('read only', () => {
    const root = createNode({
      text: 'root',
      children: ['a', 'b', 'c']
    })
    return {
      components: { MapCanvas },
      template: `
      <v-app>
        <div>
          <MapCanvas
            :nodes="nodes"
            :selectedNodes="selectedNodes"
            :fileAuthority="fileAuthority"
            :user="user"
            @updateNodes="updateNodes"
            @createNode="createNode"
            @setSelectedNodes="setSelectedNodes"
            @clearSelect="clearSelect"
          />
        </div>
      </v-app>
      `,
      data: () => ({
        nodes: {
          root,
          a: createNode({ text: 'aaaa', children: ['d'] }),
          b: createNode({ text: 'bbbbbbbbbbbbbbbbbbbbbbbbb' }),
          c: createNode({ text: 'cccccccccccccccccccccccccccccccccccc' }),
          d: createNode({ text: 'dddd' })
        },
        selectedNodes: {},
        user,
        fileAuthority: {
          user: {}
        }
      }),
      methods
    }
  })
