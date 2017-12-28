import { testAction } from '../../../tools'
import actions from '@/store/nodes/actions'
import { actionTypes, mutationTypes } from '@/store/nodes/types'
import { createNode } from '@/utils/model'
import { ROOT_NODE } from '@/constants'

describe('store/nodes/actions', () => {
  describe('DISCONNECT', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.DISCONNECT],
        {},
        {},
        [
          {
            type: mutationTypes.CLEAR_NODES
          }
        ],
        done
      )
    })
  })
  describe('LOAD_NODES', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.LOAD_NODES],
        {
          fileKey: 'fileKey'
        },
        {},
        [
          {
            type: mutationTypes.SET_FILE_KEY,
            payload: { fileKey: 'fileKey' }
          },
          {
            type: mutationTypes.SET_INITIAL_LOADING,
            payload: { initialLoading: true }
          }
        ],
        done
      )
    })
  })
  describe('UPDATE_NODES', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.UPDATE_NODES],
        {
          nodes: { a: createNode({ text: 'a' }), b: createNode({ text: 'b' }) }
        },
        {
          nodes: { b: createNode({ text: 'b' }) }
        },
        [
          {
            type: mutationTypes.PUSH_UNDO_STACK,
            payload: { nodes: { a: createNode({ text: 'a' }) } }
          },
          {
            type: mutationTypes.UPDATE_NODES,
            payload: { nodes: { a: createNode({ text: 'a' }) } }
          }
        ],
        done
      )
    })
  })
  describe('UNDO_NODES', () => {
    it('should commit correct mutations if there are stacks of undo', done => {
      testAction(
        actions[actionTypes.UNDO_NODES],
        {},
        {
          undoStacks: [{ [ROOT_NODE]: createNode({ text: 'a' }) }]
        },
        [
          {
            type: mutationTypes.POP_UNDO_STACK
          },
          {
            type: mutationTypes.UPDATE_NODES,
            payload: { nodes: { [ROOT_NODE]: createNode({ text: 'a' }) } }
          }
        ],
        done
      )
    })
    it('should do nothing if there are no stacks of undo', done => {
      testAction(
        actions[actionTypes.UNDO_NODES],
        {},
        {
          undoStacks: []
        },
        [],
        done
      )
    })
  })
  describe('REDO_NODES', () => {
    it('should commit correct mutations if there are stacks of redo', done => {
      testAction(
        actions[actionTypes.REDO_NODES],
        {},
        {
          redoStacks: [{ [ROOT_NODE]: createNode({ text: 'a' }) }]
        },
        [
          {
            type: mutationTypes.POP_REDO_STACK
          },
          {
            type: mutationTypes.UPDATE_NODES,
            payload: { nodes: { [ROOT_NODE]: createNode({ text: 'a' }) } }
          }
        ],
        done
      )
    })
    it('should do nothing if there are no stacks of redo', done => {
      testAction(
        actions[actionTypes.REDO_NODES],
        {},
        {
          redoStacks: []
        },
        [],
        done
      )
    })
  })
  describe('RESCUE_CONFRICT', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.RESCUE_CONFRICT],
        {},
        {
          nodes: {
            [ROOT_NODE]: createNode({ text: 'a' }),
            b: createNode({ text: 'b' })
          }
        },
        [
          {
            type: mutationTypes.CLEAR_STACKS
          },
          {
            type: mutationTypes.SET_SELECTED_NODES,
            payload: {}
          },
          {
            type: mutationTypes.UPDATE_NODES,
            payload: { nodes: { [ROOT_NODE]: createNode({ text: 'a' }) } }
          }
        ],
        done
      )
    })
  })
  describe('SET_SELECTED_NODES', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.SET_SELECTED_NODES],
        {
          selectedNodes: { a: true }
        },
        {},
        [
          {
            type: mutationTypes.SET_SELECTED_NODES,
            payload: { selectedNodes: { a: true } }
          }
        ],
        done
      )
    })
  })
  describe('CLEAR_SELECT', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.CLEAR_SELECT],
        null,
        {},
        [
          {
            type: mutationTypes.SET_SELECTED_NODES,
            payload: { selectedNodes: {} }
          }
        ],
        done
      )
    })
  })
})
