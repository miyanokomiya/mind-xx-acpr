import mutations from '@/store/comments/mutations'
import { mutationTypes } from '@/store/comments/types'

describe('store/comments/mutations', () => {
  describe('UPDATE_COMMENTS', () => {
    it('should update correct [comments]', () => {
      const state = {
        comments: {
          a: { x: 0, y: 0 },
          b: { x: 10, y: 10 },
          c: { x: 40, y: 40 },
        },
      }
      mutations[mutationTypes.UPDATE_COMMENTS](state, {
        comments: {
          b: { x: 20, y: 30 },
          c: null,
          d: { x: 40, y: 40 },
        },
      })
      expect(state).toEqual({
        comments: {
          a: { x: 0, y: 0 },
          b: { x: 20, y: 30 },
          d: { x: 40, y: 40 },
        },
      })
    })
  })
  describe('SET_FILE_KEY', () => {
    it('should set correct [fileKey]', () => {
      const state = {
        fileKey: null,
      }
      mutations[mutationTypes.SET_FILE_KEY](state, {
        fileKey: 'abc',
      })
      expect(state).toEqual({
        fileKey: 'abc',
      })
    })
  })
  describe('CLEAR_COMMENTS', () => {
    it('should set fileKey = null, comments = {}', () => {
      const state = {
        fileKey: 'aaa',
        comments: { a: { text: 'aa' } },
      }
      mutations[mutationTypes.CLEAR_COMMENTS](state)
      expect(state).toEqual({
        fileKey: null,
        comments: {},
      })
    })
  })
})
