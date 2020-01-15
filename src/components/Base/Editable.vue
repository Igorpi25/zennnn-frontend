<template>
  <div class="relative">
    <div
      v-if="type === 'editable'"
      ref="editable"
      :id="id"
      :placeholder="compPlaceholder"
      :class="[
        'editable',
        {
          'editable--focused': isFocused,
          'editable--outlined': outlined,
          'editable--single-line': singleLine,
          'editable--has-error': hasError,
          'text-right': type === 'number'
        }
      ]"
      :style="compStyle"
      contenteditable
      spellcheck
      v-on="listeners"
      @keydown="onKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    />
    <!-- TODO: change Editable with input to TextField -->
    <input
      v-else
      ref="editable"
      v-model="internalValue"
      :id="id"
      :placeholder="compPlaceholder"
      :class="[
        'editable',
        {
          'editable--focused': isFocused,
          'editable--outlined': outlined,
          'editable--has-error': hasError,
          'text-right': type === 'number'
        }
      ]"
      :style="compStyle"
      :type="type === 'number' ? 'text' : type"
      :min="type === 'number' ? min : null"
      :max="type === 'number'? max : null"
      :inputmode="inputmode"
      :pattern="pattern"
      :step="step"
      v-on="listeners"
      @keydown="onKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import {
  uuid,
  setCaretPosition,
  getCaretPosition,
  setCaretToEnd,
  formatNumber,
  unformat,
  setCursor,
  // event,
} from '../../util/helpers'

