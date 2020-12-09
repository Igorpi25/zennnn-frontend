import { createI18n } from 'vue-i18n'

import { CURRENT_LOCALE_STORE_KEY } from '../../config/globals'

import { datetimeFormats, numberFormats } from './formats'
import { slavicPluralRule } from './pluralizationRules'

function loadLocaleMessages () {
  const locales = require.context('../../locales/main', true, /[A-Za-z0-9-_,\s]+\.json$/i)
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

const i18nPlugin = createI18n({
  locale: localStorage.getItem(CURRENT_LOCALE_STORE_KEY) || 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
  datetimeFormats,
  numberFormats,
  // Key - language to use the rule for, `'ru'`, in this case
  // Value - function to choose right plural form
  pluralRules: {
    ru: slavicPluralRule,
    uk: slavicPluralRule,
  },
})

export default i18nPlugin

export const i18n = i18nPlugin.global
