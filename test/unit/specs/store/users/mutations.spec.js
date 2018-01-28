import { mutationTypes } from '@/store/users/types'
import mutations from '@/store/users/mutations'
import { createUser } from '@/utils/model'

describe('store/users/mutations', () => {
  describe('UPDATE_USERS', () => {
    it('should update correct user', () => {
      const state = {
        users: {
          bbb: createUser({ uid: 'bbb' })
        }
      }
      mutations[mutationTypes.UPDATE_USERS](state, {
        users: { aaa: createUser({ uid: 'aaa' }) }
      })
      expect(state).toEqual({
        users: {
          aaa: createUser({ uid: 'aaa' }),
          bbb: createUser({ uid: 'bbb' })
        }
      })
    })
    it('should delete correct user if set null', () => {
      const state = {
        users: {
          aaa: createUser({ uid: 'aaa' }),
          bbb: createUser({ uid: 'bbb' })
        }
      }
      mutations[mutationTypes.UPDATE_USERS](state, {
        users: { aaa: null }
      })
      expect(state).toEqual({
        users: {
          bbb: createUser({ uid: 'bbb' })
        }
      })
    })
  })
})