export default {
  name: 'Editable',

  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    inputmode: {
      type: String,
      default: 'text',
    },
    formatStyle: {
      type: String,
      default: 'decimal',
    },
    min: {
      type: String,
      default: null,
    },
    max: {
      type: String,
      default: null,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    singleLine: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    debounce: {
      type: Number,
      default: 0,
    },
    arrowMove: {
      type: Boolean,
      default: false,
    },
    arrowMoveMode: {
      type: String,
      default: 'table',
    },
    // if arrowMove is not 'table'
    siblingItemSelector: {
      type: String,
      default: '',
    },
    textColor: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      blurWithoutUpdate: false,
      editMode: false,
      id: uuid(),
      lazyValue: this.value,
      isFocused: false,
      hasError: false,
      integerPattern: '[0-9]*',
      decimalPattern: '^[0-9]+[,.][0-9]+$',
      integerStep: '1',
      decimalStep: '0.01',
    }
  },

  computed: {
    compPlaceholder () {
      // ignore placeholder on number
      return this.type === 'number'
        ? '' : this.placeholder
    },
    compStyle () {
      return this.textColor
        ? { color: this.textColor }
        : null
    },
    formatNumberOptions () {
      return {
        precision: this.inputmode === 'numeric' ? 0 : 2,
        thousand: this.editMode ? '' : ' ',
        decimal: ',',
        fixed: !this.editMode && this.formatStyle === 'currency',
        fallback: !this.editMode ? 0 : null,
      }
    },
    listeners () {
      return { ...this.$listeners, input: this.input, change: this.change }
    },
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        let value = val || null
        if (this.type === 'number') {
          value = formatNumber(val, this.formatNumberOptions)
        }
        this.lazyValue = value
      },
    },
    pattern () {
      if (this.type === 'number') {
        if (this.inputmode === 'decimal') {
          return this.decimalPattern
        } else {
          return this.integerPattern
        }
      }
      return null
    },
    step () {
      if (this.type === 'number') {
        if (this.inputmode === 'decimal') {
          return this.decimalStep
        } else {
          return this.integerStep
        }
      }
      return null
    },
  },

  watch: {
    value: {
      handler (val) {
        if (this.editMode) return
        this.internalValue = val
        if (this.type === 'editable') {
          this.setValue(val)
        }
      },
      immediate: true,
    },
  },

  created () {
    // debounce delay for different types
    const delay = this.debounce
      ? this.debounce : this.type === 'number'
        ? 600 : 250
    this.debounceInput = debounce(this.emitChange, delay)
  },

  mounted () {
    if (this.type === 'editable') {
      this.setValue(this.value, false)
    }
  },

  methods: {
    input (e) {
      const val = this.type === 'editable'
        ? e.target.innerText : e.target.value
      if (this.type === 'number') {
        const el = e.target
        let positionFromEnd = el.value.length - el.selectionEnd
        // update input value with formatted data
        el.value = formatNumber(el.value, this.formatNumberOptions)
        positionFromEnd = el.value.length - positionFromEnd
        setCursor(el, positionFromEnd)
        // el.dispatchEvent(event('change'))

        this.hasError = e.target.validity.badInput
      }
      // set input value for editable type
      if (this.type === 'editable') {
        this.internalValue = val || null
      }
      if (!this.lazy) {
        this.debounceInput()
      }
    },

    change () {
      if (this.lazy) {
        this.emitChange()
      }
    },

    emitChange () {
      // on number type return internal value, without formatting
      const val = this.type === 'number'
        ? unformat(this.internalValue, this.formatNumberOptions.decimal)
        : this.internalValue
      this.$emit('input', val)
    },

    onFocus (e) {
      // edit mode start on focus
      this.editMode = true
      this.isFocused = true
      if (this.type === 'number') {
        this.internalValue = this.value
          ? formatNumber(this.internalValue, this.formatNumberOptions)
          : null
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = e.target.value.length
        })
      }
    },

    onBlur (e) {
      this.isFocused = false
      // stop edit mode and call emit
      this.editMode = false
      if (this.type === 'number') {
        this.internalValue = formatNumber(this.internalValue, this.formatNumberOptions)
      }
      // cancel debounced
      this.debounceInput.cancel()
      // on esc blur without update
      if (this.blurWithoutUpdate) {
        this.blurWithoutUpdate = false
        return
      }
      // immediate call changes
      const val = this.type === 'number'
        ? unformat(this.internalValue, this.formatNumberOptions.decimal)
        : this.internalValue
      if (val !== this.value && !this.lazy) {
        this.emitChange()
      }
    },

    onKeyDown (e) {
      // on esc set value from store
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.internalValue = this.value
        this.blurWithoutUpdate = true
        if (this.$refs.editable) {
          this.$refs.editable.blur()
        }
        e.preventDefault()
        return
      } else if (e.key === 'Enter') {
        // on enter blur normally
        if (this.$refs.editable) {
          this.$refs.editable.blur()
        }
        e.preventDefault()
        return
      }
      if (!this.arrowMove) return
      const position = getCaretPosition(this.$refs.editable)
      if (e.key === 'ArrowLeft' || e.key === 'Left') { // 'Left' IE/Edge specific value
        if (this.arrowMoveMode !== 'table' && !this.siblingItemSelector) return
        if (this.isPositionStart(position)) {
          e.preventDefault()
          this.focusPrevious(null, true)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Up') { // 'Up' IE/Edge specific value
        if (this.arrowMoveMode !== 'table') return
        e.preventDefault()
        this.focusPreviousRow(position)
      } else if (e.key === 'ArrowRight' || e.key === 'Right') { // 'Right' IE/Edge specific value
        if (this.arrowMoveMode !== 'table' && !this.siblingItemSelector) return
        if (this.isPositionEnd(position)) {
          e.preventDefault()
          this.focusNext()
        }
      } else if (e.key === 'ArrowDown' || e.key === 'Down') { // 'Down' IE/Edge specific value
        if (this.arrowMoveMode !== 'table') return
        e.preventDefault()
        this.focusNextRow(position)
      }
    },

    setValue (value, setPosition) {
      const position = setPosition
        ? getCaretPosition(this.$refs.editable)
        : 0
      if (this.type === 'editable') {
        this.$refs.editable.innerText = value
      } else {
        this.$refs.editable.value = value
      }
      if (setPosition) {
        setCaretPosition(this.$refs.editable, position)
      }
    },

    focusNextRow (position) {
      const active = document.activeElement
      const siblingRow = active.closest('tr')
      if (siblingRow) {
        const nextRow = siblingRow.nextElementSibling
        if (nextRow) {
          const currentTD = active.closest('td')
          const cell = nextRow.cells[currentTD.cellIndex]
          const target = cell.querySelector('.editable')
          this.setFocus(target, position)
        }
      }
    },

    focusPreviousRow (position) {
      const active = document.activeElement
      const siblingRow = active.closest('tr')
      if (siblingRow) {
        const previousRow = siblingRow.previousElementSibling
        if (previousRow) {
          const currentTD = active.closest('td')
          const cell = previousRow.cells[currentTD.cellIndex]
          const target = cell.querySelector('.editable')
          this.setFocus(target, position)
        }
      }
    },

    focusNext (position, toEnd) {
      const target = this.getSibling()
      if (target) {
        this.setFocus(target, position, toEnd)
      }
    },

    focusPrevious (position, toEnd) {
      const target = this.getSibling(true)
      if (target) {
        this.setFocus(target, position, toEnd)
      }
    },

    getSibling (previous) {
      const active = document.activeElement
      const selector = this.arrowMoveMode === 'table'
        ? 'td' : this.siblingItemSelector
      const sibling = active.closest(selector)
      if (sibling) {
        const target = previous
          ? sibling.previousElementSibling
          : sibling.nextElementSibling
        return target && target.querySelector('.editable')
      }
      return null
    },

    setFocus (target, position, toEnd) {
      target.focus()
      if (position) {
        const range = document.createRange()
        range.selectNodeContents(target)
        const targetLength = range.toString().length
        if (position < targetLength) {
          setCaretPosition(target, position)
        } else {
          setCaretToEnd(target)
        }
      } else if (toEnd) {
        setCaretToEnd(target)
      }
    },

    isPositionStart (position) {
      const value = position || getCaretPosition(this.$refs.editable)
      return value === 0
    },

    isPositionEnd (position) {
      const value = position || getCaretPosition(this.$refs.editable)
      const range = document.createRange()
      range.selectNodeContents(this.$refs.editable)
      const length = range.toString().length
      return value === length
    },
  },
}
</script>

