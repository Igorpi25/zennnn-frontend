<template>
  <div>
    <div
      v-scroll="onScroll"
      ref="productsTable"
      class="overflow-x-auto overflow-scroll-touch"
      @mouseenter="isMouseOver = true"
      @mouseleave="isMouseOver = false"
      @touchstart="isScrollStart = true"
      @touchend="clearScrollEndTimer"
    >
      <div class="flex pt-1">
        <DataTable
          :headers="headers"
          :items="items"
          table-width="100%"
          class="relative"
          table-class="table-fixed"
          thead-class="text-sm"
          flat
        >
          <template v-slot:top>
            <div class="flex">
              <div
                class="flex-shrink-0"
                :style="{
                  width: fixedHeadersWidth + 'px',
                }"
              />
              <div class="h-11 flex-grow flex overflow-x-auto overflow-scroll-touch relative z-1 -mb-px">
                <div
                  v-for="(tab, i) in tabs"
                  :aria-selected="activeTab === tab.value"
                  :key="tab.value"
                  :class="[
                    'flex items-center justify-center rounded-t bg-gray-600 px-2',
                    'select-none whitespace-no-wrap cursor-pointer',
                    'transition-colors duration-100 ease-out',
                    { 'mr-1': i + 1 < tabs.length },
                    tab.disabled ? 'pointer-events-none opacity-40' : 'focus:outline-none focus:text-white hover:text-white',
                    tab.class || null,
                    activeTab === tab.value ? 'text-white' : 'bg-opacity-50 text-gray-200',
                  ]"
                  :style="{ width: tab.width + 'px' }"
                  :title="tab.title || null"
                  :role="tab.disabled ? null : 'tab'"
                  :tabindex="tab.disabled ? null : 0"
                  @click="switchTab(tab.value)"
                  @keydown.enter.exact="switchTab(tab.value)"
                >
                  <i
                    v-if="tab.icon"
                    :class="['relative text-2xl', tab.icon]"
                  >
                    <div
                      v-if="tab.value === 5 && hasNewComments"
                      :class="[
                        'absolute top-0 right-0 -mt-xs -mr-1 w-sm h-sm rounded-full border-2 bg-gray-600 border-gray-600 transition-colors duration-100 ease-out',
                        activeTab === tab.value ? 'bg-gray-600' : 'border-gray-700',
                      ]"
                    >
                      <div class="w-full h-full bg-purple-500 rounded-full" />
                    </div>
                  </i>
                  <span>
                    {{ tab.text }}
                  </span>
                  <select
                    v-if="tab.value === 1 && isOwnerOrManager"
                    :value="currency"
                    :disabled="activeTab !== tab.value"
                    :class="[
                      'simple-select text-sm ml-px',
                      { 'text-gray-100': activeTab === tab.value },
                      { 'pointer-events-none': activeTab !== tab.value }
                    ]"
                    @change="$emit('update:currency', $event.target.value)"
                  >
                    <option
                      v-for="curr of currencies"
                      :key="curr.value"
                      :value="curr.value"
                    >
                      {{ curr.text }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:items="{ items }">
            <template
              v-for="(item, index) in items"
            >
              <InvoiceProduct
                v-if="item.id === `empty-${invoice.id}` && isOwnerOrManager"
                :key="index"
                :index="items.length"
                :active-tab="activeTab"
                :profit-type="invoiceItem.profitType"
                :profit-for-all="invoiceItem.profitForAll"
                :role="role"
                create
                @create="addProduct"
              />
              <InvoiceProduct
                v-else
                :key="index"
                :item="item"
                :index="index + 1"
                :active-tab="activeTab"
                :profit-type="invoiceItem.profitType"
                :profit-for-all="invoiceItem.profitForAll"
                :role="role"
              />
            </template>
          </template>

          <template v-if="!create" v-slot:footer>
            <tr>
              <td colspan="4">
                <div
                  :style="{
                    background: 'linear-gradient(180deg, #1E1E1E 0%, rgba(30, 30, 30, 0) 100%)',
                    height: '88px',
                  }"
                  class="absolute inset-x-0 top-0 pointer-events-none opacity-50 -mt-1"
                />
                <div
                  :style="{
                    background: 'linear-gradient(180deg, #1E1E1E 0%, rgba(30, 30, 30, 0) 100%)',
                    transform: 'rotate(180deg)',
                  }"
                  class="h-12 absolute inset-x-0 bottom-0 pointer-events-none opacity-50"
                />
              </td>
              <td :colspan="activeTab === 2 ? 2 : 3">
                <!-- <div class="flex">
                  <Button
                    outlined
                    borderless
                    @click.prevent="createProduct"
                  >
                    <template v-slot:icon>
                      <i class="zi-plus text-xl block align-middle" />
                    </template>
                    <span>{{ $t('shipping.addProduct') }}</span>
                  </Button>
                </div> -->
              </td>

              <template v-if="activeTab === 1">
                <td class="text-gray-300 text-right px-sm">
                  <span class="relative z-1">
                    {{ $t('shipping.total') }}
                  </span>
                </td>
                <td class="text-right px-sm">
                  <span class="relative z-1">
                    {{ $n(invoiceItem.totalPurchaseAmount || 0, 'fixed') }}
                  </span>
                </td>
                <td class="text-gray-300 text-right px-sm">
                  <span class="relative z-1">
                    {{ $t('shipping.total') }}
                  </span>
                </td>
                <td class="text-right px-sm">
                  <span class="relative z-1">
                    {{ $n(invoiceItem.totalClientAmount || 0, 'fixed') }}
                  </span>
                </td>
                <td colspan="2"></td>
              </template>

              <template v-else-if="activeTab === 2">
                <td class="text-gray-300 text-right">
                  <span class="relative z-1">
                    {{ $t('shipping.total') }}
                  </span>
                </td>
                <td class="text-right pr-sm">
                  <span class="relative z-1">
                    <span>{{ $n(invoiceItem.totalNet) }}</span>
                    <span class="text-gray-300 absolute right-0 transform translate-x-full pl-1">{{ $t('measure.kg') }}</span>
                  </span>
                </td>
                <td class="text-right pr-sm">
                  <span class="relative z-1">
                    <span>{{ $n(invoiceItem.totalGross) }}</span>
                    <span class="text-gray-300 absolute right-0 transform translate-x-full pl-1">{{ $t('measure.kg') }}</span>
                  </span>
                </td>
                <td class="text-center">
                  <span class="relative z-1">
                    {{ $n(invoiceItem.totalVolume) }} <span class="text-gray-300">{{ $t('measure.m3') }}</span>
                  </span>
                </td>
                <td class="text-right pr-sm">
                  <span class="relative z-1">
                    {{ $n(invoiceItem.totalPkgQty) }}
                  </span>
                </td>
                <td class="text-left" colspan="2">
                  <span class="relative z-1">
                    <span class="text-gray-300">{{ $t('measure.pkg') }}</span>
                  </span>
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
    <InvoiceSummary
      v-if="isAmountVisible && items && !create && !hideSummary"
      :role="role"
      :currency="currency"
      :item="invoiceItem"
    />
  </div>
