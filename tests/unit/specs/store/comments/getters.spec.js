import getters from '@/store/comments/getters'
import { getterTypes } from '@/store/comments/types'

describe('store/comments/getters', () => {
  describe('COMMENTS', () => {
    it('should get correct [comments]', () => {
      const state = {
        comments: {
          a: { x: 0, y: 0 },
          b: { x: 10, y: 10 },
        },
      }
      const res = getters[getterTypes.COMMENTS](state)
      expect(res).toEqual({
        a: { x: 0, y: 0 },
        b: { x: 10, y: 10 },
      })
    })
  })
  describe('FILE_KEY', () => {
    it('should get correct [fileKey]', () => {
      const state = {
        fileKey: 'aaa',
      }
      const res = getters[getterTypes.FILE_KEY](state)
      expect(res).toBe('aaa')
    })
  })
})
