import getters from '@/store/layouts/getters'
import { getterTypes } from '@/store/layouts/types'

describe('store/layouts/getters', () => {
  describe('LEFT_DRAWER', () => {
    it('should get correct value of [leftDrawer], pattern 1', () => {
      const state = { leftDrawer: false }
      const res = getters[getterTypes.LEFT_DRAWER](state)
      expect(res).toBe(false)
    })
    it('should get correct value of [leftDrawer], pattern 2', () => {
      const state = { leftDrawer: true }
      const res = getters[getterTypes.LEFT_DRAWER](state)
      expect(res).toBe(true)
    })
  })
})
