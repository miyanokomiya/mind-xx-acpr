<template>
<div class="map-menu">
  <InviteUserDialog
    v-if="canShare"
    ref="inviteUserDialog"
    :publicFile="!!publicFile"
    :publicReadOnly="publicFile ? !publicFile.write : false"
    :canEditPublic="canEditPublic"
    :userAuthorities="userAuthorities"
    :users="users"
    :user="user"
    @setStatus="setStatus"
    @invite="invite"
    @updateUserAuthorities="updateUserAuthorities"
    @click.native="loadUsers"
  />
  <MapHelpDialog ref="mapHelpDialog" />
</div>
</template>

<script>
import InviteUserDialog from '@/components/organisms/InviteUserDialog'
import MapHelpDialog from '@/components/organisms/MapHelpDialog'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes as nodesActionTypes } from '@/store/nodes/types'
import { getterTypes as filesGetterTypes, actionTypes as filesActionTypes } from '@/store/files/types'
import { getterTypes as userGetterTypes } from '@/store/user/types'
import { getterTypes as usersGetterTypes, actionTypes as usersActionTypes } from '@/store/users/types'

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
      user: userGetterTypes.USER
    }),
    ...mapGetters('users', {
      users: usersGetterTypes.USERS
    }),
    fileAuthority () {
      return this.fileAuthorityFromKey({fileKey: this.fileKey})
    },
    canEditPublic () {
      // only the file owenr can edit public settings
      return this.isMyFileFromKey({fileKey: this.fileKey})
    },
    canShare () {
      if (!this.user) {
        return false
      }
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
    },
    userAuthorities () {
      return this.fileAuthority.users || {}
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs.mapHelpDialog.dialog) {
      this.$refs.mapHelpDialog.dialog = false
      next(false)
    } else if (this.$refs.inviteUserDialog.dialog) {
      this.$refs.inviteUserDialog.dialog = false
      next(false)
    } else {
      next()
    }
  },
  methods: {
    ...mapActions('files', {
      inviteUser: filesActionTypes.INVITE_USER,
      updateStatus: filesActionTypes.UPDATE_STATUS,
      _updateUserAuthorities: filesActionTypes.UPDATE_USER_AUTHORITIES
    }),
    ...mapActions('users', {
      _loadUsers: usersActionTypes.LOAD_USERS,
      _loadUsersFromEmail: usersActionTypes.LOAD_USERS_FROM_EMAIL
    }),
    invite ({ email, readOnly }) {
      this.inviteUser({
        fileKey: this.fileKey,
        email,
        readOnly
      })
      this._loadUsersFromEmail({
        emailList: [email]
      })
    },
    setStatus ({publicFile, readOnly}) {
      this.updateStatus({
        publicFile,
        readOnly,
        fileKey: this.fileKey
      })
    },
    loadUsers () {
      this._loadUsers({
        users: this.userAuthorities
      })
    },
    updateUserAuthorities (userAuthorities) {
      this._updateUserAuthorities({
        userAuthorities,
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

