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
          <Icon
            :size="iconSize"
            class="cursor-pointer select-none"
            role="button"
          >
            {{ icons.mdiMessageReplyText }}
          </Icon>
        </div>
      </template>
      <div
        :class="['px-4 py-5', light ? 'paper-theme' : 'bg-gray']"
      >
        <div
          v-for="item in discussions"
          :key="item.id"
          class="pb-4"
        >
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
            v-model="comment"
            :loading="addCommentLoading"
            :light="light"
            label="Введите комментарий..."
            @submit="addComment"
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
      default: 20,
    },
  },
  data () {
    return {
      menu: false,
      addCommentLoading: false,
      comment: '',
      icons: {
        mdiMessageReplyText,
      },
    }
  },
  computed: {
    light () {
      return this.isPaper
    },
    discussions () {
      const items = this.items || []
      const discussions = items.filter(d => !d.replyTo)
      return discussions.map(item => {
        const comments = items.filter(c => c.replyTo === item.id)
        return {
          ...item,
          comments,
        }
      })
    },
  },
  methods: {
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
