<template>
  <div>
    <CommentCard
      :item="item"
      :light="light"
    />
    <div class="pt-4 pl-4">
      <CommentCard
        v-for="c in item.comments"
        :key="c.id"
        :item="c"
        :light="light"
      />
      <!-- <CommentInput
        ref="commentInput"
        v-model="comment"
        :loading="commentSubmitLoading"
        :light="light"
        :label="$t('comments.enterReply')"
        class="mt-3"
        @submit="commentSubmit"
      /> -->
    </div>
    <div :class="['border-b my-4', light ? 'border-light-gray-400' : 'border-gray-200']" />
  </div>
</template>

<script>
import {
  REPLY_TO_SPEC_COMMENT,
  REPLY_TO_PRODUCT_COMMENT,
  REPLY_TO_PAPER_SPEC_COMMENT,
  REPLY_TO_PAPER_PRODUCT_COMMENT,
} from '../graphql/mutations'
import CommentCard from './CommentCard'
// import CommentInput from './CommentInput'

export default {
  name: 'Comment',
  components: {
    CommentCard,
    // CommentInput,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
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
  },
  data () {
    return {
      commentSubmitLoading: false,
      comment: '',
    }
  },
  computed: {
    light () {
      return this.isPaper
    },
  },
  methods: {
    async commentSubmit () {
      try {
        const comment = this.comment
        const commentId = this.item.id
        if (!comment) return
        this.commentSubmitLoading = true
        let mutation
        const variables = {
          commentId,
          comment,
        }
        if (this.isProduct) {
          variables.productId = this.productId
          mutation = this.isPaper
            ? REPLY_TO_PAPER_PRODUCT_COMMENT
            : REPLY_TO_PRODUCT_COMMENT
        } else {
          variables.specId = this.specId
          mutation = this.isPaper
            ? REPLY_TO_PAPER_SPEC_COMMENT
            : REPLY_TO_SPEC_COMMENT
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
        this.commentSubmitLoading = false
      }
    },
  },
}
</script>
