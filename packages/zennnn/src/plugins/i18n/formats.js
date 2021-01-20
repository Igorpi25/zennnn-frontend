const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
}
const shortOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
}
const longOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
}

export const datetimeFormats = {
  en: {
    time: timeOptions,
    short: shortOptions,
    long: Object.assign({ weekday: 'short' }, longOptions),
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
