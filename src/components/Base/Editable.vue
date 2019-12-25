<template>
  <div class="relative">
    <div
      v-if="type === 'editable'"
      ref="editable"
      :id="id"
      :placeholder="placeholder"
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
      contenteditable
      spellcheck
      v-on="listeners"
      @keydown="onKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    />
    <input
      v-else
      ref="editable"
      v-model="internalValue"
      :id="id"
      :placeholder="placeholder"
      :class="[
        'editable',
        {
          'editable--focused': isFocused,
          'editable--outlined': outlined,
          'editable--has-error': hasError,
          'text-right': type === 'number'
        }
      ]"
      :type="type"
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
} from '@/util/helpers'

export default {
  name: 'Editable',

  props: {
    value: {
      type: [String, Number],
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
      decimalPattern: '^[-+]?[0-9]+[,.][0-9]+$',
      integerStep: '1',
      decimalStep: '0.01',
    }
  },

  computed: {
    listeners () {
      return { ...this.$listeners, input: this.input }
    },
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        this.lazyValue = val
      },
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
      this.internalValue = val
      if (this.type === 'editable') {
        this.setValue(val)
      }
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
    this.setValue(this.value, false)
  },

  methods: {
    input (e) {
      const val = this.type === 'editable'
        ? e.target.innerText : e.target.value
      let value = val || null
      if (this.type === 'number') {
        this.hasError = e.target.validity.badInput
        // clear input leading zero and non-digits
        // [type="number"] safari allow to input letters
        // TODO detector non-support devices and clear only on them
        if (value && !/\d+(,|\.)&/.test(value)) {
          value = Number(value)
        }
      }
      this.internalValue = value
      this.debounceInput()
    },

    emitChange () {
      this.$emit('input', this.internalValue)
    },

    onFocus () {
      // edit mode start on focus
      this.editMode = true
      this.isFocused = true
    },

    onBlur (e) {
      this.isFocused = false
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
