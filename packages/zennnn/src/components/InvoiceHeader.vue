<template>
  <div
    :class="[
      'md:h-12 relative flex items-center mx-auto w-full select-none py-2 md:py-0 px-3 md:pl-5 md:pr-3.5',
      'rounded-t text-right',
      { 'rounded-b': !isExpanded },
      create && !isEmpty ? 'bg-gray-700' : 'bg-gray-500',
    ]"
  >
    <Checkbox
      v-if="isOwnerOrManager"
      hide-details
      disabled
      class="bg-gray-800 border-gray-800 mr-3 md:mr-5"
    />
    <div
      :class="[
        'flex-shrink-0 w-3 h-3 rounded-full mr-3 md:mr-5',
        invoiceStatusColor,
      ]"
    />
    <div
      v-if="isOwnerOrManager"
      class="flex flex-wrap md:flex-nowrap lg:flex-grow w-full md:w-auto"
    >
      <TextField
        :model-value="item.invoiceNo"
        :debounce="250"
        :placeholder="$t('shipping.invoiceNo')"
        :lazy="create"
        solo
        class="
          w-full
          sm:w-auto
          lg:w-32 lg:flex-shrink-0
          sm:flex-grow
          md:flex-grow-0
          mb-2
          md:mb-0
          mr-2
        "
        @update:model-value="$emit('update', { invoiceNo: $event }, item.id)"
      >
        <template v-slot:prepend>
          <svg
            class="mr-2"
            width="18"
            height="14"
            viewBox="0 0 18 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.4974 1.06834C12.5574 1.06834 11.1174 2.38834 11.1174 4.60834C11.1174 6.80834 12.5574 8.04834 14.4574 8.04834C16.2174 8.04834 17.8174 7.00834 17.8174 4.50834C17.8174 2.46834 16.5574 1.06834 14.4974 1.06834ZM14.4574 2.34834C15.4574 2.34834 15.8774 3.48834 15.8774 4.56834C15.8774 5.84834 15.3774 6.78834 14.4774 6.78834C13.6774 6.78834 13.0574 5.84834 13.0574 4.60834C13.0574 3.54834 13.4974 2.34834 14.4574 2.34834ZM17.2774 10.1683V8.88834H11.6774V10.1683H17.2774ZM2.99736 13.7683V9.28834C2.99736 7.04834 2.95736 5.34834 2.87736 3.68834H2.93736C3.49736 5.14834 4.15736 6.72834 4.81736 8.12834L7.59736 13.7683H10.0774V0.76834H7.93736V5.16834C7.93736 7.22834 7.99736 8.90834 8.13736 10.6283L8.11736 10.6483C7.57736 9.26834 6.91736 7.70834 6.23736 6.28834L3.53736 0.76834H0.857356V13.7683H2.99736Z"
              fill="#585858"
            />
          </svg>
        </template>
      </TextField>
      <DatePicker
        :model-value="item.purchaseDate"
        @update:model-value="$emit('update', { purchaseDate: $event }, item.id)"
      >
        <template v-slot:activator>
          <div class="text-left">
            <div>
              <TextField
                :model-value="
                  item.purchaseDate
                    ? $d($parseDate(item.purchaseDate), 'short')
                    : null
                "
                :placeholder="$t('shipping.purchaseDate')"
                solo
                readonly
                class="w-full sm:w-36 mb-2 md:mb-0 mr-2"
              >
                <template v-slot:prepend>
                  <Icon class="text-gray-300 mr-2">
                    {{ icons.ziCalendar }}
                  </Icon>
                </template>
              </TextField>
            </div>
          </div>
        </template>
      </DatePicker>
      <!-- TODO on real api, need send id -->
      <Select
        :model-value="item.supplier"
        :placeholder="$t('shipping.supplierName')"
        v-model:search="supplierSearch"
        :items="suppliers"
        :show-arrow="false"
        solo
        no-filter
        searchable
        item-value="id"
        item-text="companyName"
        return-object
        class="
          w-full
          sm:w-auto
          xl:w-full
          lg:flex-shrink-0
          sm:flex-grow
          md:flex-grow-0
          lg:flex-grow
          xl:flex-grow-0
          max-w-sm
          mb-2
          md:mb-0
          mr-2
        "
        @update:model-value="updateSupplier(item.id, $event && $event.id)"
      >
        <template v-slot:prepend>
          <button
            class="
              focus:outline-none
              select-none
              text-gray-300
              hover:text-gray-100
              focus:text-gray-100
              mr-2
            "
            @click="openCreateSupplierDialog(item)"
          >
            <Icon class="align-middle">
              {{ icons.ziPlusOutline }}
            </Icon>
          </button>
        </template>
      </Select>
      <DatePicker
        :model-value="item.shippingDate"
        @update:model-value="$emit('update', { shippingDate: $event }, item.id)"
      >
        <template v-slot:activator>
          <div class="text-left">
            <div>
              <TextField
                :model-value="
                  item.shippingDate
                    ? $d($parseDate(item.shippingDate), 'short')
                    : null
                "
                :placeholder="$t('shipping.shippingDate')"
                solo
                readonly
                class="lg:flex-shrink-0 w-full sm:w-36 mr-2"
              >
                <template v-slot:prepend>
                  <Icon class="text-gray-300 mr-2">
                    {{ icons.ziCalendar }}
                  </Icon>
                </template>
              </TextField>
            </div>
          </div>
        </template>
      </DatePicker>
    </div>
    <div v-else class="text-gray-100">
      <span class="mr-1">{{ item.invoiceNo || '-' }}</span>
      <span class="mr-1">{{ $t('preposition.from') }}</span
      >&nbsp;
      <span class="mr-1">{{
        item.purchaseDate ? $d($parseDate(item.purchaseDate), 'short') : '-'
      }}</span
      >&nbsp;
      <span v-if="item.supplier">
        <span> / </span>
        {{ item.supplier.companyName || '' }}
      </span>
    </div>
    <div class="flex-grow" />
    <div v-if="hasNewComments" class="px-2 lg:pl-4 lg:pr-6">
      <div class="w-2 h-2 rounded-full bg-purple-500" />
    </div>
    <button
      v-if="!create"
      class="
        text-blue-500
        hover:text-blue-400
        focus:text-blue-400 focus:outline-none
      "
      @click="$emit('click', item.id)"
    >
      <Icon
        class="transition-transform"
        :title="isExpanded ? $t('action.collapse') : $t('action.expand')"
        :class="{ 'rotate-90': isExpanded }"
      >
        {{ icons.ziChevronRight }}
      </Icon>
    </button>
    <div v-else class="w-6 h-6" />
    <Modal
      v-if="isOwnerOrManager"
      ref="supplierDialog"
      v-model="supplierDialog"
      :fullscreen="$breakpoint.smAndDown.value"
      scrollable
      max-width="1110"
      content-class="dialog-full-height scrolling-touch"
    >
      <SupplierForm
        ref="supplierForm"
        :org-id="orgId"
        create
        is-component
        @close="supplierDialog = false"
        @create="setCreatedSupplier"
      />
    </Modal>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'

