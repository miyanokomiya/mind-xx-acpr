<template>
<div class="header-title-wrapper">
  <div v-if="file" class="header-title">
    <router-link style="text-decoration: none;" :to="{name: 'WorkSpace'}">
      <v-btn icon small class="button"
        v-if="file"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </router-link>
    <h1 class="title-text">{{file.name || 'untitled'}}</h1>
  </div>
  <router-link v-else :to="{name: 'Top'}">
    <v-btn class="header-title" flat>MindXXACPR</v-btn>
  </router-link>
</div>
</template>

<script>
import InviteUserDialog from '@/components/organisms/InviteUserDialog'
import MapHelpDialog from '@/components/organisms/MapHelpDialog'

import { mapGetters } from 'vuex'
import { getterTypes as nodesActionTypes } from '@/store/nodes/types'
import { getterTypes as filesGetterTypes } from '@/store/files/types'

export default {
  components: {
    InviteUserDialog,
    MapHelpDialog
  },
  props: {
  },
  computed: {
    ...mapGetters('nodes', {
      fileKey: nodesActionTypes.FILE_KEY
    }),
    ...mapGetters('files', {
      fileFromKey: filesGetterTypes.FILE_FROM_KEY
    }),
    file () {
      return this.fileFromKey({fileKey: this.fileKey})
    }
  }
}
</script>

<style lang="scss" scoped>
.header-title-wrapper {
  display: inline-flex;
}
.header-title {
  margin-left: 0;
  margin-right: 0;
}
.button {
  margin-right: 0;
  margin-left: 0;
}
.title-text {
  display: inline-flex;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  font-size: 16px;
}
</style>

