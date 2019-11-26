<template>
  <div>
    <div class="data-table-wrapper">
      <div>
        <div class="flex">
          <DataTable
            :headers="headers"
            :items="items"
            table-width="100%"
            table-class="table-fixed"
            thead-class="text-accent2"
          >
            <template v-slot:top>
              <div class="flex">
                <div
                  :style="{
                    width: fixedHeadersWidth + 'px',
                    background: 'linear-gradient(to top, #1c1c1c 50%, #1c1c1c 100%)'
                  }"
                ></div>
                <ul
                  class="tabs"
                  @click="switchTab"
                >
                  <li
                    v-for="tab in tabs"
                    :key="tab.value"
                    :value="tab.value"
                    :style="{ width: tab.width + 'px' }"
                    :class="['tab-item', {'tab-item--active': activeTab === tab.value}]"
                  >{{ tab.text }}</li>
                </ul>
              </div>
            </template>
            <template v-slot:items="{ items }">
              <tr
                v-for="(item, index) in items"
                :key="item.id"
                class="items base-accent3"
              >
                <td class="relative p-0">
                  <span
                    :class="[
                      'status-indicator__bordered',
                      item.status === ProductStatus.IN_PRODUCTION
                        ? 'status-indicator__bordered--orange' : item.status === ProductStatus.IN_STOCK
                          ? 'status-indicator__bordered--green' : 'status-indicator__bordered--pink'
                    ]"
                  >
                  </span>
                </td>
                <td class="text-gray-lighter text-xs leading-none py-2 align-top">
                  {{ index + 1 }}
                </td>
                <td class="text-primary text-center">
                  <img style="width:35px;height:35px">
                </td>
                <td>
                  <Editable
                    :value="item.name"
                    :placeholder="$t('shipping.name')"
                    @input="updateProduct(item.id, { name: $event })"
                  />
                </td>
                <td>
                  <Editable
                    :value="item.article"
                    :placeholder="$t('shipping.model')"
                    @input="updateProduct(item.id, { article: $event })"
                  />
                </td>
                <td>
                  <Editable
                    type="number"
                    inputmode="numeric"
                    :value="item.qty"
                    :placeholder="$t('placeholder.emptyNumber')"
                    @input="updateProduct({ qty: $event })"
                  />
                </td>

                <template v-if="activeTab === 1">
                  <td v-if="isInvoiceProfitTypeMargin || !invoiceItem.profitForAll">
                    <Editable
                      type="number"
                      inputmode="decimal"
                      :value="item.cost && item.cost.obtainPrice"
                      :placeholder="$t('placeholder.emptyNumber')"
                      @input="updateProduct({
                        id: item.id,
                        cost: { obtainPrice: $event }
                      })"
                    />
                  </td>
                  <td v-else class="text-right">
                    {{ item.cost && item.cost.obtainPrice }}
                  </td>
                  <td class="text-right">
                    {{ item.cost && item.cost.obtainAmount }}
                  </td>
                  <td v-if="isInvoiceProfitTypeCommission || !invoiceItem.profitForAll">
                    <Editable
                      type="number"
                      inputmode="decimal"
                      :value="item.cost && item.cost.sellingPrice"
                      :placeholder="$t('placeholder.emptyNumber')"
                      @input="updateProduct({
                        id: item.id,
                        cost: { sellingPrice: $event }
                      })"
                    />
                  </td>
                  <td
                    v-else
                    class="text-right"
                  >{{ item.cost && item.cost.sellingPrice }}</td>
                  <td class="text-right">
                    {{ item.cost && item.cost.sellingAmount }}
                  </td>
                </template>

                <template v-else-if="activeTab === 2">
                  <td>
                    <Editable
                      type="number"
                      inputmode="decimal"
                      :placeholder="$t('placeholder.emptyNumber')"
                      :value="item.store && item.store.net"
                      @input="updateProduct({
                        id: item.id,
                        store: { net: $event }
                      })"
                    />
                  </td>
                  <td>
                    <Editable
                      type="number"
                      inputmode="decimal"
                      :placeholder="$t('placeholder.emptyNumber')"
                      :value="item.store && item.store.gross"
                      @input="updateProduct({
                        id: item.id,
                        store: { gross: $event }
                      })"
                    />
                  </td>
                  <td class="flex items-center" style="line-height:35px">
                    <Editable
                      type="number"
                      inputmode="decimal"
                      :placeholder="$t('placeholder.emptyNumber')"
                      :value="item.store && item.store.width"
                      @input="updateProduct({
                        id: item.id,
                        store: { width: $event }
                      })"
                    />
                    <Editable
                      type="number"
                      inputmode="decimal"
                      :placeholder="$t('placeholder.emptyNumber')"
                      :value="item.store && item.store.height"
                      @input="updateProduct({
                        id: item.id,
                        store: { height: $event }
                      })"
                    />
                    <Editable
                      type="number"
                      inputmode="decimal"
                      :placeholder="$t('placeholder.emptyNumber')"
                      :value="item.store && item.store.length"
                      @input="updateProduct({
                        id: item.id,
                        store: { length: $event }
                      })"
                    />
                  </td>
                  <td>
                    <Editable
                      type="number"
                      inputmode="numeric"
                      :placeholder="$t('placeholder.emptyNumber')"
                      :value="item.store && item.store.pkgQty"
                      @input="updateProduct({
                        id: item.id,
                        store: { pkgQty: $event }
                      })"
                    />
                  </td>
                  <td>
                    <Editable
                      type="number"
                      inputmode="numeric"
                      :placeholder="$t('placeholder.emptyNumber')"
                      :value="item.store && item.store.pkgNo"
                      @input="updateProduct({
                        id: item.id,
                        store: { pkgNo: $event }
                      })"
                    />
                  </td>
                  <td class="text-center text-primary">
                    <Checkbox
                      :value="item.store && item.store.atWhouse"
                      hide-details
                      vertical-align
                      horizontal-align
                      @input="updateProduct({
                        id: item.id,
                        store: { atWhouse: $event }
                      })"
                    />
                  </td>
                </template>

                <template v-else-if="activeTab === 3">
                  <td class="text-right">
                    <div v-if="item.info && item.info.images && item.info.images.length > 0">
                      {{ item.info.images }}
                    </div>
                  </td>
                  <td class="text-left">
                    <Editable
                      :value="item.info.description"
                      :placeholder="$t('placeholder.emptyText')"
                      @input="updateProduct({
                        id: item.id,
                        info: { description: $event }
                      })"
                    />
                  </td>
                </template>

                <template v-else-if="activeTab === 4">
                  <td class="text-left text-primary">
                    <Editable
                      :value="item.link && item.link.url"
                      :placeholder="$t('placeholder.emptyText')"
                      @input="updateProduct({
                        id: item.id,
                        link: { url: $event }
                      })"
                    />
                  </td>
                  <td class="text-right">
                    <i><a href="#"></a></i>
                  </td>
                </template>
                <td
                  class="text-gray-lighter text-center cursor-pointer px-0"
                  @click="deleteProduct(item.id)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" role="img" aria-hidden="true" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </td>
              </tr>
            </template>

            <template v-slot:footer>
              <tr class="items base-accent3">
                <td colspan="3"></td>
                <td class="text-primary" colspan="2">
                  <div class="flex">
                    <Button
                      text
                      class="flex"
                      @click.prevent="createProduct"
                    >
                      <template v-slot:icon>
                        <Icon size="20">{{ icons.mdiPlusCircleOutline }}</Icon>
                      </template>
                      <span>{{ $t('shipping.addProduct') }}</span>
                    </Button>
                  </div>
                </td>

                <template v-if="activeTab === 1">
                  <td class="text-gray-light text-right">{{ $t('shipping.total') }}</td>
                  <td class="text-gray-dark text-right">
                    {{ $n(invoiceItem.totalObtainAmount, 'formatted') }}
                  </td>
                  <td class="text-gray-dark text-right">{{ $t('shipping.total') }}</td>
                  <td class="text-gray-dark text-right">
                    {{ $n(invoiceItem.totalSellingAmount, 'formatted') }}
                  </td>
                  <td colspan="2"></td>
                </template>

                <template v-else-if="activeTab === 2">
                  <td class="text-gray-dark">{{ $t('shipping.total') }}</td>
                  <td class="text-gray-dark text-center">
                    {{ $n(invoiceItem.totalNet, 'formatted') }} <span class="text-gray-dark">{{ $t('measure.kg') }}</span>
                  </td>
                  <td class="text-gray-dark text-center">
                    {{ $n(invoiceItem.totalGross, 'formatted') }} <span class="text-gray-dark">{{ $t('measure.kg') }}</span>
                  </td>
                  <td class="text-gray-dark text-center">
                    {{ $n(invoiceItem.totalCapacity, 'formatted') }} <span class="text-gray-dark">{{ $t('measure.m') }}<sup>3</sup></span>
                  </td>
                  <td class="text-gray-dark text-center" colspan="3">
                    {{ $n(invoiceItem.totalPkgQty, 'formatted') }} <span class="text-gray-dark">{{ $t('measure.pkg') }}</span>
                  </td>
                  <td></td>
                </template>

                <template v-else>
                  <td colspan="4"></td>
                </template>

              </tr>
            </template>

          </DataTable>
        </div>
      </div>
    </div>
    <InvoiceFooter
      v-if="items && activeTab === 1"
      :item="invoiceItem"
    />
  </div>
