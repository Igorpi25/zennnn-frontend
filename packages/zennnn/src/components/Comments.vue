<template>
  <div>
    <!-- TODO: scrollt to new on open -->
    <Menu
      v-model="isMenuActive"
      :close-on-content-click="false"
      :placement="placement"
      :light="light"
      min-width="320"
      max-width="320"
      max-height="75vh"
    >
      <template v-slot:activator="{ attrs, listeners }">
        <slot name="activator" :attrs="attrs" :listeners="listeners">
          <div class="relative flex items-center">
            <transition name="scale-transition">
              <div
                v-if="newCommentsCount > 0"
                :style="badgeStyles"
                class="
                  absolute
                  rounded-full
                  flex
                  justify-center
                  items-center
                  text-xs text-white
                  bg-purple-500
                "
              >
                <span v-if="!sm">
                  {{ newCommentsCount > 99 ? '99+' : newCommentsCount }}
                </span>
              </div>
            </transition>
            <Icon class="cursor-pointer select-none">
              {{ icons.ziChat }}
            </Icon>
          </div>
        </slot>
      </template>
      <div :class="['px-5 py-5', light ? 'bg-white' : 'bg-gray-400']">
        <div v-for="item in discussions" :key="item.id">
          <Comment
            :item="item"
            :is-paper="isPaper"
            :is-product="isProduct"
            :spec-id="specId"
            :product-id="productId"
          />
        </div>
        <div>
          <CommentInput
            ref="commentInput"
            v-model="comment"
            :loading="addCommentLoading"
            :light="light"
            :label="$t('comments.enterComment')"
            @submit="addComment"
          />
        </div>
      </div>
    </Menu>
  </div>
</template>

<script>
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import { ziChat } from '@zennnn/icons'
import { Icon, Menu } from '@zennnn/core'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import { isLoggedInVar } from '@/plugins/apollo'

import { GET_PROFILE } from '../graphql/queries'
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

import Comment from './Comment'
import CommentInput from './CommentInput'

export default {
  name: 'Comments',
  components: {
    Icon,
    Menu,
    Comment,
    CommentInput,
  },
  props: {
    activator: undefined,
    items: {
      type: Array,
      default: () => [],
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
    placement: {
      type: String,
      default: 'right-start',
    },
    sm: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { resolveClient } = useApolloClient()
    const isLoggedIn = useReactiveVar(isLoggedInVar)

    const { result: result2 } = useQuery(GET_PROFILE)
    const getProfile = useResult(result2, null, () => ({
      enabled: isLoggedIn.value,
      fetchPolicy: 'cache-only',
    }))

    return {
      icons: {
        ziChat,
      },
      resolveClient,
      isLoggedIn,
      getProfile,
    }
  },
  data() {
    return {
      commentsIds: [],
      viewedComments: [],
      isMenuActive: false,
      addCommentLoading: false,
      comment: '',
    }
  },
  computed: {
    badgeStyles() {
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
    newCommentsCount() {
      let count = 0
      this.items.forEach((item) => {
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
    light() {
      return this.isPaper
    },
    discussions() {
      const items = this.items || []
      const discussions = items.filter((d) => !d.replyTo)
      return discussions
        .map((item) => {
          const comments = items.filter((c) => c.replyTo === item.id)
          return {
            ...item,
            comments,
          }
        })
        .sort((a, b) => {
          const aDate = this.$parseDate(a.updatedAt)
          const bDate = this.$parseDate(b.updatedAt)
          return aDate > bDate ? 1 : aDate < bDate ? -1 : 0
        })
    },
  },
  watch: {
    isMenuActive(val) {
      if (val) {
        setTimeout(() => {
          this.updateViewedComments()
        }, 250)
      }
    },
    items(val, oldVal) {
      const valLength = (val && val.length) || 0
      const oldValLength = (oldVal && oldVal.length) || 0
      if (this.isMenuActive && valLength > oldValLength) {
        const newIds = []
        val.forEach((el) => {
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
    async updateViewedComments(commentsIds) {
      try {
        const client = this.resolveClient()
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
          mutation = this.isProduct
            ? MARK_PAPER_PRODUCT_COMMENTS_AS_VIEWED
            : MARK_PAPER_SPEC_COMMENTS_AS_VIEWED
        } else {
          mutation = this.isProduct
            ? MARK_PRODUCT_COMMENTS_AS_VIEWED
            : MARK_SPEC_COMMENTS_AS_VIEWED
        }
        await client.mutate({
          mutation,
          variables,
        })
      } catch (error) {
        throw new Error(error)
      }
    },
    openMenu() {
      this.isMenuActive = true
    },
    closeMenu() {
      this.isMenuActive = false
    },
    toggleMenu() {
      this.isMenuActive = !this.isMenuActive
    },
    async addComment() {
      try {
        const client = this.resolveClient()
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
        await client.mutate({
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
