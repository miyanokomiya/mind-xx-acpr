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
        },
        fileAuthorities: {
          a: true,
          c: true,
          b: { write: true }
        }
      }
      mutations[mutationTypes.CLEAR_FILES](state)
      expect(state).toMatchObject({
        files: {},
        fileAuthorities: {}
      })
    })
  })
  describe('UPDATE_FILE_AUTHORITIES', () => {
    it('should update correct [fileAuthorities]', () => {
      const state = {
        fileAuthorities: {
          a: true,
          c: true,
          b: { write: true }
        }
      }
      mutations[mutationTypes.UPDATE_FILE_AUTHORITIES](state, {
        fileAuthorities: {
          b: true,
          c: null,
          d: { write: true }
        }
      })
      expect(state).toMatchObject({
        fileAuthorities: {
          a: true,
          b: true,
          d: { write: true }
        }
      })
    })
  })
})
