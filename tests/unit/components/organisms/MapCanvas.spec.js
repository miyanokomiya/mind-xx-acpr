import { mount, shallowMount } from '@vue/test-utils'
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
      grouping: true,
    }),
    b: createNode({ text: 'bbbbbbb\nbbbbb' }),
    c: createNode({ text: 'cc\ncc\nccc' }),
    d: createNode({ text: 'dddd', checked: 0 }),
    xx: createNode({ text: 'xxxx', checked: 1 }),
    zz: createNode({ text: 'zzzz', children: ['yy', 'uu'], closed: true }),
    yy: createNode({ text: 'yyyy', dependencies: ['a'] }),
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

describe('components/organisms/MapCanvas.vue', () => {
  describe('snapshot', () => {
    const stubs = { ScaleToolBox: true }

    it('no data', () => {
      const wrapper = mount(Target, {
        vuetify,
        stubs,
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
      const wrapper = mount(Target, {
        vuetify,
        stubs,
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
      const wrapper = mount(Target, {
        vuetify,
        stubs,
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
      const getWrapper = async () => {
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
        await wrapper.setData({
          nodePositions: { c: { x: 10, y: 20 } },
          nodeSizes: { c: { x: 100, y: 200 } },
        })
        return wrapper
      }
      it('single select', async () => {
        const wrapper = await getWrapper()
        wrapper.vm.selectNode('c')
        expect(wrapper.emitted('setSelectedNodes')).toEqual([[{ c: true }]])
      })
      it('multi select', async () => {
        const wrapper = await getWrapper()
        wrapper.vm.selectNode('c', true)
        expect(wrapper.emitted('setSelectedNodes')).toEqual([
          [{ a: true, b: true, c: true }],
        ])
      })
      it('can not write', async () => {
        const wrapper = await getWrapper()
        wrapper.setProps({ canWrite: false })
        wrapper.vm.selectNode('c', true)
        expect(wrapper.emitted('setSelectedNodes')).toBeFalsy()
      })
    })
  })
})
