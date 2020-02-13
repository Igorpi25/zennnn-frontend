import format from 'date-fns/format'

import {
  mdiPlusCircleOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiMinus,
  mdiPlus,
  mdiSync,
} from '@mdi/js'

import { ClientType, InvoiceStatus } from '@/graphql/enums'
import {
  GET_SPEC,
  SEARCH_CLIENTS,
  SEARCH_SUPPLIERS,
  GET_IS_SPEC_SYNC,
} from '../graphql/queries'
import {
  CREATE_INVOICE,
  UPDATE_INVOICE,
  UPDATE_SPEC,
  SET_SPEC_CLIENT,
  SET_INVOICE_SUPPLIER,
  SET_SPEC_ACTIVE_TAB,
  SET_SPEC_EXPANDED_INVOICES,
  ADD_SPEC_EXPANDED_INVOICES,
  REMOVE_SPEC_EXPANDED_INVOICES,
} from '../graphql/mutations'
import { getSpecExpandedInvoices } from '../graphql/resolvers'

export default {
  apollo: {
    isSpecSync: {
      query: GET_IS_SPEC_SYNC,
    },
    getSpec: {
      query: GET_SPEC,
      variables () {
        return {
          id: this.specId,
        }
      },
      fetchPolicy: 'cache-only',
      result ({ data, loading }) {
        if (!loading) {
          const spec = data.getSpec || {}
          this.invoiceActiveTab = spec.activeTab || 1
          this.updateExpanded(spec)
        }
      },
    },
    searchClients: {
      query: SEARCH_CLIENTS,
      variables () {
        return {
          orgId: this.orgId,
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
          orgId: this.orgId,
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
        mdiSync,
      },
      invoiceScrollLeft: 0,
      invoiceActiveTab: 1,
    }
  },
  computed: {
    orgId () {
      return this.$route.params.orgId
    },
    specId () {
      return this.$route.params.specId
    },
    spec () {
      return this.getSpec || {}
    },
    items () {
      return (this.getSpec && this.getSpec.invoices) || []
    },
    specClient () {
      const client = this.spec.client || {}
      return {
        ...client,
        name: this.getClientName(client),
      }
    },
    clients () {
      const items = (this.searchClients && this.searchClients.items) || []
      return items.map(item => {
        return {
          ...item,
          name: this.getClientName(item),
        }
      })
    },
    suppliers () {
      const items = (this.searchSuppliers && this.searchSuppliers.items) || []
      return items.map(item => {
        return {
          ...item,
          name: this.getSupplierName(item),
        }
      })
    },
  },
  watch: {
    items (val, oldVal) {
      const value = val || []
      const oldValue = oldVal || []
      // on invoice removed clear from expanded
      if (oldValue.length > value.length) {
        const removedIds = []
        oldValue.forEach(v => {
          if (!value.some(el => el.id === v.id)) {
            removedIds.push(v.id)
          }
        })
        this.removeExpandedInvoices(removedIds)
      }
    },
  },
  methods: {
    async updateExpanded (spec) {
      const specId = spec && spec.id
      if (!specId) return
      const expanded = spec.expandedInvoices || await getSpecExpandedInvoices(specId)
      if (!this.isBooted) {
        if (!expanded && !this.isBooted) {
          const [invoice] = spec.invoices || []
          if (invoice && invoice.id) {
            this.expanded = [invoice.id]
            await this.setExpandedInvoices(this.expanded)
          }
        } else {
          this.expanded = expanded || []
        }
        this.isBooted = true
      }
    },
    async setExpandedInvoices (ids) {
      await this.$apollo.mutate({
        mutation: SET_SPEC_EXPANDED_INVOICES,
        variables: {
          specId: this.specId,
          ids,
        },
      })
    },
    async addExpandedInvoices (ids) {
      await this.$apollo.mutate({
        mutation: ADD_SPEC_EXPANDED_INVOICES,
        variables: {
          specId: this.specId,
          ids,
        },
      })
    },
    async removeExpandedInvoices (ids) {
      await this.$apollo.mutate({
        mutation: REMOVE_SPEC_EXPANDED_INVOICES,
        variables: {
          specId: this.specId,
          ids,
        },
      })
    },
    async setInvoiceActiveTab (value) {
      this.invoiceActiveTab = value
      await this.$apollo.mutate({
        mutation: SET_SPEC_ACTIVE_TAB,
        variables: {
          specId: this.specId,
          tab: value,
        },
      })
    },
    formatDate (date) {
      if (!date) return ''
      return format(
        this.$parseDate(date),
        this.$i18n.locale === 'zh'
          ? 'yyyy-M-d' : this.$i18n.locale === 'ru'
            ? 'dd.MM.yyyy' : 'dd/MM/yyyy',
      )
    },
    getInvoiceSupplier (item) {
      const supplier = item.supplier || {}
      return {
        ...supplier,
        name: this.getSupplierName(supplier),
      }
    },
    openCreateSupplierDialog (item) {
      this.createSupplierInvoice = item
      this.supplierDialog = true
    },
    setCreatedSupplier (supplier) {
      this.setInvoiceSupplier(this.createSupplierInvoice.id, (supplier && supplier.id))
      this.supplierDialog = false
      this.createSupplierInvoice = null
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
      if (item.clientType === ClientType.LEGAL) {
        name = item.companyName || ''
      } else {
        name = item.firstName || ''
        name += name && item.lastName
          ? ` ${item.lastName}`
          : (item.lastName || '')
      }
      return name
    },
    getSupplierName (item) {
      if (!item) return ''
      return item.companyNameSl || item.companyNameCl || ''
    },
    expand (id) {
      if (this.expanded.includes(id)) {
        const index = this.expanded.indexOf(id)
        this.expanded.splice(index, 1)
        this.removeExpandedInvoices([id])
      } else {
        this.expanded.push(id)
        this.addExpandedInvoices([id])
      }
    },
    collapseAll () {
      this.expanded = []
      this.setExpandedInvoices([])
    },
    expandAll () {
      const invoices = this.items
      const ids = invoices.reduce((acc, curr) => {
        return [...acc, curr.id]
      }, [])
      this.expanded = ids
      this.setExpandedInvoices(ids)
    },
    async createInvoice () {
      try {
        this.createLoading = true
        const { data } = await this.$apollo.mutate({
          mutation: CREATE_INVOICE,
          variables: {
            specId: this.specId,
          },
        })
        const id = data && data.createInvoice && data.createInvoice.id
        if (id) {
          this.expanded.push(id)
          await this.addExpandedInvoices([id])
        }
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
        if (error.message && error.message.includes('GraphQL error: MongoError: WriteConflict')) {
          this.refetchSpec()
        }
        throw new Error(error)
      } finally {
        this.updateLoading = false
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
            id: this.$route.params.specId,
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
    async setSpecClient (clientId) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: SET_SPEC_CLIENT,
          variables: {
            specId: this.specId,
            clientId,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async setInvoiceSupplier (invoiceId, supplierId) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: SET_INVOICE_SUPPLIER,
          variables: {
            invoiceId,
            supplierId,
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
