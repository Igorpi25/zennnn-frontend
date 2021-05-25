export default class Breakpoint {
  constructor(options = {}) {
    this.xs = false
    this.sm = false
    this.md = false
    this.lg = false
    this.xl = false
    this.xsOnly = false
    this.smOnly = false
    this.smAndDown = false
    this.smAndUp = false
    this.mdOnly = false
    this.mdAndDown = false
    this.mdAndUp = false
    this.lgOnly = false
    this.lgAndDown = false
    this.lgAndUp = false
    this.xlOnly = false // Value is xs to match v2.x functionality

    this.name = 'xs'
    this.height = 0
    this.width = 0 // TODO: Add functionality to detect this dynamically in v3
    // Value is true to match v2.x functionality

    this.mobile = true
    this.resizeTimeout = 0

    const { mobileBreakpoint, scrollBarWidth, thresholds } = options

    this.mobileBreakpoint = mobileBreakpoint
    this.scrollBarWidth = scrollBarWidth
    this.thresholds = thresholds
  }

  init() {
    this.update()

    /* istanbul ignore if */
    if (typeof window === 'undefined') return

    window.addEventListener('resize', this._onResize.bind(this), {
      passive: true,
    })
  }

  /* eslint-disable-next-line max-statements */
  update(ssr = false) {
    const height = ssr ? 0 : this._getClientHeight()
    const width = ssr ? 0 : this._getClientWidth()

    const xs = width < this.thresholds.xs
    const sm = width < this.thresholds.sm && !xs
    const md = width < this.thresholds.md - this.scrollBarWidth && !(sm || xs)
    const lg =
      width < this.thresholds.lg - this.scrollBarWidth && !(md || sm || xs)
    const xl = width >= this.thresholds.lg - this.scrollBarWidth

    this.height = height
    this.width = width

    this.xs = xs
    this.sm = sm
    this.md = md
    this.lg = lg
    this.xl = xl

    this.xsOnly = xs
    this.smOnly = sm
    this.smAndDown = (xs || sm) && !(md || lg || xl)
    this.smAndUp = !xs && (sm || md || lg || xl)
    this.mdOnly = md
    this.mdAndDown = (xs || sm || md) && !(lg || xl)
    this.mdAndUp = !(xs || sm) && (md || lg || xl)
    this.lgOnly = lg
    this.lgAndDown = (xs || sm || md || lg) && !xl
    this.lgAndUp = !(xs || sm || md) && (lg || xl)
    this.xlOnly = xl

    switch (true) {
      case xs:
        this.name = 'xs'
        break
      case sm:
        this.name = 'sm'
        break
      case md:
        this.name = 'md'
        break
      case lg:
        this.name = 'lg'
        break
      default:
        this.name = 'xl'
        break
    }

    if (typeof this.mobileBreakpoint === 'number') {
      this.mobile = width < parseInt(this.mobileBreakpoint, 10)

      return
    }

    const breakpoints = {
      xs: 0,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4,
    }

    const current = breakpoints[this.name]
    const max = breakpoints[this.mobileBreakpoint]

    this.mobile = current <= max
  }

  _onResize() {
    clearTimeout(this.resizeTimeout)

    this.resizeTimeout = window.setTimeout(this.update.bind(this), 200)
  }

  // Cross-browser support as described in:
  // https://stackoverflow.com/questions/1248081
  _getClientWidth() {
    if (typeof document === 'undefined') return 0 // SSR
    return Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    )
  }

  _getClientHeight() {
    if (typeof document === 'undefined') return 0 // SSR
    return Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    )
  }
}
