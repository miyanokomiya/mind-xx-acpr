import mutations from '@/store/settings/mutations'
import { mutationTypes } from '@/store/settings/types'

describe('store/settings/mutations', () => {
  describe('SET_NODE_COLOR', () => {
    it('should set correct value', () => {
      const state = { nodeColor: '#000000' }
      mutations[mutationTypes.SET_NODE_COLOR](state, { nodeColor: '#456789' })
      expect(state).toMatchObject({ nodeColor: '#456789' })
    })
  })
  describe('SET_TEXT_COLOR', () => {
    it('should set correct value', () => {
      const state = { textColor: '#000000' }
      mutations[mutationTypes.SET_TEXT_COLOR](state, { textColor: '#456789' })
      expect(state).toMatchObject({ textColor: '#456789' })
    })
  })
})
