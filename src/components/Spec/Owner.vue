<template>
  <div class="container container--sm">
    <div
      v-if="isSpecSync"
      class="fixed bottom-0 right-0 z-20 opacity-50 text-2xl mr-2 sm:mr-4 mb-6"
    >
      <Icon class="animate-spin">
        {{ icons.ziRefresh }}
      </Icon>
    </div>
    <div class="py-10">
      <div class="flex flex-wrap items-center justify-between pb-4">
        <h1 class="text-2xl text-white font-semibold relative">
          <span class="pr-6">
            {{ $t('shipping.title') }}
          </span>
          <transition name="fade-transition">
            <div
              v-if="loading"
              class="absolute top-0 right-0 text-gray-200"
            >
              <Progress
                indeterminate
                size="20"
                width="2"
              />
            </div>
          </transition>
        </h1>
        <div class="flex items-center text-white">
          <Switch
            :model-value="specSimpleUI"
            class="inline-flex"
            @update:model-value="toggleSpecSimpleUI"
          >
            <span class="mr-2">
              {{ $t('shipping.simpleInterface') }}
            </span>
          </Switch>
          <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="320">
            <template v-slot:activator>
              <Icon class="text-blue-500 align-middle">
                {{ icons.ziQuestionSign }}
              </Icon>
            </template>
            <span>
              {{ $t('shipping.simpleInterfaceHint') }}
            </span>
          </Tooltip>
        </div>
        <div class="flex items-center text-gray-300">
          <Comments
            v-if="spec.client"
            :items="spec.comments"
            :spec-id="specId"
            left
            class="text-gray-300 focus:text-gray-100 hover:text-gray-100 transition-colors duration-100 ease-out mr-4"
          />
          <span v-if="spec.client">
            {{ `${$t('shipping.shippingClient')}: ${spec.client.uid} ${spec.client.fullName}` }}
          </span>
          <template v-else>
            <Select
              :model-value="spec.client"
              :placeholder="$t('shipping.shippingClientAdd')"
              v-model:search="clientSearch"
              :items="clients"
              :show-arrow="false"
              flat
              no-filter
              searchable
              return-object
              item-value="id"
              item-text="name"
              solo
              hide-details
              class="inline-flex justify-end ml-2"
              @update:model-value="setSpecClient($event && $event.id)"
              @click:prepend-item="createClient"
            >
              <template v-slot:prepend-item>
                <span class="flex items-center jusitfy-center text-blue-500">
                  <Icon class="mr-1">
                    {{ icons.ziPlusOutline }}
                  </Icon>
                  <span>{{ $t('deals.createSpecDialogAddClient') }}</span>
                </span>
              </template>
            </Select>
          </template>
        </div>
      </div>

      <div class="bg-gray-800 bg-opacity-90 rounded-md px-sm pb-sm">
        <div class="h-12 flex items-center">
          <div class="flex items-center pl-5 sm:pr-sm">
            <Checkbox disabled hide-details class="pt-xs">
              <button disabled class="flex text-blue-500 focus:outline-none cursor-not-allowed">
                <Icon>
                  {{ icons.ziChevronDown }}
                </Icon>
              </button>
            </Checkbox>
          </div>
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-1 sm:px-sm">
            <Icon>
              {{ icons.ziCopy }}
            </Icon>
          </button>
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-1 sm:px-sm">
            <Icon>
              {{ icons.ziDelete }}
            </Icon>
          </button>
          <div class="w-px h-5 bg-gray-400 mx-sm" />
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-sm">
            <Icon>
              {{ icons.ziFilter }}
            </Icon>
          </button>
          <div class="flex-grow" />
          <div class="flex text-gray-200 text-lg overflow-hidden">
            <span v-html="specTitleHtml" :title="specTitleText" class="truncate" />
            <div class="inline-block text-2xl pl-sm pr-3 md:pr-md">
              <button
                v-if="expanded.length === 0"
                :disabled="dataLoading"
                class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="expandAll"
              >
                <Icon :title="$t('action.expandAll')">
                  {{ icons.ziExpand }}
                </Icon>
              </button>
              <button
                v-else
                :disabled="dataLoading"
                class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="collapseAll"
              >
                <Icon :title="$t('action.collapseAll')">
                  {{ icons.ziCollapse }}
                </Icon>
              </button>
            </div>
          </div>
        </div>
        <div v-if="dataLoading" class="flex items-center justify-center h-12 text-gray-200 bg-gray-700 rounded">
          {{ `${$t('action.loading')}...` }}
        </div>
        <div
          v-else
          v-for="(item, i) in items"
          :key="i"
          :class="[item.id ? 'shadow-lg' : 'shadow-xl', { 'mb-1': i + 1 < items.length }]"
        >
          <template v-if="item.id === emptyId">
            <InvoiceHeader
              :role="Role.OWNER"
              :class="{ 'mt-1': !isEmpty }"
              :is-empty="isEmpty"
              create
              @update="createInvoice"
            />
            <ExpandTransition>
              <InvoiceContent
                v-if="isEmpty"
                :currency="spec.currency"
                :invoice="item"
                :active-tab="invoiceActiveTab"
                :scroll-left="invoiceScrollLeft"
                :scroll-invoice-id="invoiceScrollId"
                :role="Role.OWNER"
                :hide-summary="!isInvoiceSummaryVisible"
                create
                @change:tab="setInvoiceActiveTab"
                @change:scrollLeft="setScrollLeft"
                @update:currency="updateSpec({ currency: $event })"
              />
            </ExpandTransition>
          </template>
          <template v-else>
            <InvoiceHeader
              :item="item"
              :is-expanded="expanded.includes(item.id)"
              :role="Role.OWNER"
              @update="updateInvoice"
              @click="expand"
            />
            <ExpandTransition>
              <InvoiceContent
                v-if="expanded.includes(item.id)"
                :currency="spec.currency"
                :invoice="item"
                :active-tab="invoiceActiveTab"
                :scroll-left="invoiceScrollLeft"
                :scroll-invoice-id="invoiceScrollId"
                :role="Role.OWNER"
                :hide-summary="!isInvoiceSummaryVisible"
                @change:tab="setInvoiceActiveTab"
                @change:scrollLeft="setScrollLeft"
                @update:currency="updateSpec({ currency: $event })"
              />
            </ExpandTransition>
          </template>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap lg:flex-nowrap pb-8">
      <div class="w-full flex-grow lg:w-auto pb-8 lg:pb-0 lg:pr-3" style="max-width: 746px;">
        <transition name="slide-y-transition" @leave="el => { el.style.display = 'none' }">
          <SpecShipping
            v-if="isInfoVisible"
            :spec="spec"
            :hide-containers="!isCostVisible"
          >
            <template v-slot:actions>
              <div class="flex items-center justify-between pt-6">
                <select
                  :value="`${container.size}${container.mode}`"
                  :disabled="setContainerSizeLoading"
                  name="container-size"
                  class="simple-select"
                  @change="setContainerSize(container.id, $event)"
                >
                  <option value="_20_DC">
                    <span class="cursor-pointer">
                      20'DC
                    </span>
                  </option>
                  <option value="_40_HC">
                    <span class="cursor-pointer">
                      40'HC
                    </span>
                  </option>
                  <option value="_45_HC">
                    <span class="cursor-pointer">
                      45'HC
                    </span>
                  </option>
                </select>
                <Switch
                  :model-value="spec.shipped"
                  @update:model-value="updateSpec({ shipped: $event })"
                >
                  {{ $t('shipping.setShipped') }}
                </Switch>
              </div>
            </template>
          </SpecShipping>
        </transition>
      </div>
      <div class="w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3">
        <transition name="slide-y-transition" @leave="el => { el.style.display = 'none' }">
          <SpecCost
            v-if="isCostVisible"
            :role="Role.OWNER"
            :spec="spec"
            @update-spec="updateSpec"
          />
        </transition>
      </div>
    </div>

    <transition name="slide-y-transition" @leave="el => { el.style.display = 'none' }">
      <div
        v-if="isSummaryVisible"
        class="pb-8"
      >
        <h4 class="text-white text-xl font-semibold leading-6 mb-4">
          <span class="mr-1">{{ $t('shipping.extraTitle') }}</span>
          <Tooltip placement="top-start" distance="2" skidding="-16" origin="24px 100%" max-width="240">
            <template v-slot:activator>
              <Icon class="text-blue-500 align-middle">
                {{ icons.ziQuestionSign }}
              </Icon>
            </template>
            <span>
              {{ $t('shipping.extraHint') }}
            </span>
          </Tooltip>
        </h4>
        <div class="flex">
          <div class="w-full flex-grow lg:w-auto lg:pr-3">
            <div class="rounded-md bg-gray-700 pt-2 px-sm pb-5">
              <TextArea
                :placeholder="$t('shipping.extraPlaceholder')"
              />
            </div>
          </div>
          <div class="hidden lg:block w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3" />
        </div>
      </div>
    </transition>

    <!-- <div class="flex pt-5">
      <Btn
        outlined
        @click="createInvoice"
      >
        <template v-slot:icon>
          <Icon small class="block align-middle">
            {{ icons.ziPlus }}
          </Icon>
        </template>
        <span>{{ $t('shipping.addInvoice') }}</span>
      </Btn>
    </div> -->

    <transition name="slide-y-transition" @leave="el => { el.style.display = 'none' }">
      <SpecSummary
        v-if="isSummaryVisible"
        :spec="spec"
        :role="Role.OWNER"
      />
    </transition>

    <Modal
      ref="clientDialog"
      v-model="clientDialog"
      :fullscreen="$breakpoint.xs"
      scrollable
      max-width="1110"
      content-class="dialog-full-height scrolling-touch"
    >
      <ClientCard
        ref="clientCard"
        :org-id="orgId"
        create
        is-component
        @close="clientDialog = false"
        @create="setCreateSpecClient"
      />
    </Modal>

  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useResult, useMutation, useApolloClient } from '@vue/apollo-composable'

