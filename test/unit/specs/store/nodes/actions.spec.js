import { testAction } from '../../../tools'
import actions from '@/store/nodes/actions'
import { actionTypes, mutationTypes } from '@/store/nodes/types'

describe('store/nodes/actions', () => {
  describe('UPDATE_NODES', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.UPDATE_NODES],
        {
          nodes: { a: { x: 1, y: 2 } }
        },
        {},
        [
          {
            type: mutationTypes.UPDATE_NODES,
            payload: { nodes: { a: { x: 1, y: 2 } } }
          }
        ],
        done
      )
    })
  })
})
