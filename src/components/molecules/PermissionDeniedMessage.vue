<template>
<v-card>
  <v-card-title primary-title>
    <div>
      <div class="headline">Permission denied</div>
    </div>
  </v-card-title>
  <v-card-text>
    <v-list>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>There may be some reasons.</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>This file does not exist.</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-sub-title>You don't have an authority to read this file.</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Let's reload after getting an authority.</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card-text>
</v-card>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
</style>