import {
  ziRefresh,
  ziQuestionSign,
  ziPlusOutline,
  ziChevronDown,
  ziCopy,
  ziDelete,
  ziFilter,
  ziExpand,
  ziCollapse,
} from '../../assets/icons'

import { Role, ProductStatus } from '../../graphql/enums'
import {
  GET_SPEC,
  SEARCH_CLIENTS,
  SEARCH_SUPPLIERS,
  GET_IS_SPEC_SYNC,
  SPEC_SIMPLE_UI_OFF,
} from '../../graphql/queries'
import {
  SET_SPEC_CONTAINER_SIZE,
  SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
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
} from '../../graphql/mutations'
import { getSpecExpandedInvoices, getSpecActiveTab } from '../../graphql/resolvers'

import Icon from '../Base/Icon'
import Progress from '../Base/Progress'
import Tooltip from '../Base/Tooltip'
import Modal from '../Base/Modal'
import TextArea from '../Base/TextArea'
import Select from '../Base/Select'
import Switch from '../Base/Switch'
import Checkbox from '../Base/Checkbox'
import ExpandTransition from '../Base/ExpandTransition'
import InvoiceHeader from '../InvoiceHeader.vue'
import InvoiceContent from '../InvoiceContent.vue'
import SpecSummary from '../SpecSummary.vue'
import ClientCard from '../ClientCard.vue'
import Comments from '../Comments.vue'
import SpecShipping from '../SpecShipping.vue'
import SpecCost from '../SpecCost.vue'

