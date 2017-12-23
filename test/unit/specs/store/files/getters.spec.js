import getters from '@/store/files/getters'
import { getterTypes } from '@/store/files/types'

describe('store/files/getters', () => {
  describe('FILES', () => {
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
  describe('FILE_AUTHORITIES', () => {
    it('should get correct [fileAuthorities]', () => {
      const state = {
        fileAuthorities: {
          a: true,
          b: { write: true }
        }
      }
      const res = getters[getterTypes.FILE_AUTHORITIES](state)
      expect(res).toMatchObject({
        a: true,
        b: { write: true }
      })
    })
  })
})
