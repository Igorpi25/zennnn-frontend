<template>
  <div>
    <textarea
      ref="input"
      :value="comment"
      :disabled="loading"
      :placeholder="label"
      :class="[
        'px-xs placeholder-blue-500 resize-none',
        'w-full appearence-none bg-transparent focus:outline-none transition-colors duration-100 ease-out',
        light ? 'text-gray-900 focus:placeholder-gray-100' : 'text-white focus:placeholder-gray-200',
      ]"
      rows="1"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="handleMeta"
    />
    <div
      v-if="isFocused"
      class="flex pt-3"
    >
      <div class="flex-grow" />
      <Btn
        outlined
        :merge-class="light ? 'text-gray-900 border-gray-100 h-8' : 'text-white border-gray-200 h-8'"
        content-class="w-full flex items-center justify-center text-xs"
        class="mr-2"
        min-width="68"
        @click="blur"
      >
        {{ $t('action.cancel') }}
      </Btn>
      <Btn
        :disabled="!comment"
        :loading="loading"
        :merge-class="!comment ? ['h-8', light ? 'bg-gray-100 text-light-gray-400' : 'bg-gray-300'] : 'h-8'"
        content-class="w-full flex items-center justify-center text-xs"
        min-width="68"
        @click="submitComment"
      >
        {{ $t('comments.post') }}
      </Btn>
    </div>
  </div>
</template>

<script>
import Btn from './Base/Btn'

export default {
  name: 'CommentInput',
  components: {
    Btn,
  },
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
      isFocused: false,
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
      this.$emit('input', '')
      this.$nextTick(this.calculateHeight)
    },
    handleMeta (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.submitComment()
      }
    },
    calculateHeight () {
      const textArea = this.$refs.input
      textArea.style.height = '0'

      const height = textArea.scrollHeight
      const minHeight = parseInt(1, 10) * 24

      textArea.style.height = Math.max(minHeight, height) + 'px'
    },
    onInput (e) {
      const val = e.target.value
      this.comment = val
      this.$emit('input', val)
      this.$nextTick(this.calculateHeight)
    },
    onFocus (val) {
      this.isFocused = true
    },
    onBlur () {
      if (!this.comment) {
        this.isFocused = false
      }
    },
    blur () {
      this.clear()
      this.$refs.input.blur()
      this.isFocused = false
    },
    submitComment () {
      if (!this.comment) return
      this.$emit('submit', this.comment)
    },
  },
}
</script>
