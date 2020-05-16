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
        :readonly="!searchable"
        :disabled="disabled"
        :minlength="minlength"
        :maxlength="maxlength"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :debounce="debounce"
        :content-class="contentClass"
        :input-class="inputClass"
        :adlib="adlib"
        :state-icon="stateIcon"
        :slot-class="slotClass"
        :class="['select-input']"
        :label="label"
        :label-no-wrap="labelNoWrap"
        :label-hint="labelHint"
        :single-line="singleLine"
        :solo="solo"
        :solo-flat="soloFlat"
        :dense="dense"
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
            :class="{ 'cursor-not-allowed': disabled }"
            tabindex="-1"
            class="flex items-center text-2xl text-blue-500 hover:text-blue-600 focus:text-blue-600 cursor-pointer focus:outline-none select-none"
          >
            <i :class="isMenuActive ? 'zi-chevron-up' : 'zi-chevron-down'" />
          </button>
        </template>
      </TextField>
    </div>
    <v-menu
      ref="menu"
      v-model="isMenuActive"
      :activator="$refs.slot"
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
        class="select-picker"
        role="menu"
      >
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
          v-if="filteredItems.length === 0"
          class="select-picker__item select-picker__item--disabled"
        >
          <span v-if="searchable && search" class="truncate">
            {{ $t('select.noResult') }}
          </span>
          <span v-else class="truncate">
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
            <span>{{ item[itemText] }}</span>
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
import validatable from '@/mixins/validatable'
import { isObject, defaultFilter } from '../../util/helpers'

export default {
  name: 'Select',
  inject: {
    form: {
      default: null,
    },
  },
  mixins: [validatable],
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
    rules: Array,
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
    hideDetails: Boolean,
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
    // preferably validation icon
    adlib: Boolean,
    stateIcon: Boolean,
    slotClass: {
      type: String,
      default: 'w-10',
    },
    flat: Boolean,
    menuAttach: undefined,
    noFilter: Boolean,
    hasArrowIcon: {
      type: Boolean,
      default: true,
    },
    dense: Boolean,
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
        this.closeMenu()
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
      this.checkField({})
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
