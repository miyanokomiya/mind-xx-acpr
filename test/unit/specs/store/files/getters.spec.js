import getters from '@/store/files/getters'
import { getterTypes } from '@/store/files/types'

describe('store/files/getters', () => {
  describe('FILES', () => {
    it('should get correct [files]', () => {
      const state = {
        files: {
          a: { name: 'a' },
          b: { name: 'b' }
        }
      }
      const res = getters[getterTypes.FILES](state)
      expect(res).toMatchObject({
        a: { name: 'a' },
        b: { name: 'b' }
      })
    })
  })
  describe('FILE_AUTHORITIES', () => {
    it('should get correct [fileAuthorities]', () => {
      const state = {
        fileAuthorities: {
          a: true,
          b: { write: true }
        }
      }
      const res = getters[getterTypes.FILE_AUTHORITIES](state)
      expect(res).toMatchObject({
        a: true,
        b: { write: true }
      })
    })
  })
  describe('SHARED_FILES', () => {
    it('should get correct [files]', () => {
      const state = {
        sharedFiles: {
          a: { name: 'a' },
          b: { name: 'b' }
        }
      }
      const res = getters[getterTypes.SHARED_FILES](state)
      expect(res).toMatchObject({
        a: { name: 'a' },
        b: { name: 'b' }
      })
    })
  })
  describe('SHARED_FILE_AUTHORITIES', () => {
    it('should get correct [fileAuthorities]', () => {
      const state = {
        sharedFileAuthorities: {
          a: true,
          b: { write: true }
        }
      }
      const res = getters[getterTypes.SHARED_FILE_AUTHORITIES](state)
      expect(res).toMatchObject({
        a: true,
        b: { write: true }
      })
    })
  })
  describe('FILE_FROM_KEY', () => {
    it('should get correct file from [files] or [sharedFiles], if from files', () => {
      const state = {
        files: {
          a: { name: 'a' },
          b: { name: 'b' }
        },
        sharedFiles: {}
      }
      const res = getters[getterTypes.FILE_FROM_KEY](state)({
        fileKey: 'a'
      })
      expect(res).toMatchObject({ name: 'a' })
    })
    it('should get correct file from [files] or [sharedFiles], if from sharedFiles', () => {
      const state = {
        files: {},
        sharedFiles: {
          a: { name: 'a' },
          b: { name: 'b' }
        }
      }
      const res = getters[getterTypes.FILE_FROM_KEY](state)({
        fileKey: 'a'
      })
      expect(res).toMatchObject({ name: 'a' })
    })
  })
  describe('FILE_AUTHORITY_FROM_KEY', () => {
    it('should get correct authority of a file from [fileAuthorities] or [sharedFileAuthorities], if from fileAuthorities', () => {
      const state = {
        fileAuthorities: {
          a: { write: false },
          b: { write: true }
        },
        sharedFileAuthorities: {}
      }
      const res = getters[getterTypes.FILE_AUTHORITY_FROM_KEY](state)({
        fileKey: 'a'
      })
      expect(res).toMatchObject({ write: false })
    })
    it('should get correct authority of a file from [fileAuthorities] or [sharedFileAuthorities], if from sharedFileAuthorities', () => {
      const state = {
        fileAuthorities: {},
        sharedFileAuthorities: {
          a: { write: false },
          b: { write: true }
        }
      }
      const res = getters[getterTypes.FILE_AUTHORITY_FROM_KEY](state)({
        fileKey: 'a'
      })
      expect(res).toMatchObject({ write: false })
    })
  })
  describe('IS_MY_FILE_FROM_KEY', () => {
    it('should return true if the file is in [files]', () => {
      const state = {
        files: {
          a: { name: 'a' },
          b: { name: 'b' }
        },
        sharedFiles: {}
      }
      const res = getters[getterTypes.IS_MY_FILE_FROM_KEY](state)({
        fileKey: 'a'
      })
      expect(res).toBe(true)
    })
    it('should return false if the file is not in [files]', () => {
      const state = {
        files: {},
        sharedFiles: {
          a: { name: 'a' },
          b: { name: 'b' }
        }
      }
      const res = getters[getterTypes.IS_MY_FILE_FROM_KEY](state)({
        fileKey: 'a'
      })
      expect(res).toBe(false)
    })
  })
  describe('PERMISSION_DENIED', () => {
    it('should get correct [fileAuthorities]', () => {
      const state = {
        permissionDenied: true
      }
      const res = getters[getterTypes.PERMISSION_DENIED](state)
      expect(res).toBe(true)
    })
  })
})
