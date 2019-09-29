import { mutationTypes } from '@/store/user/types'
import mutations from '@/store/user/mutations'

describe('store/user/mutations', () => {
  describe('SET_USER', () => {
    it('should set correct user', () => {
      const state = {
        user: null,
        authorityLoading: true,
      }
      mutations[mutationTypes.SET_USER](state, {
        uid: 'bbbb',
        displayName: 'aaa',
        email: 'email',
        photoURL: 'photoURL',
      })
      expect(state).toEqual({
        user: {
          uid: 'bbbb',
          displayName: 'aaa',
          email: 'email',
          photoURL: 'photoURL',
        },
        authorityLoading: false,
      })
    })
    it('should set null if arg is null', () => {
      const state = {
        user: null,
        authorityLoading: true,
      }
      mutations[mutationTypes.SET_USER](state, null)
      expect(state).toEqual({
        user: null,
        authorityLoading: true,
      })
    })
  })
  describe('SET_AUTHORITY_LOADING', () => {
    it('should set true', () => {
      const state = {
        authorityLoading: false,
      }
      mutations[mutationTypes.SET_AUTHORITY_LOADING](state, true)
      expect(state).toEqual({
        authorityLoading: true,
      })
    })
    it('should set false', () => {
      const state = {
        authorityLoading: true,
      }
      mutations[mutationTypes.SET_AUTHORITY_LOADING](state, false)
      expect(state).toEqual({
        authorityLoading: false,
      })
    })
  })
})