</template>

<script>
import invoice from '../mixins/invoice'

import InvoiceProduct from './InvoiceProduct.vue'
import InvoiceSummary from './InvoiceSummary.vue'
import { Role } from '../graphql/enums'

export default {
  name: 'InvoiceContent',
  components: {
    InvoiceProduct,
    InvoiceSummary,
  },
  mixins: [invoice],
  props: {
    invoice: {
      type: Object,
      default: () => ({}),
    },
    role: {
      type: String,
      required: true,
    },
    create: Boolean,
    hideSummary: Boolean,
  },
  computed: {
    hasNewComments () {
      const products = this.invoice.products || []
      return products.some(item => {
        const comments = item.comments || []
        return comments.some(c => !c.viewed)
      })
    },
    isAmountVisible () {
      return this.role === Role.OWNER || this.role === Role.MANAGER || this.role === Role.ACCOUNTANT
    },
    isOwnerOrManager () {
      return this.role === Role.OWNER || this.role === Role.MANAGER
    },
    tabs () {
      return this.isOwnerOrManager
        ? [
          { value: 1, text: this.$t('shipping.prices'), width: 130, class: 'flex-1' },
          { value: 2, text: this.$t('shipping.warehouse'), width: 130, class: 'flex-1' },
          { value: 3, text: this.$t('shipping.description'), width: 130, class: 'flex-1' },
          { value: 4, title: this.$t('shipping.link'), icon: 'zi-link', width: 46 },
          { value: 5, icon: 'zi-chat', width: 46 },
          { value: 6, icon: 'zi-qc', width: 46, disabled: true },
        ]
        : this.role === Role.ACCOUNTANT
          ? [
            { value: 1, text: this.$t('shipping.prices'), width: 130 },
            { value: 3, text: this.$t('shipping.description'), width: 130 },
            { value: 4, title: this.$t('shipping.link'), icon: 'zi-link', width: 46 },
          ]
          : this.role === Role.WAREHOUSEMAN || this.role === Role.FREELANCER
            ? [
              { value: 2, text: this.$t('shipping.warehouse'), width: 130 },
              { value: 3, text: this.$t('shipping.description'), width: 130 },
              { value: 4, title: this.$t('shipping.link'), icon: 'zi-link', width: 46 },
            ]
            : []
    },
    headers () {
      switch (this.activeTab) {
        case 1: return [...this.productHeaders, ...this.costHeaders]
        case 2: return [...this.productHeaders, ...this.storeHeaders]
        case 3: return [...this.productHeaders, ...this.infoHeaders]
        case 4: return [...this.productHeaders, ...this.linkHeaders]
        case 5: return [...this.productHeaders, ...this.chatHeaders]
        default: return []
      }
    },
    productHeaders () {
      return [
        { text: '', value: 'status', align: 'left', width: 16, minWidth: 16 },
        { text: this.$t('shipping.productIndexNo'), value: 'index', align: 'left', width: 48, minWidth: 48, class: 'pl-4' },
        { text: this.$t('shipping.photo'), value: 'photo', align: 'left', width: 48, minWidth: 48, class: 'pl-1 pr-0' },
        { text: this.$t('shipping.name'), value: 'name', align: 'left', width: 123, minWidth: 123, class: 'px-sm' },
        { text: this.$t('shipping.model'), value: 'model', align: 'left', width: 200, minWidth: 200, class: 'px-sm' },
        { text: this.$t('shipping.qty'), value: 'qty', align: 'right', width: 68, minWidth: 68, class: 'px-sm' },
        { text: '', value: 'unit', align: 'right', width: 57, minWidth: 57 },
      ]
    },
    costHeaders () {
      return [
        {
          text: this.isInvoiceProfitTypeMargin
            ? this.$t('shipping.costPrice') : this.$t('shipping.purchaseCost'),
          value: 'purchasePrice',
          width: 138,
          class: 'bg-gray-600 relative z-1 px-sm',
          align: 'right',
        },
        { text: this.$t('shipping.obtainAmount'), value: 'purchaseAmount', align: 'right', width: '100%', minWidth: 300, class: 'bg-gray-600 relative z-1 px-sm' },
        { text: this.$t('shipping.clientCost'), value: 'clientPrice', align: 'right', width: 138, class: 'bg-gray-600 relative z-1 px-sm' },
        { text: this.$t('shipping.obtainAmount'), value: 'clientAmount', align: 'right', width: '100%', minWidth: 300, class: 'bg-gray-600 relative z-1 px-sm' },
        { text: '', value: 'action', width: 48, class: 'bg-gray-600 relative z-1' },
      ]
    },
    storeHeaders () {
      return [
        { text: `${this.$t('shipping.net')} ${this.$t('measure.unit')} ${this.$t('measure.kg')}`, value: 'net', align: 'right', width: 64, class: 'bg-gray-600 relative z-1 leading-none pr-sm py-0' },
        { text: `${this.$t('shipping.gross')} ${this.$t('measure.unit')} ${this.$t('measure.kg')}`, value: 'gross', align: 'right', width: 64, class: 'bg-gray-600 relative z-1 leading-none pr-sm py-0' },
        { text: `${this.$t('shipping.packageSize')} (${this.$t('measure.mm')})`, value: 'size', align: 'center', width: '140%', class: 'bg-gray-600 relative z-1 leading-none pr-sm py-0' },
        { text: this.$t('shipping.packageQty'), value: 'pkgQty', width: 62, align: 'right', class: 'bg-gray-600 relative z-1 leading-none pr-sm pr-sm py-0' },
        { text: this.$t('shipping.packageNo'), value: 'pkgNo', width: 62, align: 'right', class: 'bg-gray-600 relative z-1 leading-none pr-sm py-0' },
        { text: this.$t('shipping.atWhouse'), value: 'atWhouse', width: 32, align: 'right', class: 'bg-gray-600 relative z-2 leading-none whitespace-no-wrap pr-sm py-0' },
        { text: '', value: 'action', width: 48, class: 'bg-gray-600 relative z-1' },
      ]
    },
    infoHeaders () {
      return [
        { text: this.$t('shipping.additionalPhoto'), value: 'images', width: '100%', align: 'left', class: 'bg-gray-600 relative z-1 pl-6' },
        { text: this.$t('shipping.additionalInfo'), value: 'description', width: 282, align: 'left', class: 'bg-gray-600 relative z-1 pl-sm' },
        { text: '', value: 'action', width: 48, class: 'bg-gray-600 relative z-1' },
      ]
    },
    linkHeaders () {
      return [
        { text: this.$t('shipping.linkAttachFile'), value: 'file', width: '100%', align: 'left', class: 'bg-gray-600 relative z-1 pl-6 pr-3' },
        { text: this.$t('shipping.linkSave'), value: 'url', align: 'left', width: 264, class: 'bg-gray-600 relative z-1 pl-3' },
        { text: '', value: 'action', width: 48, class: 'bg-gray-600 relative z-1' },
      ]
    },
    chatHeaders () {
      return [
        { text: this.$t('shipping.chatMembers'), value: 'participants', width: '100%', align: 'left', class: 'bg-gray-600 relative z-1 px-6' },
        { text: '', value: 'messages', width: 140, align: 'left', class: 'bg-gray-600 relative z-1' },
        { text: '', value: 'startChat', width: 168, align: 'right', class: 'bg-gray-600 relative z-1' },
      ]
    },
  },
}
</script>
