<template>
  <Select
    ref="codeInputRef"
    :model-value="codeInput"
    :error="hasPhoneInputError"
    :error-messages="errorMessages"
    :loading="loading"
    :items="items"
    :distance="16"
    :control-class="isPhoneInputFocused ? 'rounded-b ring-1 ring-blue-500' : 'rounded-b'"
    :open-on-focus="false"
    :dependencies="dependencies"
    :solo="solo"
    :dense="dense"
    :label="label"
    :label-hint="labelHint"
    :show-label-wrap="showLabelWrap"
    :pattern="codeInputPattern"
    :size="computedSize"
    :hide-details="!hasPhoneInputError"
    :messages-on-focused="showMessagesOnFocused"
    :readonly="readonly"
    :disabled="disabled"
    type="tel"
    inputmode="tel"
    item-text="code"
    box-class="rounded-t-md"
    content-class="rounded-t-md pt-0"
    control-input-class="flex-shrink-0"
    input-class="pr-1"
    searchable
    has-items-filter
    content-on-intersect
    :items-filter-tab-down="itemsFilterTabDown"
    @update:model-value="onCodeSelect"
  >
    <template v-slot:prepend>
      <img
        v-if="codeInput"
        :src="require(`@/assets/img/flags/square/${codeInput}.svg`)"
        class="w-6 flex-shrink-0 mr-2"
        aria-hidden="true"
      >
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
        type="tel"
        inputmode="tel"
        class="w-full flex-grow"
        control-class="text-field__control--no-shadow pl-1 pr-0"
        @focus="onFocus"
        @blur="onBlur"
        @update:modelValue="onPhoneInput"
      />
    </template>
    <template v-slot:item="{ item }">
      <div class="flex items-center px-2">
        <img
          :src="require(`@/assets/img/flags/square/${item.value}.svg`)"
          :alt="item.value"
          class="w-6 flex-shrink-0 mr-2"
          aria-hidden="true"
        >
        <span class="text-gray-900 dark:text-light-gray-400 truncate pr-1">
          {{ item.country }}
        </span>
        <span class="text-gray-200 flex-shrink-0">
          {{ item.code }}
        </span>
      </div>
    </template>
  </Select>
</template>

<script>
import { ref, computed } from 'vue'
import Select from './Base/Select'
import TextField from './Base/TextField'

import phonesPlaceholder from '../config/countries-phones-placeholder.json'
import phonesMask from '../config/countries-phones-mask.json'
import phonesCode from '../config/countries-phones-code.json'

export default {
  name: 'Phone',
  components: { Select, TextField },
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
    showLabelWrap: Boolean,
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
    messagesOnFocused: Boolean,
  },

  emits: ['update:modelValue'],

  setup () {
    const codeInput = ref(undefined)
    const phoneInput = ref(undefined)
    const isPhoneInputFocused = ref(false)
    const codeInputPattern = '^[0-9\\s\\-()+]{0,10}$'
    const codeInputRef = ref(null)
    const phoneInputRef = ref(null)
    const hasPhoneInputError = computed(() => {
      return phoneInputRef.value && phoneInputRef.value.hasError && phoneInputRef.value.shouldValidate
    })
    const dependencies = computed(() => {
      return [phoneInputRef.value && phoneInputRef.value.rootElement]
    })
    const itemsFilterTabDown = () => {
      phoneInputRef.value && phoneInputRef.value.focus()
    }
    return {
      codeInput,
      phoneInput,
      isPhoneInputFocused,
      codeInputPattern,
      codeInputRef,
      phoneInputRef,
      hasPhoneInputError,
      dependencies,
      itemsFilterTabDown,
    }
  },
  computed: {
    items () {
      return Object.entries(phonesCode)
        .map(([k, v]) => {
          const country = this.$t(`countries.${k}`, 'en') ? this.$t(`countries.${k}`, 'en') : k
          return {
            code: v,
            value: k,
            country: this.$t(`countries.${k}`) ? this.$t(`countries.${k}`) : country,
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
    showMessagesOnFocused () {
      // TODO: messagesOnFocused prop do not work after select
      return this.messagesOnFocused && this.isPhoneInputFocused ? false : this.messagesOnFocused
    },
    phonesUnformatted () {
      const result = {}
      for (const [k, v] of Object.entries(phonesCode)) {
        result[k] = `+${v.replace(/\D/g, '')}`
      }
      return result
    },
    errorMessages () {
      return [this.errorMessage || this.$t('rule.phone')]
    },
    computedRules () {
      return [
        v => {
          const val = v || ''
          const message = 'Not valid.'
          const mLength = this.currentMask.length || 1
          const { iMask, iValue } = this.maskValue(val)
          return (val.length === mLength && iMask === iValue) || message
        },
      ]
    },
    computedSize () {
      const code = this.currentCode || ' '
      let cLength = code.length
      if (/\(/.test(code)) cLength--
      return cLength + 1
    },
    defaultCountryCode () {
      switch (this.locale || this.$i18n.locale) {
        case 'en': return 'GB'
        case 'fr': return 'FR'
        case 'ru': return 'RU'
        case 'zh-Hans':
        case 'zh-Hant': return 'CN'
        case 'uk': return 'UA'
        default: return 'GB'
      }
    },
    unmasked () {
      const { result } = this.maskValue(this.phoneInput, false)
      return `${this.currentCodeUnformatted}${result}`
    },
    currentCodeUnformatted () {
      return `+${(this.currentCode || '').replace(/\D/g, '')}`
    },
    currentCode () {
      return phonesCode[this.codeInput]
    },
    currentMask () {
      return phonesMask[this.codeInput]
    },
    currentPlaceholder () {
      return phonesPlaceholder[this.codeInput]
    },
  },
  watch: {
    modelValue (val) {
      if (!val) return
      this.setValue(val)
    },
    locale (val) {
      if (!this.modelValue) {
        this.codeInput = this.defaultCountryCode
      }
    },
  },
  created () {
    this.codeInput = this.getCountryCode()
  },
  methods: {
    onFocus () {
      this.codeInputRef.closeMenu()
      this.isPhoneInputFocused = true
    },
    onBlur () {
      this.isPhoneInputFocused = false
    },
    onPhoneInput (val) {
      this.phoneInput = val
      this.emitChange()
    },
    onCodeSelect (val) {
      if (this.readonly || this.disabled) return
      this.codeInput = val
      this.phoneInputRef.focus()
      this.emitChange()
    },
    getCountryCode () {
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
    setValue (val) {
      let value = val && val.phone
      if (value === this.unmasked) return
      value = value || ''
      const countryCode = val && val.countryCode
      this.codeInput = countryCode || this.getCountryCode()
      this.phoneInput = value.slice(this.currentCodeUnformatted.length)
    },
    emitChange () {
      // prevent emit if no changes
      const oldCode = this.modelValue && this.modelValue.countryCode
      const oldVal = this.modelValue && this.modelValue.phone
      if (oldVal === this.unmasked && oldCode === this.codeInput) return
      const phone = this.unmasked
      this.$emit('update:modelValue', { countryCode: this.codeInput, phone })
    },
    maskValue (value, masked = true) {
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
