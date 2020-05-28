<template>
  <div>
    <TextField
      ref="phoneInput"
      v-model="internalValue"
      :loading="loading"
      :label="label"
      :label-no-wrap="labelNoWrap"
      :label-hint="labelHint"
      :placeholder="phonePlaceholder"
      :class="['combo-input', { 'combo-input--menu-active': isPhoneMenuActive }]"
      :state-icon="stateIcon"
      :state-color="stateColor"
      :required="required"
      :patterns="inputPatterns"
      force-update
      hide-warn
      type="tel"
      prepend-slot-class="w-auto"
      @blur="onBlur"
    >
      <template v-slot:prepend>
        <Select
          :value="countryCode"
          :activator="$refs.phoneInput"
          :search.sync="phoneSearch"
          :items="phonesItems"
          :patterns="inputPatterns"
          :size="compSize"
          hide-warn
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
import Phones from '../../config/countries-phones.json'

export default {
  name: 'PhoneInput',
  props: {
    value: String,
    defaultCountryCode: String,
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
  },
  data () {
    return {
      isValid: false,
      lazyValue: this.value,
      countryCode: this.defaultCountryCode,
      phoneSearch: '',
      isPhoneMenuActive: false,
    }
  },
  computed: {
    compSize () {
      const length = (this.currentPhoneItem.code || '').length
      return length + 1
    },
    inputPatterns () {
      return [
        v => {
          const re = new RegExp(`^[0-9\\s\\-()+]{0,${this.phoneMask.length}}$`)
          return re.test(v) || ''
        },
      ]
    },
    localeCountry () {
      switch (this.$i18n.locale) {
        case 'en': return 'GB'
        case 'fr': return 'FR'
        case 'ru': return 'RU'
        case 'zh-Hans':
        case 'zh-Hant': return 'CN'
        case 'uk': return 'UK'
        default: return 'GB'
      }
    },
    internalValue: {
      get () {
        return this.lazyValue || undefined
      },
      set (val) {
        const value = val || ''
        const masked = this.maskValue(value)
        this.validate(masked)
        this.lazyValue = masked
      },
    },
    unmasked () {
      const unmasked = this.maskValue(this.internalValue, false)
      return `${this.currentPhoneItem.codeCleared}${unmasked}`
    },
    phoneMask () {
      return this.currentPhoneItem.mask || ''
    },
    phonePlaceholder () {
      return this.currentPhoneItem.placeholder || ''
    },
    currentPhoneItem () {
      return this.phonesItems.find(el => el.value === this.countryCode) || {}
    },
    phonesItems () {
      return Object.entries(Phones).map(([k, v]) => {
        let index = v.indexOf('#')
        const prev = v[index - 1]
        if (prev === '(') {
          index -= 2
        } else {
          index -= 1
        }
        const code = v.slice(0, index)
        const mask = v.slice(index + 1)
        let placeholder = ''
        let inc = 0
        mask.split('').forEach(letter => {
          if (letter === '#') {
            inc = (inc >= 9) ? inc = 0 : ++inc
            placeholder += inc
          } else {
            placeholder += letter
          }
        })
        let codeCleared = ''
        code.split('').forEach(letter => {
          if (/\d/.test(letter)) {
            codeCleared += letter
          }
        })
        return {
          full: v,
          code,
          codeCleared: `+${codeCleared}`,
          mask,
          placeholder,
          value: k,
        }
      })
    },
  },
  watch: {
    value (val) {
      if (!val) return
      this.countryCode = this.setCountryCode()
      this.setValue(val)
    },
    unmasked (val) {
      this.isValid && this.$emit('input', val)
    },
  },
  created () {
    this.countryCode = this.setCountryCode()
  },
  methods: {
    onBlur () {
      if (!this.isValid) {
        this.setValue(this.value)
      }
    },
    setValue (val) {
      val = val || ''
      this.internalValue = val.slice(this.currentPhoneItem.codeCleared.length)
    },
    validate (val) {
      const re = new RegExp(`^[0-9\\s\\-()+]{${this.phoneMask.length},${this.phoneMask.length}}$`)
      const result = re.test(val) || this.ruleMessage || this.$t('rule.phone')
      if (result !== true) {
        this.isValid = false
        this.$refs.phoneInput.setError(result)
      } else {
        this.isValid = true
        this.$refs.phoneInput.clearError()
      }
    },
    setCountryCode () {
      let result = this.defaultCountryCode
      const value = this.value || this.unmasked || ''
      for (let item of this.phonesItems) {
        if (value.startsWith(item.codeCleared)) {
          result = item.value
          break
        }
      }
      return result || this.localeCountry
    },
    onCountryCodeSelect (val) {
      this.countryCode = val
      this.internalValue = this.maskValue(this.internalValue)
      this.$refs.phoneInput.focus()
    },
    maskValue (value, masked = true) {
      value = value || ''
      const mask = this.phoneMask || ''
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
