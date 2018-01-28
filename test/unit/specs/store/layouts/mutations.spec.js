import mutations from '@/store/layouts/mutations'
import { mutationTypes } from '@/store/layouts/types'

describe('store/layouts/mutations', () => {
  describe('SET_LEFT_DRAWER', () => {
    it('should set correct value of [leftDrawer], pattern 1', () => {
      const state = { leftDrawer: false }
      mutations[mutationTypes.SET_LEFT_DRAWER](state, { leftDrawer: true })
      expect(state).toEqual({ leftDrawer: true })
    })
    it('should set correct value of [leftDrawer], pattern 2', () => {
      const state = { leftDrawer: true }
      mutations[mutationTypes.SET_LEFT_DRAWER](state, { leftDrawer: false })
      expect(state).toEqual({ leftDrawer: false })
    })
  })
})
