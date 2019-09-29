<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" width="400px">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>help</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Help</span>
        </v-card-title>
        <v-list two-line subheader>
          <v-divider></v-divider>
          <v-subheader>Select</v-subheader>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Move focus
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Arrow key</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Multiple
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Shift</code> + <code>Click</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Rectangle
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Shift</code> + <code>Drag</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
          <v-subheader>Selecting a Node</v-subheader>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Create a younger node
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Enter</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Create a child node
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Shift</code> + <code>Enter</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Delete a node
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Shift</code> + <code>Delete</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Edit text
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Space</code> , <code>Double click</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Complete editing text
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Escape</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Change the parent
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Drag</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Switch order
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Shift</code> + <code>Up or Down</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
          <v-subheader>History</v-subheader>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Undo
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Control</code> + <code>Z</code> , <code>Command</code> +
                <code>Z</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Redo
              </v-list-item-title>
              <v-list-item-subtitle>
                <code>Control</code> + <code>Shift</code> + <code>Z</code> ,
                <code>Command</code> + <code>Shift</code> + <code>Z</code>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
  }),
}
</script>

<style lang="scss" scoped></style>