</template>

<script>
import { mdiPlusCircleOutline } from '@mdi/js'

import {
  ProductStatus,
  InvoiceProfitType,
} from '@/graphql/enums'
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '@/graphql/mutations'

import { confirmDialog } from '@/util/helpers'

import InvoiceFooter from '@/components/InvoiceFooter.vue'

export default {
  name: 'Invoice',
  components: {
    InvoiceFooter,
  },
  props: {
    invoice: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      ProductStatus,
      isBooted: false,
      createLoading: null,
      updateLoading: null,
      deleteLoading: null,
      activeTab: 1,
      errors: [],
      icons: {
        mdiPlusCircleOutline,
      },
    }
  },
  computed: {
    fixedHeadersWidth () {
      return this.productHeaders.reduce((acc, curr) => {
        return acc + (curr.width || 0)
      }, 0)
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
    tabs () {
      return [
        { value: 1, text: this.$t('shipping.prices'), width: 130 },
        { value: 2, text: this.$t('shipping.warehouse'), width: 130 },
        { value: 3, text: this.$t('shipping.description'), width: 130 },
        { value: 4, text: this.$t('shipping.link'), width: 130 },
      ]
    },
    headers () {
      switch (this.activeTab) {
        case 1: return [...this.productHeaders, ...this.costHeaders]
        case 2: return [...this.productHeaders, ...this.storeHeaders]
        case 3: return [...this.productHeaders, ...this.infoHeaders]
        case 4: return [...this.productHeaders, ...this.linkHeaders]
        default: return []
      }
    },
    productHeaders () {
      return [
        { text: '', value: 'status', align: 'left', width: 14 },
        { text: this.$t('shipping.productIndexNo'), value: 'index', align: 'left', width: 54 },
        { text: this.$t('shipping.photo'), value: 'photo', width: 55 },
        { text: this.$t('shipping.name'), value: 'name', width: 165 },
        { text: this.$t('shipping.model'), value: 'model', width: 165 },
        { text: this.$t('shipping.qty'), value: 'qty', width: 110 },
      ]
    },
    costHeaders () {
      return [
        {
          text: this.isInvoiceProfitTypeMargin
            ? this.$t('shipping.costPrice') : this.$t('shipping.purchaseCost'),
          value: 'obtainPrice',
          width: 138,
          bgcolor: 'gray-darkest',
        },
        { text: this.$t('shipping.obtainAmount'), value: 'obtainAmount', minWidth: 100, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.clientCost'), value: 'sellingPrice', width: 138, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.obtainAmount'), value: 'sellingAmount', minWidth: 100, bgcolor: 'gray-darkest' },
        { text: '', value: 'action', width: 20, bgcolor: 'gray-darkest' },
      ]
    },
    storeHeaders () {
      return [
        { text: `${this.$t('shipping.net')}, ${this.$t('measure.kg')}`, value: 'net', width: 75, bgcolor: 'gray-darkest' },
        { text: `${this.$t('shipping.gross')}, ${this.$t('measure.kg')}`, value: 'gross', width: 80, bgcolor: 'gray-darkest' },
        { text: `${this.$t('shipping.packageSize')} (${this.$t('measure.mm')})`, value: 'size', width: 148, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.packageQty'), value: 'pkgQty', width: 65, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.packageNo'), value: 'pkgNo', width: 65, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.atWhouse'), value: 'atWhouse', minWidth: 75, bgcolor: 'gray-darkest' },
        { text: '', value: 'action', width: 20, bgcolor: 'gray-darkest' },
      ]
    },
    infoHeaders () {
      return [
        { text: this.$t('shipping.additionalPhoto'), value: 'images', width: 85, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.additionalInfo'), value: 'description', align: 'left', bgcolor: 'gray-darkest' },
        { text: '', value: 'action', width: 20, bgcolor: 'gray-darkest' },
      ]
    },
    linkHeaders () {
      return [
        { text: this.$t('shipping.linkField'), value: 'url', align: 'left', bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.openLink'), value: 'openLink', width: 70, bgcolor: 'gray-darkest' },
        { text: '', value: 'action', width: 20, bgcolor: 'gray-darkest' },
      ]
    },
  },
  methods: {
    switchTab (event) {
      this.activeTab = event.target.value
    },
    async createProduct () {
      try {
        this.createLoading = true
        const input = {
          invoiceId: this.invoice.id,
        }
        await this.$apollo.mutate({
          mutation: CREATE_PRODUCT,
          variables: { input },
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
        this.createLoading = null
      }
    },
    async updateProduct (id, input) {
      try {
        this.updateLoading = input.id
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: { id, input },
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
        if (error && error.errors && error.errors.length > 0) {
          this.errors = error.errors
        }
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'UpdateProductError',
        //   attributes: {
        //     error: error
        //   }
        // })
      } finally {
        this.updateLoading = null
      }
    },
    async deleteProduct (id) {
      try {
        const msg = this.$t('alert.removeProduct')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        await this.$apollo.mutate({
          mutation: DELETE_PRODUCT,
          variables: { id },
        })
      } catch (error) {
        if (error === 'not_confirmed') return
        this.errors = error.errors || []
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'DeleteProductError',
        //   attributes: {
        //     error: error
        //   }
        // })
      } finally {
        this.deleteLoading = null
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
/* table tabs */
.tabs {
  height: 26px;
  display: flex;
  color: #434343
}

.tab-item {
  @apply flex items-center justify-center;
  @apply rounded-t-lg text-sm cursor-pointer;
  bacground-color: #252525;
}
.tab-item:not(:first-child) {
  margin-left:  1px;
}
.tab-item--active {
  @apply bg-gray-darkest;
  color: #ababab
}
</style>
