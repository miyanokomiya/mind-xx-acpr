import { testAction } from '../../../tools'
import actions from '@/store/files/actions'
import { actionTypes, mutationTypes } from '@/store/files/types'

describe('store/files/actions', () => {
  describe('UPDATE_FILES', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.UPDATE_FILES],
        {
          files: { a: { name: 'a' } }
        },
        {},
        [
          {
            type: mutationTypes.UPDATE_FILES,
            payload: { files: { a: { name: 'a' } } }
          }
        ],
        done
      )
    })
  })
})
