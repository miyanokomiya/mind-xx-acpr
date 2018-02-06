<template>
  <v-card class="comment-list">
    <v-list three-line>
      <template v-for="comment in commentList">
        <form v-if="editKey === comment.key" class="form" :key="comment.key">
          <v-text-field
            multi-line
            hide-details
            :rows="3"
            v-model="editText"
          />
          <v-btn flat icon dark small color="primary" @click="deleteComment">
            <v-icon dark>delete</v-icon>
          </v-btn>
          <v-btn flat icon dark small color="primary" @click="editKey = ''">
            <v-icon dark>cancel</v-icon>
          </v-btn>
          <v-btn flat icon dark small color="primary" :disabled="!editText.trim()" @click="updateComment">
            <v-icon dark>done</v-icon>
          </v-btn>
        </form>
        <v-list-tile v-else avatar :key="comment.key">
          <v-list-tile-avatar>
            <img :src="users[comment.uid] ? users[comment.uid].photoURL : ''"/>
          </v-list-tile-avatar>
          <v-list-tile-content :class="{editable: canEdit(comment.key)}" @click="readyEdit(comment.key)">
            <v-list-tile-title>{{users[comment.uid] ? users[comment.uid].displayName : '---'}}</v-list-tile-title>
            <v-list-tile-sub-title><pre class="text">{{comment.text}}</pre></v-list-tile-sub-title>
            <v-list-tile-sub-title class="date">{{dateFormat(comment.updated)}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider :key="`line_${comment.key}`"/>
      </template>
    </v-list>
    <form v-if="!editKey" class="form">
      <v-text-field
        label="Comment"
        multi-line
        hide-details
        :rows="3"
        v-model="text"
      />
      <!-- <v-btn :disabled="!this.text" @click="clear">clear</v-btn> -->
      <v-btn :disabled="!text.trim()" @click="submit">post</v-btn>
    </form>
    <v-snackbar
      bottom
      right
      :timeout="2000"
      v-model="snackbar"
    >
      One more click to delete.
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    text: '',
    editKey: '',
    editText: '',
    snackbar: false
  }),
  props: {
    comments: {
      type: Object,
      required: true
    },
    users: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    commentList () {
      return Object.keys(this.comments).map(key => ({ ...this.comments[key], key })).sort((a, b) => {
        return a.created - b.created
      })
    }
  },
  methods: {
    canEdit (key) {
      const comment = this.comments[key]
      return this.user.uid === comment.uid
    },
    readyEdit (key) {
      if (this.canEdit(key)) {
        const comment = this.comments[key]
        this.editKey = key
        this.editText = comment.text
      }
    },
    submit () {
      this.$emit('postComment', {
        comment: {
          text: this.text
        }
      })
      this.clear()
    },
    updateComment () {
      this.$emit('postComment', {
        comment: {
          ...this.comments[this.editKey],
          text: this.editText
        },
        key: this.editKey
      })
      this.editKey = ''
    },
    deleteComment () {
      if (!this.snackbar) {
        this.snackbar = true
      } else {
        this.$emit('postComment', {
          comment: null,
          key: this.editKey
        })
        this.editKey = ''
      }
    },
    clear () {
      this.text = ''
    },
    dateFormat (ms) {
      const date = new Date(ms)
      const yyyy = date.getFullYear()
      const mm = (`0${date.getMonth() + 1}`).slice(-2)
      const dd = (`0${date.getDate()}`).slice(-2)
      return `${yyyy}/${mm}/${dd}`
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  .text {
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .date {
    text-align: right;
  }
  .editable {
    cursor: pointer;
  }
  .form {
    margin: 0 12px;
    text-align: right;
  }
  & /deep/ {
    .list__tile.list__tile--avatar {
      padding: 0 6px;
      height: auto;
    }
    .avatar.list__tile__avatar {
      min-width: 48px;
      margin-top: 4px;
    }
    .list--three-line .list__tile__sub-title {
      -webkit-line-clamp: initial;
    }
  }
}
</style>

