import Vue from 'vue'
import parseISO from 'date-fns/parseISO'

const DateFns = {
  install (Vue) {
    if (DateFns.installed) return
    Vue.prototype.$parseISO = (dateString) => {
      if (!dateString) return ''
      return parseISO(dateString)
    }
  },
}

Vue.use(DateFns)