<style lang="postcss" scoped>
div[contenteditable=true]:empty::before {
  content: attr(placeholder);
  display: block; /* For Firefox */
  line-height: 1.5;
  min-height: 1.5em;
}

.editable {
  padding: 1px 6px;
  outline: none;
  line-height: 1.5;
  width: 100%;
  border-radius: 4px;
  @apply truncate text-primary bg-transparent;
}

.editable--focused {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  @apply bg-gray-darkest;
}
.editable--outlined {
  border: 1px solid #E0E0E0;
}
.editable--outlined.editable--focused {
  border: 1px solid #1E88E5;
}
.editable--single-line {
  color: #888888;
  border-bottom: 1px solid #888888;
  border-radius: 0;
}
.editable--single-line.editable--focused {
  background-color: transparent;
}
.editable--has-error {
  background-color: #522b2d;
}

 .editable::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  @apply text-primary;
}
 .editable::-moz-placeholder { /* Firefox 19+ */
  @apply text-primary;
}
 .editable:-ms-input-placeholder { /* IE 10+ */
  @apply text-primary;
}
 .editable:-moz-placeholder { /* Firefox 18- */
  @apply text-primary;
}

 .editable:focus::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  @apply text-gray-lighter;
}
 .editable:focus::-moz-placeholder { /* Firefox 19+ */
  @apply text-gray-lighter;
}
 .editable:focus:-ms-input-placeholder { /* IE 10+ */
  @apply text-gray-lighter;
}
 .editable:focus:-moz-placeholder { /* Firefox 18- */
  @apply text-gray-lighter;
}
</style>
