import format from 'date-fns/format'

import {
  mdiClose,
  mdiPlusCircleOutline,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js'

import { UPDATE_INVOICE } from '../graphql/mutations'
import {
  ProductStatus,
  InvoiceProfitType,
} from '../graphql/enums'

export default {
  // props: {
  //   content: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data () {
    return {
      ProductStatus,
      InvoiceProfitType,
      isBooted: false,
      createLoading: null,
      updateLoading: null,
      deleteLoading: null,
      activeTab: 1,
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
      prepaymentDate: new Date().toISOString().substr(0, 10),
      residueDate: new Date().toISOString().substr(0, 10),
      clientDebtDate: new Date().toISOString().substr(0, 10),
    }
  },
  // watch: {
  //   'content.invoiceNo' (val) {
  //     this.$refs.name.innerText = val || ''
  //   },
  // },
  // mounted () {
  //   this.$refs.name.innerText = this.content.invoiceNo || ''
  // },
  computed: {
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
      return this.invoice || {}
    },
    isInvoiceProfitTypeMargin () {
      return this.invoiceItem.profitType === InvoiceProfitType.MARGIN
    },
    isInvoiceProfitTypeCommission () {
      return this.invoiceItem.profitType === InvoiceProfitType.COMMISSION
    },
  },
  methods: {
    // onBlur () {
    //   this.$refs.name.innerText = this.content.invoiceNo || ''
    // },
    formatDate (date) {
      return format(this.$parseISO(date), this.$i18n.locale === 'zh'
        ? 'yyyy-M-d' : this.$i18n.locale === 'ru'
          ? 'dd.MM.yyyy' : 'dd/MM/yyyy',
      )
    },
    switchTab (event) {
      this.activeTab = event.target.value
    },
    async updateInvoice (id, input) {
      try {
        this.updateLoading = id
        await this.$apollo.mutate({
          mutation: UPDATE_INVOICE,
          variables: { id, input },
        })
      } catch (error) {
        if (error && error.errors && error.errors.length > 0) {
          this.errors = error.errors
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
  },
}
