import { ref, computed, watch, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  formatNumber as format,
  unformatNumber as unformat,
  isNumber,
} from 'vue-supp'

import type { PropType, Ref } from 'vue'

const COMMA_SEPARATE_LOCALES = ['fr', 'ru', 'uk']

export interface InputNumberProps {
  modelValue?: any
  number?: boolean
  numberFormat: 'default' | 'integer' | 'decimal' | 'currency' | 'fixed'
  numberFallback: number
  inputmode?: string
  placeholder?: string
}

export interface InputNumberContext {
  internalValue: any
  isFocused: Ref<boolean>
}

// Props
export const useInputNumberProps = () => {
  return {
    number: Boolean,
    numberFormat: {
      type: String as PropType<
        'default' | 'integer' | 'decimal' | 'currency' | 'fixed'
      >,
      default: 'default',
    },
    numberFallback: {
      type: Number,
      default: 0,
    },
  }
}

// Default
export const useInputNumber = (
  props: InputNumberProps,
  { internalValue, isFocused }: InputNumberContext
) => {
  const { locale, n } = useI18n()

  const formattedNumber = ref<string | number | null>()

  const numberDecimal = computed(() => getLocaleDecimal(locale.value))

  const numberPrecision = computed(() => {
    const isFixed =
      props.numberFormat === 'currency' || props.numberFormat === 'fixed'
    // precision numbers digits must be between 0 and 20
    const precision = props.numberFormat === 'integer' ? 0 : isFixed ? 2 : 20
    return precision
  })

  const inputmode = computed(() => {
    if (props.number) {
      return props.numberFormat === 'integer' ? 'numeric' : 'decimal'
    }
    return props.inputmode || 'text'
  })

  // ignore placeholder on number
  const computedPlaceholder = computed(() =>
    props.number ? '' : props.placeholder
  )

  watch(locale, () => {
    if (props.number) {
      formattedNumber.value = formatNumber(internalValue.value)
    }
  })

  onBeforeMount(() => {
    if (props.number) {
      formattedNumber.value = formatNumber(props.modelValue)
    }
  })

  function getLocaleDecimal(val: string): ',' | '.' {
    return COMMA_SEPARATE_LOCALES.includes(val) ? ',' : '.'
  }

  function formatNumber(val: any, decimal?: string): string {
    const parsed = unformat(val, decimal || numberDecimal.value)
    return isNumber(parsed)
      ? n(parsed || 0, props.numberFormat)
      : n(props.numberFallback)
  }

  // TODO: format removed value when entered '--'
  function formatInputNumber(val: any, decimal?: string): string | null {
    return format(val, {
      precision: numberPrecision.value,
      decimal: decimal || numberDecimal.value,
    })
  }

  function unformatNumber(val: any, decimal?: string): number | null {
    return unformat(val, decimal || numberDecimal.value)
  }

  function setInternalValue(val: any) {
    if (props.number) {
      formattedNumber.value = isFocused.value
        ? formatInputNumber(val)
        : formatNumber(val)
    }
    internalValue.value = val
  }

  return {
    formattedNumber,
    numberDecimal,
    numberPrecision,
    inputmode,
    computedPlaceholder,
    formatNumber,
    formatInputNumber,
    unformatNumber,
    setInternalValue,
  }
}
