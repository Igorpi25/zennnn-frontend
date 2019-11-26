import Vue from 'vue'
import parseISO from 'date-fns/parseISO'
import fromUnixTime from 'date-fns/fromUnixTime'

const DateFns = {
  install (Vue) {
    if (DateFns.installed) return
    Vue.prototype.$parseISO = (date) => {
      if (!date) return ''
      const isUnixTime = !Number.isNaN(Number(date))
      return isUnixTime
        ? fromUnixTime(date / 1000)
        : parseISO(date)
    }
  },
}

Vue.use(DateFns)
