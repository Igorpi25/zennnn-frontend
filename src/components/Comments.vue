<template>
  <div>
    <div
      ref="defaultActivator"
      class="relative flex items-center"
      @click="toggleMenu"
    >
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
      <i :class="['icon-message cursor-pointer select-none', sm ? 'text-sm' : 'text-xl']" />
    </div>
    <v-menu
      v-model="isMenuActive"
      :activator="activator || $refs.defaultActivator"
      :close-on-content-click="false"
      :open-on-click="false"
      :left="left"
      :top="top"
      :right="right"
      :bottom="bottom"
      :offset-x="offsetX"
      :offset-y="offsetY"
      min-width="320px"
      max-height="420px"
    >
      <div
        :class="['px-4 py-5', light ? 'paper-theme' : 'bg-gray']"
      >
        <div>
          <CommentInput
            ref="commentInput"
            v-model="comment"
            :loading="addCommentLoading"
            :light="light"
            :label="$t('comments.enterComment')"
            :class="{ 'pb-4': discussions.length > 0 }"
            @submit="addComment"
          />
        </div>
        <div
          v-for="(item, index) in discussions"
          :key="item.id"
          :class="{ 'pb-4': discussions.length - 1 > index }"
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
import Comment from './Comment'
import CommentInput from './CommentInput'
import { GET_PROFILE, GET_IS_LOGGED_IN } from '../graphql/queries'
import {
  ADD_COMMENT_TO_SPEC,
  ADD_COMMENT_TO_PRODUCT,
  ADD_COMMENT_TO_PAPER_SPEC,
  ADD_COMMENT_TO_PAPER_PRODUCT,
  MARK_SPEC_COMMENTS_AS_VIEWED,
  MARK_PRODUCT_COMMENTS_AS_VIEWED,
  MARK_PAPER_SPEC_COMMENTS_AS_VIEWED,
  MARK_PAPER_PRODUCT_COMMENTS_AS_VIEWED,
} from '../graphql/mutations'

export default {
  name: 'Comments',
  components: {
    Comment,
    CommentInput,
  },
  props: {
    activator: undefined,
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
    top: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
    offsetX: {
      type: Boolean,
      default: true,
    },
    offsetY: {
      type: Boolean,
      default: false,
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
      isMenuActive: false,
      addCommentLoading: false,
      comment: '',
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
      this.items.forEach(item => {
        if (this.isPaper) {
          if (!item.clientViewed) {
            count++
          }
        } else {
          if (!item.viewed) {
            count++
          }
        }
      })
      return count
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
    isMenuActive (val) {
      if (val) {
        setTimeout(() => {
          this.updateViewedComments()
        }, 250)
      }
    },
    items (val, oldVal) {
      const valLength = (val && val.length) || 0
      const oldValLength = (oldVal && oldVal.length) || 0
      if (this.isMenuActive && valLength > oldValLength) {
        const newIds = []
        val.forEach(el => {
          if (this.isPaper) {
            if (!el.clientViewed) {
              newIds.push(el.id)
            }
          } else {
            if (!el.viewed) {
              newIds.push(el.id)
            }
          }
        })
        this.updateViewedComments(newIds)
      }
    },
  },
  methods: {
    async updateViewedComments (commentsIds) {
      try {
        const variables = {}
        if (this.isProduct) {
          variables.productId = this.productId
        } else {
          variables.specId = this.specId
        }
        if (commentsIds) {
          variables.commentsIds = commentsIds
        }
        let mutation = null
        if (this.isPaper) {
          mutation = this.isProduct ? MARK_PAPER_PRODUCT_COMMENTS_AS_VIEWED : MARK_PAPER_SPEC_COMMENTS_AS_VIEWED
        } else {
          mutation = this.isProduct ? MARK_PRODUCT_COMMENTS_AS_VIEWED : MARK_SPEC_COMMENTS_AS_VIEWED
        }
        await this.$apollo.mutate({
          mutation,
          variables,
        })
      } catch (error) {
        throw new Error(error)
      }
    },
    openMenu () {
      this.isMenuActive = true
    },
    closeMenu () {
      this.isMenuActive = false
    },
    toggleMenu () {
      this.isMenuActive = !this.isMenuActive
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
        this.$refs.commentInput.blur()
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
