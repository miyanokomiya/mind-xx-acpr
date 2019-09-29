import getters from '@/store/user/getters'
import { getterTypes } from '@/store/user/types'
import { getterTypes as filesGetterTypes } from '@/store/files/types'

describe('store/user/getters', () => {
  describe('USER', () => {
    it('should get correct [user]', () => {
      const state = {
        user: {
          name: 'aa',
        },
      }
      const res = getters[getterTypes.USER](state)
      expect(res).toEqual({
        name: 'aa',
      })
    })
  })
  describe('AUTHORITY_LOADING', () => {
    it('should get correct [authorityLoading]: true', () => {
      const state = {
        authorityLoading: true,
      }
      const res = getters[getterTypes.AUTHORITY_LOADING](state)
      expect(res).toBe(true)
    })
    it('should get correct [authorityLoading]: false', () => {
      const state = {
        authorityLoading: false,
      }
      const res = getters[getterTypes.AUTHORITY_LOADING](state)
      expect(res).toBe(false)
    })
  })
  describe('CAN_WRITE', () => {
    it('should get false when authority not found', () => {
      const state = {
        user: {
          uid: 'a',
        },
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return null
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(false)
    })
    it('should get false when authority exists, is public but read-only', () => {
      const state = {
        user: {
          uid: 'a',
        },
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {
              public: {
                write: false,
              },
            }
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(false)
    })
    it('should get true when authority exists, is public and writable', () => {
      const state = {
        user: {
          uid: 'a',
        },
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {
              public: {
                write: true,
              },
            }
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(true)
    })
    it('should get false when authority exists, is public and read-only, invited but read-only', () => {
      const state = {
        user: {
          uid: 'a',
        },
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {
              public: {
                write: false,
              },
              users: {
                a: {
                  write: false,
                },
              },
            }
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(false)
    })
    it('should get true when authority exists, is public and read-only, invited with writable', () => {
      const state = {
        user: {
          uid: 'a',
        },
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {
              public: {
                write: false,
              },
              users: {
                a: {
                  write: true,
                },
              },
            }
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(true)
    })
    it('should get false when authority exists, is not public, invited but read-only', () => {
      const state = {
        user: {
          uid: 'a',
        },
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {
              users: {
                a: {
                  write: false,
                },
              },
            }
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(false)
    })
    it('should get true when authority exists, is not public, invited as writable', () => {
      const state = {
        user: {
          uid: 'a',
        },
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {
              users: {
                a: {
                  write: true,
                },
              },
            }
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(true)
    })
    it('should get false when authority exists, is not public, invited as writable, but user does not exist', () => {
      const state = {
        user: null,
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {}
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(false)
    })
    it('should get true when authority exists, is public as writable, but user does not exist', () => {
      const state = {
        user: null,
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {
              public: {
                write: true,
              },
            }
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(true)
    })
    it('should get false when authority exists, is public as read-only, but user does not exist', () => {
      const state = {
        user: null,
      }
      const res = getters[getterTypes.CAN_WRITE](
        state,
        {},
        {},
        {
          [`files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`]() {
            return {
              public: {
                write: false,
              },
            }
          },
        },
      )({ fileKey: 'b' })
      expect(res).toBe(false)
    })
  })
})
