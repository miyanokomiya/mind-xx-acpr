import getters from '@/store/files/getters'
import { getterTypes } from '@/store/files/types'

describe('store/files/getters', () => {
  describe('NODES', () => {
    it('should get correct [files]', () => {
      const state = {
        files: {
          a: { name: 'a' },
          b: { name: 'b' }
        }
      }
      const res = getters[getterTypes.FILES](state)
      expect(res).toMatchObject({
        a: { name: 'a' },
        b: { name: 'b' }
      })
    })
  })
})
