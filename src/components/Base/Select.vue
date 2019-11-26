<template>
  <InputBase
    :is-dirty="!!internalValue"
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
        'select--focused': hasFocus
      }
    ]"
  >
    <div
      class="select__controls"
    >
      <div
        ref="slot"
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
          v-model="internalValue"
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
          :class="[inputClass, 'select-input-asd']"
          autocomplete="off"
          @input="input"
          @focus="onFocus"
          @blur="onBlur"
        >
        <div
          v-if="$slots.append"
          class="select__append"
        >
          <slot name="append" />
        </div>
      </div>
      <div class="select__append-outer">
        <slot name="append-outer" />
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
              { 'select-picker__item--selected': item[itemValue] === value[itemValue] }
            ]"
            tabindex="0"
            role="menuitem"
            @click="select(item)"
          >
            <span>{{ item[itemText] }}</span>
          </li>
        </ul>
      </v-menu>
    </div>
  </InputBase>
</template>

<script>
import focusable from '@/mixins/focusable'
import validatable from '@/mixins/validatable'

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
      type: Object,
      default: () => ({}),
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
      lazyValue: '',
      menu: false,
      content: null,
      isActive: false,
    }
  },
  computed: {
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        let value = val || null
        this.lazyValue = value
      },
    },
    isLabelActive () {
      return this.hasFocus || this.internalValue || this.placeholder
    },
  },
  watch: {
    value (val) {
      const v = val || {}
      this.internalValue = v[this.itemText]
    },
    hasFocus (val) {
      if (this.searchable) {
        this.internalValue = (this.value && this.value[this.itemText]) || ''
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
    openMenu () {
      this.menu = true
      document.addEventListener('click', this.closeConditional, false)
    },
    closeMenu () {
      this.menu = false
      document.removeEventListener('click', this.closeConditional, false)
    },
    select (value) {
      this.$emit('input', value)
      this.closeMenu()
    },
    input (e) {
      if (this.searchable) {
        this.$emit('update:search', this.internalValue)
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
