import parseISO from 'date-fns/parseISO'
import fromUnixTime from 'date-fns/fromUnixTime'
import formatISO from 'date-fns/formatISO'

export default {
  install(app) {
    app.config.globalProperties.$parseDate = (date) => {
      if (!date) return ''
      const isUnixTime = !Number.isNaN(Number(date))
      return isUnixTime ? fromUnixTime(date / 1000) : parseISO(date)
    }

    app.config.globalProperties.$toISOString = (date) => {
      if (!date) return ''
      return formatISO(date)
    }
  },
}