export default {
  name: 'Owner',
  components: {
    Icon,
    Progress,
    Tooltip,
    Modal,
    TextArea,
    Select,
    Switch,
    Checkbox,
    ExpandTransition,
    InvoiceHeader,
    InvoiceContent,
    SpecSummary,
    ClientCard,
    Comments,
    SpecShipping,
    SpecCost,
  },
  props: {
    loading: Boolean,
  },
  setup () {
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

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

    const { result: result3, onResult } = useQuery(GET_SPEC, () => ({
      id: specId,
    }), {
      fetchPolicy: 'cache-only',
    })
    const getSpec = useResult(result3)
    onResult(({ data, loading }) => {
      if (!loading && !isBooted.value) {
        const spec = (data && data.getSpec) || {}
        updateExpandedAndActiveTab(spec)
      }
    })

    const { result: result4, refetch: searchClientsRefetch } = useQuery(SEARCH_CLIENTS, () => ({
      orgId: orgId,
      search: clientSearch.value,
    }), () => ({
      enabled: !!clientSearch.value,
      fetchPolicy: 'cache-and-network',
      debounce: 300,
    }))
    const searchClients = useResult(result4)

    const { result: result5, refetch: searchSuppliersRefetch } = useQuery(SEARCH_SUPPLIERS, () => ({
      orgId: orgId,
      search: supplierSearch.value,
    }), () => ({
      enabled: !!supplierSearch.value,
      fetchPolicy: 'cache-and-network',
      debounce: 300,
    }))
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

    const { mutate: setExpandedInvoicesMutate } = useMutation(SET_SPEC_EXPANDED_INVOICES)
    const setExpandedInvoices = async (ids) => {
      await setExpandedInvoicesMutate({ specId: specId, ids })
    }

    const { mutate: addExpandedInvoicesMutate } = useMutation(ADD_SPEC_EXPANDED_INVOICES)
    const addExpandedInvoices = async (ids) => {
      await addExpandedInvoicesMutate({ specId: specId, ids })
    }

    const { mutate: removeExpandedInvoicesMutate } = useMutation(REMOVE_SPEC_EXPANDED_INVOICES)
    const removeExpandedInvoices = async (ids) => {
      await removeExpandedInvoicesMutate({ specId: specId, ids })
    }

    const { mutate: setInvoiceActiveTabMutate } = useMutation(SET_SPEC_ACTIVE_TAB)
    const setInvoiceActiveTab = async (value) => {
      invoiceActiveTab.value = value
      await setInvoiceActiveTabMutate({ specId: specId, tab: value })
    }

    return {
      icons: {
        ziRefresh,
        ziQuestionSign,
        ziPlusOutline,
        ziChevronDown,
        ziCopy,
        ziDelete,
        ziFilter,
        ziExpand,
        ziCollapse,
      },
      apolloClient,
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
  data () {
    return {
      defaultTab: 1,
      setContainerSizeLoading: false,
      setContainerCustomCapacityLoading: false,
      Role,
      clientDialog: false,
      createLoading: null,
      updateLoading: null,
      deleteLoading: null,
      errors: [],
      supplierDialog: false,
      menuPurchaseDate: {},
      menuShippingDate: {},
      invoiceScrollId: '',
      invoiceScrollLeft: 0,
      // invoiceActiveTab: 0,
    }
  },
  computed: {
    // TODO: need work with containers
    container () {
      const containers = this.spec.containers || []
      return containers[0] || {}
    },
    dataLoading () {
      return this.items.length === 0 && this.loading
    },
    isInvoiceSummaryVisible () {
      return this.specSimpleUIOff || (this.hasInvoiceShippingDate || this.hasFilledProduct || this.hasFilledProductQty)
    },
    isInfoVisible () {
      return this.specSimpleUIOff || (this.hasInvoiceShippingDate || this.hasFilledProduct)
    },
    isCostVisible () {
      return this.specSimpleUIOff || (this.hasFilledProduct)
    },
    isSummaryVisible () {
      return this.specSimpleUIOff || (this.hasInvoiceShippingDate && this.hasFilledProduct)
    },
    hasInvoiceShippingDate () {
      const invoices = this.spec.invoices || []
      return invoices.some(el => el.shippingDate)
    },
    hasFilledProduct () {
      const invoices = this.spec.invoices || []
      return invoices.some(i => {
        const products = i.products || []
        return products.some(el => {
          return el.productStatus === ProductStatus.IN_PROCESSING ||
            el.productStatus === ProductStatus.IN_PRODUCTION ||
            el.productStatus === ProductStatus.IN_STOCK
        })
      })
    },
    hasFilledProductQty () {
      const invoices = this.spec.invoices || []
      return invoices.some(i => {
        const products = i.products || []
        return products.some(el => el.qty)
      })
    },
    specSimpleUI () {
      return !this.specSimpleUIOff
    },
    emptyId () {
      return `empty-${this.spec.id}`
    },
    isEmpty () {
      return this.items.length === 1 && this.items[0].id === this.emptyId
    },
    specTitleText () {
      return `
         ${this.$t('shipping.dealNo')}
         ${this.spec.specNo || '-'} ${this.$t('preposition.from')}
         ${this.spec.createdAt ? this.$d(this.$parseDate(this.spec.createdAt), 'short') : '-'}
      `
    },
    specTitleHtml () {
      return `
        ${this.$t('shipping.dealNo')}
        &nbsp;${this.spec.specNo || '-'} ${this.$t('preposition.from')}
        &nbsp;${this.spec.createdAt ? this.$d(this.$parseDate(this.spec.createdAt), 'short') : '-'}
      `
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
    async setContainerSize (containerId, e) {
      try {
        const val = e.target.value || ''
        const split = val.split('_')
        const inputSize = `_${split[1]}`
        const inputMode = `_${split[2]}`
        if (!containerId) return
        this.setContainerSizeLoading = true
        await this.apolloClient.mutate({
          mutation: SET_SPEC_CONTAINER_SIZE,
          variables: {
            specId: this.spec.id,
            containerId,
            inputSize,
            inputMode,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.setContainerSizeLoading = false
      }
    },
    async setContainerCustomCapacity (containerId, inputCapacity, inputShrink) {
      try {
        if (!containerId) return
        this.setContainerCustomCapacityLoading = true
        await this.apolloClient.mutate({
          mutation: SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
          variables: {
            specId: this.spec.id,
            containerId,
            inputCapacity,
            inputShrink,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.setContainerCustomCapacityLoading = false
      }
    },
    async toggleSpecSimpleUI (value) {
      await this.apolloClient.mutate({
        mutation: SET_SPEC_SIMPLE_UI,
        variables: {
          value: !value,
        },
      })
    },
    setScrollLeft (scrollLeft, invoiceId) {
      this.invoiceScrollId = invoiceId
      this.invoiceScrollLeft = scrollLeft
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
    createClient () {
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
    setCreateSpecClient (client) {
      this.setSpecClient(client.id)
      this.clientDialog = false
      this.searchClientsRefetch()
    },
    setCreatedSupplier (supplier) {
      this.setInvoiceSupplier(this.createSupplierInvoice.id, (supplier && supplier.id))
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
    getClientName (item) {
      return item.fullName || ''
    },
    getSupplierName (item) {
      return item.companyName || ''
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
    async createInvoice (input) {
      try {
        this.createLoading = true
        const variables = {
          specId: this.specId,
        }
        if (input) {
          variables.input = input
        }
        const { data } = await this.apolloClient.mutate({
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
    async updateInvoice (input, invoiceId) {
      try {
        const id = invoiceId
        this.updateLoading = true
        await this.apolloClient.mutate({
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
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async refetchSpec () {
      try {
        this.apolloClient.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: true },
        })
        await this.apolloClient.query({
          query: GET_SPEC,
          variables: {
            id: this.$route.params.specId,
          },
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        this.apolloClient.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: false },
        })
      }
    },
    async updateSpec (input) {
      try {
        this.updateLoading = true
        await this.apolloClient.mutate({
          mutation: UPDATE_SPEC,
          variables: {
            id: this.specId,
            input,
          },
        })
      } catch (error) {
        if (error.message && error.message.includes('GraphQL error: MongoError: WriteConflict')) {
          this.refetchSpec()
        }
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async setSpecClient (clientId) {
      try {
        this.updateLoading = true
        await this.apolloClient.mutate({
          mutation: SET_SPEC_CLIENT,
          variables: {
            specId: this.specId,
            clientId,
          },
        })
      } catch (error) {
        if (error.message && error.message.includes('GraphQL error: MongoError: WriteConflict')) {
          this.refetchSpec()
        }
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async setInvoiceSupplier (invoiceId, supplierId) {
      try {
        this.updateLoading = true
        await this.apolloClient.mutate({
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
</script>
