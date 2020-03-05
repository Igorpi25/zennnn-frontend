<template>
  <InputBase
    :is-dirty="!!internalInput"
    :has-error="hasError"
    :hide-details="hideDetails"
    :detail-text="errorText"
    :class="[
      customClass,
      'select',
      {
        'select--outlined': outlined,
        'select--squared': squared,
        'select--borderless': borderless,
        'select--solo': solo,
        'select--colored': colored,
        'select--focused': hasFocus && searchable,
        'select--active': hasFocus || menu,
        'select--disabled': disabled,
      }
    ]"
  >
    <div
      ref="slot"
      class="select__controls"
    >
      <div
        class="select__slot"
      >
        <label
          v-if="!solo"
          :for="inputId"
          :class="[
            'select__label',
            { 'select__label--active': isLabelActive }
          ]"
        >
          {{ label }}
        </label>
        <div
          v-if="$slots.prepend"
          class="select__prepend"
        >
          <slot name="prepend" />
        </div>
        <input
          ref="input"
          v-model="internalInput"
          :id="inputId"
          :type="type"
          :name="name"
          :required="required"
          :readonly="!searchable"
          :disabled="disabled"
          :minlength="minlength"
          :maxlength="maxlength"
          :autofocus="autofocus"
          :placeholder="placeholder"
          :class="[placeholderClass, inputClass, 'select-input']"
          autocomplete="off"
          @input="input"
          @focus="onFocus"
          @blur="onBlur"
        >
        <div
          v-if="$slots.append || $scopedSlots.append"
          class="select__append"
        >
          <slot name="append" :isMenuOpen="menu" :toggle="toggleMenu" />
        </div>
      </div>
      <div class="select__append-outer">
        <slot name="append-outer" :isMenuOpen="menu" />
      </div>
      <v-menu
        ref="menu"
        v-model="menu"
        :attach="$refs.slot"
        :close-on-click="false"
        :close-on-content-click="false"
        :open-on-click="false"
        :disable-keys="true"
        :max-height="maxHeight"
        :min-width="minWidth"
        :max-width="maxWidth"
        :nudge-bottom="nudgeBottom"
        offset-y
      >
        <ul
          class="select-picker"
          role="menu"
        >
          <li
            v-if="items.length === 0"
            class="select-picker__item select-picker__item--disabled"
          >
            <span v-if="searchable && search">
              {{ $t('select.noResult') }}
            </span>
            <span v-else>
              {{ $t('select.noData') }}
            </span>
          </li>
          <li
            v-else
            v-for="item in items"
            :key="item[itemValue]"
            :value="item[itemValue]"
            :class="[
              'select-picker__item',
              { 'select-picker__item--selected': item[itemValue] === internalValue[itemValue] }
            ]"
            tabindex="0"
            role="menuitem"
            @click="select(item)"
          >
            <span>{{ item[itemText] }}</span>
          </li>
          <li
            v-if="$slots['append-item']"
            key="select-append-item"
            class="select-picker__item"
            tabindex="0"
            role="menuitem"
            @click="appendItemClick"
          >
            <slot name="append-item" />
          </li>
        </ul>
      </v-menu>
    </div>
  </InputBase>
</template>

<script>
import focusable from '@/mixins/focusable'
import validatable from '@/mixins/validatable'
import { isObject } from '../../util/helpers'

export default {
  name: 'Select',
  inject: {
    form: {
      default: null,
    },
  },
  mixins: [focusable, validatable],
  props: {
    value: {
      type: [String, Number, Object],
      default: () => ({}),
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      default: '',
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    itemValue: {
      type: String,
      default: 'value',
    },
    itemText: {
      type: String,
      default: 'text',
    },
    minWidth: {
      type: [Number, String],
      default: '100%',
    },
    maxWidth: {
      type: [Number, String],
      default: '100%',
    },
    maxHeight: {
      type: [Number, String],
      default: 304,
    },
    nudgeBottom: {
      type: [Number, String],
      default: 0,
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
    name: {
      type: String,
      default: null,
    },
    required: {
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
    outlined: {
      type: Boolean,
      default: false,
    },
    squared: {
      type: Boolean,
      default: false,
    },
    borderless: {
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
    customClass: {
      type: [String, Array, Object],
      default: '',
    },
    inputClass: {
      type: [String, Array, Object],
      default: '',
    },
  },
  data () {
    return {
      // TODO input registrator
      inputId: 'input' + Math.round(Math.random() * 100000),
      lazyInput: '',
      lazyValue: this.value,
      menu: false,
      content: null,
      isActive: false,
    }
  },
  computed: {
    placeholderClass () {
      let c = this.colored
        ? 'placeholder-primary' : this.squared
          ? 'placeholder-gray-200' : this.outlined
            ? 'placeholder-primary' : 'placeholder-gray-100'
      if (this.outlined || this.squared) {
        c += ' focus:placeholder-gray-light'
      }
      return c
    },
    internalValue: {
      get () {
        if (isObject(this.lazyValue)) {
          return this.lazyValue
        } else {
          const item = this.items.find(el => el[this.itemValue] === this.lazyValue)
          return item || {}
        }
      },
      set (val) {
        this.lazyValue = val
      },
    },
    internalInput: {
      get () {
        let v = ''
        if (isObject(this.value)) {
          v = this.value[this.itemText]
        } else {
          const item = this.items.find(el => el[this.itemValue] === this.value)
          v = item ? item[this.itemText] : ''
        }
        return this.hasFocus && this.searchable ? this.lazyInput : v
      },
      set (val) {
        this.lazyInput = val || null
      },
    },
    isLabelActive () {
      return this.hasFocus || this.internalInput || this.placeholder
    },
  },
  watch: {
    value: {
      handler (val) {
        this.lazyValue = val
      },
      immediate: true,
    },
    hasFocus (val) {
      if (this.searchable) {
        this.internalInput = (this.value && this.value[this.itemText]) || ''
      }
      if (val) {
        this.openMenu()
      } else {
        this.$emit('update:search', '')
      }
    },
  },
  created () {
    if (this.form) {
      this.form.register(this)
    }
  },
  mounted () {
    if (this.autofocus) {
      this.$refs.input.focus()
    }
    this.content = this.$refs.menu && this.$refs.menu.$refs.content
  },
  beforeDestroy () {
    if (this.form) {
      this.form.unregister(this)
    }
  },
  methods: {
    toggleMenu () {
      if (this.menu) {
        this.closeMenu()
      } else {
        this.openMenu()
      }
    },
    openMenu () {
      this.menu = true
      document.addEventListener('click', this.closeConditional, false)
    },
    closeMenu () {
      this.menu = false
      document.removeEventListener('click', this.closeConditional, false)
    },
    appendItemClick (e) {
      this.$emit('click:append-item', e)
      this.closeMenu()
    },
    select (value) {
      this.internalValue = value
      const val = this.returnObject ? value : value[this.itemValue]
      this.$emit('input', val)
      this.closeMenu()
    },
    input (e) {
      if (this.searchable) {
        this.$emit('update:search', this.internalInput)
      }
      this.checkField(e)
    },
    closeConditional (e) {
      if (
        // Click originates from outside the menu content
        this.content &&
        !this.content.contains(e.target) &&

        // Click originates from outside the element
        this.$el &&
        !this.$el.contains(e.target) &&
        e.target !== this.$el
      ) {
        this.closeMenu()
      }
    },
  },
}
</script>
