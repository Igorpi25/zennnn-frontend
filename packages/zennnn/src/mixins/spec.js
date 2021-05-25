import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  useQuery,
  useResult,
  useMutation,
  useApolloClient,
} from '@vue/apollo-composable'

import { ziRefresh } from '@zennnn/icons'

import { Role, ProductStatus } from '../graphql/enums'
import {
  GET_SPEC,
  SEARCH_CLIENTS,
  SEARCH_SUPPLIERS,
  GET_IS_SPEC_SYNC,
  SPEC_SIMPLE_UI_OFF,
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
  SET_SPEC_SIMPLE_UI,
} from '../graphql/mutations'
import { getSpecExpandedInvoices, getSpecActiveTab } from '../graphql/resolvers'

export default {
  props: {
    loading: Boolean,
  },
  setup() {
    const { resolveClient } = useApolloClient()
    const route = useRoute()
    const orgId = route.params.orgId
    const specId = route.params.orgId
    const clientSearch = ref('')
    const supplierSearch = ref('')
    const isBooted = ref(false)
    const expanded = ref([])
    const invoiceActiveTab = ref(0)

    const { result: result1 } = useQuery(SPEC_SIMPLE_UI_OFF)
    const specSimpleUIOff = useResult(result1)

    const { result: result2 } = useQuery(GET_IS_SPEC_SYNC)
    const isSpecSync = useResult(result2)

    const { result: result3, onResult } = useQuery(
      GET_SPEC,
      () => ({
        id: specId,
      }),
      {
        fetchPolicy: 'cache-only',
      }
    )
    const getSpec = useResult(result3)
    onResult(({ data, loading }) => {
      if (!loading && !isBooted.value) {
        const spec = (data && data.getSpec) || {}
        updateExpandedAndActiveTab(spec)
      }
    })

    const { result: result4, refetch: searchClientsRefetch } = useQuery(
      SEARCH_CLIENTS,
      () => ({
        orgId: orgId,
        search: clientSearch.value,
      }),
      () => ({
        enabled: !!clientSearch.value,
        fetchPolicy: 'cache-and-network',
        debounce: 300,
      })
    )
    const searchClients = useResult(result4)

    const { result: result5, refetch: searchSuppliersRefetch } = useQuery(
      SEARCH_SUPPLIERS,
      () => ({
        orgId: orgId,
        search: supplierSearch.value,
      }),
      () => ({
        enabled: !!supplierSearch.value,
        fetchPolicy: 'cache-and-network',
        debounce: 300,
      })
    )
    const searchSuppliers = useResult(result5)

    // Methods
    const updateExpandedAndActiveTab = async (spec) => {
      const specId = spec && spec.id
      if (!specId || isBooted.value) return
      isBooted.value = true
      const activeTab = await getSpecActiveTab(specId)
      invoiceActiveTab.value = activeTab || 1 // this.defaultTab
      const _expanded = await getSpecExpandedInvoices(specId)
      if (!_expanded) {
        const [invoice] = spec.invoices || []
        if (invoice && invoice.id) {
          expanded.value = [invoice.id]
          await setExpandedInvoices(expanded.value)
        }
      } else {
        expanded.value = _expanded || []
      }
    }

    const { mutate: setExpandedInvoicesMutate } = useMutation(
      SET_SPEC_EXPANDED_INVOICES
    )
    const setExpandedInvoices = async (ids) => {
      await setExpandedInvoicesMutate({ specId: specId, ids })
    }

    const { mutate: addExpandedInvoicesMutate } = useMutation(
      ADD_SPEC_EXPANDED_INVOICES
    )
    const addExpandedInvoices = async (ids) => {
      await addExpandedInvoicesMutate({ specId: specId, ids })
    }

    const { mutate: removeExpandedInvoicesMutate } = useMutation(
      REMOVE_SPEC_EXPANDED_INVOICES
    )
    const removeExpandedInvoices = async (ids) => {
      await removeExpandedInvoicesMutate({ specId: specId, ids })
    }

    const { mutate: setInvoiceActiveTabMutate } =
      useMutation(SET_SPEC_ACTIVE_TAB)
    const setInvoiceActiveTab = async (value) => {
      invoiceActiveTab.value = value
      await setInvoiceActiveTabMutate({ specId: specId, tab: value })
    }

    return {
      resolveClient,
      orgId,
      specId,
      clientSearch,
      supplierSearch,
      isBooted,
      expanded,
      invoiceActiveTab,
      specSimpleUIOff,
      isSpecSync,
      getSpec,
      searchClients,
      searchSuppliers,
      updateExpandedAndActiveTab,
      setExpandedInvoices,
      addExpandedInvoices,
      removeExpandedInvoices,
      setInvoiceActiveTab,
      searchClientsRefetch,
      searchSuppliersRefetch,
    }
  },
  data() {
    return {
      Role,
      clientDialog: false,
      createLoading: null,
      updateLoading: null,
      deleteLoading: null,
      errors: [],
      supplierDialog: false,
      menuPurchaseDate: {},
      menuShippingDate: {},
      icons: {
        ziRefresh,
      },
      invoiceScrollId: '',
      invoiceScrollLeft: 0,
      invoiceActiveTab: 0,
    }
  },
  computed: {
    dataLoading() {
      return this.items.length === 0 && this.loading
    },
    isInvoiceSummaryVisible() {
      return (
        this.specSimpleUIOff ||
        this.hasInvoiceShippingDate ||
        this.hasFilledProduct ||
        this.hasFilledProductQty
      )
    },
    isInfoVisible() {
      return (
        this.specSimpleUIOff ||
        this.hasInvoiceShippingDate ||
        this.hasFilledProduct
      )
    },
    isCostVisible() {
      return this.specSimpleUIOff || this.hasFilledProduct
    },
    isSummaryVisible() {
      return (
        this.specSimpleUIOff ||
        (this.hasInvoiceShippingDate && this.hasFilledProduct)
      )
    },
    hasInvoiceShippingDate() {
      const invoices = this.spec.invoices || []
      return invoices.some((el) => el.shippingDate)
    },
    hasFilledProduct() {
      const invoices = this.spec.invoices || []
      return invoices.some((i) => {
        const products = i.products || []
        return products.some((el) => {
          return (
            el.productStatus === ProductStatus.IN_PROCESSING ||
            el.productStatus === ProductStatus.IN_PRODUCTION ||
            el.productStatus === ProductStatus.IN_STOCK
          )
        })
      })
    },
    hasFilledProductQty() {
      const invoices = this.spec.invoices || []
      return invoices.some((i) => {
        const products = i.products || []
        return products.some((el) => el.qty)
      })
    },
    specSimpleUI() {
      return !this.specSimpleUIOff
    },
    emptyId() {
      return `empty-${this.spec.id}`
    },
    isEmpty() {
      return this.items.length === 1 && this.items[0].id === this.emptyId
    },
    specTitleText() {
      return `
         ${this.$t('shipping.dealNo')}
         ${this.spec.specNo} ${this.$t('preposition.from')}
         ${this.$d(this.$parseDate(this.spec.createdAt), 'short')}
      `
    },
    specTitleHtml() {
      return `
        ${this.$t('shipping.dealNo')}
        &nbsp;${this.spec.specNo} ${this.$t('preposition.from')}
        &nbsp;${this.$d(this.$parseDate(this.spec.createdAt), 'short')}
      `
    },
    spec() {
      return this.getSpec || {}
    },
    items() {
      return (this.getSpec && this.getSpec.invoices) || []
    },
    specClient() {
      const client = this.spec.client || {}
      return {
        ...client,
        name: this.getClientName(client),
      }
    },
    clients() {
      const items = (this.searchClients && this.searchClients.items) || []
      return items.map((item) => {
        return {
          ...item,
          name: this.getClientName(item),
        }
      })
    },
    suppliers() {
      const items = (this.searchSuppliers && this.searchSuppliers.items) || []
      return items.map((item) => {
        return {
          ...item,
          name: this.getSupplierName(item),
        }
      })
    },
  },
  watch: {
    items(val, oldVal) {
      const value = val || []
      const oldValue = oldVal || []
      // on invoice removed clear from expanded
      if (oldValue.length > value.length) {
        const removedIds = []
        oldValue.forEach((v) => {
          if (!value.some((el) => el.id === v.id)) {
            removedIds.push(v.id)
          }
        })
        this.removeExpandedInvoices(removedIds)
      }
    },
  },
  methods: {
    async toggleSpecSimpleUI(value) {
      const client = this.resolveClient()
      await client.mutate({
        mutation: SET_SPEC_SIMPLE_UI,
        variables: {
          value: !value,
        },
      })
    },
    setScrollLeft(scrollLeft, invoiceId) {
      this.invoiceScrollId = invoiceId
      this.invoiceScrollLeft = scrollLeft
    },
    getInvoiceSupplier(item) {
      const supplier = item.supplier || {}
      return {
        ...supplier,
        name: this.getSupplierName(supplier),
      }
    },
    openCreateSupplierDialog(item) {
      this.createSupplierInvoice = item
      this.supplierDialog = true
    },
    createClient() {
      this.clientDialog = true
      this.$nextTick(() => {
        if (this.$refs.clientCard) {
          this.$refs.clientCard.reset()
          if (this.$refs.clientDialog.$refs.dialog) {
            this.$refs.clientDialog.$refs.dialog.scrollTop = 0
          }
        }
      })
    },
    setCreateSpecClient(client) {
      this.setSpecClient(client.id)
      this.clientDialog = false
      this.searchClientsRefetch()
    },
    setCreatedSupplier(supplier) {
      this.setInvoiceSupplier(
        this.createSupplierInvoice.id,
        supplier && supplier.id
      )
      this.supplierDialog = false
      this.createSupplierInvoice = null
      this.searchSuppliersRefetch()
      setTimeout(() => {
        this.$refs.supplierCard.reset()
        if (this.$refs.supplierDialog.$refs.dialog) {
          this.$refs.supplierDialog.$refs.dialog.scrollTop = 0
        }
      }, 200)
    },
    getClientName(item) {
      return item.fullName || ''
    },
    getSupplierName(item) {
      return item.companyName || ''
    },
    expand(id) {
      if (this.expanded.includes(id)) {
        const index = this.expanded.indexOf(id)
        this.expanded.splice(index, 1)
        this.removeExpandedInvoices([id])
      } else {
        this.expanded.push(id)
        this.addExpandedInvoices([id])
      }
    },
    collapseAll() {
      this.expanded = []
      this.setExpandedInvoices([])
    },
    expandAll() {
      const invoices = this.items
      const ids = invoices.reduce((acc, curr) => {
        return [...acc, curr.id]
      }, [])
      this.expanded = ids
      this.setExpandedInvoices(ids)
    },
    async createInvoice(input) {
      try {
        const client = this.resolveClient()
        this.createLoading = true
        const variables = {
          specId: this.specId,
        }
        if (input) {
          variables.input = input
        }
        const { data } = await client.mutate({
          mutation: CREATE_INVOICE,
          variables,
          fetchPolicy: 'no-cache',
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
    async updateInvoice(input, invoiceId) {
      try {
        const client = this.resolveClient()
        const id = invoiceId
        this.updateLoading = true
        await client.mutate({
          mutation: UPDATE_INVOICE,
          variables: {
            id,
            input,
          },
        })
        this.menuPurchaseDate[invoiceId] = false
        this.menuShippingDate[invoiceId] = false
      } catch (error) {
        if (
          error.message &&
          error.message.includes('GraphQL error: MongoError: WriteConflict')
        ) {
          this.refetchSpec()
        }
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async refetchSpec() {
      const client = this.resolveClient()
      try {
        client.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: true },
        })
        await client.query({
          query: GET_SPEC,
          variables: {
            id: this.$route.params.specId,
          },
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        client.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: false },
        })
      }
    },
    async updateSpec(input) {
      try {
        const client = this.resolveClient()
        this.updateLoading = true
        await client.mutate({
          mutation: UPDATE_SPEC,
          variables: {
            id: this.specId,
            input,
          },
        })
      } catch (error) {
        if (
          error.message &&
          error.message.includes('GraphQL error: MongoError: WriteConflict')
        ) {
          this.refetchSpec()
        }
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async setSpecClient(clientId) {
      try {
        const client = this.resolveClient()
        this.updateLoading = true
        await client.mutate({
          mutation: SET_SPEC_CLIENT,
          variables: {
            specId: this.specId,
            clientId,
          },
        })
      } catch (error) {
        if (
          error.message &&
          error.message.includes('GraphQL error: MongoError: WriteConflict')
        ) {
          this.refetchSpec()
        }
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async setInvoiceSupplier(invoiceId, supplierId) {
      try {
        const client = this.resolveClient()
        this.updateLoading = true
        await client.mutate({
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
