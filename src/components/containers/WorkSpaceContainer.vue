<template>
<WorkSpace
  :files="files"
  @changeName="updateFiles"
/>
</template>

<script>
import WorkSpace from '@/components/organisms/WorkSpace'

import { mapGetter, mapActions } from '@/store/files'
import { getterTypes, actionTypes } from '@/store/files/types'

export default {
  components: {
    WorkSpace
  },
  computed: {
    ...mapGetter('files', {
      files: getterTypes.FILES
    })
  },
  methods: {
    ...mapActions('files', {
      updateFiles: actionTypes.UPDATE_FILES
    })
  }
}
</script>

<style lang="postcss" scoped>

</style>

