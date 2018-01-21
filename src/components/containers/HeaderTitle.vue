<template>
<div class="header-title-wrapper">
  <div v-if="file" class="header-title">
    <v-btn icon small class="button"
      v-if="file"
      @click="moveToHome"
    >
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <h1 class="title-text">{{file.name || 'untitled'}}</h1>
  </div>
  <v-btn v-else class="header-title" flat @click="moveToHome">MindXXACPR</v-btn>
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
  },
  methods: {
    moveToHome () {
      this.$router.push({name: 'WorkSpace'})
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

