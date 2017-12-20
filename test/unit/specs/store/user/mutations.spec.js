import { mutationTypes } from '@/store/user/types'
import mutations from '@/store/user/mutations'

describe('store/user/mutations', () => {
  describe('SET_USER', () => {
    it('should set correct user', () => {
      const state = {
        user: null
      }
      mutations[mutationTypes.SET_USER](state, {
        uid: 'bbbb',
        displayName: 'aaa',
        email: 'email',
        photoURL: 'photoURL'
      })
      expect(state).toMatchObject({
        user: {
          uid: 'bbbb',
          displayName: 'aaa',
          email: 'email',
          photoURL: 'photoURL'
        }
      })
    })
    it('should set null if arg is null', () => {
      const state = {
        user: null
      }
      mutations[mutationTypes.SET_USER](state, null)
      expect(state).toMatchObject({
        user: null
      })
    })
  })
})
