import { testAction } from '../../../tools'
import actions from '@/store/comments/actions'
import { actionTypes, mutationTypes } from '@/store/comments/types'
import { createComment } from '@/utils/model'

describe('store/comments/actions', () => {
  describe('DISCONNECT', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.DISCONNECT],
        {},
        {},
        [
          {
            type: mutationTypes.CLEAR_COMMENTS
          }
        ],
        done
      )
    })
  })
  describe('LOAD_COMMENTS', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.LOAD_COMMENTS],
        {
          fileKey: 'fileKey'
        },
        {},
        [
          {
            type: mutationTypes.SET_FILE_KEY,
            payload: { fileKey: 'fileKey' }
          }
        ],
        done
      )
    })
  })
  describe('UPDATE_COMMENTS', () => {
    it('should commit correct mutations', done => {
      testAction(
        actions[actionTypes.UPDATE_COMMENTS],
        {
          comments: {
            a: createComment({ text: 'a' })
          }
        },
        {
          comments: { b: createComment({ text: 'b' }) }
        },
        [],
        done
      )
    })
  })
})
