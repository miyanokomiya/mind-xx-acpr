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
        <v-subheader>Select</v-subheader>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Move focus
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Arrow</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Multiple
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Shift</code> + <code>Click</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Rectangle
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Shift</code> + <code>Drag</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>
        <v-subheader>Selecting a Node</v-subheader>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Create a younger node
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Enter</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Create a child node
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Shift</code> + <code>Enter</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Delete a node
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Shift</code> + <code>Delete</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Edit text
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Space</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Complete editing text
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Escape</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Change the parent
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Drag</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Switch order
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Shift</code> + <code>Up or Down</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>
        <v-subheader>History</v-subheader>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Undo
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Control</code> + <code>Z</code> , <code>Command</code> + <code>Z</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              Redo
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <code>Control</code> + <code>Shift</code> + <code>Z</code> , <code>Command</code> + <code>Shift</code> + <code>Z</code>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
      <v-divider></v-divider>
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

