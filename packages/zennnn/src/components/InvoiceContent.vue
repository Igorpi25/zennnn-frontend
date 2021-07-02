<template>
  <div>
    <div
      v-scroll="onScroll"
      ref="productsTable"
      class="overflow-x-auto scrolling-touch"
      @mouseenter="isMouseOver = true"
      @mouseleave="isMouseOver = false"
      @touchstart="isScrollStart = true"
      @touchend="clearScrollEndTimer"
    >
      <div class="flex pt-1">
        <DataTable
          :headers="headers"
          :items="items"
          :scrollable="false"
          :rounded="false"
          table-width="100%"
          class="relative"
          table-class="table-fixed"
          thead-class="text-sm"
        >
          <template v-slot:header-content-atWhouse="{ header }">
            <span
              class="inline-block truncate align-middle"
              style="max-width: 78px"
            >
              {{ header.text }}
            </span>
          </template>

          <template v-slot:top>
            <div class="flex">
              <div
                class="flex-shrink-0"
                :style="{
                  width: fixedHeadersWidth + 'px',
                }"
              />
              <div
                class="
                  h-11
                  flex-grow flex
                  overflow-x-auto
                  scrolling-touch
                  relative
                  z-1
                  -mb-px
                "
              >
                <div
                  v-for="(tab, i) in tabs"
                  :aria-selected="activeTab === tab.value"
                  :key="tab.value"
                  :class="[
                    'flex items-center justify-center rounded-t bg-gray-600 px-2',
                    'select-none whitespace-nowrap cursor-pointer',
                    'transition-colors duration-100 ease-out',
                    { 'mr-1': i + 1 < tabs.length },
                    tab.disabled
                      ? 'pointer-events-none opacity-40'
                      : 'focus:outline-none focus:text-white hover:text-white',
                    tab.class || null,
                    activeTab === tab.value
                      ? 'text-white'
                      : 'bg-opacity-50 text-gray-200',
                  ]"
                  :style="{ width: tab.width + 'px' }"
                  :title="tab.title || null"
                  :role="tab.disabled ? null : 'tab'"
                  :tabindex="tab.disabled ? null : 0"
                  @click="switchTab(tab.value)"
                  @keydown.enter.exact="switchTab(tab.value)"
                >
                  <span v-if="tab.icon" class="relative">
                    <div
                      v-if="tab.value === 5 && hasNewComments"
                      :class="[
                        'absolute top-0 right-0 -mt-0.5 -mr-1 w-2.5 h-2.5 rounded-full border-2 bg-gray-600 border-gray-600 transition-colors duration-100 ease-out',
                        activeTab === tab.value
                          ? 'bg-gray-600'
                          : 'border-gray-700',
                      ]"
                    >
                      <div class="w-full h-full bg-purple-500 rounded-full" />
                    </div>
                    <Icon>
                      {{ tab.icon }}
                    </Icon>
                  </span>
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
                      { 'pointer-events-none': activeTab !== tab.value },
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
            <template v-for="(item, index) in items" :key="index">
              <InvoiceProduct
                v-if="item.id === `empty-${invoice.id}` && isOwnerOrManager"
                :index="items.length"
                :active-tab="activeTab"
                :profit-type="invoice.profitType"
                :profit-for-all="invoice.profitForAll"
                :role="role"
                create
                @create="addProduct"
              />
              <InvoiceProduct
                v-else
                :item="item"
                :index="index + 1"
                :active-tab="activeTab"
                :profit-type="invoice.profitType"
                :profit-for-all="invoice.profitForAll"
                :role="role"
              />
            </template>
          </template>

          <template v-if="!create" v-slot:footer>
            <tr>
              <td colspan="4">
                <div
                  style="height: 88px"
                  class="
                    absolute
                    inset-x-0
                    top-0
                    pointer-events-none
                    opacity-50
                    bg-gradient-to-b
                    from-gray-900
                    to-gray-900/0
                    -mt-1
                  "
                />
                <div
                  class="
                    h-12
                    absolute
                    inset-x-0
                    bottom-0
                    pointer-events-none
                    opacity-50
                    bg-gradient-to-t
                    from-gray-900
                    to-gray-900/0
                  "
                />
              </td>
              <td :colspan="activeTab === 2 ? 2 : 3" />

              <template v-if="activeTab === 1">
                <td class="text-gray-300 text-right px-2.5">
                  <span class="relative z-1">
                    {{ $t('shipping.total') }}
                  </span>
                </td>
                <td class="text-right px-2.5">
                  <span class="relative z-1">
                    {{ $n(invoice.totalPurchaseAmount || 0, 'fixed') }}
                  </span>
                </td>
                <td class="text-gray-300 text-right px-2.5">
                  <span class="relative z-1">
                    {{ $t('shipping.total') }}
                  </span>
                </td>
                <td class="text-right px-2.5">
                  <span class="relative z-1">
                    {{ $n(invoice.totalClientAmount || 0, 'fixed') }}
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
                <td class="text-right pr-2.5">
                  <span class="relative z-1">
                    <span>{{ $n(invoice.totalNet) }}</span>
                    <span
                      class="
                        text-gray-300
                        absolute
                        right-0
                        translate-x-full
                        pl-1
                      "
                      >{{ $t('measure.kg') }}</span
                    >
                  </span>
                </td>
                <td class="text-right pr-2.5">
                  <span class="relative z-1">
                    <span>{{ $n(invoice.totalGross) }}</span>
                    <span
                      class="
                        text-gray-300
                        absolute
                        right-0
                        translate-x-full
                        pl-1
                      "
                      >{{ $t('measure.kg') }}</span
                    >
                  </span>
                </td>
                <td class="text-center">
                  <span class="relative z-1">
                    {{ $n(invoice.totalVolume) }}
                    <span class="text-gray-300">{{ $t('measure.m3') }}</span>
                  </span>
                </td>
                <td class="text-right pr-2.5">
                  <span class="relative z-1">
                    {{ $n(invoice.totalPkgQty) }}
                  </span>
                </td>
                <td class="text-left" colspan="2">
                  <span class="relative whitespace-nowrap z-1">
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
      :invoice="invoice"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'

