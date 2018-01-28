import mutations from '@/store/nodes/mutations'
import { mutationTypes } from '@/store/nodes/types'
import { createDefaultNodes, createNode } from '@/utils/model'

describe('store/nodes/mutations', () => {
  describe('UPDATE_NODES', () => {
    it('should update correct [nodes]', () => {
      const state = {
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 10, y: 10 },
          c: { x: 40, y: 40 }
        },
        selectedNodes: {}
      }
      mutations[mutationTypes.UPDATE_NODES](state, {
        nodes: {
          b: { x: 20, y: 30 },
          c: null,
          d: { x: 40, y: 40 }
        }
      })
      expect(state).toEqual({
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 20, y: 30 },
          d: { x: 40, y: 40 }
        },
        selectedNodes: {}
      })
    })
    it('should clear select of deleted nodes', () => {
      const state = {
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 10, y: 10 },
          c: { x: 40, y: 40 }
        },
        selectedNodes: { b: true, c: true }
      }
      mutations[mutationTypes.UPDATE_NODES](state, {
        nodes: {
          b: { x: 20, y: 30 },
          c: null
        }
      })
      expect(state).toEqual({
        nodes: {
          a: { x: 0, y: 0 },
          b: { x: 20, y: 30 }
        },
        selectedNodes: { b: true }
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
      expect(state).toEqual({
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
      expect(state).toEqual({
        fileKey: 'abc'
      })
    })
  })
  describe('CLEAR_NODES', () => {
    it('should set fileKey = null, nodes = {}, selectedNodes = {}, undoStacks = [], redoStacks = []', () => {
      const state = {
        fileKey: 'aaa',
        nodes: { a: { text: 'aa' } },
        selectedNodes: { a: true },
        undoStacks: [{ a: { text: 'a' } }],
        redoStacks: [{ a: { text: 'a' } }]
      }
      mutations[mutationTypes.CLEAR_NODES](state)
      expect(state).toEqual({
        fileKey: null,
        nodes: createDefaultNodes(),
        selectedNodes: {},
        undoStacks: [],
        redoStacks: []
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
      expect(state).toEqual({
        initialLoading: true
      })
    })
  })
  describe('PUSH_UNDO_STACK', () => {
    it('should push new stack to [undoStacks], and clear [redoStacks]', () => {
      const state = {
        nodes: {
          b: createNode({ text: 'bbb' })
        },
        undoStacks: [],
        redoStacks: [{ a: createNode({ text: 'a' }) }]
      }
      mutations[mutationTypes.PUSH_UNDO_STACK](state, {
        nodes: {
          b: createNode({ text: 'b' })
        }
      })
      expect(state).toEqual({
        nodes: {
          b: createNode({ text: 'bbb' })
        },
        undoStacks: [{ b: createNode({ text: 'bbb' }) }],
        redoStacks: []
      })
    })
  })
  describe('POP_UNDO_STACK', () => {
    it('should pop a stack from [undoStacks], and push it to [redoStacks]', () => {
      const state = {
        nodes: {
          b: createNode({ text: 'bbb' })
        },
        undoStacks: [
          { a: createNode({ text: 'a' }) },
          { b: createNode({ text: 'b' }) }
        ],
        redoStacks: []
      }
      mutations[mutationTypes.POP_UNDO_STACK](state)
      expect(state).toEqual({
        nodes: {
          b: createNode({ text: 'bbb' })
        },
        undoStacks: [{ a: createNode({ text: 'a' }) }],
        redoStacks: [{ b: createNode({ text: 'bbb' }) }]
      })
    })
    it('should do nothing if there are no stacks in [undoStacks]', () => {
      const state = {
        undoStacks: [],
        redoStacks: [{ b: createNode({ text: 'b' }) }]
      }
      mutations[mutationTypes.POP_UNDO_STACK](state)
      expect(state).toEqual({
        undoStacks: [],
        redoStacks: [{ b: createNode({ text: 'b' }) }]
      })
    })
  })
  describe('POP_REDO_STACK', () => {
    it('should pop a stack from [redoStacks], and push it to [undoStacks]', () => {
      const state = {
        nodes: {
          b: createNode({ text: 'bbb' })
        },
        undoStacks: [],
        redoStacks: [
          { a: createNode({ text: 'a' }) },
          { b: createNode({ text: 'b' }) }
        ]
      }
      mutations[mutationTypes.POP_REDO_STACK](state)
      expect(state).toEqual({
        nodes: {
          b: createNode({ text: 'bbb' })
        },
        undoStacks: [{ b: createNode({ text: 'bbb' }) }],
        redoStacks: [{ a: createNode({ text: 'a' }) }]
      })
    })
    it('should do nothing if there are no stacks in [redoStacks]', () => {
      const state = {
        undoStacks: [{ b: createNode({ text: 'b' }) }],
        redoStacks: []
      }
      mutations[mutationTypes.POP_REDO_STACK](state)
      expect(state).toEqual({
        undoStacks: [{ b: createNode({ text: 'b' }) }],
        redoStacks: []
      })
    })
  })
  describe('CLEAR_STACKS', () => {
    it('should set empty array to [undoStacks] and [redoStacks]', () => {
      const state = {
        undoStacks: [{ a: { text: 'a' } }],
        redoStacks: [{ a: { text: 'a' } }]
      }
      mutations[mutationTypes.CLEAR_STACKS](state)
      expect(state).toEqual({
        undoStacks: [],
        redoStacks: []
      })
    })
  })
  describe('CLEAR_UNDO_STACKS', () => {
    it('should set empty array to [undoStacks]', () => {
      const state = {
        undoStacks: [{ a: { text: 'a' } }]
      }
      mutations[mutationTypes.CLEAR_UNDO_STACKS](state)
      expect(state).toEqual({
        undoStacks: []
      })
    })
  })
  describe('CLEAR_REDO_STACKS', () => {
    it('should set empty array to [redoStacks]', () => {
      const state = {
        redoStacks: [{ a: { text: 'a' } }]
      }
      mutations[mutationTypes.CLEAR_REDO_STACKS](state)
      expect(state).toEqual({
        redoStacks: []
      })
    })
  })
})
