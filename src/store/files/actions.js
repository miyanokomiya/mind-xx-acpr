import { actionTypes, mutationTypes } from './types'

export default {
  [actionTypes.UPDATE_FILES] (context, { files }) {
    context.commit(mutationTypes.UPDATE_FILES, { files })
  }
}
