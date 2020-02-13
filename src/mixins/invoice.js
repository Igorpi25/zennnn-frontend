import format from 'date-fns/format'

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
    scrollLeft: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
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
    scrollLeft (val) {
      const target = this.$refs.productsTable
      if (target) {
        target.scrollLeft = val || 0
      }
    },
  },
  mounted () {
    if (this.scrollLeft) {
      const target = this.$refs.productsTable
      if (target) {
        target.scrollLeft = this.scrollLeft
      }
    }
  },
  methods: {
    onScroll (e) {
      const target = e.target
      const scrollLeft = target ? target.scrollLeft : 0
      this.$emit('change:scrollLeft', scrollLeft || 0)
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
