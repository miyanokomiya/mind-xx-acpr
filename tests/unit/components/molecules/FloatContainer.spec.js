import { mount } from '@vue/test-utils'
import Target from '@/components/molecules/FloatContainer.vue'

describe('@/components/molecules/FloatContainer.vue', () => {
  describe('snapshot', () => {
    it('default', () => {
      const wrapper = mount(Target, {
        propsData: {
          x: 10,
          y: 20,
        },
        slots: {
          default: '<div>slot</div>',
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
