import actions from './actions'
import mutations from './mutations'
import getters from './getters'

// import { createUser } from '@/utils/model'

export default {
  namespaced: true,
  state: {
    user: null, // createUser(),
    authorityLoading: true
  },
  modules: {},
  actions,
  mutations,
  getters
}
