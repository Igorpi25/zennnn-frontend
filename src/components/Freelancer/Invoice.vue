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
                <td class="text-primary" colspan="2"></td>

                <template v-if="activeTab === 1">
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
  </div>
</template>

<script>
import invoice from '../../mixins/invoice'

import Product from './Product.vue'

export default {
  name: 'FreelancerInvoice',
  components: {
    Product,
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
        { value: 1, text: this.$t('shipping.warehouse'), width: 176 },
        { value: 2, text: this.$t('shipping.description'), width: 175 },
        { value: 3, text: this.$t('shipping.link'), width: 175 },
      ]
    },
    headers () {
      switch (this.activeTab) {
        case 1: return [...this.productHeaders, ...this.storeHeaders]
        case 2: return [...this.productHeaders, ...this.infoHeaders]
        case 3: return [...this.productHeaders, ...this.linkHeaders]
        default: return []
      }
    },
    productHeaders () {
      return [
        { text: '', value: 'status', align: 'left', width: 14, minWidth: 14 },
        { text: this.$t('shipping.productIndexNo'), value: 'index', align: 'left', width: 54, minWidth: 54 },
        { text: this.$t('shipping.photo'), value: 'photo', width: 54, minWidth: 54 },
        { text: this.$t('shipping.name'), value: 'name', width: 164, minWidth: 164 },
        { text: this.$t('shipping.model'), value: 'model', width: 164, minWidth: 164 },
        { text: this.$t('shipping.qty'), value: 'qty', width: 90, minWidth: 90 },
      ]
    },
    storeHeaders () {
      return [
        { text: `${this.$t('shipping.net')}, ${this.$t('measure.kg')}`, value: 'net', width: 167, bgcolor: 'gray-darkest' },
        { text: `${this.$t('shipping.gross')}, ${this.$t('measure.kg')}`, value: 'gross', width: 167, bgcolor: 'gray-darkest' },
        { text: `${this.$t('shipping.packageSize')} (${this.$t('measure.mm')})`, value: 'size', width: 169, bgcolor: 'gray-darkest' },
        { text: '', value: 'action', width: 24, bgcolor: 'gray-darkest' },
      ]
    },
    infoHeaders () {
      return [
        { text: this.$t('shipping.additionalPhoto'), value: 'images', width: 175, bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.additionalInfo'), value: 'description', width: '100%', align: 'left', bgcolor: 'gray-darkest' },
        { text: '', value: 'action', width: 24, bgcolor: 'gray-darkest' },
      ]
    },
    linkHeaders () {
      return [
        { text: this.$t('shipping.linkField'), value: 'url', width: '100%', align: 'left', bgcolor: 'gray-darkest' },
        { text: this.$t('shipping.openLink'), value: 'openLink', width: 70, bgcolor: 'gray-darkest' },
        { text: '', value: 'action', width: 24, bgcolor: 'gray-darkest' },
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
