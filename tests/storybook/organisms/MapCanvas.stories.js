import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import MapCanvas from '@/components/organisms/MapCanvas'

import { createNode, createUser, createComment, createDefaultNodes } from '@/utils/model'

const methods = {
  updateNodes(nextNodes) {
    Object.keys(nextNodes).forEach(key => {
      if (nextNodes[key]) {
        Vue.set(this.nodes, key, nextNodes[key])
      } else {
        Vue.delete(this.nodes, key)
      }
    })
    if (Object.keys(this.nodes).length === 0) {
      this.nodes = createDefaultNodes()
    }
  },
  createNode(createNodes) {
    this.nodes = Object.assign({}, this.nodes, createNodes)
  },
  setSelectedNodes(selectedNodes) {
    this.selectedNodes = Object.keys(selectedNodes).reduce((p, c) => {
      if (selectedNodes[c]) {
        p[c] = true
      }
      return p
    }, {})
  },
  clearSelect() {
    this.selectedNodes = {}
  },
  selectProp(args) {
    const selectedKeys = Object.keys(this.selectedNodes)
    if (selectedKeys.length > 0) {
      const updatedNodes = selectedKeys.reduce((p, key) => {
        p[key] = {
          ...this.nodes[key],
          ...args,
        }
        return p
      }, {})
      this.updateNodes(updatedNodes)
    }
  },
  postComment({ comment, key }) {
    console.log('post comment:', comment, key)
    if (comment) {
      Vue.set(this.comments, key, comment)
    } else {
      Vue.delete(this.comments, key)
    }
  },
}

const user = createUser({ uid: 'user' })

storiesOf('organisms/MapCanvas', module)
  .add('some nodes', () => {
    const root = createNode({
      text: 'root',
      children: ['a', 'b', 'c'],
    })
    return {
      components: { MapCanvas },
      template: `
      <v-app>
        <div style="width: 620px; height: 600px;">
          <MapCanvas
            :width="600"
            :height="600"
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
          root: {
            ...root,
            oppositeChildren: ['zz', 'xx'],
          },
          a: createNode({
            text: 'aaaa',
            children: ['d'],
          }),
          b: createNode({ text: 'bbbbbbbbbbbbbbbbbbbbbbbbb' }),
          c: createNode({ text: 'cccccccccccccccccccccccccccccccccccc' }),
          d: createNode({ text: 'dddd' }),
          xx: createNode({ text: 'xxxx' }),
          zz: createNode({ text: 'zzzz', children: ['yy', 'uu'] }),
          yy: createNode({ text: 'yyyy' }),
          uu: createNode({ text: 'uuuu' }),
        },
        selectedNodes: {},
        user,
        comments: {
          a: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
          aa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
          aaa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'c' }),
          aaaa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
          b: createComment({ uid: 'b', text: 'bbb', nodeId: 'c' }),
        },
        users: {
          a: createUser({ displayName: 'aabb' }),
          b: createUser({ displayName: 'bbaa' }),
          user,
        },
      }),
      methods,
    }
  })
  .add('read only', () => {
    const root = createNode({
      text: 'root',
      children: ['a', 'b', 'c'],
    })
    return {
      components: { MapCanvas },
      template: `
      <v-app>
      <div style="width: 620px; height: 600px;">
          <MapCanvas
            :width="600"
            :height="600"
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
          d: createNode({ text: 'dddd' }),
        },
        selectedNodes: {},
        user,
      }),
      methods,
    }
  })
  .add('huge count', () => {
    const nodes = [...Array(50)].reduce((m, _, i) => {
      m[i] = createNode({ text: `node_${i}` })
      return m
    }, {})
    const root = createNode({
      text: 'root',
      children: Object.keys(nodes),
    })
    return {
      components: { MapCanvas },
      template: `
      <v-app>
        <div style="width: 620px; height: 600px;">
          <MapCanvas
            :width="600"
            :height="600"
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
          ...nodes,
        },
        selectedNodes: {},
        user,
        comments: {},
        users: { user },
      }),
      methods,
    }
  })
