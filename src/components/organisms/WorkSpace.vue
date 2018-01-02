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
        <td class="text-xs-left open-file" @click="$router.push({name: 'Map', params: { fileKey: props.item.key }})">
          <span class="name elevation-1">{{ props.item.name || 'untitled' }}</span>
        </td>
        <td class="text-xs-right count">{{ props.item.nodeCount }}</td>
        <td class="text-xs-right datetime">{{ new Date(props.item.created).toLocaleString() }}</td>
        <td class="text-xs-right datetime">{{ new Date(props.item.updated).toLocaleString() }}</td>
        <td class="button-column">
          <v-edit-dialog
            lazy
            v-if="canWrite[props.item.key]"
          >
            <v-btn
              dark
              fab
              small
              color="blue"
            >
              <v-icon>edit</v-icon>
            </v-btn>
            <v-text-field
              slot="input"
              label="Edit"
              single-line
              counter
              :value="props.item.name"
              @change="val => changeName({ key: props.item.key, name: val })"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="button-column">
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
      { text: '', value: '', sortable: false },
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
          const authority = fileAuthority.users[uid]
          if (authority) {
            p[fileKey] = authority.write
          } else {
            if (fileAuthority.public) {
              // this file is public
              p[fileKey] = fileAuthority.public.write
            } else {
              // no authority
              p[fileKey] = false
            } 
          }
        } else {
              // no authority
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
        file: { name: '' }
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
  .open-file {
    cursor: pointer;
  }
  .name {
    padding: 5px 10px;
    width: 100%;
    display: inline-block;
  }
  .count {
    width: 50px;
  }
  .datetime {
    width: 50px;
  }
  .button-column {
    width: 50px;
    padding: 0;
  }
}
</style>

