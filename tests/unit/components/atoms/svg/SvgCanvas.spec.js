import { mount, shallowMount } from '@vue/test-utils'
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
    it('with selecting rectangle', async () => {
      const wrapper = mount(Target, {
        propsData: {
          x: 1,
          y: 2,
          width: 10,
          height: 20,
          scale: 100,
        },
      })
      await wrapper.setData({
        rectangleSelecting: true,
        downP: { x: 3, y: 4 },
        beforeMoveP: { x: 30, y: 40 },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    describe('execLongPress', () => {
      it('set rectangleSelecting true', () => {
        const wrapper = shallowMount(Target, {
          propsData: {
            x: 1,
            y: 2,
            width: 10,
            height: 20,
            scale: 100,
          },
        })
        wrapper.vm.execLongPress()
        expect(wrapper.vm.rectangleSelecting).toBe(true)
        expect(wrapper.vm.longPressTimer).toBe(0)
      })
    })

    describe('clearLongPress', () => {
      it('clear timeout', async () => {
        const wrapper = shallowMount(Target, {
          propsData: {
            x: 1,
            y: 2,
            width: 10,
            height: 20,
            scale: 100,
          },
        })
        await wrapper.setData({ longPressTimer: 1 })
        wrapper.vm.clearLongPress()
        expect(wrapper.vm.longPressTimer).toBe(0)
      })
    })
  })
})
