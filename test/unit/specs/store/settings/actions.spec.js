import { actionTypes, mutationTypes } from '@/store/settings/types'
import actions from '@/store/settings/actions'
import { testAction } from '@/../test/unit/tools'

describe('store/settings/actions', () => {
  describe('SET_NODE_COLOR', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.SET_NODE_COLOR],
        { nodeColor: '#123456' },
        {},
        [
          {
            type: mutationTypes.SET_NODE_COLOR,
            payload: { nodeColor: '#123456' }
          }
        ],
        done
      )
    })
  })
  describe('SET_TEXT_COLOR', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.SET_TEXT_COLOR],
        { textColor: '#123456' },
        {},
        [
          {
            type: mutationTypes.SET_TEXT_COLOR,
            payload: { textColor: '#123456' }
          }
        ],
        done
      )
    })
  })
})
