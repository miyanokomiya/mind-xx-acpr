import getters from '@/store/user/getters'
import { getterTypes } from '@/store/user/types'

describe('store/user/getters', () => {
  describe('USER', () => {
    it('should get correct [user]', () => {
      const state = {
        user: {
          name: 'aa'
        }
      }
      const res = getters[getterTypes.USER](state)
      expect(res).toMatchObject({
        name: 'aa'
      })
    })
  })
  describe('AUTHORITY_LOADING', () => {
    it('should get correct [authorityLoading]: true', () => {
      const state = {
        authorityLoading: true
      }
      const res = getters[getterTypes.AUTHORITY_LOADING](state)
      expect(res).toBe(true)
    })
    it('should get correct [authorityLoading]: false', () => {
      const state = {
        authorityLoading: false
      }
      const res = getters[getterTypes.AUTHORITY_LOADING](state)
      expect(res).toBe(false)
    })
  })
})
