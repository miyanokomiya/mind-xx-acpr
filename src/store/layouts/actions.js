import { actionTypes, mutationTypes } from './types'

export default {
  [actionTypes.SET_LEFT_DRAWER](context, { leftDrawer }) {
    context.commit(mutationTypes.SET_LEFT_DRAWER, { leftDrawer })
  },
}
