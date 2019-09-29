import { testAction } from '../../../tools'
import actions from '@/store/layouts/actions'
import { actionTypes, mutationTypes } from '@/store/layouts/types'

describe('store/layouts/actions', () => {
  describe('SET_LEFT_DRAWER', () => {
    it('should commit correct mutations, pattern 1', done => {
      testAction(
        actions[actionTypes.SET_LEFT_DRAWER],
        { leftDrawer: true },
        {},
        [{ type: mutationTypes.SET_LEFT_DRAWER, payload: { leftDrawer: true } }],
        done,
      )
    })
    it('should commit correct mutations, pattern 2', done => {
      testAction(
        actions[actionTypes.SET_LEFT_DRAWER],
        { leftDrawer: false },
        {},
        [
          {
            type: mutationTypes.SET_LEFT_DRAWER,
            payload: { leftDrawer: false },
          },
        ],
        done,
      )
    })
  })
})
