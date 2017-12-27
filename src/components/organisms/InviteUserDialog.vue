<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="300">
      <v-btn icon slot="activator">
        <v-icon>share</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="headline">Share this file</v-card-title>
        <v-card-text>
           <form>
            <v-text-field
              label="E-mail"
              v-model="email"
              :error-messages="emailErrors"
              required
            />
            <v-checkbox
              label="Read only"
              v-model="readOnly"
            />
            <v-btn @click="submit">invite</v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    email: '',
    readOnly: false
  }),
  props: {
  },
  computed: {
    emailErrors () {
      return []
    }
  },
  methods: {
    submit () {
      this.$emit('invite', { email: this.email, readOnly: this.readOnly })
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

