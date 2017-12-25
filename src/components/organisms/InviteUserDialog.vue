<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="240">
      <v-btn icon slot="activator">
        <v-icon>help</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="headline">Email</v-card-title>
        <v-card-text>
           <form>
            <v-text-field
              label="E-mail"
              v-model="email"
              :error-messages="emailErrors"
              required
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
    email: ''
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
      this.$emit('invite', { email: this.email })
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

