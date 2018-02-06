import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import MapCanvas from '@/components/organisms/MapCanvas'

import { createNode, createUser, createComment } from '@/utils/model'

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
  },
  selectProp (args) {
    console.log('change props:', args)
  },
  postComment ({ comment, key }) {
    console.log('post comment:', comment, key)
    Vue.set(this.comments, key, comment)
  }
}

const user = createUser({ uid: 'user' })

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
        <div style="width: 420px; height: 400px;">
          <MapCanvas
            :width="400"
            :height="400"
            :nodes="nodes"
            :selectedNodes="selectedNodes"
            :canWrite="true"
            :user="user"
            :comments="comments"
            :users="users"
            @updateNodes="updateNodes"
            @createNode="createNode"
            @setSelectedNodes="setSelectedNodes"
            @clearSelect="clearSelect"
            @selectProp="selectProp"
            @postComment="postComment"
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
        comments: {
          a: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
          aa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
          aaa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'c' }),
          aaaa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
          b: createComment({ uid: 'b', text: 'bbb', nodeId: 'c' })
        },
        users: {
          a: createUser({ displayName: 'aabb' }),
          b: createUser({ displayName: 'bbaa' }),
          user
        }
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
      <div style="width: 420px; height: 400px;">
          <MapCanvas
            :width="400"
            :height="400"
            :nodes="nodes"
            :selectedNodes="selectedNodes"
            :canWrite="false"
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
        user
      }),
      methods
    }
  })
