import getters from '@/store/nodes/getters'
import { getterTypes } from '@/store/nodes/types'

describe('store/nodes/getters', () => {
  describe('NODES', () => {
    it('should get correct [nodes]', () => {
      const state = {
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 10, y: 10 }
        }
      }
      const res = getters[getterTypes.NODES](state)
      expect(res).toEqual({
        a: { x: 0, y: 0 },
        b: { x: 10, y: 10 }
      })
    })
  })
  describe('SELECTED_NODES', () => {
    it('should get correct [selectedNodes]', () => {
      const state = {
        selectedNodes: {
          a: true,
          b: true
        }
      }
      const res = getters[getterTypes.SELECTED_NODES](state)
      expect(res).toEqual({
        a: true,
        b: true
      })
    })
  })
  describe('FILE_KEY', () => {
    it('should get correct [fileKey]', () => {
      const state = {
        fileKey: 'aaa'
      }
      const res = getters[getterTypes.FILE_KEY](state)
      expect(res).toBe('aaa')
    })
  })
  describe('INITIAL_LOADING', () => {
    it('should get correct [initialLoading]', () => {
      const state = {
        initialLoading: false
      }
      const res = getters[getterTypes.INITIAL_LOADING](state)
      expect(res).toBe(false)
    })
  })
})
