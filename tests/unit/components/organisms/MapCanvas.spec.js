import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Target from '@/components/organisms/MapCanvas.vue'
import { createNode, createUser, createComment } from '@/utils/model'
import { ROOT_NODE } from '@/constants'

const vuetify = new Vuetify()

const getNodes = () => {
  return {
    [ROOT_NODE]: createNode({
      text: 'root',
      children: ['a', 'b', 'c'],
      oppositeChildren: ['zz', 'xx'],
    }),
    a: createNode({
      text: 'aaaa',
      children: ['d'],
    }),
    b: createNode({ text: 'bbbbbbb\nbbbbb' }),
    c: createNode({ text: 'cc\ncc\nccc' }),
    d: createNode({ text: 'dddd' }),
    xx: createNode({ text: 'xxxx' }),
    zz: createNode({ text: 'zzzz', children: ['yy', 'uu'] }),
    yy: createNode({ text: 'yyyy' }),
    uu: createNode({ text: 'uuuu' }),
  }
}
const getComments = () => {
  return {
    a: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
    aa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
    aaa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'c' }),
    aaaa: createComment({ uid: 'a', text: 'aaa\naaa', nodeId: 'b' }),
    b: createComment({ uid: 'b', text: 'bbb', nodeId: 'c' }),
  }
}
const getUsers = () => {
  return {
    a: createUser({ displayName: 'aabb' }),
    b: createUser({ displayName: 'bbaa' }),
    user: createUser({ uid: 'user' }),
  }
}

const template = `
  <v-app>
    <div style="width: 620px; height: 600px;">
      <Target
        :width="600"
        :height="600"
        :nodes="nodes"
        :selectedNodes="selectedNodes"
        :canWrite="true"
        :user="user"
        :comments="comments"
        :users="users"
      />
    </div>
  </v-app>
`

describe('components/organisms/MapCanvas.vue', () => {
  describe('snapshot', () => {
    it('no data', () => {
      const wrapper = shallowMount(Target, {
        vuetify,
        propsData: {
          width: 100,
          hegith: 200,
          nodes: { [ROOT_NODE]: createNode() },
          selectedNodes: {},
          user: {},
          comments: {},
          users: {},
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('full data', () => {
      const wrapper = shallowMount(Target, {
        vuetify,
        propsData: {
          width: 100,
          hegith: 200,
          nodes: getNodes(),
          selectedNodes: {},
          user: getUsers().user,
          comments: getComments(),
          users: getUsers(),
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('can write and select nodes', () => {
      const wrapper = shallowMount(Target, {
        vuetify,
        propsData: {
          width: 100,
          hegith: 200,
          nodes: getNodes(),
          selectedNodes: { a: true, b: true },
          user: getUsers().user,
          comments: getComments(),
          users: getUsers(),
          canWrite: true,
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    describe('selectNode', () => {
      const getWrapper = () => {
        const wrapper = shallowMount(Target, {
          vuetify,
          propsData: {
            width: 100,
            hegith: 200,
            nodes: getNodes(),
            selectedNodes: { a: true, b: true },
            canWrite: true,
          },
          computed: {
            scale: {
              get() {
                return 1
              },
              set() {},
            },
          },
          methods: {
            moveViewToCoverSelectedNode: jest.fn(),
          },
        })
        wrapper.setData({
          nodePositions: { c: { x: 10, y: 20 } },
          nodeSizes: { c: { x: 100, y: 200 } },
        })
        return wrapper
      }
      it('single select', () => {
        const wrapper = getWrapper()
        wrapper.vm.selectNode('c')
        expect(wrapper.emitted('setSelectedNodes')).toEqual([[{ c: true }]])
      })
      it('multi select', () => {
        const wrapper = getWrapper()
        wrapper.vm.selectNode('c', true)
        expect(wrapper.emitted('setSelectedNodes')).toEqual([
          [{ a: true, b: true, c: true }],
        ])
      })
      it('can not write', () => {
        const wrapper = getWrapper()
        wrapper.setProps({ canWrite: false })
        wrapper.vm.selectNode('c', true)
        expect(wrapper.emitted('setSelectedNodes')).toBeFalsy()
      })
    })
  })
})
