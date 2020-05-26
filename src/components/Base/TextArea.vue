<template>
  <div
    :class="[
      'rounded relative flex items-center focus:outline-none transition-colors duration-100 ease-out',
      'focus-within:shadow-blue-500 text-white text-base bg-gray-800',
      { 'opacity-40 cursor-not-allowed': disabled },
    ]"
  >
    <label
      v-if="!singleLine"
      :for="computedId"
      :class="[
        'block leading-5 text-base text-gray-200 text-right whitespace-no-wrap py-2',
      ]"
    >
      {{ label }}
    </label>
    <textarea
      ref="input"
      v-model="internalValue"
      :id="computedId"
      :name="name"
      :required="required"
      :readonly="readonly"
      :disabled="disabled"
      :cols="cols"
      :rows="rows"
      :maxlength="maxlength"
      :minlength="minlength"
      :autofocus="autofocus"
      :placeholder="placeholder"
      :class="[
        'w-full text-current appearence-none bg-transparent focus:outline-none transition-colors duration-100 ease-out truncate',
        'placeholder-gray-200 px-sm py-3',
        { 'cursor-not-allowed': disabled },
        { 'cursor-wait': !disabled && loading },
        inputClass,
      ]"
      style="resize:none"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @change="onChange"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

import { mdiCloseCircle, mdiCheckCircle } from '@mdi/js'

import validatable from '@/mixins/validatable'

export default {
  name: 'TextArea',
  mixins: [validatable],
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    label: String,
    type: {
      type: String,
      default: 'text',
    },
    name: String,
    required: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    cols: {
      type: [String, Number],
      default: null,
    },
    rows: {
      type: [String, Number],
      default: null,
    },
    minlength: String,
    maxlength: String,
    autofocus: Boolean,
    placeholder: String,
    clearable: Boolean,
    hideDetails: Boolean,
    autoGrow: Boolean,
    singleLine: Boolean,
    debounce: {
      type: Number,
      default: 0,
    },
    contentClass: {
      type: [String, Object],
      default: '',
    },
    inputClass: {
      type: [String, Object],
      default: '',
    },
    loading: Boolean,
    lazy: Boolean,
  },
  data () {
    return {
      hasFocus: false,
      lazyValue: this.value,
      icons: {
        mdiCloseCircle,
        mdiCheckCircle,
      },
    }
  },
  computed: {
    computedId () {
      return this.id || `input-${this._uid}`
    },
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        const value = val || null
        this.lazyValue = value
        if (!this.lazy) {
          if (this.debounce) {
            this.debounceInput()
          } else {
            this.$emit('input', value)
          }
        }
      },
    },
    isLabelActive () {
      return this.hasFocus || this.internalValue || this.placeholder
    },
  },
  watch: {
    value (val) {
      this.lazyValue = val
    },
    hasFocus (val) {
      this.$emit('focus-change', val)
    },
  },
  created () {
    if (this.debounce) {
      this.debounceInput = debounce(this.emitChange, this.debounce)
    }
  },
  mounted () {
    if (this.autofocus) {
      this.$refs.input.focus()
    }
    this.autoGrow && this.calculateHeight()
  },
  methods: {
    emitChange () {
      this.$emit('input', this.internalValue)
    },
    calculateHeight () {
      const textArea = this.$refs.input
      textArea.style.height = '0'

      const height = textArea.scrollHeight
      const minHeight = parseInt(this.rows, 10) * 24

      textArea.style.height = Math.max(minHeight, height) + 'px'
    },
    onInput () {
      if (this.autoGrow) {
        this.calculateHeight()
      }
    },
    onChange () {
      if (this.lazy) {
        this.emitChange()
      }
    },
    onFocus () {
      this.hasFocus = true
    },
    onBlur () {
      this.hasFocus = false
    },
  },
}
</script>
