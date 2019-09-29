import { actionTypes, mutationTypes } from './types'
import firebase from '@/firebase'
import { createNode, getNodeDiff, isConflict, rescueConflict } from '@/utils/model'

const updateNodes =
  process.env.NODE_ENV === 'test'
    ? () => Promise.resolve()
    : (context, { nodes }) => {
        const fileKey = context.state.fileKey
        const comments = context.rootState.comments.comments
        const commentKeys = Object.keys(comments)
        const updates = Object.keys(nodes).reduce((p, c) => {
          p[`/nodes/${fileKey}/${c}`] = nodes[c]
          if (!nodes[c]) {
            // delete comments of this node
            commentKeys.forEach(key => {
              const comment = comments[key]
              if (comment.nodeId === c) {
                p[`/comments/${fileKey}/${key}`] = null
              }
            })
          }
          return p
        }, {})
        updates[`/files/${fileKey}/updated`] = firebase.database.ServerValue.TIMESTAMP
        const newNodes = Object.assign({}, context.state.nodes, nodes)
        updates[`/files/${fileKey}/nodeCount`] = Object.keys(newNodes).reduce(
          (count, c) => {
            return newNodes[c] ? count + 1 : count
          },
          0,
        )
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
          .ref('nodes/' + context.state.fileKey)
          .off()
      }

const connect =
  process.env.NODE_ENV === 'test'
    ? () => Promise.resolve()
    : (context, { fileKey }) => {
        var nodesRef = firebase.database().ref('nodes/' + fileKey)
        nodesRef.on('child_added', data => {
          const nodes = {
            [data.key]: createNode(data.val()),
          }
          context.commit(mutationTypes.UPDATE_NODES, { nodes })
          if (context.state.initialLoading) {
            context.commit(mutationTypes.SET_INITIAL_LOADING, {
              initialLoading: false,
            })
          }
        })
        nodesRef.on('child_changed', function(data) {
          const nodes = {
            [data.key]: createNode(data.val()),
          }
          context.commit(mutationTypes.UPDATE_NODES, { nodes })
        })
        nodesRef.on('child_removed', function(data) {
          const nodes = {
            [data.key]: null,
          }
          context.commit(mutationTypes.UPDATE_NODES, { nodes })
        })
        return Promise.resolve()
      }

export default {
  [actionTypes.DISCONNECT](context) {
    if (context.state.fileKey) {
      disconnect(context)
    }
    context.commit(mutationTypes.CLEAR_NODES)
  },
  [actionTypes.LOAD_NODES](context, { fileKey }) {
    context.dispatch(actionTypes.DISCONNECT)
    context.commit(mutationTypes.SET_FILE_KEY, { fileKey })
    context.commit(mutationTypes.SET_INITIAL_LOADING, { initialLoading: true })
    connect(
      context,
      { fileKey },
    )
  },
  [actionTypes.UPDATE_NODES](context, { nodes }) {
    // get only diff
    const diff = getNodeDiff({
      nodes: context.state.nodes,
      updatedNodes: nodes,
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
  [actionTypes.UNDO_NODES](context) {
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
          if (isConflict({ nodes: nextMerged })) {
            context.commit(mutationTypes.CLEAR_UNDO_STACKS)
            return reject(new Error('Failed to undo. Others may edit and conflicted.'))
          } else {
            // pop undo stack
            context.commit(mutationTypes.POP_UNDO_STACK)
            // local commit
            context.commit(mutationTypes.UPDATE_NODES, { nodes })
            // push firebase
            updateNodes(context, { nodes })
          }
        }
      } else {
        return reject(new Error('No undo history'))
      }
      return resolve()
    })
  },
  [actionTypes.REDO_NODES](context) {
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
          if (isConflict({ nodes: nextMerged })) {
            context.commit(mutationTypes.CLEAR_REDO_STACKS)
            return reject(new Error('Failed to redo. Others may edit and conflicted.'))
          } else {
            // pop redo stack
            context.commit(mutationTypes.POP_REDO_STACK)
            // local commit
            context.commit(mutationTypes.UPDATE_NODES, { nodes })
            // push firebase
            updateNodes(context, { nodes })
          }
        }
      } else {
        return reject(new Error('No redo history'))
      }
      return resolve()
    })
  },
  [actionTypes.RESCUE_CONFRICT](context) {
    if (!isConflict({ nodes: context.state.nodes })) {
      return Promise.resolve()
    }
    const nodes = rescueConflict({ nodes: context.state.nodes })
    // clear stack
    context.commit(mutationTypes.CLEAR_STACKS)
    // clear select
    context.commit(mutationTypes.SET_SELECTED_NODES, {})
    // local commit
    context.commit(mutationTypes.UPDATE_NODES, { nodes })
    // push firebase
    return updateNodes(context, { nodes })
  },
  [actionTypes.SET_SELECTED_NODES](context, { selectedNodes }) {
    context.commit(mutationTypes.SET_SELECTED_NODES, { selectedNodes })
  },
  [actionTypes.CLEAR_SELECT](context) {
    context.commit(mutationTypes.SET_SELECTED_NODES, {})
  },
}
