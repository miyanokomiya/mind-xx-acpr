import getters from '@/store/users/getters'
import { getterTypes } from '@/store/users/types'
import { createUser } from '@/utils/model'

describe('store/users/getters', () => {
  describe('USERS', () => {
    it('should get correct [users]', () => {
      const state = {
        users: {
          aaa: createUser({ uid: 'aaa' }),
          bbb: createUser({ uid: 'bbb' }),
        },
      }
      const res = getters[getterTypes.USERS](state)
      expect(res).toEqual({
        aaa: createUser({ uid: 'aaa' }),
        bbb: createUser({ uid: 'bbb' }),
      })
    })
  })
})
