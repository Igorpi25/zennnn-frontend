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
      :lazy-validation="lazyValidation"
      :required="required"
      :mask="currentMask"
      :rules="compRule"
      :readonly="readonly"
      :disabled="disabled"
      type="tel"
      prepend-slot-class="w-auto"
      @blur="onBlur"
      @input="onInput"
      @change="onChange"
      @keydown="onKeyDown"
    >
      <template v-slot:prepend>
        <Select
          :value="countryCode"
          :activator="$refs.input"
          :search.sync="phoneSearch"
          :items="filteredPhonesItems"
          :patterns="codeInputPatterns"
          :size="compSize"
          :readonly="readonly"
          :disabled="disabled"
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
          <template v-slot:menu-prepend-item>
            <li
              class="v-list-item bg-gray-900 sticky top-0 flex items-center outline-none p-2 -mt-2"
              tabindex="0"
              role="menuitem"
            >
              <TextField
                v-model="countrySearch"
                :placeholder="$t('placeholder.startTyping')"
                :content-class="['bg-transparent', countrySearch ? 'shadow-blue-500' : '', '']"
                class="w-full"
                @click.prevent.stop
              >
                <template v-slot:prepend>
                  <i class="zi-magnifier text-2xl text-gray-100"></i>
                </template>
                <template v-slot:append v-if="countrySearch">
                  <i
                    class="zi-close text-2xl text-gray-200 cursor-pointer focus:outline-none focus:text-gray-100 hover:text-gray-100"
                    @click.prevent.stop="countrySearch = null"
                  />
                </template>
              </TextField>
            </li>
          </template>
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
            <span class="text-white pr-1">
              {{ item.country }}
            </span>
            <span class="text-gray-200">{{ item.code }}</span>
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
import { defaultFilter } from '../../util/helpers'

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
    lazy: Boolean,
    stateIcon: Boolean,
    stateColor: String,
    required: Boolean,
    ruleMessage: String,
    debounce: {
      type: Number,
      default: 500,
    },
    readonly: Boolean,
    disabled: Boolean,
  },
  data () {
    return {
      blurWithoutUpdate: false,
      isValid: false,
      lazyValue: undefined,
      countryCode: undefined,
      phoneSearch: '',
      countrySearch: '',
      isPhoneMenuActive: false,
    }
  },
  computed: {
    compRule () {
      return [
        v => {
          const val = v || ''
          const message = this.ruleMessage || this.$t('rule.phone')
          const mLength = this.currentMask.length || 1
          return val.length === mLength || message
        },
      ]
    },
    compSize () {
      const length = (this.currentCode || '').length
      return length + 1
    },
    codeInputPatterns () {
      return [
        v => {
          const re = new RegExp('^[0-9\\s\\-()+]{0,10}$')
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
      const result = {}
      for (const [k, v] of Object.entries(phonesCode)) {
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
      return Object.entries(phonesCode)
        .map(([k, v]) => {
          const code = phonesCode[k]
          const codeUnformatted = this.phonesUnformatted[k]
          const placeholder = phonesPlaceholder[k]
          const mask = phonesMask[k]
          const country = this.$te(`countries.${k}`, 'en') ? this.$t(`countries.${k}`, 'en') : k
          return {
            code,
            country: this.$te(`countries.${k}`) ? this.$t(`countries.${k}`) : country,
            countryName: country,
            codeUnformatted,
            placeholder,
            mask,
            value: k,
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
    filteredPhonesItems () {
      if (this.countrySearch) {
        return this.phonesItems.filter(item => Object.values(item).some(el => defaultFilter(el, this.countrySearch)))
      }
      return this.phonesItems
    },
  },
  watch: {
    value (val) {
      if (!val) return
      this.setValue(val)
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
    onInput (val) {
      if (!this.lazy) {
        if (this.debounce) {
          this.debounceInput()
        } else {
          this.emitChange()
        }
      }
    },
    onChange () {
      if (this.lazy) {
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
      this.$emit('blur', e)
      // cancel debounced
      if (this.debounce) {
        this.debounceInput.cancel()
      }
      // on esc blur without update
      if (this.blurWithoutUpdate) {
        this.blurWithoutUpdate = false
        return
      }
      if (this.readonly || this.disabled) return
      // immediate call changes
      if (!this.lazy) {
        this.emitChange()
      }
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
      for (const [k, v] of Object.entries(this.phonesUnformatted)) {
        if (value.startsWith(v)) {
          result = k
          break
        }
      }
      return result
    },
    onCountryCodeSelect (val) {
      if (this.readonly || this.disabled) return
      this.countryCode = val
      this.$refs.input.focus()
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
      return result
    },
  },
}
</script>
