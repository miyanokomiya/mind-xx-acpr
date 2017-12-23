<template>
<WorkSpace
  :files="files"
  @changeName="updateFiles"
  @createFile="createFile"
  @deleteFiles="deleteFiles"
/>
</template>

<script>
import WorkSpace from '@/components/organisms/WorkSpace'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes, actionTypes } from '@/store/files/types'

export default {
  components: {
    WorkSpace
  },
  computed: {
    ...mapGetters('files', {
      files: getterTypes.FILES
    })
  },
  mounted () {
    this.loadFiles()
  },
  methods: {
    ...mapActions('files', {
      loadFiles: actionTypes.LOAD_FILES,
      updateFiles: actionTypes.UPDATE_FILES,
      createFile: actionTypes.CREATE_FILE,
      deleteFiles: actionTypes.DELETE_FILES
    })
  }
}
</script>

<style lang="postcss" scoped>

</style>

