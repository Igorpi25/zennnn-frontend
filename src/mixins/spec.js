import format from 'date-fns/format'

import {
  mdiPlusCircleOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiMinus,
  mdiPlus,
} from '@mdi/js'

import { ClientType, InvoiceStatus } from '@/graphql/enums'
import { GET_SPEC, SEARCH_CLIENTS, SEARCH_SUPPLIERS } from '../graphql/queries'
import { CREATE_INVOICE, UPDATE_INVOICE, UPDATE_SPEC } from '../graphql/mutations'

export default {
  apollo: {
    getSpec: {
      query: GET_SPEC,
      variables () {
        return {
          id: this.specId,
        }
      },
      fetchPolicy: 'cache-only',
    },
    searchClients: {
      query: SEARCH_CLIENTS,
      variables () {
        return {
          specId: this.specId,
          search: this.clientSearch,
        }
      },
      fetchPolicy: 'cache-and-network',
      skip () {
        return !this.clientSearch
      },
      debounce: 300,
    },
    searchSuppliers: {
      query: SEARCH_SUPPLIERS,
      variables () {
        return {
          specId: this.specId,
          search: this.supplierSearch,
        }
      },
      fetchPolicy: 'cache-and-network',
      skip () {
        return !this.supplierSearch
      },
      debounce: 300,
    },
  },
  data () {
    return {
      InvoiceStatus,
      createLoading: null,
      updateLoading: null,
      deleteLoading: null,
      isBooted: false,
      errors: [],
      expanded: [],
      supplierDialog: false,
      clientSearch: '',
      supplierSearch: '',
      menuPurchaseDate: {},
      menuShippingDate: {},
      icons: {
        mdiPlusCircleOutline,
        mdiChevronLeft,
        mdiChevronRight,
        mdiMinus,
        mdiPlus,
      },
    }
  },
  computed: {
    specId () {
      return this.$route.params.specId
    },
    spec () {
      return this.getSpec || {}
    },
    items () {
      return this.getSpec && this.getSpec.invoices
    },
    specClient () {
      const client = this.spec.client || {}
      return {
        ...client,
        name: this.getClientName(client),
      }
    },
    clients () {
      return (this.searchClients && this.searchClients.items) || []
    },
    suppliers () {
      return (this.searchSuppliers && this.searchSuppliers.items) || []
    },
  },
  methods: {
    formatDate (date) {
      if (!date) return ''
      return format(
        this.$parseDate(date),
        this.$i18n.locale === 'zh'
          ? 'yyyy-M-d' : this.$i18n.locale === 'ru'
            ? 'dd.MM.yyyy' : 'dd/MM/yyyy',
      )
    },
    getInvoiceSupplierName (item) {
      const supplier = item.supplier || {}
      const name = supplier.companyNameSl || supplier.companyNameCl || ''
      return {
        ...supplier,
        name,
      }
    },
    openCreateSupplierDialog (item) {
      this.createSupplier = item
      this.supplierDialog = true
    },
    setCreatedSupplier (supplier) {
      this.updateInvoice({
        id: this.createSupplier.id,
        invoiceSupplierId: supplier && supplier.id,
        supplier,
      })
      this.supplierDialog = false
      this.createSupplier = null
      this.$apollo.queries.searchSuppliers.refetch()
      setTimeout(() => {
        this.$refs.supplierCard.reset()
        if (this.$refs.supplierDialog.$refs.dialog) {
          this.$refs.supplierDialog.$refs.dialog.scrollTop = 0
        }
      }, 200)
    },
    getClientName (item) {
      if (!item) return ''
      let name = ''
      if (item.clientType === ClientType.legal) {
        name = item.companyNameSl || item.companyNameCl || ''
      } else {
        name = item.lastName || ''
        name += item.firstName ? ` ${item.firstName}` : ''
        name += item.middleName ? ` ${item.middleName}` : ''
      }
      return name
    },
    expand (id) {
      // this.$apollo.mutate({
      //   mutation: TOGGLE_SPEC_EXPANDED_INVOICES,
      //   variables: {
      //     specId: this.specId,
      //     invoiceId: id
      //   }
      // })
      if (this.expanded.includes(id)) {
        const index = this.expanded.indexOf(id)
        this.expanded.splice(index, 1)
      } else {
        this.expanded.push(id)
      }
    },
    collapseAll () {
      this.expanded = []
    },
    async createInvoice () {
      try {
        this.createLoading = true
        await this.$apollo.mutate({
          mutation: CREATE_INVOICE,
          variables: {
            specId: this.specId,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async updateInvoice (input, invoiceId) {
      try {
        const id = invoiceId
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_INVOICE,
          variables: {
            id,
            input,
          },
        })
        this.menuPurchaseDate[invoiceId] = false
        this.menuShippingDate[invoiceId] = false
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async updateSpec (input) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_SPEC,
          variables: {
            id: this.specId,
            input,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
  },
}
