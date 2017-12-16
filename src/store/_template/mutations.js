import { mutationTypes } from './types'

export default {
  [mutationTypes.SET_LEFT_DRAWER] (state, { leftDrawer }) {
    state.leftDrawer = leftDrawer
  }
}
