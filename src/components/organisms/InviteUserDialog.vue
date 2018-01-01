<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="400">
      <v-btn icon slot="activator">
        <v-icon>share</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="headline">File status</v-card-title>
        <v-card-text>
          <form>
            <v-checkbox
              label="Public"
              v-model="publicFileLocal"
              :disabled="!canEditPublic"
            />
            <v-checkbox
              v-if="publicFileLocal"
              label="Read Only (except for invited users)"
              v-model="publicReadOnlyLocal"
              :disabled="!canEditPublic"
            />
            <div class="text-xs-right">
              <v-btn v-if="canEditPublic" @click="setStatus">Set status</v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card>
      <v-divider/>
      <v-card>
        <v-card-title class="headline">Share</v-card-title>
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
            <div class="text-xs-right">
              <v-btn @click="invite">Invite users</v-btn>
            </div>
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
    readOnly: false,
    publicFileLocal: false,
    publicReadOnlyLocal: false
  }),
  props: {
    publicFile: {
      type: Boolean,
      default: false
    },
    publicReadOnly: {
      type: Boolean,
      default: false
    },
    canEditPublic: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    emailErrors () {
      return []
    }
  },
  watch: {
    publicFile (to, from) {
      this.publicFileLocal = to || false
    },
    publicReadOnly (to, from) {
      this.publicReadOnlyLocal = to || false
    },
    dialog (to) {
      if (to) {
        this.publicFileLocal = this.publicFile || false
        this.publicReadOnlyLocal = this.publicReadOnly || false
      }
    }
  },
  mounted () {
    this.publicFileLocal = this.publicFile || false
    this.publicReadOnlyLocal = this.publicReadOnly || false
  },
  methods: {
    setStatus () {
      this.$emit('setStatus', {
        publicFile: this.publicFileLocal,
        readOnly: this.publicReadOnlyLocal
      })
      this.dialog = false
    },
    invite () {
      this.$emit('invite', { email: this.email, readOnly: this.readOnly })
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

