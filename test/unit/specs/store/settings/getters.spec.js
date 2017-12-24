import { getterTypes } from '@/store/settings/types'
import getters from '@/store/settings/getters'

describe('store/settings/getters', () => {
  describe('NODE_COLOR', () => {
    it('should get correct value', () => {
      const state = { nodeColor: '#000000' }
      const res = getters[getterTypes.NODE_COLOR](state)
      expect(res).toBe('#000000')
    })
  })
  describe('TEXT_COLOR', () => {
    it('should get correct value', () => {
      const state = { textColor: '#123456' }
      const res = getters[getterTypes.TEXT_COLOR](state)
      expect(res).toBe('#123456')
    })
  })
})
