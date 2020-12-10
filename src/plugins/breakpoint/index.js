import Breakpoint from './Breakpoint'

export default {
  install (app) {
    const breakpoint = new Breakpoint({
      thresholds: {
        xs: 340,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
      scrollBarWidth: 16,
    })
    app.config.globalProperties.$breakpoint = {
      get () {
        return breakpoint
      },
    }
  },
}
