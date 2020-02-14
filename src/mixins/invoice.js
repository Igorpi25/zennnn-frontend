import format from 'date-fns/format'
// import throttle from 'lodash.throttle'

import {
  mdiClose,
  mdiPlusCircleOutline,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js'

import { GET_SPEC } from '../graphql/queries'
import { UPDATE_INVOICE, CREATE_PRODUCT } from '../graphql/mutations'
import {
  ProductStatus,
  InvoiceProfitType,
} from '../graphql/enums'

import Scroll from '../directives/Scroll'

export default {
  directives: {
    Scroll,
  },
  props: {
    activeTab: {
      type: Number,
      default: 1,
    },
    scrollInvoiceId: {
      type: String,
      default: '',
    },
    scrollLeft: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      isScrollStart: false,
      scrollEndTimer: null,
      isMouseOver: false,
      lazyScrollLeft: 0,
      scrollLeftDelay: 75,
      scrollAnimationDuration: 75,
      ProductStatus,
      InvoiceProfitType,
      isBooted: false,
      createLoading: null,
      updateLoading: null,
      deleteLoading: null,
      errors: [],
      icons: {
        mdiClose,
        mdiPlusCircleOutline,
        mdiChevronLeft,
        mdiChevronRight,
      },
      menuPrepaymentDate: false,
      menuResidueDate: false,
      menuClientDebtDate: false,
      prepaymentDate: null,
      residueDate: null,
      clientDebtDate: null,
    }
  },
  computed: {
    specId () {
      return this.$route.params.specId
    },
    fixedHeadersWidth () {
      return this.productHeaders.reduce((acc, curr) => {
        return acc + (curr.width || 0)
      }, 0)
    },
    tabs () {
      return [
        { value: 1, text: this.$t('shipping.prices'), width: 130 },
        { value: 2, text: this.$t('shipping.warehouse'), width: 130 },
        { value: 3, text: this.$t('shipping.description'), width: 130 },
        { value: 4, text: this.$t('shipping.link'), width: 130 },
      ]
    },
    items () {
      return (this.invoice && this.invoice.products) || []
    },
    invoiceItem () {
      return this.invoice || this.item || {}
    },
    isInvoiceProfitTypeMargin () {
      return this.invoiceItem.profitType === InvoiceProfitType.MARGIN
    },
    isInvoiceProfitTypeCommission () {
      return this.invoiceItem.profitType === InvoiceProfitType.COMMISSION
    },
  },
  watch: {
    scrollLeft () {
      if (this.invoiceItem.id === this.scrollInvoiceId) return
      if (this.isMouseOver || this.isScrollStart) return
      this.setScrollLeft()
    },
  },
  mounted () {
    // this.debounceEmitScrollLeftChange = throttle(this.emitScrollLeftChange, this.scrollLeftDelay, { leading: true })
    if (this.scrollLeft) {
      this.setScrollLeft(false)
    }
  },
  methods: {
    emitScrollLeftChange () {
      this.$emit('change:scrollLeft', this.lazyScrollLeft, this.invoiceItem.id)
    },
    setScrollLeft (animate = true) {
      const target = this.$refs.productsTable
      if (target) {
        const scrollLeft = this.scrollLeft || 0
        if (animate) {
          target.scrollLeft = scrollLeft
          // this.scrollLeftWithAnimation(scrollLeft)
        } else {
          target.scrollLeft = scrollLeft
        }
      }
    },
    scrollLeftWithAnimation (scrollLeft) {
      const container = this.$refs.productsTable
      if (!container) return
      const targetLocation = scrollLeft
      const startLocation = container.scrollLeft
      if (targetLocation === startLocation) return
      const startTime = performance.now()
      const duration = this.scrollAnimationDuration
      const ease = (t) => t
      return new Promise(resolve => requestAnimationFrame(function step (currentTime) {
        const timeElapsed = currentTime - startTime
        const progress = Math.abs(duration ? Math.min(timeElapsed / duration, 1) : 1)

        container.scrollLeft = Math.floor(startLocation + (targetLocation - startLocation) * ease(progress))

        const clientWidth = container.clientWidth
        if (progress === 1 || clientWidth + container.scrollLeft === container.scrollWidth) {
          return resolve(targetLocation)
        }

        requestAnimationFrame(step)
      }))
    },
    onScroll (e) {
      const target = e.target
      const scrollLeft = target ? target.scrollLeft : 0
      this.lazyScrollLeft = scrollLeft < 0 ? 0 : scrollLeft
      if (!this.isMouseOver && !this.isScrollStart) return
      if (this.isScrollStart) {
        this.clearScrollEndTimer()
      }
      this.emitScrollLeftChange()
      // this.debounceEmitScrollLeftChange()
    },
    clearScrollEndTimer () {
      clearTimeout(this.scrollEndTimer)
      this.scrollEndTimer = setTimeout(() => {
        this.isScrollStart = false
      }, 300)
    },
    async createProduct () {
      try {
        this.createLoading = true
        const variables = {
          invoiceId: this.invoiceItem.id,
        }
        await this.$apollo.mutate({
          mutation: CREATE_PRODUCT,
          variables,
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
        this.errors = error.errors || []
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'CreateProductError',
        //   attributes: {
        //     error: error
        //   }
        // })
      } finally {
        this.createLoading = false
      }
    },
    formatDate (date) {
      if (!date) return null
      const parsedDate = this.$parseDate(date)
      return format(parsedDate, this.$i18n.locale === 'zh'
        ? 'yyyy-M-d' : this.$i18n.locale === 'ru'
          ? 'dd.MM.yyyy' : 'dd/MM/yyyy',
      )
    },
    switchTab (value) {
      this.$emit('change:tab', value)
    },
    async updateInvoice (input) {
      try {
        const id = this.invoiceItem.id
        this.updateLoading = id
        await this.$apollo.mutate({
          mutation: UPDATE_INVOICE,
          variables: {
            id,
            input,
          },
        })
      } catch (error) {
        if (error && error.errors && error.errors.length > 0) {
          this.errors = error.errors
        }
        if (error.message && error.message.includes('GraphQL error: MongoError: WriteConflict')) {
          this.refetchSpec()
        }
        this.$logger.warn('Error: ', error)
        // this.$Amplify.Analytics.record({
        //   name: 'UpdateInvoiceError',
        //   attributes: {
        //     error: error.message
        //   }
        // })
      } finally {
        this.updateLoading = null
      }
    },
    async refetchSpec () {
      const apolloClient = this.$apollo.provider.defaultClient
      try {
        apolloClient.cache.writeData({
          data: { isSpecSync: true },
        })
        await this.$apollo.query({
          query: GET_SPEC,
          variables: {
            id: this.specId,
          },
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        apolloClient.cache.writeData({
          data: { isSpecSync: false },
        })
      }
    },
  },
}
