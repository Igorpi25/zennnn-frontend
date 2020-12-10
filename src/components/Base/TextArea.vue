<template>
  <div
    :class="compContentClass"
  >
    <label
      v-if="!singleLine"
      :for="computedId"
      :class="[
        'block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2',
      ]"
    >
      {{ label }}
    </label>
    <div class="relative w-full">
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
          'w-full text-current appearence-none bg-transparent focus:outline-none transition-colors duration-100 ease-out',
          'placeholder-gray-200 resize-none px-sm py-3',
          { 'cursor-not-allowed': disabled },
          { 'cursor-wait': !disabled && loading },
          { 'pr-7': hasState },
          inputClass,
        ]"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
      />
      <span
        v-if="hasState"
        class="absolute top-0 right-0  pt-4 pr-4"
        :class="stateColorClass"
      >
        <svg v-if="stateColorClass === 'text-yellow-500' && stateColor === 'warn'" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="4" fill="currentColor" />
        </svg>
        <svg v-else width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M1.41421 1L6.07107 5.65685L4.65685 7.07107L0 2.41421L1.41421 1Z M10.3137 1.41421L4.65685 7.07107L3.24264 5.65685L8.8995 0L10.3137 1.41421Z" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

import validatable from '@/mixins/validatable'
import { mergeClasses } from '../../util/helpers'

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
      default: 1,
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
    stateIcon: Boolean,
    stateColor: String,
  },
  data () {
    return {
      hasFocus: false,
      lazyValue: this.value,
    }
  },
  computed: {
    compContentClass () {
      const classes = [
        'rounded relative flex items-center focus:outline-none transition-colors duration-100 ease-out',
        'focus-within:shadow-blue-500 text-white text-base bg-gray-800',
      ]
      if (this.disabled) {
        classes.push('opacity-40 cursor-not-allowed')
      }
      if (this.contentClass) {
        return mergeClasses(classes, this.contentClass)
      }
      return classes
    },
    stateColorClass () {
      return this.stateIcon && this.stateColor === 'warn' && !this.internalValue
        ? 'text-yellow-500'
        : this.hasState
          ? 'text-green-500'
          : ''
    },
    hasState () {
      return (this.stateIcon && this.internalValue) || (this.stateIcon && this.stateColor === 'warn')
    },
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
    this.autoGrow && this.$nextTick(this.calculateHeight)
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
