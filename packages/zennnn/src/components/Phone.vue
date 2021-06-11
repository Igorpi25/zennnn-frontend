<template>
  <Select
    ref="codeInputRef"
    :model-value="codeInput"
    :loading="loading"
    :items="filteredItems"
    :dependencies="dependencies"
    :solo="solo"
    :dense="dense"
    :label="label"
    :label-hint="labelHint"
    :size="computedSize"
    :disabled="disabled"
    max-height="304"
    type="tel"
    inputmode="tel"
    item-text="code"
    class="phone"
    content-on-intersect
    @update:model-value="onCodeSelect"
    @keydown="onCodeKeydown"
  >
    <template v-slot:prepend>
      <img
        v-if="codeInput"
        :src="require(`@/assets/img/flags/square/${codeInput}.svg`).default"
        class="w-6 flex-shrink-0"
        aria-hidden="true"
      />
    </template>
    <template v-slot:prepend-item>
      <TextField
        ref="searchInputRef"
        v-model="search"
        :placeholder="$t('placeholder.startTyping')"
        clearable
        class="sticky top-0"
        control-class="input__control--no-shadow rounded-none"
        @keydown="onSearchKeydown"
      >
        <template v-slot:prepend>
          <Icon class="text-gray-100 dark:text-gray-200 ml-1">
            {{ ziSearch }}
          </Icon>
        </template>
      </TextField>
    </template>
    <template v-slot:append-outer>
      <TextField
        ref="phoneInputRef"
        :model-value="phoneInput"
        :solo="solo"
        :dense="dense"
        :readonly="readonly"
        :disabled="disabled"
        :placeholder="currentPlaceholder"
        :mask="currentMask"
        :rules="computedRules"
        :lazy="lazy"
        :required="required"
        :state-icon="stateIcon"
        :state-success-icon="stateSuccessIcon"
        :state-error-icon="stateErrorIcon"
        :state-success-color="stateSuccessColor"
        :state-error-color="stateErrorColor"
        :debounce="debounce"
        :hide-details="hideDetails"
        :messages-on-focused="messagesOnFocused"
        type="tel"
        inputmode="tel"
        class="w-full flex-grow"
        control-class="rounded-l-none pl-2"
        @focus="onFocus"
        @blur="onBlur"
        @update:modelValue="onPhoneInput"
      />
    </template>
    <template v-slot:item="{ item, selected }">
      <div class="w-8 flex justify-center flex-shrink-0">
        <Icon v-if="selected">{{ ziChecked }}</Icon>
      </div>
      <img
        :src="require(`@/assets/img/flags/square/${item.value}.svg`).default"
        :alt="item.value"
        class="w-6 flex-shrink-0 mr-2"
        aria-hidden="true"
      />
      <span class="text-gray-900 dark:text-light-gray-400 truncate pr-2">
        {{ item.country }}
      </span>
      <span class="text-gray-200 flex-shrink-0">
        {{ item.code }}
      </span>
    </template>
  </Select>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'

import { ziSearch, ziChecked } from '@zennnn/icons'

import { Select, TextField, Icon } from '@zennnn/core'

import phonesPlaceholder from '../config/countries-phones-placeholder.json'
import phonesMask from '../config/countries-phones-mask.json'
import phonesCode from '../config/countries-phones-code.json'
import defaultFilter from '../utils/defaultFilter'

