<template>
  <v-card>
    <v-list three-line>
      <template v-for="(comment, key) in comments">
        <v-list-tile avatar :key="key">
          <v-list-tile-avatar>
            <img :src="users[comment.uid] ? users[comment.uid].photoURL : ''"/>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{users[comment.uid] ? users[comment.uid].displayName : ''}} ({{comment.updated}})</v-list-tile-title>
            <v-list-tile-sub-title ><pre>{{comment.text}}</pre></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-divider/>
    <form class="form">
      <v-text-field
        label="Comment"
        multi-line
        hide-details
        autofocus
        v-model="text"
      />
      <v-btn :disabled="!this.text" @click="clear">clear</v-btn>
      <v-btn :disabled="!this.text.trim()" @click="submit">submit</v-btn>
    </form>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    text: ''
  }),
  props: {
    comments: {
      type: Object,
      required: true
    },
    users: {
      type: Object,
      required: true
    }
  },
  computed: {
    commentUsers () {
      return Object.keys(this.comments).map(c => this.users[c.uid])
    }
  },
  methods: {
    submit () {
      this.$emit('addComment', { text: this.text })
    },
    clear () {
      this.text = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin: 0 12px;
  text-align: right;
}
</style>

