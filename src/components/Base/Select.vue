<template>
  <div
    :class="[
      'select',
      { 'select--menu-active': isMenuActive }
    ]"
  >
    <div
      ref="slot"
    >
      <TextField
        ref="input"
        v-model="internalInput"
        :id="computedId"
        :type="type"
        :name="name"
        :required="required"
        :readonly="readonly || !searchable"
        :disabled="disabled"
        :minlength="minlength"
        :maxlength="maxlength"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :debounce="debounce"
        :content-class="contentClass"
        :input-class="inputClass"
        :label-class="labelClass"
        :state-icon="searchable && search && internalInput ? null : stateIcon"
        :state-icon-on-validate="stateIconOnValidate"
        :state-color="stateColor"
        :slot-class="slotClass"
        :prepend-slot-class="prependSlotClass"
        :append-slot-class="appendSlotClass"
        :class="['select-input']"
        :not-focus-on-select="notFocusOnSelect"
        :rules="rules"
        :patterns="patterns"
        :validate-on-blur="validateOnBlur"
        :lazy-validation="lazyValidation"
        :hide-warn="hideWarn"
        :label="label"
        :label-no-wrap="labelNoWrap"
        :label-hint="labelHint"
        :single-line="singleLine"
        :solo="solo"
        :solo-flat="soloFlat"
        :dense="dense"
        :loading="loading"
        :size="size"
        :style="compStyle"
        autocomplete="off"
        force-update
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeyDown"
      >
        <template v-if="$slots.prepend" v-slot:prepend>
          <slot name="prepend" />
        </template>
        <template v-if="$slots.append" v-slot:append>
          <slot name="append" />
        </template>
        <template v-if="hasArrowIcon" v-slot:append>
          <button
            v-if="hasArrowIcon"
            :disabled="disabled"
            tabindex="-1"
            :class="[
              disabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-600',
              'flex items-center text-2xl focus:text-blue-600 cursor-pointer focus:outline-none select-none'
            ]"
            @click="toggleMenu"
          >
            <i :class="isMenuActive ? 'zi-chevron-up' : 'zi-chevron-down'" />
          </button>
        </template>
      </TextField>
    </div>
    <v-menu
      ref="menu"
      v-model="isMenuActive"
      :activator="activator || $refs.slot"
      :attach="menuAttach"
      :close-on-click="false"
      :close-on-content-click="false"
      :open-on-click="false"
      :disable-keys="true"
      :disabled="disabled"
      :max-height="maxHeight"
      :min-width="minWidth"
      :max-width="maxWidth"
      :content-class="menuContentClass"
      allow-overflow
      offset-y
    >
      <ul
        :class="['select-picker', { 'select-picker--dense': solo || dense }, { 'pt-2 pb-3': padded }]"
        role="menu"
      >
        <slot name="menu-prepend-item" />
        <li
          v-if="$slots['prepend-item']"
          key="select-prepend-item"
          :class="[
            'select-picker__item v-list-item',
          ]"
          tabindex="0"
          role="menuitem"
          @click="prependItemClick"
        >
          <slot name="prepend-item" />
        </li>
        <li
          v-if="filteredItems.length === 0 && searchable && search"
          class="select-picker__item select-picker__item--disabled"
        >
          <span class="truncate">
            {{ $t('select.noResult') }}
          </span>
        </li>
        <li
          v-else-if="filteredItems.length === 0 && !hideNoData"
          class="select-picker__item select-picker__item--disabled"
        >
          <span class="truncate">
            {{ $t('select.noData') }}
          </span>
        </li>
        <template
          v-else
          v-for="(item, i) in filteredItems"
        >
          <div
            v-if="item.divider"
            :key="`divider-${i}`"
            class="border-b border-blue-500"
          />
          <li
            v-else
            :key="item[itemValue]"
            :value="item[itemValue]"
            :class="[
              'select-picker__item v-list-item',
              { 'select-picker__item--selected': item[itemValue] === internalValueObject[itemValue] }
            ]"
            tabindex="0"
            role="menuitem"
            @click="select(item)"
          >
            <slot name="item" :item="item">
              <span>{{ item[itemText] }}</span>
            </slot>
          </li>
        </template>
        <li
          v-if="$slots['append-item']"
          key="select-append-item"
          class="select-picker__item v-list-item"
          tabindex="0"
          role="menuitem"
          @click="appendItemClick"
        >
          <slot name="append-item" />
        </li>
      </ul>
    </v-menu>
  </div>
