import {
  defineComponent,
  ref,
  computed,
  watch,
  nextTick,
  onBeforeMount,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { ziSearch, ziChecked } from '@zennnn/icons'
import { Select, TextField, Icon } from '@zennnn/core'
import phonesPlaceholder from '@/assets/countries/phones-placeholder.json'
import phonesMask from '@/assets/countries/phones-mask.json'
import phonesCode from '@/assets/countries/phones-code.json'
import { defaultFilter } from '@/utils/defaultFilter'

import type { PropType } from 'vue'

interface PhoneInput {
  countryCode?: string | null
  phone?: string | null
}

interface PhoneItem {
  code: unknown
  value: string
  country: string
  countryName: string
  codeUnformatted: string
  placeholder: any
  mask: any
}

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<PhoneInput | null>,
      default: () => ({}),
    },
    locale: String as PropType<string | null>,
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

  setup(props, { emit }) {
    const { t, locale } = useI18n()

    const search = ref('')
    const codeInput = ref()
    const phoneInput = ref()
    const codeInputRef = ref()
    const phoneInputRef = ref()
    const searchInputRef = ref()

    const dependencies = computed(() => {
      return [phoneInputRef.value && phoneInputRef.value.rootElement]
    })

    const isMenuActive = computed(
      () => codeInputRef.value && codeInputRef.value.isMenuActive
    )

    const filteredItems = computed(() => {
      if (!search.value) return items.value
      return items.value.filter((item) => {
        return [
          item.country,
          item.countryName,
          item.codeUnformatted,
          item.code,
          item.value,
        ].some((text) => defaultFilter(text, search.value))
      })
    })

    const items = computed(() => {
      return Object.entries(phonesCode)
        .map(([k, v]) => {
          const country = t(`countries.${k}`, 'en')
            ? t(`countries.${k}`, 'en')
            : k
          return {
            code: v,
            value: k,
            country: t(`countries.${k}`) ? t(`countries.${k}`) : country,
            countryName: country,
            codeUnformatted: phonesUnformatted.value[k],
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
    })

    const phonesUnformatted = computed(() => {
      const result = {} as Record<string, string>
      for (const [k, v] of Object.entries(phonesCode)) {
        result[k] = `+${(v as string).replace(/\D/g, '')}`
      }
      return result
    })

    const computedRules = computed(() => [
      (v: string | undefined) => {
        const val = v || ''
        const message = props.errorMessage || t('rule.phone')
        const mLength = currentMask.value.length || 1
        const { iMask, iValue } = maskValue(val)
        return (val.length === mLength && iMask === iValue) || message
      },
    ])

    // can calculate width with src/utils/getTextWidth
    const computedSize = computed(() => {
      {
        const code = currentCode.value || ' '
        return code.length + 1
      }
    })

    const defaultCountryCode = computed(() => {
      {
        switch (props.locale || locale.value) {
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
      }
    })

    const unmasked = computed(() => {
      {
        const { result } = maskValue(phoneInput.value, false)
        return `${currentCodeUnformatted.value}${result}`
      }
    })

    const currentCodeUnformatted = computed(
      () => `+${(currentCode.value || '').replace(/\D/g, '')}`
    )

    const currentCode = computed(() => phonesCode[codeInput.value])

    const currentMask = computed(() => phonesMask[codeInput.value])

    const currentPlaceholder = computed(
      () => phonesPlaceholder[codeInput.value]
    )

    watch(
      () => props.modelValue,
      (val) => {
        setValue(val)
      },
      { immediate: true }
    )

    watch(
      () => props.locale,
      () => {
        if (!props.modelValue) {
          codeInput.value = defaultCountryCode.value
        }
      }
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

    onBeforeMount(() => {
      codeInput.value = getCountryCode()
    })

    function onCodeKeydown(e: KeyboardEvent) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault()
        phoneInputRef.value && phoneInputRef.value.focus()
      }
    }

    function onSearchKeydown(e: KeyboardEvent) {
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

    function onPhoneInput(val?: string) {
      phoneInput.value = val
      emitChange()
    }

    function onCodeSelect(val?: string) {
      if (props.readonly || props.disabled) return
      codeInput.value = val
      emitChange()
      // TODO: can detect is keydown or click
      // nextTick(() => {
      //   this.$refs.phoneInputRef && this.$refs.phoneInputRef.focus()
      // })
    }

    function getCountryCode() {
      let result = defaultCountryCode.value
      const phone = props.modelValue && props.modelValue.phone
      const value = phone || unmasked.value || ''
      for (const [k, v] of Object.entries(phonesUnformatted.value)) {
        if (value.startsWith(v)) {
          result = k
          break
        }
      }
      return result
    }

    function setValue(val: PhoneInput | null) {
      let value = val && val.phone
      if (value === unmasked.value) return
      value = value || ''
      const countryCode = val && val.countryCode
      codeInput.value = countryCode || getCountryCode()
      phoneInput.value = value.slice(currentCodeUnformatted.value.length)
    }

    function emitChange() {
      // prevent emit if no changes
      const oldCode = props.modelValue && props.modelValue.countryCode
      const oldVal = props.modelValue && props.modelValue.phone
      if (oldVal === unmasked.value && oldCode === codeInput.value) return
      const phone = unmasked.value
      emit('update:modelValue', { countryCode: codeInput.value, phone })
    }

    function maskValue(value: string | undefined, masked = true) {
      value = value || ''
      const mask = currentMask.value || ''
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
    }

    return () => (
      <Select
        ref={codeInputRef}
        modelValue={codeInput.value}
        loading={props.loading}
        items={filteredItems.value}
        dependencies={dependencies.value}
        solo={props.solo}
        dense={props.dense}
        label={props.label}
        labelHint={props.labelHint}
        size={computedSize.value}
        disabled={props.disabled}
        maxHeight={304}
        type="tel"
        inputmode="tel"
        itemText="code"
        class="phone"
        controlClass={classNames(
          'pl-2 pr-0 bg-light-gray-400 dark:bg-gray-400',
          codeInputRef.value?.isMenuActive || 'rounded'
        )}
        inputClass="flex-shrink-0 whitespace-nowrap w-auto"
        contentOnIntersect
        {...{
          'onUpdate:modelValue': onCodeSelect,
          onKeydown: onCodeKeydown,
        }}
        v-slots={{
          prepend: () =>
            codeInput.value && (
              <img
                src={
                  require(`@/assets/img/flags/square/${codeInput.value}.svg`)
                    .default
                }
                class="w-6 flex-shrink-0"
                aria-hidden="true"
              />
            ),
          'prepend-item': () => (
            <TextField
              ref={searchInputRef}
              v-model={search.value}
              placeholder={t('placeholder.startTyping')}
              clearable
              class="sticky top-0"
              controlClass="input__control--no-shadow rounded-none"
              {...{
                onKeydown: onSearchKeydown,
              }}
              v-slots={{
                prepend: () => (
                  <Icon class="text-gray-100 dark:text-gray-200 ml-1">
                    {ziSearch}
                  </Icon>
                ),
              }}
            />
          ),
          'append-outer': () => (
            <TextField
              ref={phoneInputRef}
              modelValue={phoneInput.value}
              solo={props.solo}
              dense={props.dense}
              readonly={props.readonly}
              disabled={props.disabled}
              placeholder={currentPlaceholder.value}
              mask={currentMask.value}
              rules={computedRules.value}
              lazy={props.lazy}
              required={props.required}
              stateIcon={props.stateIcon}
              stateSuccessIcon={props.stateSuccessIcon}
              stateErrorIcon={props.stateErrorIcon}
              stateSuccessColor={props.stateSuccessColor}
              stateErrorColor={props.stateErrorColor}
              debounce={props.debounce}
              hideDetails={props.hideDetails}
              messagesOnFocused={props.messagesOnFocused}
              type="tel"
              inputmode="tel"
              class="w-full flex-grow"
              controlClass={classNames(
                'rounded-l-none pl-2',
                codeInputRef.value?.isMenuActive && 'rounded-br-none'
              )}
              {...{
                onFocus: () => {
                  codeInputRef.value?.closeMenu()
                },
                'onUpdate:modelValue': onPhoneInput,
              }}
            />
          ),
          item: ({
            item,
            selected,
          }: {
            item: PhoneItem
            selected: boolean
          }) => (
            <>
              <div class="w-8 flex justify-center flex-shrink-0">
                {selected && <Icon>{ziChecked}</Icon>}
              </div>
              <img
                src={
                  require(`@/assets/img/flags/square/${item.value}.svg`).default
                }
                alt={item.value}
                class="w-6 flex-shrink-0 mr-2"
                aria-hidden="true"
              />
              <span class="text-gray-900 dark:text-light-gray-400 truncate pr-2">
                {item.country}
              </span>
              <span class="text-gray-200 flex-shrink-0">{item.code}</span>
            </>
          ),
        }}
      />
    )
  },
})
