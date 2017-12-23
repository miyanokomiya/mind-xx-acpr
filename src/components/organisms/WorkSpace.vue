<template>
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
  </v-card-title>
  <v-data-table
      :headers="headers"
      :items="fileList"
      :pagination.sync="pagination"
      hide-actions
    >
    <template slot="items" slot-scope="props">
      <td>
        <v-edit-dialog
          lazy
        > {{ props.item.name }}
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
    </template>
  </v-data-table>
  <div class="text-xs-center pt-2">
    <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
  </div>
</v-card>
</template>

<script>
export default {
  data: () => ({
    max25chars: (v) => v.length <= 25 || 'Input too long!',
    tmp: '',
    searchText: '',
    pagination: {
      sortBy: 'column',
      page: 1,
      rowsPerPage: 5,
      descending: false
    },
    headers: [
      {
        text: 'Name',
        align: 'left',
        value: 'name'
      },
      { text: 'Updated', value: 'updated' },
      { text: 'Created', value: 'created' }
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
    }
  }
}
</script>

<style lang="postcss" scoped>

</style>

