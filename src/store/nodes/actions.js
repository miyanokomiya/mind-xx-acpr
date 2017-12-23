import { actionTypes, mutationTypes } from './types'
import firebase from '@/firebase'
import { createNode } from '@/utils/model'

export default {
  [actionTypes.DISCONNECT] (context) {
    if (context.state.fileKey) {
      firebase
        .database()
        .ref('nodes/' + context.state.fileKey)
        .off()
    }
    context.commit(mutationTypes.CLEAR_NODES)
  },
  [actionTypes.LOAD_NODES] (context, { fileKey }) {
    context.dispatch(actionTypes.DISCONNECT)
    context.commit(mutationTypes.SET_FILE_KEY, { fileKey })
    var commentsRef = firebase.database().ref('nodes/' + fileKey)
    commentsRef.on('child_added', data => {
      const nodes = {
        [data.key]: createNode(data.val())
      }
      context.commit(mutationTypes.UPDATE_NODES, { nodes })
    })
    commentsRef.on('child_changed', function (data) {
      const nodes = {
        [data.key]: createNode(data.val())
      }
      context.commit(mutationTypes.UPDATE_NODES, { nodes })
    })
    commentsRef.on('child_removed', function (data) {
      const nodes = {
        [data.key]: null
      }
      context.commit(mutationTypes.UPDATE_NODES, { nodes })
    })
  },
  [actionTypes.UPDATE_NODES] (context, { nodes }) {
    // local commit
    context.commit(mutationTypes.UPDATE_NODES, { nodes })

    const fileKey = context.state.fileKey
    const updates = Object.keys(nodes).reduce((p, c) => {
      // get new keys for new nodes
      p[`/nodes/${fileKey}/${c}`] = nodes[c]
      return p
    }, {})
    updates[`/files/${fileKey}/updated`] =
      firebase.database.ServerValue.TIMESTAMP
    updates[`/files/${fileKey}/nodeCount`] = Object.keys(
      Object.assign({}, context.state.nodes, nodes)
    ).length
    firebase
      .database()
      .ref()
      .update(updates)
  },
  [actionTypes.SET_SELECTED_NODES] (context, { selectedNodes }) {
    context.commit(mutationTypes.SET_SELECTED_NODES, { selectedNodes })
  },
  [actionTypes.CLEAR_SELECT] (context) {
    context.commit(mutationTypes.SET_SELECTED_NODES, {})
  }
}