export default {
  name: 'Phone',
  components: { Select, TextField, Icon },
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    locale: String,
    loading: Boolean,
    solo: Boolean,
    dense: Boolean,
    label: String,
    labelHint: String,
    debounce: {
      type: Number,
      default: 500,
    },
    readonly: Boolean,
    disabled: Boolean,
    required: Boolean,
    // state
    stateIcon: Boolean,
    stateSuccessIcon: String,
    stateErrorIcon: String,
    // tailwindcss text class
    stateSuccessColor: String,
    // warn, none or tailwindcss text class
    stateErrorColor: String,
    errorMessage: String,
    lazy: Boolean,
    messagesOnFocused: {
      type: Boolean,
      default: true,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  setup() {
    const search = ref('')
    const codeInput = ref()
    const phoneInput = ref()
    const isPhoneInputFocused = ref(false)
    const codeInputPattern = '^[0-9\\s\\-()+]{0,10}$'
    const codeInputRef = ref()
    const phoneInputRef = ref()
    const searchInputRef = ref()
    const hasPhoneInputError = computed(() => {
      return (
        phoneInputRef.value &&
        phoneInputRef.value.hasError &&
        phoneInputRef.value.shouldValidate
      )
    })

    const dependencies = computed(() => {
      return [phoneInputRef.value && phoneInputRef.value.rootElement]
    })

    const isMenuActive = computed(
      () => codeInputRef.value && codeInputRef.value.isMenuActive
    )

    watch(isMenuActive, (val) => {
      if (val) {
        setTimeout(() => {
          searchInputRef.value.focus()
        }, 0)
      } else {
        nextTick(() => {
          search.value = ''
        })
      }
    })

    function onCodeKeydown(e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault()
        phoneInputRef.value && phoneInputRef.value.focus()
      }
    }

    function onSearchKeydown(e) {
      const selectApi = codeInputRef.value
      if (e.key === 'Esc' || e.key === 'Escape') {
        e.preventDefault()
        selectApi.focus()
        nextTick(() => {
          selectApi.closeMenu()
        })
      } else if (e.key === 'Enter') {
        selectApi.onEnter(e)
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        selectApi.onArrowUp(e)
      } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        selectApi.onArrowDown(e)
      } else if (e.key === 'Tab') {
        selectApi.onTab(e)
        e.preventDefault()
        e.stopPropagation()
        if (e.shiftKey && codeInputRef.value) {
          codeInputRef.value.focus()
        } else if (phoneInputRef.value) {
          phoneInputRef.value.focus()
        }
      }
    }

    return {
      search,
      ziSearch,
      ziChecked,
      codeInput,
      phoneInput,
      isPhoneInputFocused,
      codeInputPattern,
      codeInputRef,
      phoneInputRef,
      searchInputRef,
      hasPhoneInputError,
      dependencies,
      onCodeKeydown,
      onSearchKeydown,
    }
  },
  computed: {
    filteredItems() {
      if (!this.search) return this.items
      return this.items.filter((item) => {
        return [
          item.country,
          item.countryName,
          item.codeUnformatted,
          item.code,
          item.value,
        ].some((text) => defaultFilter(text, this.search))
      })
    },
    items() {
      return Object.entries(phonesCode)
        .map(([k, v]) => {
          const country = this.$t(`countries.${k}`, 'en')
            ? this.$t(`countries.${k}`, 'en')
            : k
          return {
            code: v,
            value: k,
            country: this.$t(`countries.${k}`)
              ? this.$t(`countries.${k}`)
              : country,
            countryName: country,
            codeUnformatted: this.phonesUnformatted[k],
            placeholder: phonesPlaceholder[k],
            mask: phonesMask[k],
          }
        })
        .sort((a, b) => {
          const name1 = a.country
          const name2 = b.country
          if (name1 > name2) {
            return 1
          }
          if (name1 < name2) {
            return -1
          }
          return 0
        })
    },
    phonesUnformatted() {
      const result = {}
      for (const [k, v] of Object.entries(phonesCode)) {
        result[k] = `+${v.replace(/\D/g, '')}`
      }
      return result
    },
    computedRules() {
      return [
        (v) => {
          const val = v || ''
          const message = this.errorMessage || this.$t('rule.phone')
          const mLength = this.currentMask.length || 1
          const { iMask, iValue } = this.maskValue(val)
          return (val.length === mLength && iMask === iValue) || message
        },
      ]
    },
    // can calculate width with src/utils/getTextWidth
    computedSize() {
      const code = this.currentCode || ' '
      return code.length + 1
    },
    defaultCountryCode() {
      switch (this.locale || this.$i18n.locale) {
        case 'en':
          return 'GB'
        case 'fr':
          return 'FR'
        case 'ru':
          return 'RU'
        case 'zh-Hans':
        case 'zh-Hant':
          return 'CN'
        case 'uk':
          return 'UA'
        default:
          return 'GB'
      }
    },
    unmasked() {
      const { result } = this.maskValue(this.phoneInput, false)
      return `${this.currentCodeUnformatted}${result}`
    },
    currentCodeUnformatted() {
      return `+${(this.currentCode || '').replace(/\D/g, '')}`
    },
    currentCode() {
      return phonesCode[this.codeInput]
    },
    currentMask() {
      return phonesMask[this.codeInput]
    },
    currentPlaceholder() {
      return phonesPlaceholder[this.codeInput]
    },
  },
  watch: {
    modelValue(val) {
      if (!val) return
      this.setValue(val)
    },
    locale() {
      if (!this.modelValue) {
        this.codeInput = this.defaultCountryCode
      }
    },
  },
  created() {
    this.codeInput = this.getCountryCode()
  },
  methods: {
    onFocus() {
      this.codeInputRef.closeMenu()
      this.isPhoneInputFocused = true
    },
    onBlur() {
      this.isPhoneInputFocused = false
    },
    onPhoneInput(val) {
      this.phoneInput = val
      this.emitChange()
    },
    onCodeSelect(val) {
      if (this.readonly || this.disabled) return
      this.codeInput = val
      this.emitChange()
      // TODO: can detect is keydown or click
      // nextTick(() => {
      //   this.$refs.phoneInputRef && this.$refs.phoneInputRef.focus()
      // })
    },
    getCountryCode() {
      let result = this.defaultCountryCode
      const phone = this.modelValue && this.modelValue.phone
      const value = phone || this.unmasked || ''
      for (const [k, v] of Object.entries(this.phonesUnformatted)) {
        if (value.startsWith(v)) {
          result = k
          break
        }
      }
      return result
    },
    setValue(val) {
      let value = val && val.phone
      if (value === this.unmasked) return
      value = value || ''
      const countryCode = val && val.countryCode
      this.codeInput = countryCode || this.getCountryCode()
      this.phoneInput = value.slice(this.currentCodeUnformatted.length)
    },
    emitChange() {
      // prevent emit if no changes
      const oldCode = this.modelValue && this.modelValue.countryCode
      const oldVal = this.modelValue && this.modelValue.phone
      if (oldVal === this.unmasked && oldCode === this.codeInput) return
      const phone = this.unmasked
      this.$emit('update:modelValue', { countryCode: this.codeInput, phone })
    },
    maskValue(value, masked = true) {
      value = value || ''
      const mask = this.currentMask || ''
      let iMask = 0
      let iValue = 0
      let result = ''
      while (iMask < mask.length && iValue < value.length) {
        const cMask = mask[iMask]
        const cValue = value[iValue]
        const masker = cMask === '#' ? /\d/ : undefined
        if (masker) {
          if (masker.test(cValue)) {
            result += cValue
            iMask++
          }
          iValue++
        } else {
          if (masked) result += cMask
          if (cValue === cMask) iValue++
          iMask++
        }
      }
      return { result, iMask, iValue }
    },
  },
}
</script>

<style lang="postcss">
.phone .select__control {
  padding-right: 0;
  padding-left: 8px;
  @apply bg-light-gray-400 dark:bg-gray-400 !important;
  @apply rounded !important;
}
.phone .select__control input {
  text-overflow: unset;
  white-space: nowrap;
}
.phone.select--is-menu-active::before {
  content: '';
  @apply absolute inset-x-0 bottom-0 pt-1;
  @apply bg-white dark:bg-gray-900;
}
</style>
