<template>
  <v-card class="comment-list" v-if="user || commentList.length > 0">
    <div class="switch-buttons">
      <v-btn text small color="black" v-if="open" @click="open = false">
        <v-icon dark>keyboard_arrow_up</v-icon>
      </v-btn>
      <v-btn text small color="black" v-else @click="open = true">
        <v-icon dark>comment</v-icon>
        <span>{{ commentList.length }}</span>
      </v-btn>
    </div>
    <v-list three-line v-if="open">
      <template v-for="comment in commentList">
        <form v-if="editKey === comment.key" class="form" :key="comment.key">
          <v-text-field multi-line hide-details :rows="3" v-model="editText" />
          <v-btn text icon small color="black" @click="deleteComment">
            <v-icon dark>delete</v-icon>
          </v-btn>
          <v-btn text icon small color="primary" @click="cancelEdit">
            <v-icon dark>cancel</v-icon>
          </v-btn>
          <v-btn
            text
            icon
            small
            color="primary"
            :disabled="!editText.trim()"
            @click="updateComment"
          >
            <v-icon dark>done</v-icon>
          </v-btn>
        </form>
        <v-list-item
          v-else
          :key="comment.key"
          class="comment-tile"
          :class="{ editable: canEdit(comment.key) }"
          @click="readyEdit(comment.key)"
        >
          <v-list-item-avatar>
            <img v-if="users[comment.uid]" :src="users[comment.uid].photoURL" />
            <v-icon class="unknown-user" v-else>account_circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle
              ><pre class="text">{{ comment.text }}</pre></v-list-item-subtitle
            >
            <v-list-item-subtitle class="comment-info"
              >{{ users[comment.uid] ? users[comment.uid].displayName : '---' }},
              {{ dateFormat(comment.updated) }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`line_${comment.key}`" />
      </template>
    </v-list>
    <form v-if="!editKey && open && user" class="form">
      <v-text-field label="Comment" multi-line hide-details :rows="3" v-model="text" />
      <v-btn text icon small color="primary" :disabled="!text.trim()" @click="submit">
        <v-icon dark>done</v-icon>
      </v-btn>
    </form>
    <v-snackbar bottom right :timeout="2000" v-model="snackbar">
      One more click to delete.
    </v-snackbar>
  </v-card>
</template>

<script>
import { dateFormat } from '@/utils/helper'

export default {
  data: () => ({
    text: '',
    editKey: '',
    editText: '',
    snackbar: false,
    open: false,
  }),
  props: {
    comments: {
      type: Object,
      required: true,
    },
    users: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    commentList() {
      return Object.keys(this.comments)
        .map(key => ({ ...this.comments[key], key }))
        .sort((a, b) => {
          return a.created - b.created
        })
    },
  },
  watch: {
    comments() {
      this.editKey = ''
      this.snackbar = false
    },
  },
  methods: {
    canEdit(key) {
      const comment = this.comments[key]
      return this.user && this.user.uid === comment.uid
    },
    readyEdit(key) {
      if (this.canEdit(key)) {
        const comment = this.comments[key]
        this.editKey = key
        this.editText = comment.text
      }
    },
    submit() {
      this.$emit('postComment', {
        comment: {
          text: this.text,
        },
      })
      this.clear()
    },
    updateComment() {
      this.$emit('postComment', {
        comment: {
          ...this.comments[this.editKey],
          text: this.editText,
        },
        key: this.editKey,
      })
      this.editKey = ''
      this.snackbar = false
    },
    cancelEdit() {
      this.editKey = ''
      this.snackbar = false
    },
    deleteComment() {
      if (!this.snackbar) {
        this.snackbar = true
      } else {
        this.snackbar = false
        this.$emit('postComment', {
          comment: null,
          key: this.editKey,
        })
        this.editKey = ''
      }
    },
    clear() {
      this.editKey = ''
      this.text = ''
      this.snackbar = false
    },
    dateFormat(ms) {
      return dateFormat(new Date(ms))
    },
  },
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
  .unknown-user {
    line-height: 40px;
  }
  .text {
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left;
  }
  .comment-info {
    text-align: right;
    font-size: 0.8em;
  }
  .form {
    margin: 0 12px;
    text-align: right;
  }
}
</style>
