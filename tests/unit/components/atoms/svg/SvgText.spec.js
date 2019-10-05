import { mount } from '@vue/test-utils'
import Target from '@/components/atoms/svg/SvgText.vue'

describe('components/atoms/svg/SvgText.vue', () => {
  describe('snapshot', () => {
    it('does not have link', () => {
      const wrapper = mount(Target, {
        propsData: {
          text: 'prop-text',
          x: 1,
          y: 2,
          fontSize: 10,
          fill: 'red',
          fontWeight: 20,
          textDecoration: 'prop-textDecoration',
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
    it('has link', () => {
      const wrapper = mount(Target, {
        propsData: {
          text: 'http://example.com',
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('methods', () => {
    describe('getBBox', () => {
      it('returns bbox of svg node', () => {
        const wrapper = mount(Target, {
          propsData: {
            text: 'http://example.com',
          },
        })
        const bbox = wrapper.vm.getBBox()
        expect(bbox.width).toBeGreaterThan(0)
        expect(bbox.height).toBeGreaterThan(0)
      })
    })

    describe('moveLink', () => {
      const orgOpen = window.open
      beforeEach(() => (window.open = jest.fn()))
      afterEach(() => (window.open = orgOpen))

      it('exec window.open if text is link', () => {
        const wrapper = mount(Target, {
          propsData: {
            text: 'http://example.com',
          },
        })
        wrapper.vm.moveLink()
        expect(window.open.mock.calls).toEqual([['http://example.com']])
      })
      it('not exec window.open if text is not link', () => {
        const wrapper = mount(Target, {
          propsData: {
            text: 'text text',
          },
        })
        wrapper.vm.moveLink()
        expect(window.open).toHaveBeenCalledTimes(0)
      })
    })
  })
})
