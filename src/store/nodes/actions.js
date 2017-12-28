import { actionTypes, mutationTypes } from './types'
import firebase from '@/firebase'
import { createNode, getNodeDiff, isConfrict } from '@/utils/model'

const updateNodes =
  process.env.NODE_ENV === 'test'
    ? () => {}
    : (context, { nodes }) => {
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
      }

const disconnect =
  process.env.NODE_ENV === 'test'
    ? () => {}
    : context => {
        firebase
          .database()
          .ref('nodes/' + context.state.fileKey)
          .off()
      }

const connect =
  process.env.NODE_ENV === 'test'
    ? () => {}
    : (context, { fileKey }) => {
        var commentsRef = firebase.database().ref('nodes/' + fileKey)
        commentsRef.on('child_added', data => {
          const nodes = {
            [data.key]: createNode(data.val())
          }
          context.commit(mutationTypes.UPDATE_NODES, { nodes })
          if (context.state.initialLoading) {
            context.commit(mutationTypes.SET_INITIAL_LOADING, {
              initialLoading: false
            })
          }
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
      }

export default {
  [actionTypes.DISCONNECT] (context) {
    if (context.state.fileKey) {
      disconnect(context)
    }
    context.commit(mutationTypes.CLEAR_NODES)
  },
  [actionTypes.LOAD_NODES] (context, { fileKey }) {
    context.dispatch(actionTypes.DISCONNECT)
    context.commit(mutationTypes.SET_FILE_KEY, { fileKey })
    context.commit(mutationTypes.SET_INITIAL_LOADING, { initialLoading: true })
    connect(context, { fileKey })
  },
  [actionTypes.UPDATE_NODES] (context, { nodes }) {
    // get only diff
    const diff = getNodeDiff({
      nodes: context.state.nodes,
      updatedNodes: nodes
    })
    if (Object.keys(diff).length === 0) {
      return
    }
    // save undo stack
    context.commit(mutationTypes.PUSH_UNDO_STACK, { nodes: diff })
    // local commit
    context.commit(mutationTypes.UPDATE_NODES, { nodes: diff })
    // push firebase
    updateNodes(context, { nodes: diff })
  },
  [actionTypes.UNDO_NODES] (context) {
    return new Promise((resolve, reject) => {
      const stacks = context.state.undoStacks
      if (stacks.length > 0) {
        const nodes = stacks[stacks.length - 1]
        if (nodes) {
          // check all parents exist after merging
          const nextMerged = Object.assign({}, context.state.nodes, nodes)
          for (const key in nextMerged) {
            if (!nextMerged[key]) {
              delete nextMerged[key]
            }
          }
          if (isConfrict({ nodes: nextMerged })) {
            context.commit(mutationTypes.CLEAR_STACKS)
            return reject(
              new Error('Failed to undo. Others may edit and confricted.')
            )
          } else {
            // pop undo stack
            context.commit(mutationTypes.POP_UNDO_STACK)
            // local commit
            context.commit(mutationTypes.UPDATE_NODES, { nodes })
            // push firebase
            updateNodes(context, { nodes })
          }
        }
      }
      return resolve()
    })
  },
  [actionTypes.REDO_NODES] (context) {
    return new Promise((resolve, reject) => {
      const stacks = context.state.redoStacks
      if (stacks.length > 0) {
        const nodes = stacks[stacks.length - 1]
        if (nodes) {
          // check all parents exist after merging
          const nextMerged = Object.assign({}, context.state.nodes, nodes)
          for (const key in nextMerged) {
            if (!nextMerged[key]) {
              delete nextMerged[key]
            }
          }
          if (isConfrict({ nodes: nextMerged })) {
            context.commit(mutationTypes.CLEAR_STACKS)
            return reject(
              new Error('Failed to redo. Others may edit and confricted.')
            )
          } else {
            // pop redo stack
            context.commit(mutationTypes.POP_REDO_STACK)
            // local commit
            context.commit(mutationTypes.UPDATE_NODES, { nodes })
            // push firebase
            updateNodes(context, { nodes })
          }
        }
      }
      return resolve()
    })
  },
  [actionTypes.SET_SELECTED_NODES] (context, { selectedNodes }) {
    context.commit(mutationTypes.SET_SELECTED_NODES, { selectedNodes })
  },
  [actionTypes.CLEAR_SELECT] (context) {
    context.commit(mutationTypes.SET_SELECTED_NODES, {})
  }
}
