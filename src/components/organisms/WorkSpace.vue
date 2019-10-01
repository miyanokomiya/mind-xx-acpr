<template>
  <div class="work-space-component">
    <v-card>
      <v-card-title>
        <v-flex xs6>
          <v-select
            class="data-kind-select"
            :items="[
              { text: 'All files', value: 'all' },
              { text: 'My files', value: 'workSpace' },
              { text: 'Shared files', value: 'shared' },
            ]"
            v-model="dataKind"
            single-line
            bottom
            hide-details
          />
        </v-flex>
        <div class="header-buttons">
          <v-btn dark fab small color="green" v-if="!hideEditTools" @click="createFile">
            <v-icon>add</v-icon>
          </v-btn>
        </div>
      </v-card-title>
    </v-card>
    <v-card>
      <div class="header-tools"></div>
      <v-flex xs-12 v-for="file in sortedFileList" :key="file.key">
        <v-card class="file-card">
          <v-card-title class="card-title">
            <div
              class="content-box"
              @click="$router.push({ name: 'Map', params: { fileKey: file.key } })"
            >
              <p class="file-name mb-0">{{ file.name || 'untitled' }}</p>
              <dl>
                <dt>Nodes:</dt>
                <dd>{{ file.nodeCount }}</dd>
              </dl>
              <dl>
                <dt>Updated:</dt>
                <dd>{{ dateFormat(file.updated) }}</dd>
              </dl>
            </div>
            <div class="button-box">
              <v-chip
                class="shared-tag"
                :class="{ hidden: !sharedFileAuthorities[file.key] }"
              >
                shared
              </v-chip>
              <div class="buttons">
                <v-edit-dialog lazy :class="{ hidden: !canWrite[file.key] }">
                  <v-btn dark fab small color="blue" class="file-button edit-name">
                    <v-icon>textsms</v-icon>
                  </v-btn>
                  <v-text-field
                    single-line
                    counter
                    slot="input"
                    label="Edit"
                    :value="file.name"
                    @change="val => changeName({ key: file.key, name: val })"
                  ></v-text-field>
                </v-edit-dialog>
                <v-btn
                  dark
                  fab
                  small
                  outlined
                  color="black"
                  class="file-button"
                  @click="cloneFile(file.key)"
                >
                  <v-icon>content_copy</v-icon>
                </v-btn>
                <v-btn
                  dark
                  fab
                  small
                  outlined
                  color="black"
                  class="file-button"
                  :class="{ hidden: sharedFileAuthorities[file.key] }"
                  @click="deleteFile(file.key)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-card>
    <v-snackbar bottom right :timeout="2000" v-model="snackbar">
      One more click to delete.
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    pagination: {
      sortBy: 'updated',
      descending: true,
    },
    snackbar: false,
    dataKind: 'all',
  }),
  props: {
    files: {
      type: Object,
      default: () => ({}),
    },
    fileAuthorities: {
      type: Object,
      default: () => ({}),
    },
    sharedFiles: {
      type: Object,
      default: () => ({}),
    },
    sharedFileAuthorities: {
      type: Object,
      default: () => ({}),
    },
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    headers() {
      return [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
        },
        { text: 'Count', value: 'nodeCount' },
        { text: 'Updated', value: 'updated' },
        { text: 'Created', value: 'created' },
        { text: '', value: '', sortable: false },
        { text: '', value: '', sortable: false },
      ]
    },
    currentFiles() {
      if (this.dataKind === 'shared') {
        return this.sharedFiles
      } else if (this.dataKind === 'workSpace') {
        return this.files
      } else {
        return { ...this.sharedFiles, ...this.files }
      }
    },
    currentFileAuthorities() {
      if (this.dataKind === 'shared') {
        return this.sharedFileAuthorities
      } else if (this.dataKind === 'workSpace') {
        return this.fileAuthorities
      } else {
        return { ...this.sharedFileAuthorities, ...this.fileAuthorities }
      }
    },
    sortedFileList() {
      const sortBy = [this.pagination.sortBy]
      const coefficient = this.pagination.descending ? -1 : 1
      return Object.keys(this.currentFiles)
        .map(key => {
          return Object.assign({}, this.currentFiles[key], { key })
        })
        .sort((a, b) => {
          return (a[sortBy] - b[sortBy]) * coefficient
        })
    },
    canWrite() {
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
    hideEditTools() {
      return this.dataKind === 'shared'
    },
  },
  methods: {
    changeName({ key, name }) {
      const files = {
        [key]: Object.assign({}, this.currentFiles[key], { name }),
      }
      this.$emit('changeName', { files })
    },
    createFile() {
      this.$emit('createFile', {
        file: { name: '' },
      })
      this.pagination.sortBy = 'updated'
      this.pagination.descending = true
    },
    deleteFile(key) {
      if (this.snackbar) {
        const files = {
          [key]: null,
        }
        this.$emit('deleteFiles', { files })
        this.snackbar = false
      } else {
        this.snackbar = true
      }
    },
    cloneFile(key) {
      const file = this.currentFiles[key]
      if (file) {
        this.$emit('cloneFile', { fileKey: key })
      }
    },
    dateFormat(ms) {
      const date = new Date(ms)
      const yyyy = date.getFullYear()
      const mm = `0${date.getMonth() + 1}`.slice(-2)
      const dd = `0${date.getDate()}`.slice(-2)
      const hh = `0${date.getHours()}`.slice(-2)
      const mi = `0${date.getMinutes()}`.slice(-2)
      const se = `0${date.getSeconds()}`.slice(-2)
      return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${se}`
    },
  },
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
    margin-left: auto;
  }
  .header-tools {
    display: flex;
  }
  .file-card {
    padding: 0;
    border-bottom: 1px solid rgba(#bbb, 0.4);
  }
  .card-title {
    padding: 0;
    display: flex;

    .file-name {
      word-wrap: break-word;
      font-size: 1.3em;
      font-weight: 500;
    }
    .content-box {
      flex-grow: 1;
      max-width: 100%;
      margin-left: 0.7em;
      margin-right: 0.7em;
      padding: 0.2em 0.3em;
      padding-right: 0.5em;
      box-shadow: 1px 1px 8px -3px gray;
      text-align: left;
      cursor: pointer;

      &:hover {
        background-color: rgba(#eee, 0.7);
      }
    }
    .button-box {
      margin-left: auto;
      padding-right: 6px;
      text-align: left;
    }
    .shared-tag {
      height: 24px;
    }
    .buttons {
      display: flex;
      margin-bottom: 4px;
    }
    dl {
      display: flex;
      vertical-align: bottom;
      margin-left: 0.5em;
      font-size: 0.9em;
    }
    dt {
      margin-left: 1em;
      font-weight: 500;
    }
    dt:first-child {
      margin-left: 0;
    }
    dd {
      margin-left: 0.3em;
    }
  }
  .file-button {
    margin: 2px 0 0 8px;

    &.edit-name {
      margin-left: 0;
    }
  }
  .hidden {
    visibility: hidden;
  }
}
.btn--floating.btn--small .icon {
  line-height: 40px;
}
</style>
