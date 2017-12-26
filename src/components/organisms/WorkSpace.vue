<template>
<div class="work-space-component">
  <v-card>
    <v-card-title>
      <v-flex xs6>
        <v-select
          class="data-kind-select"
          :items="[{text: 'Work space', value: 'workSpace'}, {text: 'Shared', value: 'shared'}]"
          v-model="dataKind"
          single-line
          bottom
          hide-details
        />
      </v-flex>
      <div class="header-buttons">
        <v-btn
          v-if="!hideEditTools"
          dark
          fab
          small
          color="green"
          @click="createFile"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    </v-card>
    <v-card>
    <v-data-table
        :headers="headers"
        :items="fileList"
        :pagination.sync="pagination"
        hide-actions
        must-sort
        expand
      >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">
          <v-btn
            v-if="canWrite[props.item.key]"
            dark
            fab
            small
            color="blue"
            @click="$router.push({name: 'Map', params: { fileKey: props.item.key }})"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn
            v-else
            dark
            fab
            small
            color="blue"
            @click="$router.push({name: 'Map', params: { fileKey: props.item.key }})"
          >
            <v-icon>navigate_next</v-icon>
          </v-btn>
          <v-edit-dialog
            lazy
            v-if="canWrite[props.item.key]"
          >
            <span class="name elevation-1">{{ props.item.name }}</span>
            <v-text-field
              slot="input"
              label="Edit"
              single-line
              counter
              :rules="[max25chars]"
              :value="props.item.name"
              @change="val => changeName({ key: props.item.key, name: val })"
            ></v-text-field>
          </v-edit-dialog>
          <span v-else class="name">{{ props.item.name }}</span>
        </td>
        <td class="text-xs-right">{{ props.item.nodeCount }}</td>
        <td class="text-xs-right">{{ new Date(props.item.created).toLocaleString() }}</td>
        <td class="text-xs-right">{{ new Date(props.item.updated).toLocaleString() }}</td>
        <td class="delete-button-cell">
          <v-btn
            v-if="!hideEditTools"
            dark
            fab
            small
            color="black"
            outline
            @click="deleteFile(props.item.key)"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
  </v-card>
  <v-snackbar
    bottom
    right
    :timeout="2000"
    v-model="snackbar"
  >
    One more click to delete.
  </v-snackbar>
</div>
</template>

<script>
export default {
  data: () => ({
    max25chars: (v) => v.length <= 25 || 'Input too long!',
    tmp: '',
    searchText: '',
    pagination: {
      page: 1,
      rowsPerPage: 10,
      sortBy: 'created',
      descending: true
    },
    headers: [
      {
        text: 'Name',
        align: 'left',
        value: 'name'
      },
      { text: 'Count', value: 'nodeCount' },
      { text: 'Updated', value: 'updated' },
      { text: 'Created', value: 'created' },
      { text: '', value: '', sortable: false }
    ],
    snackbar: false,
    dataKind: 'workSpace'
  }),
  props: {
    files: {
      type: Object,
      default: () => ({})
    },
    fileAuthorities: {
      type: Object,
      default: () => ({})
    },
    sharedFiles: {
      type: Object,
      default: () => ({})
    },
    sharedFileAuthorities: {
      type: Object,
      default: () => ({})
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    pagination: {
      handler () {
      },
      deep: true
    }
  },
  computed: {
    pages () {
      return this.pagination.rowsPerPage ? Math.ceil(this.fileList.length / this.pagination.rowsPerPage) : 0
    },
    currentFiles () {
      if (this.dataKind === 'shared') {
        return this.sharedFiles
      } else {
        return this.files
      }
    },
    currentFileAuthorities () {
      if (this.dataKind === 'shared') {
        return this.sharedFileAuthorities
      } else {
        return this.fileAuthorities
      }
    },
    fileList () {
      return Object.keys(this.currentFiles).map(key => {
        return Object.assign({}, this.currentFiles[key], { key })
      })
    },
    canWrite () {
      const uid = this.user.uid
      const ret = Object.keys(this.currentFileAuthorities).reduce((p, fileKey) => {
        const fileAuthority = this.currentFileAuthorities[fileKey]
        if (fileAuthority) {
          const authority = fileAuthority[uid]
          p[fileKey] = authority.write
        } else {
          p[fileKey] = false
        }
        return p
      }, {})
      return ret
    },
    hideEditTools () {
      return this.dataKind === 'shared'
    }
  },
  methods: {
    changeName ({ key, name }) {
      const files = {
        [key]: Object.assign({}, this.currentFiles[key], { name })
      }
      this.$emit('changeName', { files })
    },
    createFile () {
      this.$emit('createFile', {
        file: { name: 'untitled' }
      })
      this.pagination.sortBy = 'created'
      this.pagination.descending = true
    },
    deleteFile (key) {
      if (this.snackbar) {
        const files = {
          [key]: null
        }
        this.$emit('deleteFiles', { files })
        this.snackbar = false
      } else {
        this.snackbar = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.work-space-component {
  width: 100%;
  height: 100%;

  .data-kind-select {
    padding: 0;
  }
  .header-buttons {
    right: 0;
    top: 0;
    position: absolute;
  }
  .name {
    padding: 5px 10px;
  }
  .delete-button-cell {
    width: 50px;
    padding: 0;
  }
}
</style>

