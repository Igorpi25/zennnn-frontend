<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :left="left"
      :right="right"
      min-width="320px"
      max-height="420px"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <div class="relative">
            <v-scale-transition>
              <div
                v-if="newCommentsCount > 0"
                :style="badgeStyles"
                style="background-color: #ff4800"
                class="absolute rounded-full flex justify-center items-center text-xs text-white"
              >
                <span v-if="!sm">
                  {{ newCommentsCount > 99 ? '99+' : newCommentsCount }}
                </span>
              </div>
            </v-scale-transition>
            <Icon
              :size="iconSize"
              class="cursor-pointer select-none"
              role="button"
            >
              {{ icons.mdiMessageReplyText }}
            </Icon>
          </div>
        </div>
      </template>
      <div
        :class="['px-4 py-5', light ? 'paper-theme' : 'bg-gray']"
      >
        <div>
          <CommentInput
            v-model="comment"
            :loading="addCommentLoading"
            :light="light"
            :label="$t('comments.enterComment')"
            class="pb-4"
            @submit="addComment"
          />
        </div>
        <div
          v-for="item in discussions"
          :key="item.id"
        >
          <Comment
            :item="item"
            :is-paper="isPaper"
            :is-product="isProduct"
            :spec-id="specId"
            :product-id="productId"
          />
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import { mdiMessageReplyText } from '@mdi/js'
import {
  ADD_COMMENT_TO_SPEC,
  ADD_COMMENT_TO_PRODUCT,
  ADD_COMMENT_TO_PAPER_SPEC,
  ADD_COMMENT_TO_PAPER_PRODUCT,
} from '../graphql/mutations'

import Comment from './Comment'
import CommentInput from './CommentInput'
import { GET_PROFILE, GET_IS_LOGGED_IN } from '../graphql/queries'
import { VIEWED_COMMENTS_STORE_KEY_PREFIX } from '../config/globals'

export default {
  name: 'Comments',
  components: {
    Comment,
    CommentInput,
  },
  props: {
    items: {
      type: Array,
      default: () => ([]),
    },
    isPaper: {
      type: Boolean,
      default: false,
    },
    isProduct: {
      type: Boolean,
      default: false,
    },
    specId: {
      type: String,
      default: '',
      required: true,
    },
    productId: {
      type: String,
      default: '',
    },
    menuProps: {
      type: Object,
      default: () => ({}),
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    iconSize: {
      type: [Number, String],
      default: 24,
    },
    sm: {
      type: Boolean,
      default: false,
    },
  },
  apollo: {
    isLoggedIn: {
      query: GET_IS_LOGGED_IN,
    },
    getProfile: {
      query: GET_PROFILE,
      fetchPolicy: 'cache-only',
      skip () {
        return !this.isLoggedIn
      },
    },
  },
  data () {
    return {
      commentsIds: [],
      viewedComments: [],
      menu: false,
      addCommentLoading: false,
      comment: '',
      icons: {
        mdiMessageReplyText,
      },
    }
  },
  computed: {
    badgeStyles () {
      let height = 16
      let width = 18
      if (this.sm) {
        height = 6
        width = 6
      } else if (this.newCommentsCount > 99) {
        width = 26
      }
      const styles = {
        height: `${height}px`,
        top: `-${height / 2}px`,
        width: `${width}px`,
        right: `-${width / 2}px`,
      }
      return styles
    },
    newCommentsCount () {
      let count = 0
      this.commentsIds.forEach(el => {
        if (!this.viewedComments.includes(el)) {
          count++
        }
      })
      return count
    },
    viewedStoreKey () {
      const userId = this.getProfile ? this.getProfile.id : ''
      return `${VIEWED_COMMENTS_STORE_KEY_PREFIX}.${userId}.${this.specId}:`
    },
    light () {
      return this.isPaper
    },
    discussions () {
      const items = this.items || []
      const discussions = items.filter(d => !d.replyTo)
      return discussions
        .map(item => {
          const comments = items.filter(c => c.replyTo === item.id)
          return {
            ...item,
            comments,
          }
        }).sort((a, b) => {
          const aDate = this.$parseDate(a.updatedAt)
          const bDate = this.$parseDate(b.updatedAt)
          return aDate > bDate ? -1 : aDate < bDate ? 1 : 0
        })
    },
  },
  watch: {
    menu (val) {
      if (val) {
        setTimeout(() => {
          this.updateViewedComments()
        }, 250)
      }
    },
    items: {
      handler (val) {
        const ids = (val || []).map(el => el.id)
        if (ids.length > 0) {
          this.commentsIds = ids
          if (this.menu) {
            this.viewedComments = ids
            this.udpateStorageViewedComments(ids)
          }
        }
      },
      immediate: true,
    },
  },
  mounted () {
    this.viewedComments = JSON.parse(localStorage.getItem(this.viewedStoreKey)) || []
  },
  methods: {
    updateViewedComments () {
      if (this.commentsIds.length > 0) {
        const newComments = []
        this.commentsIds.forEach(el => {
          if (!this.viewedComments.includes(el)) {
            newComments.push(el)
          }
        })
        if (newComments.length > 0) {
          this.viewedComments = this.commentsIds
          this.udpateStorageViewedComments(newComments)
        }
      }
    },
    udpateStorageViewedComments (newComments) {
      const viewedComments = JSON.parse(localStorage.getItem(this.viewedStoreKey)) || []
      const storageNewComments = []
      newComments.forEach(el => {
        if (!viewedComments.includes(el)) {
          storageNewComments.push(el)
        }
      })
      localStorage.setItem(this.viewedStoreKey, JSON.stringify([...viewedComments, ...storageNewComments]))
    },
    openMenu () {
      this.menu = true
    },
    clear () {
      this.comment = ''
    },
    async addComment () {
      try {
        if (!this.comment) return
        this.addCommentLoading = true
        let mutation
        const variables = {
          comment: this.comment,
        }
        if (this.isProduct) {
          variables.productId = this.productId
          mutation = this.isPaper
            ? ADD_COMMENT_TO_PAPER_PRODUCT
            : ADD_COMMENT_TO_PRODUCT
        } else {
          variables.specId = this.specId
          mutation = this.isPaper
            ? ADD_COMMENT_TO_PAPER_SPEC
            : ADD_COMMENT_TO_SPEC
        }
        await this.$apollo.mutate({
          mutation,
          variables,
          fetchPolicy: 'no-cache',
        })
        this.clear()
      } catch (error) {
        throw new Error(error)
      } finally {
        this.addCommentLoading = false
      }
    },
  },
}
</script>

<style>
.paper-theme {
  background-color: #f4f4f4;
}
.paper-theme textarea {
  color: #494949!important;
}
.paper-theme .text-area--outlined .text-area__slot {
  border-color: #d6d6d6!important;
}
.paper-theme .text-area--focused.text-area--outlined .text-area__slot {
  background-color: #fdfdfd!important;
}
</style>>
