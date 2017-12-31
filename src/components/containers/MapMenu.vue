<template>
<div class="map-menu">
  <InviteUserDialog
    v-if="canShare"
    :publicFile="!!publicFile"
    :publicReadOnly="publicFile ? !publicFile.write : false"
    :canEditPublic="canEditPublic"
    @setStatus="setStatus"
    @invite="invite"
  />
  <MapHelpDialog/>
</div>
</template>

<script>
import InviteUserDialog from '@/components/organisms/InviteUserDialog'
import MapHelpDialog from '@/components/organisms/MapHelpDialog'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes as nodesActionTypes } from '@/store/nodes/types'
import { getterTypes as filesGetterTypes, actionTypes as filesActionTypes } from '@/store/files/types'
import { getterTypes as userActionTypes } from '@/store/user/types'

export default {
  components: {
    InviteUserDialog,
    MapHelpDialog
  },
  computed: {
    ...mapGetters('nodes', {
      fileKey: nodesActionTypes.FILE_KEY
    }),
    ...mapGetters('files', {
      fileAuthorityFromKey: filesGetterTypes.FILE_AUTHORITY_FROM_KEY,
      isMyFileFromKey: filesGetterTypes.IS_MY_FILE_FROM_KEY
    }),
    ...mapGetters('user', {
      user: userActionTypes.USER
    }),
    fileAuthority () {
      return this.fileAuthorityFromKey({fileKey: this.fileKey})
    },
    canEditPublic () {
      // only the file owenr can edit public settings
      return this.isMyFileFromKey({fileKey: this.fileKey})
    },
    canShare () {
      const uid = this.user.uid
      const fileAuthority = this.fileAuthority
      if (fileAuthority) {
        // The file owenr and users who are invited and have writable authority can invite others.
        const authority = fileAuthority.users[uid]
        return authority && authority.write
      } else {
        return false
      }
    },
    publicFile () {
      const fileAuthority = this.fileAuthority
      if (fileAuthority) {
        return fileAuthority.public
      } else {
        return null
      }
    }
  },
  methods: {
    ...mapActions('files', {
      inviteUser: filesActionTypes.INVITE_USER,
      updateStatus: filesActionTypes.UPDATE_STATUS
    }),
    invite ({ email, readOnly }) {
      this.inviteUser({
        fileKey: this.fileKey,
        email,
        readOnly
      })
    },
    setStatus ({publicFile, readOnly}) {
      this.updateStatus({
        publicFile,
        readOnly,
        fileKey: this.fileKey
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

