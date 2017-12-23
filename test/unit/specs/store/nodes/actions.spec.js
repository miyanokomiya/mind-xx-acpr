import { testAction } from '../../../tools'
import actions from '@/store/nodes/actions'
import { actionTypes, mutationTypes } from '@/store/nodes/types'

describe('store/nodes/actions', () => {
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
