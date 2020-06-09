import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { CURRENT_LANG_STORE_KEY } from '../../config/globals'

const defaultImpl = VueI18n.prototype.getChoiceIndex

/**
 * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
 * @param choicesLength {number} an overall amount of available choices
 * @returns a final choice index to select plural word by
**/
VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  // this === VueI18n instance, so the locale property also exists here
  if (this.locale !== 'ru' && this.locale !== 'uk') {
    // proceed to the default implementation
    return defaultImpl.apply(this, arguments)
  }

  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1

  if (!teen && endsWithOne) {
    return 1
  }

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return (choicesLength < 4) ? 2 : 3
}

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('../../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const dateTimeFormats = {
  en: {
    time: {
      hour: 'numeric',
      minute: 'numeric',
    },
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  fr: {
    time: {
      hour: 'numeric',
      minute: 'numeric',
    },
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  ru: {
    time: {
      hour: 'numeric',
      minute: 'numeric',
    },
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  uk: {
    time: {
      hour: 'numeric',
      minute: 'numeric',
    },
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
}

const numberFormats = {
  en: {
    currency: {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    },
    integer: {
      maximumFractionDigits: 0,
    },
    decimal: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    fixed: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
  fr: {
    currency: {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    },
    integer: {
      maximumFractionDigits: 0,
    },
    decimal: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    fixed: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
  ru: {
    currency: {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 2,
    },
    integer: {
      maximumFractionDigits: 0,
    },
    decimal: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    fixed: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
  uk: {
    currency: {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    },
    integer: {
      maximumFractionDigits: 0,
    },
    decimal: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    fixed: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
}

export default new VueI18n({
  locale: localStorage.getItem(CURRENT_LANG_STORE_KEY) || process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  dateTimeFormats,
  numberFormats,
})
