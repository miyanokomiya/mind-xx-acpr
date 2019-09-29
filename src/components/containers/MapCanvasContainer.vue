<template>
  <div class="wrapper">
    <MapCanvas
      v-if="loaded && !permissionDenied"
      :width="canvasWidth"
      :height="canvasHeight"
      :nodes="nodes"
      :selectedNodes="selectedNodes"
      :fileAuthority="fileAuthority"
      :user="user"
      :canWrite="canWrite"
      :defaultNodeProps="defaultNodeProps"
      :comments="comments"
      :users="users"
      @updateNodes="nodes => updateNodes({ nodes })"
      @setSelectedNodes="selectedNodes => setSelectedNodes({ selectedNodes })"
      @clearSelect="clearSelect"
      @undo="undo"
      @redo="redo"
      @selectProp="selectProp"
      @postComment="postComment"
    />
    <div class="center-box" v-if="permissionDenied">
      <PermissionDeniedMessage />
    </div>
    <v-snackbar
      bottom
      left
      color="error"
      :timeout="4000"
      v-model="snackbar"
      @click="snackbar = false"
    >
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script>
import MapCanvas from '@/components/organisms/MapCanvas'
import PermissionDeniedMessage from '@/components/molecules/PermissionDeniedMessage'

import { mapGetters, mapActions } from 'vuex'
import { getterTypes as layoutsGetterTypes } from '@/store/layouts/types'
import {
  getterTypes as nodesGetterTypes,
  actionTypes as nodesActionTypes,
} from '@/store/nodes/types'
import {
  getterTypes as commentsGetterTypes,
  actionTypes as commentsActionTypes,
} from '@/store/comments/types'
import {
  getterTypes as usersGetterTypes,
  actionTypes as usersActionTypes,
} from '@/store/users/types'
import {
  getterTypes as filesGetterTypes,
  actionTypes as filesActionTypes,
} from '@/store/files/types'
import { getterTypes as userGetterTypes } from '@/store/user/types'
import {
  getterTypes as settingsGetterTypes,
  actionTypes as settingsActionTypes,
} from '@/store/settings/types'

export default {
  components: {
    MapCanvas,
    PermissionDeniedMessage,
  },
  data: () => ({
    message: '',
  }),
  props: {
    fileKey: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('layouts', {
      leftDrawer: layoutsGetterTypes.LEFT_DRAWER,
    }),
    ...mapGetters('user', {
      user: userGetterTypes.USER,
      _canWrite: userGetterTypes.CAN_WRITE,
    }),
    ...mapGetters('nodes', {
      nodes: nodesGetterTypes.NODES,
      selectedNodes: nodesGetterTypes.SELECTED_NODES,
      initialLoading: nodesGetterTypes.INITIAL_LOADING,
    }),
    ...mapGetters('comments', {
      comments: commentsGetterTypes.COMMENTS,
    }),
    ...mapGetters('users', {
      users: usersGetterTypes.USERS,
    }),
    ...mapGetters('files', {
      fileFromKey: filesGetterTypes.FILE_FROM_KEY,
      fileAuthorityFromKey: filesGetterTypes.FILE_AUTHORITY_FROM_KEY,
      permissionDenied: filesGetterTypes.PERMISSION_DENIED,
    }),
    ...mapGetters('settings', {
      nodeColor: settingsGetterTypes.NODE_COLOR,
      textColor: settingsGetterTypes.TEXT_COLOR,
    }),
    canWrite() {
      return this._canWrite({ fileKey: this.fileKey })
    },
    canvasWidth() {
      return this.$window.width >= 1264 && this.leftDrawer
        ? this.$window.width - 300 - 20
        : this.$window.width - 20
    },
    canvasHeight() {
      return this.$window.height - 48
    },
    defaultNodeProps() {
      return {
        backgroundColor: this.nodeColor,
        color: this.textColor,
      }
    },
    file() {
      return this.fileFromKey({ fileKey: this.fileKey })
    },
    fileAuthority() {
      return this.fileAuthorityFromKey({ fileKey: this.fileKey })
    },
    loaded() {
      // If the count of nodes in a file is zero, the records of nodes don't exist.
      return !this.initialLoading || (this.file && this.file.nodeCount < 1)
    },
    snackbar: {
      get() {
        return !!this.message
      },
      set(val) {
        this.message = val ? this.message : ''
      },
    },
  },
  watch: {
    comments: {
      handler(to) {
        const users = Object.keys(this.comments).reduce((p, key) => {
          const comment = this.comments[key]
          if (comment.uid && !this.users[comment.uid]) {
            p[comment.uid] = true
          }
          return p
        }, {})
        this.loadUsers({ users })
      },
      deep: true,
    },
  },
  created() {
    this.loadFile({ key: this.fileKey })
    this.loadNodes({ fileKey: this.fileKey })
    this.loadComments({ fileKey: this.fileKey })
  },
  destroyed() {
    this.disconnectComments()
    this.disconnectNodes()
    this.disconnectFile({ key: this.fileKey })
  },
  methods: {
    ...mapActions('nodes', {
      disconnectNodes: nodesActionTypes.DISCONNECT,
      updateNodes: nodesActionTypes.UPDATE_NODES,
      _setSelectedNodes: nodesActionTypes.SET_SELECTED_NODES,
      clearSelect: nodesActionTypes.CLEAR_SELECT,
      loadNodes: nodesActionTypes.LOAD_NODES,
      _undo: nodesActionTypes.UNDO_NODES,
      _redo: nodesActionTypes.REDO_NODES,
    }),
    ...mapActions('comments', {
      disconnectComments: commentsActionTypes.DISCONNECT,
      loadComments: commentsActionTypes.LOAD_COMMENTS,
      updateComments: commentsActionTypes.UPDATE_COMMENTS,
    }),
    ...mapActions('users', {
      loadUsers: usersActionTypes.LOAD_USERS,
    }),
    ...mapActions('files', {
      disconnectFile: filesActionTypes.DISCONNECT_FILE,
      loadFile: filesActionTypes.LOAD_FILE,
    }),
    ...mapActions('settings', {
      setNodeColor: settingsActionTypes.SET_NODE_COLOR,
      setTextColor: settingsActionTypes.SET_TEXT_COLOR,
    }),
    setSelectedNodes({ selectedNodes }) {
      this._setSelectedNodes({ selectedNodes })
      const keys = Object.keys(selectedNodes)
      if (keys.length > 0) {
        const key = keys[0]
        const node = this.nodes[key]
        this.setTextColor({ textColor: node.color })
        this.setNodeColor({ nodeColor: node.backgroundColor })
      }
    },
    undo() {
      this._undo().catch(e => {
        this.message = e.message
      })
    },
    redo() {
      this._redo().catch(e => {
        this.message = e.message
      })
    },
    changeSelectedNodesProps({ color, backgroundColor }) {
      const selectedKeys = Object.keys(this.selectedNodes)
      if (selectedKeys.length > 0) {
        const updatedNodes = selectedKeys.reduce((p, key) => {
          p[key] = {
            ...this.nodes[key],
            color,
            backgroundColor,
          }
          return p
        }, {})
        this.updateNodes({ nodes: updatedNodes })
      }
    },
    selectProp({ color, backgroundColor }) {
      this.changeSelectedNodesProps({ color, backgroundColor })
      this.setTextColor({ textColor: color })
      this.setNodeColor({ nodeColor: backgroundColor })
    },
    postComment({ comment, key }) {
      const comments = {
        [key]: comment,
      }
      this.updateComments({ comments })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  background-color: #f5f5f5;
}
.center-box {
  margin: 30px 10%;
}
</style>
