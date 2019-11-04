import { mount, shallowMount } from '@vue/test-utils'
import Target from '@/components/molecules/FloatTextInput.vue'

describe('components/molecules/FloatTextInput.vue', () => {
  describe('snapshot', () => {
    it('default', () => {
      const wrapper = mount(Target, {
        propsData: {
          value: 'text',
          targetKey: 'target',
          x: 10,
          y: 20,
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('computed', () => {
    describe('localValue', () => {
      it('set => $emit', () => {
        const wrapper = shallowMount(Target, {
          propsData: {
            value: 'text',
            targetKey: 'target',
            x: 10,
            y: 20,
          },
        })
        wrapper.vm.localValue = 'updated'
        expect(wrapper.emitted('input')).toEqual([['updated']])
      })
    })
  })

  describe('methods', () => {
    describe('done', () => {
      it('$emit', () => {
        const wrapper = shallowMount(Target, {
          propsData: {
            value: 'text',
            targetKey: 'target',
            x: 10,
            y: 20,
          },
        })
        wrapper.vm.done()
        expect(wrapper.emitted('done')).toEqual([
          [
            {
              value: 'text',
              targetKey: 'target',
            },
          ],
        ])
      })
    })
  })
})
