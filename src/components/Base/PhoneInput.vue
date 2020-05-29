<template>
  <div>
    <TextField
      ref="input"
      v-model="internalValue"
      :loading="loading"
      :label="label"
      :label-no-wrap="labelNoWrap"
      :label-hint="labelHint"
      :placeholder="currentPlaceholder"
      :class="['combo-input', { 'combo-input--menu-active': isPhoneMenuActive }]"
      :state-icon="stateIcon"
      :state-color="stateColor"
      :required="required"
      :mask="currentMask"
      type="tel"
      prepend-slot-class="w-auto"
      @blur="onBlur"
      @input="onInput"
      @keydown="onKeyDown"
    >
      <template v-slot:prepend>
        <Select
          :value="countryCode"
          :activator="$refs.input"
          :search.sync="phoneSearch"
          :items="phonesItems"
          :patterns="codeInputPatterns"
          :size="compSize"
          hide-warn
          type="tel"
          searchable
          item-value="value"
          item-text="code"
          prepend-slot-class="w-auto pl-2"
          append-slot-class="w-auto pr-1"
          not-focus-on-select
          @menu="v => isPhoneMenuActive = v"
          @input="onCountryCodeSelect"
        >
          <template v-slot:prepend>
            <img
              :src="`/static/flags/${countryCode}.svg`"
              class="w-6 rounded-sm mr-2"
            >
          </template>
          <template v-slot:item="{ item }">
            <img
              :src="`/static/flags/${item.value}.svg`"
              class="w-6 rounded-sm mr-2"
            >
            <span class="text-white pr-1">{{ item.code }}</span>
            <span class="text-gray-200">{{ item.placeholder }}</span>
          </template>
        </Select>
      </template>
    </TextField>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

import phonesPlaceholder from '../../config/countries-phones-placeholder.json'
import phonesMask from '../../config/countries-phones-mask.json'
import phonesCode from '../../config/countries-phones-code.json'

export default {
  name: 'PhoneInput',
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    locale: String,
    loading: Boolean,
    label: String,
    labelNoWrap: Boolean,
    labelHint: String,
    rules: Array,
    lazyValidation: Boolean,
    stateIcon: Boolean,
    stateColor: String,
    required: Boolean,
    ruleMessage: String,
    debounce: {
      type: Number,
      default: 500,
    },
  },
  data () {
    return {
      blurWithoutUpdate: false,
      isValid: false,
      lazyValue: undefined,
      countryCode: undefined,
      phoneSearch: '',
      isPhoneMenuActive: false,
    }
  },
  computed: {
    compSize () {
      const length = (this.currentCode || '').length
      return length + 1
    },
    codeInputPatterns () {
      return [
        v => {
          const re = new RegExp(`^[0-9\\s\\-()+]{0,10}$`)
          return re.test(v) || ''
        },
      ]
    },
    defaultCountryCode () {
      const locale = this.locale || this.$i18n.locale
      return this.getLocaleCountryCode(locale)
    },
    internalValue: {
      get () {
        return this.lazyValue || undefined
      },
      set (val) {
        const value = val || ''
        this.lazyValue = value
        this.debounceInput()
      },
    },
    unmasked () {
      const unmasked = this.maskValue(this.internalValue, false)
      return `${this.currentCodeUnformatted}${unmasked}`
    },
    currentCodeUnformatted () {
      return `+${(this.currentCode || '').replace(/\D/g, '')}`
    },
    phonesUnformatted () {
      let result = {}
      for (let [k, v] of Object.entries(phonesCode)) {
        result[k] = `+${v.replace(/\D/g, '')}`
      }
      return result
    },
    currentCode () {
      return phonesCode[this.countryCode]
    },
    currentMask () {
      return phonesMask[this.countryCode]
    },
    currentPlaceholder () {
      return phonesPlaceholder[this.countryCode]
    },
    phonesItems () {
      return Object.entries(phonesCode).map(([k, v]) => {
        const code = phonesCode[k]
        const codeUnformatted = this.phonesUnformatted[k]
        const placeholder = phonesPlaceholder[k]
        const mask = phonesMask[k]
        return {
          code,
          codeUnformatted,
          placeholder,
          mask,
          value: k,
        }
      })
    },
  },
  watch: {
    value (val) {
      if (!val) return
      this.setValue(val)
    },
    internalValue (val) {
      this.validate(val || '')
    },
    locale (val) {
      if (!this.value) {
        this.countryCode = this.defaultCountryCode
      }
    },
  },
  created () {
    this.countryCode = this.getCountryCode()
    this.debounceInput = debounce(this.emitChange, this.debounce)
  },
  methods: {
    onInput () {
      if (this.debounce) {
        this.debounceInput()
      } else {
        this.emitChange()
      }
    },
    onKeyDown (e) {
      this.$emit('keydown', e)
      if (this.debounce) {
        // on esc set value from store
        if (e.key === 'Esc' || e.key === 'Escape') {
          this.setValue(this.value)
          this.blurWithoutUpdate = true
          this.$refs.input.blur()
          e.preventDefault()
        } else if (e.key === 'Enter') {
          // on enter blur normally
          this.$refs.input.blur()
          e.preventDefault()
        }
      }
    },
    onBlur (e) {
      // cancel debounced
      if (this.debounce) {
        this.debounceInput.cancel()
      }
      // on esc blur without update
      if (this.blurWithoutUpdate) {
        this.blurWithoutUpdate = false
        return
      }
      this.validate(this.internalValue || '')
      this.emitChange()
      this.$emit('blur', e)
    },
    emitChange () {
      // prevent emit if no changes
      const oldCode = this.value && this.value.countryCode
      const oldVal = this.value && this.value.phone
      if (oldVal === this.unmasked && oldCode === this.countryCode) return
      const phone = this.unmasked
      this.$emit('input', { countryCode: this.countryCode, phone })
    },
    getLocaleCountryCode (value) {
      switch (value) {
        case 'en': return 'GB'
        case 'fr': return 'FR'
        case 'ru': return 'RU'
        case 'zh-Hans':
        case 'zh-Hant': return 'CN'
        case 'uk': return 'UA'
        default: return 'GB'
      }
    },
    setValue (val) {
      let value = val && val.phone
      if (value === this.unmasked) return
      value = value || ''
      const countryCode = val && val.countryCode
      this.countryCode = countryCode || this.getCountryCode()
      this.internalValue = value.slice(this.currentCodeUnformatted.length)
    },
    getCountryCode () {
      let result = this.defaultCountryCode
      const phone = this.value && this.value.phone
      const value = phone || this.unmasked || ''
      for (let [k, v] of Object.entries(this.phonesUnformatted)) {
        if (value.startsWith(v)) {
          result = k
          break
        }
      }
      return result
    },
    onCountryCodeSelect (val) {
      this.countryCode = val
      this.$refs.input.focus()
    },
    validate (val) {
      const message = this.ruleMessage || this.$t('rule.phone')
      const length = this.currentMask.length || 1
      const result = val.length === length || message
      if (result !== true) {
        this.isValid = false
        this.$refs.input.setError(result)
      } else {
        this.isValid = true
        this.$refs.input.clearError()
      }
    },
    maskValue (value, masked = true) {
      value = value || ''
      const mask = this.currentMask || ''
      let iMask = 0
      let iValue = 0
      let result = ''
      while (iMask < mask.length && iValue < value.length) {
        let cMask = mask[iMask]
        let cValue = value[iValue]
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
      return result
    },
  },
}
</script>
