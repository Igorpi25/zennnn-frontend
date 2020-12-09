import localforage from 'localforage'

export const store = localforage.createInstance({
  name: 'zennnn',
})

export default {
  install (app) {
    app.config.globalProperties.$store = store
  },
}
