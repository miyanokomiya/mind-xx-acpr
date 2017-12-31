<template>
  <v-layout row justify-center>
    <v-dialog
      max-width="240"
      :value="value"
      :persistent="!reauth"
      @input="val => $emit('input', val)"
    >
      <v-card>
        <v-card-title class="headline">{{reauth ? 'Need Reauth' : 'Need Auth'}}</v-card-title>
        <v-card-text>
          <v-btn color="white" @click="authGoogle">
            <img class="image" src="../..//assets/images/googlelogo_color_90x40dp.png" />
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import firebase from '@/firebase'

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    reauth: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    authGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  height: 36px - 2px;
  width: auto;
  margin-top: 2px;
}
</style>

