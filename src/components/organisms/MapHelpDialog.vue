<template>
<v-layout row justify-center>
  <v-dialog v-model="dialog" width="400px">
    <v-btn icon slot="activator">
      <v-icon>help</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">Help</span>
      </v-card-title>
      <v-list two-line subheader>

        <v-divider></v-divider>
        <v-subheader>Selecting a Node</v-subheader>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <code>Arrow</code>
            </v-list-tile-title>
            <v-list-tile-sub-title>Move focus</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <code>Enter</code>
            </v-list-tile-title>
            <v-list-tile-sub-title>Create a younger node</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <code>Delete</code>
            </v-list-tile-title>
            <v-list-tile-sub-title>Delete a node</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <code>Shift</code> + <code>Enter</code>
            </v-list-tile-title>
            <v-list-tile-sub-title>Create a child node</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <code>Space</code>
            </v-list-tile-title>
            <v-list-tile-sub-title>Edit text</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <code>Drag</code>
            </v-list-tile-title>
            <v-list-tile-sub-title>Change the parent</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <code>Shift</code> + <code>Up or Down</code>
            </v-list-tile-title>
            <v-list-tile-sub-title>Switch order</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>
        <v-subheader>Editing Text of a Node</v-subheader>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <code>Escape</code>
            </v-list-tile-title>
            <v-list-tile-sub-title>Complete editing text</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>

      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black darken-1" flat="flat" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false
  })
}
</script>

<style lang="scss" scoped>

</style>

