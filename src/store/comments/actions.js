import { actionTypes, mutationTypes } from './types'
import firebase from '@/firebase'
import { createComment } from '@/utils/model'

const updateComments =
  process.env.NODE_ENV === 'test'
    ? () => Promise.resolve()
    : (context, { comments }) => {
        const fileKey = context.state.fileKey
        const updates = Object.keys(comments).reduce((p, c) => {
          const current = context.state.comments[c]
          p[`/comments/${fileKey}/${c}`] = {
            ...comments[c],
            updated: firebase.database.ServerValue.TIMESTAMP,
            created: current
              ? current.created
              : firebase.database.ServerValue.TIMESTAMP
          }
          return p
        }, {})
        updates[`/files/${fileKey}/updated`] =
          firebase.database.ServerValue.TIMESTAMP
        return firebase
          .database()
          .ref()
          .update(updates)
      }

const disconnect =
  process.env.NODE_ENV === 'test'
    ? () => Promise.resolve()
    : context => {
        return firebase
          .database()
          .ref('comments/' + context.state.fileKey)
          .off()
      }

const connect =
  process.env.NODE_ENV === 'test'
    ? () => Promise.resolve()
    : (context, { fileKey }) => {
        var commentsRef = firebase.database().ref('comments/' + fileKey)
        commentsRef.on('child_added', data => {
          const comments = {
            [data.key]: createComment(data.val())
          }
          context.commit(mutationTypes.UPDATE_COMMENTS, { comments })
        })
        commentsRef.on('child_changed', function (data) {
          const comments = {
            [data.key]: createComment(data.val())
          }
          context.commit(mutationTypes.UPDATE_COMMENTS, { comments })
        })
        commentsRef.on('child_removed', function (data) {
          const comments = {
            [data.key]: null
          }
          context.commit(mutationTypes.UPDATE_COMMENTS, { comments })
        })
        return Promise.resolve()
      }

export default {
  [actionTypes.DISCONNECT] (context) {
    if (context.state.fileKey) {
      disconnect(context)
    }
    context.commit(mutationTypes.CLEAR_COMMENTS)
  },
  [actionTypes.LOAD_COMMENTS] (context, { fileKey }) {
    context.dispatch(actionTypes.DISCONNECT)
    context.commit(mutationTypes.SET_FILE_KEY, { fileKey })
    connect(context, { fileKey })
  },
  [actionTypes.UPDATE_COMMENTS] (context, { comments }) {
    // push firebase
    updateComments(context, { comments })
    // local commit
    context.commit(mutationTypes.UPDATE_COMMENTS, { comments })
  }
}
