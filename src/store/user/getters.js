import { getterTypes } from './types'
import { getterTypes as filesGetterTypes } from '../files/types'

export default {
  [getterTypes.USER](state) {
    return state.user
  },
  [getterTypes.AUTHORITY_LOADING](state) {
    return state.authorityLoading
  },
  [getterTypes.CAN_WRITE]: (state, getters, rootState, rootGetters) => ({ fileKey }) => {
    const getType = `files/${filesGetterTypes.FILE_AUTHORITY_FROM_KEY}`
    const fileAuthority = rootGetters[getType]({ fileKey })
    const user = state.user
    if (fileAuthority) {
      if (fileAuthority.public && fileAuthority.public.write) {
        // this file is public and writable
        return true
      }
      if (!user) {
        return false
      }
      const authority = fileAuthority.users ? fileAuthority.users[user.uid] : null
      return !!authority && authority.write
    } else {
      return false
    }
  },
}
