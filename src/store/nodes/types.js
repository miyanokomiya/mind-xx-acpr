export const getterTypes = {
  NODES: 'NODES',
  SELECTED_NODES: 'SELECTED_NODES',
  FILE_KEY: 'FILE_KEY',
  INITIAL_LOADING: 'INITIAL_LOADING',
}

export const actionTypes = {
  DISCONNECT: 'DISCONNECT',
  LOAD_NODES: 'LOAD_NODES',
  UPDATE_NODES: 'UPDATE_NODES',
  UNDO_NODES: 'UNDO_NODES',
  REDO_NODES: 'REDO_NODES',
  SET_SELECTED_NODES: 'SET_SELECTED_NODES',
  CLEAR_SELECT: 'CLEAR_SELECT',
  RESCUE_CONFRICT: 'RESCUE_CONFRICT',
}

export const mutationTypes = {
  UPDATE_NODES: 'UPDATE_NODES',
  SET_SELECTED_NODES: 'SET_SELECTED_NODES',
  SET_FILE_KEY: 'SET_FILE_KEY',
  CLEAR_NODES: 'CLEAR_NODES',
  SET_INITIAL_LOADING: 'SET_INITIAL_LOADING',
  PUSH_UNDO_STACK: 'PUSH_UNDO_STACK',
  POP_UNDO_STACK: 'POP_UNDO_STACK',
  POP_REDO_STACK: 'POP_REDO_STACK',
  CLEAR_STACKS: 'CLEAR_STACKS',
  CLEAR_UNDO_STACKS: 'CLEAR_UNDO_STACKS',
  CLEAR_REDO_STACKS: 'CLEAR_REDO_STACKS',
}
