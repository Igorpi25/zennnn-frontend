<template>
  <div>
    <TextArea
      ref="input"
      :value="comment"
      :disabled="loading"
      :placeholder="label"
      hide-details
      outlined
      auto-grow
      rows="1"
      @input="onInput"
      @focus-change="onFocusChange"
      @keydown.native.enter="handleMeta"
    />
    <div
      v-if="hasFocus"
      class="flex"
    >
      <Button
        outlined
        borderless
        merge-class="text-gray-150 hover:text-gray-200"
        @click="blur"
      >
        {{ $t('action.cancel') }}
      </Button>
      <div class="flex-grow" />
      <Button
        :disabled="!comment"
        :loading="loading"
        outlined
        borderless
        @click="submitComment"
      >
        {{ $t('comments.post') }}
      </Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    light: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      comment: '',
      hasFocus: false,
    }
  },
  watch: {
    value (val) {
      this.comment = val
    },
  },
  methods: {
    clear () {
      this.comment = ''
    },
    handleMeta (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.submitComment()
      }
    },
    onInput (val) {
      this.comment = val
      this.$emit('input', val)
    },
    onFocusChange (val) {
      if (val) {
        this.hasFocus = true
      } else {
        if (!this.comment) {
          this.hasFocus = false
        }
      }
    },
    blur () {
      this.clear()
      this.$refs.input.$refs.input.blur()
      this.hasFocus = false
    },
    submitComment () {
      if (!this.comment) return
      this.$emit('submit', this.comment)
    },
  },
}
</script>
