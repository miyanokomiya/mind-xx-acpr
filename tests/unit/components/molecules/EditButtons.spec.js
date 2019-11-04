import { mount } from '@vue/test-utils'
import { createNode } from '@/utils/model'
import { CANVAS_MODE } from '@/constants'
import Target from '@/components/molecules/EditButtons.vue'

describe('components/molecules/EditButtons.vue', () => {
  describe('snapshot', () => {
    const targetNode = createNode({ children: ['a', 'b'] })

    it('default', () => {
      const wrapper = mount(Target, {
        propsData: {
          targetNode,
          targetNodeViewSize: { width: 10, height: 20 },
          targetNodeViewPosition: { x: 100, y: 200 },
          mode: CANVAS_MODE.NORMAL,
          root: false,
          oppositeEditTarget: false,
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('root', () => {
      const wrapper = mount(Target, {
        propsData: {
          targetNode,
          targetNodeViewSize: { width: 10, height: 20 },
          targetNodeViewPosition: { x: 100, y: 200 },
          mode: CANVAS_MODE.NORMAL,
          root: true,
          oppositeEditTarget: false,
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('opposite', () => {
      const wrapper = mount(Target, {
        propsData: {
          targetNode,
          targetNodeViewSize: { width: 10, height: 20 },
          targetNodeViewPosition: { x: 100, y: 200 },
          mode: CANVAS_MODE.NORMAL,
          root: false,
          oppositeEditTarget: true,
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('CANVAS_MODE.DEPENDENCY', () => {
      const wrapper = mount(Target, {
        propsData: {
          targetNode,
          targetNodeViewSize: { width: 10, height: 20 },
          targetNodeViewPosition: { x: 100, y: 200 },
          mode: CANVAS_MODE.DEPENDENCY,
          root: false,
          oppositeEditTarget: false,
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
