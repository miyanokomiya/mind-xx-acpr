<template>
  <v-card class="comment-list">
    <div class="switch-buttons">
      <v-btn flat small color="black" v-if="open" @click="open = false">
        <v-icon dark>keyboard_arrow_up</v-icon>
      </v-btn>
      <v-btn flat small color="black" v-else @click="open = true">
        <v-icon dark>comment</v-icon>
        <span>{{commentList.length}}</span>
      </v-btn>
    </div>
    <v-list three-line v-if="open">
      <template v-for="comment in commentList">
        <form v-if="editKey === comment.key" class="form" :key="comment.key">
          <v-text-field
            multi-line
            hide-details
            :rows="3"
            v-model="editText"
          />
          <v-btn flat icon small color="black" @click="deleteComment">
            <v-icon dark>delete</v-icon>
          </v-btn>
          <v-btn flat icon small color="primary" @click="editKey = ''">
            <v-icon dark>cancel</v-icon>
          </v-btn>
          <v-btn flat icon small color="primary" :disabled="!editText.trim()" @click="updateComment">
            <v-icon dark>done</v-icon>
          </v-btn>
        </form>
        <v-list-tile v-else avatar :key="comment.key" class="comment-tile" :class="{editable: canEdit(comment.key)}" @click="readyEdit(comment.key)">
          <v-list-tile-avatar>
            <img :src="users[comment.uid] ? users[comment.uid].photoURL : ''"/>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <!-- <v-list-tile-title>{{users[comment.uid] ? users[comment.uid].displayName : '---'}}</v-list-tile-title> -->
            <v-list-tile-sub-title><pre class="text">{{comment.text}}</pre></v-list-tile-sub-title>
            <v-list-tile-sub-title class="comment-info">{{users[comment.uid] ? users[comment.uid].displayName : '---'}}, {{dateFormat(comment.updated)}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider :key="`line_${comment.key}`"/>
      </template>
    </v-list>
    <form v-if="!editKey && open" class="form">
      <v-text-field
        label="Comment"
        multi-line
        hide-details
        :rows="3"
        v-model="text"
      />
      <v-btn flat icon small color="primary" :disabled="!text.trim()" @click="submit">
        <v-icon dark>done</v-icon>
      </v-btn>
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
    snackbar: false,
    open: false
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
        this.snackbar = false
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
  .switch-buttons {
    text-align: center;
    border-bottom: 1px solid #ddd;
    button {
      margin: 0;
      width: 100%;
    }
    span {
      margin-left: 6px;
    }
  }
  .text {
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .comment-info {
    text-align: right;
    font-size: 0.8em;
  }
  .form {
    margin: 0 12px;
    text-align: right;
  }
  & /deep/ {
    .list.list--three-line {
      padding: 0;
    }
    .list__tile.list__tile--link.list__tile--avatar:hover {
      background-color: #fff;
      cursor: default;
    }
    .editable .list__tile.list__tile--link.list__tile--avatar:hover {
      background-color: #eee;
      cursor: pointer;
    }
    .list__tile.list__tile--avatar {
      padding: 0 6px;
      height: auto;
    }
    .avatar.list__tile__avatar {
      min-width: 48px;
      align-items: center;
    }
    .list--three-line .list__tile__sub-title {
      -webkit-line-clamp: initial;
    }
  }
}
</style>

