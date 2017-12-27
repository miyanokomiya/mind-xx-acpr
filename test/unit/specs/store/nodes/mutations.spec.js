import mutations from '@/store/nodes/mutations'
import { mutationTypes } from '@/store/nodes/types'
import { createDefaultNodes } from '@/utils/model'

describe('store/nodes/mutations', () => {
  describe('UPDATE_NODES', () => {
    it('should update correct [nodes]', () => {
      const state = {
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 10, y: 10 },
          c: { x: 40, y: 40 }
        }
      }
      mutations[mutationTypes.UPDATE_NODES](state, {
        nodes: {
          b: { x: 20, y: 30 },
          c: null,
          d: { x: 40, y: 40 }
        }
      })
      expect(state).toMatchObject({
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 20, y: 30 },
          d: { x: 40, y: 40 }
        }
      })
    })
  })
  describe('SET_SELECTED_NODES', () => {
    it('should set correct [selectedNodes]', () => {
      const state = {
        selectedNodes: {}
      }
      mutations[mutationTypes.SET_SELECTED_NODES](state, {
        selectedNodes: {
          a: true
        }
      })
      expect(state).toMatchObject({
        selectedNodes: {
          a: true
        }
      })
    })
    it('should delete keys which set false', () => {
      const state = {
        selectedNodes: {
          a: true
        }
      }
      mutations[mutationTypes.SET_SELECTED_NODES](state, {
        selectedNodes: {
          a: false
        }
      })
      expect(state.a).toBe(undefined)
    })
  })
  describe('SET_FILE_KEY', () => {
    it('should set correct [fileKey]', () => {
      const state = {
        fileKey: null
      }
      mutations[mutationTypes.SET_FILE_KEY](state, {
        fileKey: 'abc'
      })
      expect(state).toMatchObject({
        fileKey: 'abc'
      })
    })
  })
  describe('CLEAR_NODES', () => {
    it('should set fileKey = null, nodes = {}, selectedNodes = {}', () => {
      const state = {
        fileKey: 'aaa',
        nodes: { a: { text: 'aa' } },
        selectedNodes: { a: true }
      }
      mutations[mutationTypes.CLEAR_NODES](state)
      expect(state).toMatchObject({
        fileKey: null,
        nodes: createDefaultNodes(),
        selectedNodes: {}
      })
    })
  })
  describe('SET_INITIAL_LOADING', () => {
    it('should set fileKey = null, nodes = {}, selectedNodes = {}', () => {
      const state = {
        initialLoading: false
      }
      mutations[mutationTypes.SET_INITIAL_LOADING](state, {
        initialLoading: true
      })
      expect(state).toMatchObject({
        initialLoading: true
      })
    })
  })
})
