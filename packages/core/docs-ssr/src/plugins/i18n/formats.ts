const timeOptions = {
  hour: 'numeric' as const,
  minute: 'numeric' as const,
}
const shortOptions = {
  year: 'numeric' as const,
  month: 'numeric' as const,
  day: 'numeric' as const,
}
const longOptions = {
  year: 'numeric' as const,
  month: 'short' as const,
  day: 'numeric' as const,
  hour: 'numeric' as const,
  minute: 'numeric' as const,
}

export const datetimeFormats = {
  en: {
    time: timeOptions,
    short: shortOptions,
    long: Object.assign({ weekday: 'short' as const }, longOptions),
  },
  fr: {
    time: timeOptions,
    short: shortOptions,
    long: longOptions,
  },
  ru: {
    time: timeOptions,
    short: shortOptions,
    long: longOptions,
  },
  uk: {
    time: timeOptions,
    short: shortOptions,
    long: longOptions,
  },
}

const defaultOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 20,
}
const integerOptions = {
  maximumFractionDigits: 0,
}
const decimalOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}
const fixedOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}

export const numberFormats = {
  en: {
    currency: {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    },
    integer: integerOptions,
    decimal: decimalOptions,
    fixed: fixedOptions,
    default: defaultOptions,
  },
  fr: {
    currency: {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    },
    integer: integerOptions,
    decimal: decimalOptions,
    fixed: fixedOptions,
    default: defaultOptions,
  },
  ru: {
    currency: {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 2,
    },
    integer: integerOptions,
    decimal: decimalOptions,
    fixed: fixedOptions,
    default: defaultOptions,
  },
  uk: {
    currency: {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    },
    integer: integerOptions,
    decimal: decimalOptions,
    fixed: fixedOptions,
    default: defaultOptions,
  },
}
