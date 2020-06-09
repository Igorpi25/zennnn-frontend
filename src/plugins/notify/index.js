import Vue from 'vue'
import Notifications from '@/components/Notify/Notifications.vue'

const DEFAULT_TIMEOUT = 6000
let id = 0

const Notify = {
  install (Vue) {
    if (Notify.installed) return
    const NotificationsConstructor = Vue.extend(Notifications)
    const _instance = new NotificationsConstructor()
    _instance.$mount()
    document.body.appendChild(_instance.$el)
    Vue.prototype.$notify = (payload) => {
      // Default values
      let notification = { id: id++, color: 'primary', text: '', close: true }
      const isString = typeof payload === 'string' || payload instanceof String
      if (isString) {
        notification.text = payload
        notification.timeout = DEFAULT_TIMEOUT
      } else {
        if (!Object.prototype.hasOwnProperty.call(payload, 'timeout')) {
          payload.timeout = DEFAULT_TIMEOUT
        }
        notification = Object.assign(notification, payload)
      }
      _instance.add(notification)
      return id
    }
    Vue.prototype.$notify.removeByName = (name) => {
      _instance.removeByName(name)
    }
  },
}

Vue.use(Notify)