import { ziCalendar, ziPlusOutline, ziChevronRight } from '@zennnn/icons'
import {
  Icon,
  Modal,
  Select,
  Checkbox,
  TextField,
  DatePicker,
} from '@zennnn/core'

import { InvoiceStatus, Role } from '../graphql/enums'
import { SEARCH_SUPPLIERS } from '../graphql/queries'
import { SET_INVOICE_SUPPLIER } from '../graphql/mutations'

import SupplierForm from '@/components/supplier/Form'

export default {
  name: 'InvoiceHeader',
  components: {
    Icon,
    Modal,
    Select,
    Checkbox,
    TextField,
    DatePicker,
    SupplierForm,
  },
  props: {
    item: {
      type: [Array, Object],
      default: () => ({}),
    },
    isExpanded: Boolean,
    role: {
      type: String,
      required: true,
    },
    create: Boolean,
    isEmpty: Boolean,
  },
  emits: ['update', 'click'],
  setup() {
    const route = useRoute()
    const orgId = route.params.orgId
    const supplierSearch = ref('')

    const { result, refetch: searchSuppliersRefetch } = useQuery(
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
    const searchSuppliers = useResult(result)

    const { mutate: setInvoiceSupplierMutate } =
      useMutation(SET_INVOICE_SUPPLIER)

    return {
      icons: {
        ziCalendar,
        ziPlusOutline,
        ziChevronRight,
      },
      orgId,
      supplierSearch,
      searchSuppliers,
      searchSuppliersRefetch,
      setInvoiceSupplierMutate,
    }
  },
  data() {
    return {
      supplierDialog: false,
      createSupplierInvoice: null,
      invoiceSupplierSetLoading: false,
    }
  },
  computed: {
    hasNewComments() {
      if (!this.isOwnerOrManager && this.create && this.isEmpty) return false
      const products = this.item.products || []
      return products.some((item) => {
        const comments = item.comments || []
        return comments.some((c) => !c.viewed)
      })
    },
    isOwnerOrManager() {
      return this.role === Role.OWNER || this.role === Role.OWNER
    },
    invoiceStatusColor() {
      return this.item.invoiceStatus === InvoiceStatus.IN_STOCK
        ? 'bg-green-500'
        : this.item.invoiceStatus === InvoiceStatus.IN_PRODUCTION
        ? 'bg-yellow-500'
        : this.item.invoiceStatus === InvoiceStatus.IN_PROCESSING
        ? 'bg-pink-500'
        : 'bg-gray-800'
    },
    suppliers() {
      return (this.searchSuppliers && this.searchSuppliers.items) || []
    },
  },
  methods: {
    onHeaderClick(e) {
      if (e.target !== this.$el) return
      this.$emit('click', this.item.id)
    },
    openCreateSupplierDialog(item) {
      this.createSupplierInvoice = item
      this.supplierDialog = true
    },
    setCreatedSupplier(supplier) {
      this.updateSupplier(
        this.createSupplierInvoice.id,
        supplier && supplier.id
      )
      this.supplierDialog = false
      this.createSupplierInvoice = null
      this.searchSuppliersRefetch()
      setTimeout(() => {
        this.$refs.supplierForm.reset()
        if (this.$refs.supplierDialog.$refs.dialog) {
          this.$refs.supplierDialog.$refs.dialog.scrollTop = 0
        }
      }, 200)
    },
    updateSupplier(invoiceId, supplierId) {
      if (this.create || this.isEmpty) {
        this.$emit('update', { supplier: supplierId }, invoiceId)
      } else {
        this.setInvoiceSupplier(invoiceId, supplierId)
      }
    },
    async setInvoiceSupplier(invoiceId, supplierId) {
      try {
        this.invoiceSupplierSetLoading = true
        await this.setInvoiceSupplierMutate({
          invoiceId,
          supplierId,
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.invoiceSupplierSetLoading = false
      }
    },
  },
}
</script>
