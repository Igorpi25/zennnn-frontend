<template>
  <InputBase
    :is-dirty="!!internalValue"
    :has-error="hasError"
    :has-state-icon="hasStateIcon"
    :hide-details="hideDetails"
    :detail-text="errorText"
    :class="[
      'text-field',
      {
        'is-disabled': disabled,
        'is-readonly': readonly,
        'text-field--outlined': outlined,
        'text-field--squared': squared,
        'text-field--single-line': singleLine,
        'text-field--solo': solo,
        'text-field--colored': colored,
        'text-field--borderless': borderless,
        'text-field--focused': hasFocus,
        'text-field--text-dark': textDark,
        'text-field--background-dark': backgroundDark
      }
    ]"
  >
    <div class="text-field__controls">
      <div class="text-field__slot"
        :style="compHeight"
      >
        <label
          v-if="!solo"
          :for="inputId"
          :class="[
            'text-field__label',
            { 'text-field__label--active': isLabelActive }
          ]"
        >
          {{ label }}
        </label>
        <div
          v-if="$slots.prepend"
          class="text-field__prepend"
        >
          <slot name="prepend" />
        </div>
        <input
          ref="input"
          v-model="internalValue"
          :id="inputId"
          :type="type"
          :name="name"
          :required="required"
          :readonly="readonly"
          :disabled="disabled"
          :minlength="minlength"
          :maxlength="maxlength"
          :autofocus="autofocus"
          :placeholder="placeholder"
          :class="{ 'text-right' : type === 'number' || right }"
          :inputmode="inputmode"
          :pattern="pattern"
          :step="step"
          @input="input"
          @keydown="onKeyDown"
          @focus="onFocus"
          @blur="onBlur"
        >
        <div
          v-if="$slots.append"
          class="text-field__append"
        >
          <slot name="append" />
        </div>
      </div>
      <div class="text-field__append-outer">
        <slot name="append-outer" />
        <div
          v-if="hasStateIcon"
          class="text-field__state-icon"
        >
          <Icon v-if="hasError" color="#808080">
            {{ icons.mdiCloseCircle }}
          </Icon>
          <Icon v-else color="#808080">
            {{ icons.mdiCheckCircle }}
          </Icon>
        </div>
      </div>
    </div>
  </InputBase>
</template>

<script>
import debounce from 'lodash.debounce'

import { mdiCloseCircle, mdiCheckCircle } from '@mdi/js'

import validatable from '@/mixins/validatable'

import { convertToUnit } from '@/util/helpers'

export default {
  name: 'TextField',
  inject: {
    form: {
      default: null,
    },
  },
  mixins: [validatable],
  props: {
    value: {
      type: [String, Number, Date],
      default: null,
    },
    rules: {
      type: Array,
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    inputmode: {
      type: String,
      default: 'text',
    },
    name: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    minlength: {
      type: String,
      default: null,
    },
    maxlength: {
      type: String,
      default: null,
    },
    height: {
      type: [String, Number],
      default: null,
    },
    right: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: null,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    stateIcon: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    squared: {
      type: Boolean,
      default: false,
    },
    singleLine: {
      type: Boolean,
      default: false,
    },
    solo: {
      type: Boolean,
      default: false,
    },
    colored: {
      type: Boolean,
      default: false,
    },
    borderless: {
      type: Boolean,
      default: false,
    },
    textDark: {
      type: Boolean,
      default: false,
    },
    backgroundDark: {
      type: Boolean,
      default: false,
    },
    debounce: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      blurWithoutUpdate: false,
      hasFocus: false,
      editMode: false,
      // TODO input registrator
      inputId: 'input' + Math.round(Math.random() * 100000),
      lazyValue: this.value,
      integerPattern: '[0-9]*',
      decimalPattern: '^[-+]?[0-9]+[,.][0-9]+$',
      integerStep: '1',
      decimalStep: '0.01',
      icons: {
        mdiCloseCircle,
        mdiCheckCircle,
      },
    }
  },
  computed: {
    compHeight () {
      return this.height ? convertToUnit(this.height) : null
    },
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        let value = val || null
        if (this.type === 'number') {
          // clear input leading zero and non-digits
          // [type="number"] safari allow to input letters
          // TODO detector non-support devices and clear only on them
          if (value && !/\d+(,|\.)&/.test(value)) {
            value = Number(value)
          }
        }
        this.lazyValue = value
        if (this.debounce) {
          this.debounceInput()
        } else {
          this.$emit('input', value)
        }
      },
    },
    isLabelActive () {
      return this.hasFocus || this.internalValue || this.placeholder
    },
    hasStateIcon () {
      return this.form && this.form.wasValidated && this.stateIcon
    },
    pattern () {
      if (this.type === 'number') {
        if (this.inputmode === 'decimal') {
          return this.integerPattern
        } else {
          return this.decimalPattern
        }
      }
      return null
    },
    step () {
      if (this.type === 'number') {
        if (this.inputmode === 'decimal') {
          return this.integerStep
        } else {
          return this.decimalStep
        }
      }
      return null
    },
  },
  watch: {
    value (val) {
      if (this.editMode) return
      this.lazyValue = val
    },
  },
  created () {
    if (this.debounce) {
      this.debounceInput = debounce(this.emitChange, this.debounce)
    }
    if (this.form) {
      this.form.register(this)
    }
  },
  mounted () {
    if (this.autofocus) {
      this.$refs.input.focus()
    }
  },
  beforeDestroy () {
    if (this.form) {
      this.form.unregister(this)
    }
  },
  methods: {
    onFocus () {
      // edit mode start on focus
      this.editMode = true
      this.hasFocus = true
    },
    onBlur () {
      this.hasFocus = false
      // stop edit mode and call emit
      this.editMode = false
      // cancel debounced
      if (this.debounce) {
        this.debounceInput.cancel()
      }
      // on esc blur without update
      if (this.blurWithoutUpdate) {
        this.blurWithoutUpdate = false
        return
      }
      // immediate call changes
      if (this.internalValue !== this.value) {
        this.emitChange()
      }
    },
    focus () {
      this.$refs.input.focus()
    },
    emitChange () {
      this.$emit('input', this.internalValue)
    },
    input (e) {
      if (this.type === 'number') {
        this.hasError = e.target.validity.badInput
      }
      this.checkField(e)
    },
    onKeyDown (e) {
      if (this.debounce) {
        // on esc set value from store
        if (e.key === 'Esc' || e.key === 'Escape') {
          this.internalValue = this.value
          this.blurWithoutUpdate = true
          this.$refs.input.blur()
          e.preventDefault()
        } else if (e.key === 'Enter') {
          // on enter blur normally
          this.$refs.input.blur()
          e.preventDefault()
        }
      }
      // for ios inputtype="numberic" & pattern="[0-9]*"
      // and not exist e.key on ios, TODO with e.which
      if (this.type === 'number') {
        // prevent if e.key non-digit or [,.+-]
        // on ios e.which
        // 0-9 - 48-57
        // +   - 187
        // -   - 189
        // ,   - 188
        // .   - 190
        if (
          (e.key &&
          e.key.length === 1 &&
          !/\d|[,.+-]/.test(e.key)) ||
          (!e.key && e.which &&
            !((e.which >= 48 && e.which <= 57) || (e.which >= 187 && e.which <= 190)))
        ) {
          e.preventDefault()
        }
      }
    },
  },
}
</script>
