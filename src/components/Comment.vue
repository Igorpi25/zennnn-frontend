<template>
  <div
    class="p-4 rounded shadow-md"
    :style="{ 'border-color': light ? '#E5E5E5' : '#474747', borderWidth: '1px', borderStyle: 'solid' }"
  >
    <CommentCard
      :item="item"
      :light="light"
    />
    <div
      class="border-b my-2"
      :style="{ 'border-color': light ? '#E5E5E5' : '#474747', borderWidth: '1px', borderStyle: 'solid' }"
    />
    <div>
      <CommentCard
        v-for="c in item.comments"
        :key="c.id"
        :item="c"
        :light="light"
      />
      <CommentInput
        ref="commentInput"
        v-model="comment"
        :loading="commentSubmitLoading"
        :label="$t('comments.enterReply')"
        class="mt-3"
        @submit="commentSubmit"
      />
    </div>
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
import CommentInput from './CommentInput'

export default {
  name: 'Comment',
  components: {
    CommentCard,
    CommentInput,
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
