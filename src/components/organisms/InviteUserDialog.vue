<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="560">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>share</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">File status</v-card-title>
        <v-card-text>
          <form>
            <v-checkbox
              hide-details
              label="Public"
              v-model="publicFileLocal"
              :disabled="!canEditPublic"
              :class="{ updated: publicFile !== publicFileLocal }"
            />
            <v-checkbox
              v-if="publicFileLocal"
              hide-details
              label="Read Only (except for invited users)"
              v-model="publicReadOnlyLocal"
              :disabled="!canEditPublic"
              :class="{ updated: publicReadOnly !== publicReadOnlyLocal }"
            />
            <div class="text-xs-right">
              <v-btn v-if="canEditPublic" @click="setStatus">Update</v-btn>
            </div>
          </form>
        </v-card-text>
        <v-divider />
      </v-card>
      <v-card>
        <v-card-title class="headline">Share</v-card-title>
        <v-card-text>
          <form @submit.prevent="invite">
            <v-text-field
              label="E-mail"
              v-model="email"
              :error-messages="emailErrors"
              required
            />
            <v-checkbox hide-details label="Read only" v-model="readOnly" />
            <div class="text-xs-right">
              <v-btn @click="invite">Invite</v-btn>
            </div>
          </form>
        </v-card-text>
        <v-divider />
      </v-card>
      <v-card>
        <v-card-title class="headline">Users</v-card-title>
        <v-card-text>
          <v-list subheader>
            <v-subheader>Owner</v-subheader>
            <v-list-item v-if="owner">
              <v-badge overlay left color="blue" overlap>
                <v-icon slot="badge" dark>edit</v-icon>
                <v-avatar size="32px">
                  <img :src="owner.photoURL" />
                </v-avatar>
              </v-badge>
              <v-list-item-content class="user-content">
                <v-list-item-title>{{ owner.displayName }}</v-list-item-title>
                <v-list-item-subtitle>{{ owner.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list subheader>
            <v-subheader>Invited users</v-subheader>
            <v-list-item
              v-for="(auth, uid) in invitedUserAuthorities"
              v-bind:key="uid"
              :class="{ updated: uid in updatedAuthorities }"
            >
              <v-badge
                overlay
                left
                overlap
                class="toggle-writable"
                :class="{ myself: isMe(uid) }"
                :color="
                  updatedAuthorities[uid]
                    ? updatedAuthorities[uid].write
                      ? 'blue'
                      : 'grey'
                    : auth.write
                    ? 'blue'
                    : 'grey'
                "
                @click.native="!isMe(uid) ? toggleWritableUser(uid) : ''"
              >
                <v-icon slot="badge" dark>edit</v-icon>
                <v-avatar size="32px">
                  <img :src="users[uid].photoURL" />
                </v-avatar>
              </v-badge>
              <v-list-item-content
                class="user-content"
                :class="{ deleted: updatedAuthorities[uid] === null }"
              >
                <v-list-item-title
                  >{{ users[uid].displayName
                  }}{{ isMe(uid) ? ' ( you! )' : '' }}</v-list-item-title
                >
                <v-list-item-subtitle>{{ users[uid].email }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon ripple :disabled="isMe(uid)" @click="toggleDeleteUser(uid)">
                  <v-icon :color="updatedAuthorities[uid] === null ? 'red' : 'grey'"
                    >delete</v-icon
                  >
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <div class="text-xs-right">
            <v-btn @click="update">Update</v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-card>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Vue from 'vue'

export default {
  data: () => ({
    dialog: false,
    email: '',
    readOnly: false,
    publicFileLocal: false,
    publicReadOnlyLocal: false,
    updatedAuthorities: {},
  }),
  props: {
    publicFile: {
      type: Boolean,
      default: false,
    },
    publicReadOnly: {
      type: Boolean,
      default: false,
    },
    canEditPublic: {
      type: Boolean,
      default: true,
    },
    userAuthorities: {
      type: Object,
      default: () => ({}),
    },
    users: {
      type: Object,
      default: () => ({}),
    },
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    emailErrors() {
      return []
    },
    owner() {
      const ownerId = Object.keys(this.userAuthorities).find(uid => {
        return this.userAuthorities[uid].owner
      })
      if (ownerId) {
        return this.user.uid === ownerId ? this.user : this.users[ownerId]
      } else {
        return null
      }
    },
    invitedUserAuthorities() {
      const ret = Object.keys(this.userAuthorities).reduce((map, uid) => {
        if (this.users[uid]) {
          map[uid] = this.userAuthorities[uid]
        }
        return map
      }, {})

      if (this.owner) {
        delete ret[this.owner.uid]
      }

      return ret
    },
  },
  watch: {
    dialog(to) {
      if (to) {
        this.initData()
        this.$emit('show')
      }
    },
  },
  methods: {
    isMe(uid) {
      return uid === this.user.uid
    },
    initData() {
      this.email = ''
      this.readOnly = false
      this.publicFileLocal = this.publicFile || false
      this.publicReadOnlyLocal = this.publicReadOnly || false
      this.updatedAuthorities = {}
    },
    setStatus() {
      this.$emit('setStatus', {
        publicFile: this.publicFileLocal,
        readOnly: this.publicReadOnlyLocal,
      })
    },
    invite() {
      if (this.email) {
        this.$emit('invite', { email: this.email, readOnly: this.readOnly })
        this.email = ''
      }
    },
    update() {
      const updates = Object.keys(this.updatedAuthorities).reduce((p, uid) => {
        // the user may be removed already
        if (this.userAuthorities[uid]) {
          if (!this.updatedAuthorities[uid]) {
            // delete
            p[uid] = null
          } else {
            // update
            p[uid] = this.updatedAuthorities[uid]
          }
        }
        return p
      }, {})
      this.$emit('updateUserAuthorities', updates)
      this.updatedAuthorities = {}
    },
    toggleDeleteUser(uid) {
      // set 'null' means to be delete
      if (this.updatedAuthorities[uid] === null) {
        Vue.delete(this.updatedAuthorities, uid)
      } else {
        Vue.set(this.updatedAuthorities, uid, null)
      }
    },
    toggleWritableUser(uid) {
      const auth = this.updatedAuthorities[uid]
      // if this is deleted, nothing to do
      if (auth !== null) {
        if (auth) {
          // reset
          Vue.delete(this.updatedAuthorities, uid)
        } else {
          // update
          Vue.set(this.updatedAuthorities, uid, {
            write: !this.userAuthorities[uid].write,
          })
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.deleted {
  text-decoration: line-through;
}
.toggle-writable {
  cursor: pointer;
  &.myself {
    cursor: auto;
  }
}
.updated {
  background-color: rgba(255, 0, 0, 0.2);
}
.user-content {
  margin-left: 8px;
}
</style>
