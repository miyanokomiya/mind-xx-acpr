<template>
<div class="map-menu">
  <InviteUserDialog @invite="invite"/>
  <MapHelpDialog/>
</div>
</template>

<script>
import InviteUserDialog from '@/components/organisms/InviteUserDialog'
import MapHelpDialog from '@/components/organisms/MapHelpDialog'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes as nodesActionTypes } from '@/store/nodes/types'
import { actionTypes as filesActionTypes } from '@/store/files/types'

export default {
  components: {
    InviteUserDialog,
    MapHelpDialog
  },
  computed: {
    ...mapGetters('nodes', {
      fileKey: nodesActionTypes.FILE_KEY
    })
  },
  methods: {
    ...mapActions('files', {
      inviteUser: filesActionTypes.INVITE_USER
    }),
    invite ({ email }) {
      this.inviteUser({
        fileKey: this.fileKey,
        email
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.map-menu {
  display: inherit;
}
</style>

