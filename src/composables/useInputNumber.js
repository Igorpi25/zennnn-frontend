import { ref, computed, watch, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatNumber as format, unformatNumber as unformat } from '../utils/formatNumber'
import { isNumber } from '../utils/check'

const COMMA_SEPARATE_LOCALES = ['fr', 'ru', 'uk']

// Props
export const useInputNumberProps = () => {
  return {
    number: Boolean,
    // integer, decimal, currency, fixed
    numberFormat: {
      type: String,
      default: 'default',
    },
    numberFallback: {
      type: Number,
      default: null,
    },
  }
}

// Default
export const useInputNumber = (props, { internalValue, isFocused }) => {
  const { locale, n } = useI18n()

  const formattedNumber = ref(null)

  const numberDecimal = computed(() => {
    return getLocaleDecimal(locale.value)
  })

  const numberPrecision = computed(() => {
    const isFixed = props.numberFormat === 'currency' || props.numberFormat === 'fixed'
    // precision numbers digits must be between 0 and 20
    const precision = props.numberFormat === 'integer'
      ? 0
      : isFixed
        ? 2
        : 20
    return precision
  })

  const inputmode = computed(() => {
    if (props.number) {
      return props.numberFormat === 'integer' ? 'numeric' : 'decimal'
    }
    return props.inputmode || 'text'
  })

  const computedPlaceholder = computed(() => {
    // ignore placeholder on number
    return props.number
      ? ''
      : props.placeholder
  })

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

  const getLocaleDecimal = (val) => {
    return COMMA_SEPARATE_LOCALES.includes(val) ? ',' : '.'
  }

  const formatNumber = (val, decimal) => {
    const parsed = unformat(val, decimal || numberDecimal.value)
    return isNumber(parsed) ? n(parsed || 0, props.numberFormat) : props.numberFallback
  }

  // TODO: format removed value when entered '--'
  const formatInputNumber = (val, decimal) => {
    return format(val, {
      precision: numberPrecision.value,
      decimal: decimal || numberDecimal.value,
    })
  }

  const unformatNumber = (val, decimal) => {
    return unformat(val, decimal || numberDecimal.value)
  }

  const setInternalValue = (val) => {
    if (props.number) {
      formattedNumber.value = isFocused.value ? formatInputNumber(val) : formatNumber(val)
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