import { Scroll } from 'vue-supp'

import { ziLink, ziChat, ziQr } from '@zennnn/icons'
import { Icon, DataTable } from '@zennnn/core'

import { DEFAULT_CURRENCY } from '../config'

import { SpecCurrency, InvoiceProfitType, Role } from '../graphql/enums'
import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_WITH_INVOICE,
} from '../graphql/mutations'

import InvoiceProduct from './InvoiceProduct.vue'
import InvoiceSummary from './InvoiceSummary.vue'

export default {
  name: 'InvoiceContent',
  components: {
    Icon,
    DataTable,
    InvoiceProduct,
    InvoiceSummary,
  },
  directives: {
    Scroll,
  },
  props: {
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
    },
    activeTab: {
      type: Number,
      default: 1,
    },
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
    // Scroll
    scrollInvoiceId: {
      type: String,
      default: '',
    },
    scrollLeft: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:currency', 'change:scrollLeft', 'change:tab'],
  setup() {
    const route = useRoute()
    const specId = route.params.specId

    const isScrollStart = ref(false)
    const scrollEndTimer = ref(null)
    const isMouseOver = ref(false)
    const lazyScrollLeft = ref(0)
    const scrollLeftDelay = ref(75)
    const scrollAnimationDuration = ref(75)

    const { mutate: createProductMutate, loading: createProductLoading } =
      useMutation(CREATE_PRODUCT, {
        fetchPolicy: 'no-cache',
      })

    const {
      mutate: createProductWithInvoiceMutate,
      loading: createProductWithInvoiceLoading,
    } = useMutation(CREATE_PRODUCT_WITH_INVOICE, {
      fetchPolicy: 'no-cache',
    })

    return {
      specId,
      createProductMutate,
      createProductLoading,
      createProductWithInvoiceMutate,
      createProductWithInvoiceLoading,
      // Scroll
      isScrollStart,
      scrollEndTimer,
      isMouseOver,
      lazyScrollLeft,
      scrollLeftDelay,
      scrollAnimationDuration,
    }
  },
  computed: {
    items() {
      return (this.invoice && this.invoice.products) || []
    },
    fixedHeadersWidth() {
      return this.productHeaders.reduce((acc, curr) => {
        return acc + (curr.width || 0)
      }, 0)
    },
    currencies() {
      return Object.values(SpecCurrency).map((el) => {
        return {
          text: el,
          value: el,
        }
      })
    },
    isInvoiceProfitTypeMargin() {
      return this.invoice.profitType === InvoiceProfitType.MARGIN
    },
    isInvoiceProfitTypeCommission() {
      return this.invoice.profitType === InvoiceProfitType.COMMISSION
    },
    hasNewComments() {
      const products = this.invoice.products || []
      return products.some((item) => {
        const comments = item.comments || []
        return comments.some((c) => !c.viewed)
      })
    },
    isAmountVisible() {
      return (
        this.role === Role.OWNER ||
        this.role === Role.MANAGER ||
        this.role === Role.ACCOUNTANT
      )
    },
    isOwnerOrManager() {
      return this.role === Role.OWNER || this.role === Role.MANAGER
    },
    tabs() {
      return this.isOwnerOrManager
        ? [
            {
              value: 1,
              text: this.$t('shipping.prices'),
              width: 130,
              class: 'flex-1',
            },
            {
              value: 2,
              text: this.$t('shipping.warehouse'),
              width: 130,
              class: 'flex-1',
            },
            {
              value: 3,
              text: this.$t('shipping.description'),
              width: 130,
              class: 'flex-1',
            },
            {
              value: 4,
              title: this.$t('shipping.link'),
              icon: ziLink,
              width: 46,
            },
            { value: 5, icon: ziChat, width: 46 },
            { value: 6, icon: ziQr, width: 46, disabled: true },
          ]
        : this.role === Role.ACCOUNTANT
        ? [
            { value: 1, text: this.$t('shipping.prices'), width: 130 },
            { value: 3, text: this.$t('shipping.description'), width: 130 },
            {
              value: 4,
              title: this.$t('shipping.link'),
              icon: ziLink,
              width: 46,
            },
          ]
        : this.role === Role.WAREHOUSEMAN || this.role === Role.FREELANCER
        ? [
            { value: 2, text: this.$t('shipping.warehouse'), width: 130 },
            { value: 3, text: this.$t('shipping.description'), width: 130 },
            {
              value: 4,
              title: this.$t('shipping.link'),
              icon: ziLink,
              width: 46,
            },
          ]
        : []
    },
    headers() {
      switch (this.activeTab) {
        case 1:
          return [...this.productHeaders, ...this.costHeaders]
        case 2:
          return [...this.productHeaders, ...this.storeHeaders]
        case 3:
          return [...this.productHeaders, ...this.infoHeaders]
        case 4:
          return [...this.productHeaders, ...this.linkHeaders]
        case 5:
          return [...this.productHeaders, ...this.chatHeaders]
        default:
          return []
      }
    },
    productHeaders() {
      return [
        { text: '', value: 'status', align: 'left', width: 16, minWidth: 16 },
        {
          text: this.$t('shipping.productIndexNo'),
          value: 'index',
          align: 'left',
          width: 48,
          minWidth: 48,
          class: 'pl-4',
        },
        {
          text: this.$t('shipping.photo'),
          value: 'photo',
          align: 'left',
          width: 48,
          minWidth: 48,
          class: 'pl-1 pr-0',
        },
        {
          text: this.$t('shipping.name'),
          value: 'name',
          align: 'left',
          width: 123,
          minWidth: 123,
          class: 'px-2.5',
        },
        {
          text: this.$t('shipping.model'),
          value: 'model',
          align: 'left',
          width: 200,
          minWidth: 200,
          class: 'px-2.5',
        },
        {
          text: this.$t('shipping.qty'),
          value: 'qty',
          align: 'right',
          width: 68,
          minWidth: 68,
          class: 'px-2.5',
        },
        { text: '', value: 'unit', align: 'right', width: 57, minWidth: 57 },
      ]
    },
    costHeaders() {
      return [
        {
          text: this.isInvoiceProfitTypeMargin
            ? this.$t('shipping.costPrice')
            : this.$t('shipping.purchaseCost'),
          value: 'purchasePrice',
          width: 138,
          class: 'bg-gray-600 relative z-1 px-2.5',
          align: 'right',
        },
        {
          text: this.$t('shipping.obtainAmount'),
          value: 'purchaseAmount',
          align: 'right',
          width: '100%',
          minWidth: 300,
          class: 'bg-gray-600 relative z-1 px-2.5',
        },
        {
          text: this.$t('shipping.clientCost'),
          value: 'clientPrice',
          align: 'right',
          width: 138,
          class: 'bg-gray-600 relative z-1 px-2.5',
        },
        {
          text: this.$t('shipping.obtainAmount'),
          value: 'clientAmount',
          align: 'right',
          width: '100%',
          minWidth: 300,
          class: 'bg-gray-600 relative z-1 px-2.5',
        },
        {
          text: '',
          value: 'action',
          width: 48,
          class: 'bg-gray-600 relative z-1',
        },
      ]
    },
    storeHeaders() {
      return [
        {
          text: `${this.$t('shipping.net')} ${this.$t(
            'measure.unit'
          )} ${this.$t('measure.kg')}`,
          value: 'net',
          align: 'right',
          width: 64,
          class: 'bg-gray-600 relative z-1 leading-none pr-2.5 py-0',
        },
        {
          text: `${this.$t('shipping.gross')} ${this.$t(
            'measure.unit'
          )} ${this.$t('measure.kg')}`,
          value: 'gross',
          align: 'right',
          width: 64,
          class: 'bg-gray-600 relative z-1 leading-none pr-2.5 py-0',
        },
        {
          text: `${this.$t('shipping.packageSize')} (${this.$t('measure.mm')})`,
          value: 'size',
          align: 'center',
          width: '140%',
          class: 'bg-gray-600 relative z-1 leading-none pr-2.5 py-0',
        },
        {
          text: this.$t('shipping.packageQty'),
          value: 'pkgQty',
          width: 62,
          align: 'right',
          class: 'bg-gray-600 relative z-1 leading-none pr-2.5 pr-2.5 py-0',
        },
        {
          text: this.$t('shipping.packageNo'),
          value: 'pkgNo',
          width: 62,
          align: 'right',
          class: 'bg-gray-600 relative z-1 leading-none pr-2.5 py-0',
        },
        {
          text: this.$t('shipping.atWhouse'),
          value: 'atWhouse',
          width: 32,
          align: 'right',
          class:
            'bg-gray-600 relative z-2 leading-none whitespace-nowrap pr-2.5 py-0',
        },
        {
          text: '',
          value: 'action',
          width: 48,
          class: 'bg-gray-600 relative z-1',
        },
      ]
    },
    infoHeaders() {
      return [
        {
          text: this.$t('shipping.additionalPhoto'),
          value: 'images',
          width: '100%',
          align: 'left',
          class: 'bg-gray-600 relative z-1 pl-6',
        },
        {
          text: this.$t('shipping.additionalInfo'),
          value: 'description',
          width: 282,
          align: 'left',
          class: 'bg-gray-600 relative z-1 pl-2.5',
        },
        {
          text: '',
          value: 'action',
          width: 48,
          class: 'bg-gray-600 relative z-1',
        },
      ]
    },
    linkHeaders() {
      return [
        {
          text: this.$t('shipping.linkAttachFile'),
          value: 'file',
          width: '100%',
          align: 'left',
          class: 'bg-gray-600 relative z-1 pl-6 pr-3',
        },
        {
          text: this.$t('shipping.linkSave'),
          value: 'url',
          align: 'left',
          width: 264,
          class: 'bg-gray-600 relative z-1 pl-3',
        },
        {
          text: '',
          value: 'action',
          width: 48,
          class: 'bg-gray-600 relative z-1',
        },
      ]
    },
    chatHeaders() {
      return [
        {
          text: this.$t('shipping.chatMembers'),
          value: 'participants',
          width: '100%',
          align: 'left',
          class: 'bg-gray-600 relative z-1 px-6',
        },
        {
          text: '',
          value: 'messages',
          width: 140,
          align: 'left',
          class: 'bg-gray-600 relative z-1',
        },
        {
          text: '',
          value: 'startChat',
          width: 168,
          align: 'right',
          class: 'bg-gray-600 relative z-1',
        },
      ]
    },
  },
  watch: {
    scrollLeft() {
      if (this.invoice.id === this.scrollInvoiceId) return
      if (this.isMouseOver || this.isScrollStart) return
      this.setScrollLeft()
    },
  },
  mounted() {
    // this.debounceEmitScrollLeftChange = throttle(this.emitScrollLeftChange, this.scrollLeftDelay, { leading: true })
    if (this.scrollLeft) {
      this.setScrollLeft(false)
    }
  },
  methods: {
    switchTab(value) {
      this.$emit('change:tab', value)
    },
    addProduct(input) {
      if (this.create) {
        this.createProductWithInvoice(input)
      } else {
        this.createProduct(input)
      }
    },
    createProduct(input) {
      const variables = {
        invoiceId: this.invoice.id,
      }
      if (input) {
        variables.input = {
          name: input.name,
          article: input.article,
        }
      }
      this.createProductMutate(variables)
    },
    createProductWithInvoice(input) {
      const variables = {
        specId: this.specId,
      }
      if (input) {
        variables.input = {
          name: input.name,
          article: input.article,
        }
      }
      this.createProductWithInvoiceMutate(variables)
    },
    // Scroll
    emitScrollLeftChange() {
      this.$emit('change:scrollLeft', this.lazyScrollLeft, this.invoice.id)
    },
    setScrollLeft(animate = true) {
      const target = this.$refs.productsTable
      if (target) {
        const scrollLeft = this.scrollLeft || 0
        if (animate) {
          target.scrollLeft = scrollLeft
          // this.scrollLeftWithAnimation(scrollLeft)
        } else {
          target.scrollLeft = scrollLeft
        }
      }
    },
    scrollLeftWithAnimation(scrollLeft) {
      const container = this.$refs.productsTable
      if (!container) return
      const targetLocation = scrollLeft
      const startLocation = container.scrollLeft
      if (targetLocation === startLocation) return
      const startTime = performance.now()
      const duration = this.scrollAnimationDuration
      const ease = (t) => t
      return new Promise((resolve) =>
        requestAnimationFrame(function step(currentTime) {
          const timeElapsed = currentTime - startTime
          const progress = Math.abs(
            duration ? Math.min(timeElapsed / duration, 1) : 1
          )

          container.scrollLeft = Math.floor(
            startLocation + (targetLocation - startLocation) * ease(progress)
          )

          const clientWidth = container.clientWidth
          if (
            progress === 1 ||
            clientWidth + container.scrollLeft === container.scrollWidth
          ) {
            return resolve(targetLocation)
          }

          requestAnimationFrame(step)
        })
      )
    },
    onScroll(e) {
      const target = e.target
      const scrollLeft = target ? target.scrollLeft : 0
      this.lazyScrollLeft = scrollLeft < 0 ? 0 : scrollLeft
      if (!this.isMouseOver && !this.isScrollStart) return
      if (this.isScrollStart) {
        this.clearScrollEndTimer()
      }
      this.emitScrollLeftChange()
      // this.debounceEmitScrollLeftChange()
    },
    clearScrollEndTimer() {
      clearTimeout(this.scrollEndTimer)
      this.scrollEndTimer = setTimeout(() => {
        this.isScrollStart = false
      }, 300)
    },
  },
}
</script>
