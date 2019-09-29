<template>
  <v-layout row justify-center>
    <v-dialog
      max-width="300"
      :value="value"
      :persistent="false"
      @input="val => $emit('input', val)"
    >
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text class="text-xs-left">
          {{ message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" text @click="$emit('cancel')">
            {{ cancel }}
          </v-btn>
          <v-btn color="blue darken-1" text @click="$emit('ok')">
            {{ ok }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Confirm',
    },
    message: {
      type: String,
      required: true,
    },
    ok: {
      type: String,
      default: 'OK',
    },
    cancel: {
      type: String,
      default: 'CANCEL',
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
