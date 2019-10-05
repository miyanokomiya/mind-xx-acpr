import { mount } from '@vue/test-utils'
import Target from '@/components/atoms/svg/SvgCanvas.vue'

describe('components/atoms/svg/SvgCanvas.vue', () => {
  describe('snapshot', () => {
    it('default', () => {
      const wrapper = mount(Target, {
        propsData: {
          x: 1,
          y: 2,
          width: 10,
          height: 20,
          scale: 100,
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('with selecting rectangle', () => {
      const wrapper = mount(Target, {
        propsData: {
          x: 1,
          y: 2,
          width: 10,
          height: 20,
          scale: 100,
        },
      })
      wrapper.setData({
        rectangleSelecting: true,
        downP: { x: 3, y: 4 },
        beforeMoveP: { x: 30, y: 40 },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
