<template>
<div class="work-space-component">
<v-card>
  <v-card-title>
    Work space
    <!-- <v-spacer></v-spacer>
    <v-text-field
      append-icon="search"
      label="Search"
      single-line
      hide-details
      v-model="searchText"
    /> -->
    <div class="header-buttons">
      <v-btn
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
      <td>
        <v-edit-dialog
          lazy
        >
          <span class="name elevation-3">{{ props.item.name }}</span>
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
      </td>
      <td class="text-xs-right">{{ props.item.created }}</td>
      <td class="text-xs-right">{{ props.item.updated }}</td>
      <td class="delete-button-cell">
        <v-btn
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
      { text: 'Updated', value: 'updated' },
      { text: 'Created', value: 'created' },
      { text: '', value: '', sortable: false }
    ],
  }),
  props: {
    files: {
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
    fileList () {
      return Object.keys(this.files).map(key => {
        return {
          key,
          name: this.files[key].name,
          created: this.files[key].created,
          updated: this.files[key].updated
        }
      })
    }
  },
  methods: {
    changeName ({ key, name }) {
      const files = {
        [key]: Object.assign({}, this.files[key], { name })
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
      const files = {
        [key]: null
      }
      this.$emit('deleteFiles', { files })
    }
  }
}
</script>

<style lang="scss" scoped>
.work-space-component {
  width: 100%;
  height: 100%;

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

