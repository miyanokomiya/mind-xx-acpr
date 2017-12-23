import mutations from '@/store/files/mutations'
import { mutationTypes } from '@/store/files/types'

describe('store/files/mutations', () => {
  describe('UPDATE_FILES', () => {
    it('should update correct [files]', () => {
      const state = {
        files: {
          a: { name: 'a' },
          b: { name: 'b' },
          c: { name: 'c' }
        }
      }
      mutations[mutationTypes.UPDATE_FILES](state, {
        files: {
          b: { name: 'bbb' },
          c: null,
          d: { name: 'ddd' }
        }
      })
      expect(state).toMatchObject({
        files: {
          a: { name: 'a' },
          b: { name: 'bbb' },
          d: { name: 'ddd' }
        }
      })
    })
  })
  describe('CLEAR_FILES', () => {
    it('should make [files] empty Object', () => {
      const state = {
        files: {
          a: { name: 'a' },
          b: { name: 'b' },
          c: { name: 'c' }
        }
      }
      mutations[mutationTypes.CLEAR_FILES](state)
      expect(state).toMatchObject({
        files: {}
      })
    })
  })
})