</template>

<script>
import { isObject, defaultFilter } from '../../util/helpers'

export default {
  name: 'Select',
  props: {
    value: {
      type: [String, Number, Object],
      default: () => ({}),
    },
    returnObject: Boolean,
    search: String,
    searchable: Boolean,
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
      default: undefined,
    },
    maxWidth: {
      type: [Number, String],
      default: undefined,
    },
    maxHeight: {
      type: [Number, String],
      default: 304,
    },
    nudgeBottom: {
      type: [Number, String],
      default: 0,
    },
    // validation props
    rules: Array,
    patterns: Array,
    validateOnBlur: Boolean,
    lazyValidation: Boolean,
    hideWarn: Boolean,
    label: String,
    labelNoWrap: Boolean,
    labelHint: String,
    type: {
      type: String,
      default: 'text',
    },
    name: String,
    required: Boolean,
    disabled: Boolean,
    minlength: String,
    maxlength: String,
    autofocus: Boolean,
    placeholder: String,
    clearable: Boolean,
    singleLine: Boolean,
    solo: Boolean,
    soloFlat: Boolean,
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
    labelClass: {
      type: [String, Object],
      default: '',
    },
    stateIcon: Boolean,
    stateIconOnValidate: Boolean,
    stateColor: String,
    slotClass: {
      type: String,
      default: 'w-10',
    },
    prependSlotClass: String,
    appendSlotClass: String,
    notFocusOnSelect: Boolean,
    flat: Boolean,
    activator: undefined,
    menuAttach: undefined,
    noFilter: Boolean,
    hasArrowIcon: {
      type: Boolean,
      default: true,
    },
    dense: Boolean,
    loading: Boolean,
    size: [Number, String],
    readonly: Boolean,
    hideNoData: Boolean,
    padded: {
      type: Boolean,
      default: true,
    },
    activeStyle: Object,
  },
  data () {
    return {
      hasFocus: false,
      lazyInput: '',
      lazyValue: this.value,
      isMenuActive: false,
      content: null,
    }
  },
  computed: {
    compStyle () {
      let result = {}
      if (this.activeStyle) {
        result = this.isActive ? this.activeStyle : {}
      }
      return result
    },
    computedId () {
      return this.id || `input-${this._uid}`
    },
    filteredItems () {
      if (!this.noFilter && this.searchable && this.search) {
        return this.items.filter(item => Object.values(item).some(el => defaultFilter(el, this.search)))
      }
      return this.items
    },
    menuContentClass () {
      let result = 'select-menu'
      if (this.flat) {
        result += ' select-menu--flat'
      }
      return result
    },
    isActive () {
      return this.hasFocus || this.isMenuActive
    },
    internalValue: {
      get () {
        return this.internalValueObject[this.itemValue]
      },
      set () {
        //
      },
    },
    internalValueObject: {
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
        return this.isActive && this.searchable ? this.lazyInput : v
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
        if (this.searchable && !this.isMenuActive) {
          this.internalInput = this.getSearchableInputText()
        }
      },
      immediate: true,
    },
    hasFocus (val) {
      if (val) {
        this.openMenu()
      }
    },
    isActive (val) {
      if (val) {
        if (this.searchable) {
          this.internalInput = this.getSearchableInputText()
          if (this.noFilter) {
            this.$emit('update:search', this.internalInput)
          }
        }
      } else {
        setTimeout(() => {
          this.$emit('update:search', '')
        }, 250)
      }
    },
    isMenuActive (val) {
      this.$emit('menu', val)
    },
  },
  mounted () {
    if (this.autofocus) {
      this.$refs.input.focus()
    }
    this.content = this.$refs.menu && this.$refs.menu.$refs.content
  },
  methods: {
    onFocus () {
      this.hasFocus = true
    },

    onBlur () {
      this.hasFocus = false
    },

    onKeyDown (e) {
      const menu = this.$refs.menu

      // If enter, space, open menu
      if (
        e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'
      ) {
        if (!this.isMenuActive) {
          this.openMenu()
          e.preventDefault()
        }
      }

      this.$emit('keydown', e)

      if (!menu) return

      // If menu is active, allow default
      // listIndex change from menu
      if (this.isMenuActive && e.key !== 'Tab') {
        this.$nextTick(() => {
          menu.changeListIndex(e)
          this.$emit('update:list-index', menu.listIndex)
        })
      }

      // If menu is not active, up and down can do
      // one of 2 things. If multiple, opens the
      // menu, if not, will cycle through all
      // available options
      if (
        !this.isMenuActive &&
        (e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'ArrowDown' || e.key === 'Down')
      ) {
        return this.onUpDown(e)
      }

      // If escape deactivate the menu
      if (e.key === 'Esc' || e.key === 'Escape') return this.onEscDown(e)

      // If tab - select item or close menu
      if (e.key === 'Tab') return this.onTabDown(e)
    },
    onEscDown (e) {
      e.preventDefault()
      if (this.searchable) {
        this.internalInput = this.getSearchableInputText()
      }
      setTimeout(() => {
        this.$emit('update:search', '')
      }, 250)
      if (this.isMenuActive) {
        e.stopPropagation()
        this.isMenuActive = false
      }
    },
    onTabDown (e) {
      const menu = this.$refs.menu

      if (!menu) return

      const activeTile = menu.activeTile

      // An item that is selected by
      // menu-index should toggled
      if (
        activeTile &&
        this.isMenuActive
      ) {
        e.preventDefault()
        e.stopPropagation()

        activeTile.click()
      } else {
        // If we make it here,
        // the user has no selected indexes
        // and is probably tabbing out
        this.onBlur(e)
        this.isMenuActive = false
      }
    },
    onSpaceDown (e) {
      e.preventDefault()
    },
    onUpDown (e) {
      const menu = this.$refs.menu

      if (!menu) return

      e.preventDefault()

      // Cycle through available values to achieve
      // select native behavior
      menu.isBooted = true

      window.requestAnimationFrame(() => {
        menu.getTiles()
        e.key === 'ArrowUp' || e.key === 'Up' ? menu.prevTile() : menu.nextTile()
        menu.activeTile && menu.activeTile.click()
      })
    },
    getSearchableInputText () {
      let v = ''
      if (this.searchable) {
        if (isObject(this.value)) {
          v = this.value[this.itemText]
        } else {
          const item = this.items.find(el => el[this.itemValue] === this.value)
          v = item ? item[this.itemText] : ''
        }
      }
      return v
    },
    toggleMenu () {
      if (this.disabled) return
      if (this.isMenuActive) {
        setTimeout(() => {
          this.closeMenu()
        }, 75)
        this.blur()
      } else {
        this.openMenu()
      }
    },
    openMenu () {
      this.isMenuActive = true
      document.addEventListener('click', this.closeConditional, true)
    },
    closeMenu () {
      this.isMenuActive = false
      document.removeEventListener('click', this.closeConditional, true)
    },
    appendItemClick (e) {
      this.$emit('click:append-item', e)
      this.closeMenu()
    },
    prependItemClick (e) {
      this.$emit('click:prepend-item', e)
      this.closeMenu()
    },
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    },
    select (value) {
      this.internalValueObject = value
      const val = this.returnObject ? value : value[this.itemValue]
      this.$emit('input', val)
      this.closeMenu()
    },
    onInput (val) {
      if (this.searchable) {
        this.$emit('update:search', val || '')
      }
    },
    closeConditional (e) {
      // Close on label click
      if (this.$refs.input && this.$refs.input.$refs.label && this.$refs.input.$refs.label.contains(e.target)) {
        this.closeMenu()
        return
      }
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
