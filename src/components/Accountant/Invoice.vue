<template>
  <div>
    <div
      v-scroll="onScroll"
      ref="productsTable"
      class="data-table-wrapper"
      @mouseenter="isMouseOver = true"
      @mouseleave="isMouseOver = false"
      @touchstart="isScrollStart = true"
      @touchend="clearScrollEndTimer"
    >
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
                >
                  <li
                    v-for="tab in tabs"
                    :key="tab.value"
                    :style="{ width: tab.width + 'px' }"
                    :class="['tab-item', {'tab-item--active': activeTab === tab.value}]"
                    @click="switchTab(tab.value)"
                  >{{ tab.text }}</li>
                </ul>
              </div>
            </template>
            <template v-slot:items="{ items }">
              <Product
                v-for="(item, index) in items"
                :key="item.id"
                :item="item"
                :index="index"
                :active-tab="activeTab"
                :profit-type="invoiceItem.profitType"
                :profit-for-all="invoiceItem.profitForAll"
                class="items base-accent3"
              />
            </template>

            <template v-slot:footer>
              <tr class="items base-accent3">
                <td colspan="3"></td>
                <td class="text-primary" colspan="3"></td>

                <template v-if="activeTab === 1">
                  <td class="text-gray-light text-right">{{ $t('shipping.total') }}</td>
                  <td class="text-gray-dark text-right">
                    {{ $n(invoiceItem.totalPurchaseAmount || 0, 'fixed') }}
                  </td>
                  <td class="text-gray-dark text-right">{{ $t('shipping.total') }}</td>
                  <td class="text-gray-dark text-right">
                    {{ $n(invoiceItem.totalClientAmount || 0, 'fixed') }}
                  </td>
                  <td colspan="2"></td>
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
      v-if="items"
      :currency="currency"
      :item="invoiceItem"
    />
  </div>
</template>

<script>
import invoice from '../../mixins/invoice'

import Product from './Product.vue'
import InvoiceFooter from './InvoiceFooter.vue'

export default {
  name: 'AccountantInvoice',
  components: {
    Product,
    InvoiceFooter,
  },
  mixins: [invoice],
  props: {
    invoice: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    tabs () {
      return [
        { value: 1, text: this.$t('shipping.prices'), width: 176 },
        { value: 2, text: this.$t('shipping.description'), width: 175 },
        { value: 3, text: this.$t('shipping.link'), width: 175 },
      ]
    },
    headers () {
      switch (this.activeTab) {
        case 1: return [...this.productHeaders, ...this.costHeaders]
        case 2: return [...this.productHeaders, ...this.infoHeaders]
        case 3: return [...this.productHeaders, ...this.linkHeaders]
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
          value: 'purchasePrice',
          width: 138,
          bgcolor: 'gray-darkest',
        },
        { text: this.$t('shipping.obtainAmount'), value: 'purchaseAmount', minWidth: 100, width: '100%', bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.clientCost'), value: 'clientPrice', width: 138, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.obtainAmount'), value: 'clientAmount', minWidth: 100, width: '100%', bgcolor: 'gray-darkest' },
      ]
    },
    infoHeaders () {
      return [
        { text: this.$t('shipping.additionalPhoto'), value: 'images', width: 175, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.additionalInfo'), value: 'description', width: '100%', align: 'left', bgcolor: 'gray-darkest' },
        { text: '', value: 'action', width: 20, bgcolor: 'gray-darkest' },
      ]
    },
    linkHeaders () {
      return [
        { text: this.$t('shipping.linkField'), value: 'url', width: '100%', align: 'left', bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.openLink'), value: 'openLink', width: 70, bgcolor: 'gray-darkest' },
      ]
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
  padding-left:  1px;
}
.tab-item--active {
  @apply bg-gray-darkest;
  color: #ababab
}
</style>
