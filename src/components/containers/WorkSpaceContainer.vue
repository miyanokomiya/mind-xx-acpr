<template>
  <div class="work-space-wrapper">
    <WorkSpace
      :files="files"
      :fileAuthorities="fileAuthorities"
      :sharedFiles="sharedFiles"
      :sharedFileAuthorities="sharedFileAuthorities"
      :user="user"
      @changeName="updateFiles"
      @createFile="createFile"
      @cloneFile="cloneFile"
      @deleteFiles="deleteFiles"
    />
  </div>
</template>

<script>
import WorkSpace from '@/components/organisms/WorkSpace'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes, actionTypes } from '@/store/files/types'
import { getterTypes as userGetterTYpes } from '@/store/user/types'

export default {
  components: {
    WorkSpace,
  },
  computed: {
    ...mapGetters('files', {
      files: getterTypes.FILES,
      fileAuthorities: getterTypes.FILE_AUTHORITIES,
      sharedFiles: getterTypes.SHARED_FILES,
      sharedFileAuthorities: getterTypes.SHARED_FILE_AUTHORITIES,
    }),
    ...mapGetters('user', {
      user: userGetterTYpes.USER,
    }),
  },
  created() {
    this.loadFiles()
  },
  methods: {
    ...mapActions('files', {
      loadFiles: actionTypes.LOAD_FILES,
      updateFiles: actionTypes.UPDATE_FILES,
      createFile: actionTypes.CREATE_FILE,
      cloneFile: actionTypes.CLONE_FILE,
      deleteFiles: actionTypes.DELETE_FILES,
    }),
  },
}
</script>

<style lang="scss" scoped>
.work-space-wrapper {
  margin: 0 10px;
  width: 100%;
}
</style>
