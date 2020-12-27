// import throttle from 'lodash.throttle'

import { Scroll } from 'uipart'

import apolloClient from '../plugins/apollo'

import { GET_SPEC, GET_IS_SPEC_SYNC } from '../graphql/queries'
import { UPDATE_INVOICE, CREATE_PRODUCT, CREATE_PRODUCT_WITH_INVOICE } from '../graphql/mutations'
import {
  InvoiceProfitType,
  SpecCurrency,
} from '../graphql/enums'

import { DEFAULT_CURRENCY } from '../config/globals'

export default {
  directives: {
    Scroll,
  },
  props: {
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
    },
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
      InvoiceProfitType,
      isBooted: false,
      createLoading: null,
      updateLoading: null,
      deleteLoading: null,
      errors: [],
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
    currencies () {
      return Object.values(SpecCurrency).map(el => {
        return {
          text: el,
          value: el,
        }
      })
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
    addProduct (input) {
      if (this.create) {
        this.createProductWithInvoice(input)
      } else {
        this.createProduct(input)
      }
    },
    async createProduct (input) {
      try {
        this.createLoading = true
        const variables = {
          invoiceId: this.invoiceItem.id,
        }
        if (input) {
          variables.input = {
            name: input.name,
            article: input.article,
          }
        }
        await apolloClient.mutate({
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
    async createProductWithInvoice (input) {
      try {
        this.createLoading = true
        const variables = {
          specId: this.$route.params.specId,
        }
        if (input) {
          variables.input = {
            name: input.name,
            article: input.article,
          }
        }
        await apolloClient.mutate({
          mutation: CREATE_PRODUCT_WITH_INVOICE,
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
    switchTab (value) {
      this.$emit('change:tab', value)
    },
    async updateInvoice (input) {
      try {
        const id = this.invoiceItem.id
        this.updateLoading = id
        await apolloClient.mutate({
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
        throw new Error(error)
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
      try {
        apolloClient.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: true },
        })
        await apolloClient.query({
          query: GET_SPEC,
          variables: {
            id: this.specId,
          },
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        apolloClient.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: false },
        })
      }
    },
  },
}
