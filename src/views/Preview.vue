<template>
  <div>
    <div class="content view">
      <StatusBar />
      <div class="container container--sm mb-12">
        <div class="pt-10 md:pb-16">
          <div class="flex flex-col sm:flex-row justify-between">
            <span class="mb-3">
              <span>{{ $t('preview.shippingTitle') }}</span>&nbsp;
              <span>{{ spec.specNo }}</span>&nbsp;
              <span>{{ $t('preposition.from') }}:</span>&nbsp;
              <span>{{ $d($parseDate(spec.createdAt), 'short') }}</span>
            </span>
            <span
              class="mb-2 md:m-0 text-right text-primary text-sm cursor-pointer whitespace-no-wrap"
              @click="collapseAll"
            >{{ $t('action.collapseAll') }}</span>
          </div>

          <div v-for="(item) in items" :key="item.id" class="preview-invoice-wrapper">
            <InvoiceHeader
              :item="item"
              :expanded="expanded"
              icon-color-primary
              @click="expand"
            >
              <div class="flex flex-col md:flex-row pr-2 w-full md:w-auto text-left">
                <div>
                  <span>{{ item.invoiceNo }}</span>&nbsp;
                  <span class="text-sm">{{ $t('preposition.from') }}</span>&nbsp;
                  <span>{{ item.purchaseDate ? $d($parseDate(item.purchaseDate), 'short') : '-' }}</span>&nbsp;
                </div>
                <span class="hidden md:block mx-1">//</span>&nbsp;
                <div>
                  <span class="text-sm">{{ $t('preview.expectedShipment').toLowerCase() }}</span>&nbsp;
                  <span>{{ item.shippingDate ? $d($parseDate(item.shippingDate), 'short') : '-' }}</span>
                </div>
              </div>
            </InvoiceHeader>
            <div v-if="expanded.includes(item.id)">
              <div class="data-table-wrapper">
                <DataTable
                  :headers="headers"
                  :items="item.products"
                  table-width="100%"
                  table-class="table-fixed"
                  thead-class="text-accent2 text-xs leading-tight"
                  headers-whitespace-normal
                >
                  <template v-slot:items="{ items }">
                    <tr
                      v-for="(item, index) in items"
                      :key="item.id"
                      class="items base-accent3 border-none"
                    >
                      <td class="text-gray-lighter text-right align-top">
                        <div class="leading-none py-3">
                          {{ index + 1 }}
                        </div>
                      </td>
                      <td>
                        <ProductImage
                          :product-id="item.id"
                          :images="getPreviewImage(item.images)"
                          :upload="false"
                          :removable="false"
                          light
                        />
                      </td>
                      <td>
                        <span>{{ item.name }}</span>
                        <p class="text-gray-light leading-none">{{ item.article }}</p>
                        <span class="flex items-center mt-1">
                          <img
                            v-if="item.productStatus === ProductStatus.IN_PRODUCTION"
                            src="../assets/icons/factory-yellow.png"
                            class="mb-2"
                          >
                          <img
                            v-else-if="item.productStatus === ProductStatus.IN_STOCK"
                            src="../assets/icons/in-stock.png"
                          >
                          <img
                            v-else
                            src="../assets/icons/in-processing.png"
                          >
                          <span
                            class=" text-orange "
                            :class="[
                              'ml-2 text-sm',
                              item.productStatus === ProductStatus.IN_STOCK
                                ? 'status-stock' : item.productStatus === ProductStatus.IN_PRODUCTION
                                  ? 'status-production' : 'status-processing'
                            ]"
                          >
                            <span>
                              {{ item.productStatus ? $t(`status.${item.productStatus}`) : '' }}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td class="text-center">
                        <ProductImage
                          v-if="item.images.length > 1"
                          :product-id="item.id"
                          :images="getAdditionImages(item.images)"
                          :upload="false"
                          :removable="false"
                          light
                        >
                          <template v-slot:menu-activator>
                            <div class="flex justify-center items-center">
                              <span class="mr-1 text-sm text-gray-lightest">
                              + {{ item.images.length - 1 }}
                              </span>
                              <img src="@/assets/icons/pre-image.png">
                            </div>
                          </template>
                        </ProductImage>
                      </td>
                      <td class="text-right">{{ $n(item.price || 0, 'decimal') }}</td>
                      <td class="text-right">{{ $n(item.qty || 0) }}</td>
                      <td class="text-right font-bold">{{ $n(item.amount || 0, 'decimal') }}</td>
                      <td class="text-right">{{ $n(item.pkgQty || 0) }}</td>
                      <td class="text-right">{{ item.pkgNo || '-' }}</td>
                      <td class="text-center">
                        <Comments
                          :items="item.comments"
                          :product-id="item.id"
                          :spec-id="specId"
                          is-product
                          is-paper
                          icon-size="24"
                          left
                          class="inline-block align-middle"
                          style="color:#5a8199"
                        />
                      </td>
                    </tr>
                  </template>
                  <template v-slot:footer>
                    <tr class="bg-white">
                      <td colspan="7">
                        <div class="flex justify-end py-6">
                          <div class="w-full max-w-xs">
                            <div class="h-6 flex">
                              <div class="w-32 flex-shrink-0 text-right font-bold">
                                <span>{{ $t('preview.total') }}</span>&nbsp;
                                <span class="pl-1">{{ $t('currency.CNY.symbol') }}</span>
                              </div>
                              <div class="flex-grow dots" />
                              <div class="font-bold">
                                {{ $n(item.totalClientAmount || 0, 'decimal') }}
                              </div>
                            </div>
                            <div class="h-6 flex text-gray-lightest">
                              <div class="w-32 flex-shrink-0 text-right">
                                <span>{{ $t('preview.discount') }}</span>&nbsp;
                                <span class="pl-1">{{ $t('currency.CNY.symbol') }}</span>
                              </div>
                              <div class="flex-grow dots" />
                              <div class="font-bold">
                                {{ $n(item.discount || 0, 'decimal') }}
                              </div>
                            </div>
                            <div class="h-6 flex">
                              <div class="w-32 flex-shrink-0 text-right">
                                <span>{{ $t('preview.prepay') }}</span>&nbsp;
                                <span class="pl-1">{{ $t('currency.CNY.symbol') }}</span>
                              </div>
                              <div class="flex-grow dots" />
                              <div class="font-bold">
                                {{ $n(item.prepayment || 0, 'decimal') }}
                              </div>
                            </div>
                            <div class="h-6 flex">
                              <div class="w-32 flex-shrink-0 text-right">
                                <span>{{ $t('preview.residue') }}</span>&nbsp;
                                <span class="pl-1">{{ $t('currency.CNY.symbol') }}</span>
                              </div>
                              <div class="flex-grow dots" />
                              <div class="font-bold" style="color:#ff0000">
                                {{ $n(item.clientDebt || 0, 'decimal') }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td colspan="3">
                        <div class="py-6 px-5">
                          <div class="text-sm">
                            <div class="h-6 flex items-end">
                              <span v-if="!item.discount">
                                ({{ $t('preview.noDiscount') }})
                              </span>
                            </div>
                            <div class="h-6" />
                            <div class="h-6 flex items-end">
                             {{ item.prepaymentDate ? $d($parseDate(item.prepaymentDate), 'short') : '--.--.--' }}
                            </div>
                            <div class="h-6 flex items-end">
                              {{ item.clientDebtDate ? $d($parseDate(item.clientDebtDate), 'short') : '--.--.--' }}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </DataTable>
              </div>
            </div>
          </div>

          <div class="preview-summary">
            <h4 class="text-lg mb-4">
              {{ $t('preview.summaryTitle') }}
            </h4>
            <div class="preview-summary__wrapper flex-col lg:flex-row">
              <div class="preview-summary__info">
                <div v-if="containers.length > 0" class="relative">
                  <div
                    v-if="spec.shipped"
                    class="preview-summary__container__image preview-summary__container__image--shipped w-full"
                    style="left: -20px; width: 350px; background-size: auto; z-index: 1;"
                  />
                  <template
                    v-for="(container, i) of containers"
                  >
                    <div
                      v-if="!container.full"
                      :key="`unloaded-${i}`"
                      class="preview-summary__container"
                    >
                      <div
                        class="preview-summary__container__image"
                        :class="[ container.size === '_20' ? 'preview-summary__container__image--full' : 'preview-summary__container__image--full-sm']"
                        :style="{
                          width: (container.loaded || 0) + '%',
                          height: container.size === '_20' ? '85px' : '48px'
                        }"
                      />
                      <img
                        v-if="container.size === '_20'"
                        width="210"
                        height="85"
                        src="/img/container-empty.svg"
                        alt="Container"
                      >
                      <img
                        v-else
                        width="210"
                        height="48"
                        src="/img/container-empty-sm.svg"
                        alt="Container"
                      >
                    </div>
                    <div
                      v-else
                      :key="`loaded-${i}`"
                    >
                      <div
                        class="preview-summary__container"
                      >
                        <div
                          class="preview-summary__container__image"
                          :class="[container.size === '_20' ? 'preview-summary__container__image--full' : 'preview-summary__container__image--full-sm']"
                          :style="{
                            width: '100%',
                            height: container.size === '_20' ? '85px' : '48px'
                          }"
                        />
                        <div class="preview-summary__container__label">
                          {{ container.full }} x {{ container.size.replace('_', '') }}′{{ container.mode.replace('_', '') }}
                        </div>
                        <img
                          v-if="container.size === '_20'"
                          width="210"
                          height="85"
                          src="/img/container-empty.svg"
                          alt="Container"
                        >
                        <img
                          v-else
                          width="210"
                          height="48"
                          src="/img/container-empty-sm.svg"
                          alt="Container"
                        >
                      </div>
                      <div
                        class="preview-summary__container"
                      >
                        <div
                          class="preview-summary__container__image"
                          :class="[container.size === '_20' ? 'preview-summary__container__image--full' : 'preview-summary__container__image--full-sm']"
                          :style="{
                            width: (container.loaded || 0) + '%',
                            height: container.size === '_20' ? '85px' : '48px'
                          }"
                        />
                        <img
                          v-if="container.size === '_20'"
                          width="210"
                          height="85"
                          src="/img/container-empty.svg"
                          alt="Container"
                        >
                        <img
                          v-else
                          width="210"
                          height="48"
                          src="/img/container-empty-sm.svg"
                          alt="Container"
                        >
                      </div>
                    </div>
                  </template>
                </div>
                <div>
                  <ul style="line-height:1.625rem">
                    <li
                      v-for="(c, i) in containers"
                      :key="i"
                      class="flex"
                    >
                      <div class="flex-shrink-0">
                        <span class="leaders__num" style="padding-right:0">
                          {{ c.size.replace('_', '') }}{{ $t('shipping.containerMeasure') }}{{ c.mode.replace('_', '') }}
                        </span>
                        {{ ` ${$t('shipping.container')} ${$t('shipping.containerLoaded')}` }}
                      </div>
                      <div class="flex-grow dots" />
                      <div class="leaders__num flex-shrink-0">
                        {{ c.loaded }}%
                      </div>
                    </li>
                    <li class="flex">
                      <div class="flex-shrink-0">{{ $t('preview.estimateDate') }}</div>
                      <div class="flex-grow dots" />
                      <div class="leaders__num flex-shrink-0">
                        {{ spec.estimateShippingDate ? $d($parseDate(spec.estimateShippingDate), 'short') : '-' }}
                      </div>
                    </li>
                    <li class="flex">
                      <div class="flex-shrink-0">{{ $t('preview.totalVolume') }}</div>
                      <div class="flex-grow dots" />
                      <div class="leaders__num flex-shrink-0">
                        {{ $n(spec.totalVolume, 'formatted') }} {{ $t('measure.m') }}<sup>3</sup>
                      </div>
                    </li>
                    <li class="flex">
                      <div class="flex-shrink-0">{{ $t('preview.totalWeight') }}</div>
                      <div class="flex-grow dots" />
                      <div class="leaders__num flex-shrink-0">
                        {{ $n(spec.totalWeight, 'formatted') }} {{ $t('measure.kg') }}
                      </div>
                    </li>
                    <li class="flex">
                      <div class="flex-shrink-0">{{ $t('preview.qtyOfPackages') }}</div>
                      <div class="flex-grow dots" />
                      <div class="leaders__num flex-shrink-0">
                        {{ $n(spec.qtyOfPackages, 'formatted') }}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="preview-summary__cost">
                <div class="preview-summary__cost__card">
                  <div class="flex pb-2">
                    <span class="w-48 flex-shrink-0 text-right font-bold">
                      <span>{{ $t('preview.costOfGood') }}</span>&nbsp;
                      <span>{{ $t('currency.CNY.symbol') }}</span>
                    </span>
                    <!-- TODO to custom component or Intl polyfill -->
                    <!-- i18n-n has Error formatter.formatToParts is not a function. -->
                    <div class="flex-grow dots" />
                    <span class="font-bold flex items-baseline">
                      <div class="text-accent1">{{ $n(spec.finalCost, 'integer') }}</div>
                      <div class="px-px" style="letter-spacing: -1px">{{ $n(spec.finalCost, 'decimal').slice(-3, -2) }}</div>
                      <div class="text-sm">{{ $n(spec.finalCost, 'decimal').slice(-2) }}</div>
                    </span>
                  </div>
                  <div class="flex pb-2">
                    <span class="w-48 flex-shrink-0 text-right">
                      <span>{{ $t('preview.totalPrepay') }}</span>&nbsp;
                      <span>{{ $t('currency.CNY.symbol') }}</span>
                    </span>
                    <div class="flex-grow dots" />
                    <span class="flex items-baseline">
                      <div class="text-accent1">{{ $n(spec.totalPrepay, 'integer') }}</div>
                      <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.totalPrepay, 'decimal').slice(-3, -2) }}</div>
                      <div class="text-sm">{{ $n(spec.totalPrepay, 'decimal').slice(-2) }}</div>
                    </span>
                  </div>
                  <div class="flex pb-2">
                    <span class="w-48 flex-shrink-0 text-right">
                      <span>{{ $t('preview.finalToPay') }}</span>&nbsp;
                      <span>{{ $t('currency.CNY.symbol') }}</span>
                    </span>
                    <div class="flex-grow dots" />
                    <span class="flex items-baseline font-bold" style="color: #ff0000;">
                      <div>{{ $n(spec.totalClientDebt, 'integer') }}</div>
                      <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.totalClientDebt, 'decimal').slice(-3, -2) }}</div>
                      <div class="text-sm">{{ $n(spec.totalClientDebt, 'decimal').slice(-2) }}</div>
                    </span>
                  </div>
                  <!-- <div class="mt-8 text-sm text-right">
                    <v-menu
                      v-model="menuCurrency"
                      max-width="175"
                      nudge-right="195"
                      offset-y
                    >
                      <template v-slot:activator="{ on }">
                        <div class="w-full flex justify-end items-center" v-on="on">
                          <span style="padding-top:2px; padding-right:3px; font-style:italic">Валюта:</span>
                          <span class="flex items-center font-bold cursor-pointer">
                            Китайский Юань CNY ({{ $t('currency.CNY.symbol') }})
                            <Icon v-if="!menuCurrency">{{ icons.mdiChevronDown }}</Icon>
                            <Icon v-else>{{ icons.mdiChevronUp }}</Icon>
                          </span>
                        </div>
                      </template>
                      <template>
                        <ul role="menu" class="bg-white">
                          <li class="currency-picker__item">
                            <span>Dollar</span>
                          </li>
                          <li class="currency-picker__item">
                            <span>Bitcoin</span>
                          </li>
                          <li class="currency-picker__item">
                            <span>Rubl</span>
                          </li>
                        </ul>
                      </template>
                    </v-menu>
                  </div> -->
                </div>
              </div>
              <div class="preview-summary__actions">
                <div class="select-none leading-tight" @click.prevent>
                  <img src="@/assets/icons/printer.png" class="mr-3">
                  <span class="text-left">{{ $t('preview.printThis') }}</span>
                </div>
                <div class="select-none leading-tight" @click.prevent>
                  <img src="@/assets/icons/pdf.png" class="mr-3">
                  <span class="text-left">{{ $t('preview.downloadPDF') }}</span>
                </div>
                <div class="select-none leading-tight" @click="$refs.specComments.openMenu()">
                  <Comments
                    ref="specComments"
                    :items="spec.comments"
                    :spec-id="specId"
                    class="mr-3"
                    is-paper
                    icon-size="24"
                    :right="$vuetify.breakpoint.lgAndDown"
                    :left="!$vuetify.breakpoint.lgAndDown"
                  />
                  <span class="text-left">{{ $t('preview.comment') }}</span>
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 w-full">
        <Copyright />
      </div>
    </div>
  </div>
</template>

<script>
import deepmerge from 'deepmerge'

import {
  mdiChevronDown,
  mdiChevronUp,
  mdiMinus,
  mdiPlus,
} from '@mdi/js'

import {
  ziSettings,
  ziPaperPlane,
  ziPrint,
  ziShare,
} from '@/assets/icons'

import StatusBar from '../components/StatusBar'
import Copyright from '../components/Copyright'
import InvoiceHeader from '../components/InvoiceHeader.vue'
import ProductImage from '../components/ProductImage.vue'
import Comments from '../components/Comments'

import { ProductStatus, InvoiceStatus, Typename, Operation } from '../graphql/enums'
import { GET_PAPER_SPEC } from '../graphql/queries'
import { PAPER_SPEC_DELTA } from '../graphql/subscriptions'
import {
  PAPER_SPEC_FRAGMENT,
  PAPER_INVOICE_FRAGMENT,
  PAPER_PRODUCT_FRAGMENT,
  PAPER_SPEC_INVOICES_FRAGMENT,
  PAPER_INVOICE_PRODUCTS_FRAGMENT,
} from '../graphql/typeDefs'

export default {
  name: 'Preview',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$el.classList.add('light-theme', 'h-full')
    })
  },
  components: {
    StatusBar,
    Copyright,
    InvoiceHeader,
    ProductImage,
    Comments,
  },
  apollo: {
    getPaperSpec: {
      query: GET_PAPER_SPEC,
      variables () {
        return {
          id: this.specId,
        }
      },
    },
  },
  data () {
    return {
      expanded: [],
      icons: {
        mdiChevronDown,
        mdiChevronUp,
        mdiMinus,
        mdiPlus,
        ziSettings,
        ziPaperPlane,
        ziPrint,
        ziShare,
      },
      menuCurrency: false,
      ProductStatus,
      InvoiceStatus,
    }
  },
  computed: {
    headers () {
      return [
        { text: '#', value: 'number', align: 'right', width: 20 },
        { text: this.$t('preview.photo'), value: 'photo', align: 'left', width: 62 },
        { text: this.$t('preview.name'), value: 'name', align: 'left', width: 260 },
        { text: this.$t('preview.additionalImages'), value: 'images', align: 'left', width: 85 },
        { text: `${this.$t('preview.price')}(¥)`, value: 'price', width: 80 },
        { text: this.$t('preview.qty'), value: 'qty', width: 70 },
        { text: `${this.$t('preview.cost')}(¥)`, value: 'cost', align: 'left', width: 90 },
        { text: this.$t('preview.qtyOfPackages'), value: 'pkgQty', align: 'left', width: 78 },
        { text: this.$t('preview.packageNo'), value: 'pkgNo', align: 'left', width: 78 },
        { text: this.$t('preview.leaveNote'), value: 'note', align: 'left', width: 78 },
      ]
    },
    specId () {
      return this.$route.params.specId
    },
    spec () {
      return this.getPaperSpec || {}
    },
    client () {
      const firstName = (this.spec.client && this.spec.client.firstName) || {}
      const lastName = (this.spec.client && this.spec.client.lastName) || {}
      return firstName + ' ' + lastName || {}
    },
    items () {
      return this.spec.invoices
    },
    containers () {
      return this.spec.containers || []
    },
  },
  mounted () {
    const commentsMerge = (target, source) => {
      const destination = target.slice()
      source.forEach(s => {
        const index = target.findIndex(el => el.id === s.id)
        if (index === -1) {
          destination.push(s)
        } else {
          destination.splice(index, 1, Object.assign(target[index], s))
        }
      })
      return destination
    }

    const observer = this.$apollo.subscribe({
      query: PAPER_SPEC_DELTA,
      variables: {
        specId: this.specId,
      },
      fetchPolicy: 'no-cache',
    })

    const apolloClient = this.$apollo.provider.defaultClient

    observer.subscribe({
      next: ({ data }) => {
        const delta = data.paperSpecDelta
        const operation = delta.operation
        const typename = delta.payload.__typename

        this.$logger.info(`[${typename}]: ${JSON.stringify(data)}`)

        // PRODUCT

        if (operation === Operation.INSERT_PRODUCT) {
          const parentInvoice = apolloClient.readFragment({
            id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
            fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
            fragmentName: 'PaperInvoiceProductsFragment',
          })

          if (!parentInvoice.products.some(el => el.id === delta.payload.id)) {
            parentInvoice.products.push(delta.payload)

            setTimeout(() => {
              apolloClient.writeFragment({
                id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
                fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
                fragmentName: 'PaperInvoiceProductsFragment',
                data: parentInvoice,
              })
            }, 0)
          }
        }

        if (operation === Operation.UPDATE_PRODUCT) {
          const mergeOptions = {
            customMerge: (key) => {
              if (key === 'comments') {
                return commentsMerge
              }
              if (key === 'images') {
                const merge = (_, source) => {
                  return source || []
                }
                return merge
              }
            },
          }
          const cacheData = apolloClient.readFragment({
            id: `${Typename.PAPER_PRODUCT}:${delta.payload.id}`,
            fragment: PAPER_PRODUCT_FRAGMENT,
            fragmentName: 'PaperProductFragment',
          })
          const data = delta.payload.__typename === Typename.PAPER_PRODUCT
            ? deepmerge(cacheData, delta.payload, mergeOptions)
            : deepmerge(cacheData, delta.payload.fields, mergeOptions)
          apolloClient.writeFragment({
            id: `${Typename.PAPER_PRODUCT}:${delta.payload.id}`,
            fragment: PAPER_PRODUCT_FRAGMENT,
            fragmentName: 'PaperProductFragment',
            data,
          })
        }

        if (operation === Operation.DELETE_PRODUCT) {
          let parentInvoice = apolloClient.readFragment({
            id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
            fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
            fragmentName: 'PaperInvoiceProductsFragment',
          })

          const index = parentInvoice.products.findIndex(p => p.id === delta.payload.id)

          if (index !== -1) {
            parentInvoice.products.splice(index, 1)
            apolloClient.writeFragment({
              id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
              fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
              fragmentName: 'PaperInvoiceProductsFragment',
              data: parentInvoice,
            })
          }
        }

        // INVOICE

        if (operation === Operation.INSERT_INVOICE) {
          const parentSpec = apolloClient.readFragment({
            id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
            fragment: PAPER_SPEC_INVOICES_FRAGMENT,
            fragmentName: 'PaperSpecInvoicesFragment',
          })

          if (!parentSpec.invoices.some(el => el.id === delta.payload.id)) {
            parentSpec.invoices.push(delta.payload)

            apolloClient.writeFragment({
              id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
              fragment: PAPER_SPEC_INVOICES_FRAGMENT,
              fragmentName: 'PaperSpecInvoicesFragment',
              data: parentSpec,
            })
          }
        }

        if (operation === Operation.UPDATE_INVOICE) {
          const cacheData = apolloClient.readFragment({
            id: `${Typename.PAPER_INVOICE}:${delta.payload.id}`,
            fragment: PAPER_INVOICE_FRAGMENT,
            fragmentName: 'PaperInvoiceFragment',
          })
          const data = delta.payload.__typename === Typename.PAPER_INVOICE
            ? Object.assign({}, cacheData, delta.payload)
            : Object.assign({}, cacheData, delta.payload.fields)
          apolloClient.writeFragment({
            id: `${Typename.PAPER_INVOICE}:${delta.payload.id}`,
            fragment: PAPER_INVOICE_FRAGMENT,
            fragmentName: 'PaperInvoiceFragment',
            data,
          })
        }

        if (operation === Operation.DELETE_INVOICE) {
          let parentSpec = apolloClient.readFragment({
            id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
            fragment: PAPER_SPEC_INVOICES_FRAGMENT,
            fragmentName: 'PaperSpecInvoicesFragment',
          })

          const index = parentSpec.invoices.findIndex(p => p.id === delta.payload.id)

          if (index !== -1) {
            parentSpec.invoices.splice(index, 1)
            apolloClient.writeFragment({
              id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
              fragment: PAPER_SPEC_INVOICES_FRAGMENT,
              fragmentName: 'PaperSpecInvoicesFragment',
              data: parentSpec,
            })
          }
        }

        // SPEC

        if (operation === Operation.UPDATE_SPEC) {
          const mergeOptions = {
            customMerge: (key) => {
              if (key === 'comments') {
                return commentsMerge
              }
              if (key === 'containers') {
                const merge = (_, source) => {
                  return source || []
                }
                return merge
              }
            },
          }
          const cacheData = apolloClient.readFragment({
            id: `${Typename.PAPER_SPEC}:${delta.payload.id}`,
            fragment: PAPER_SPEC_FRAGMENT,
            fragmentName: 'PaperSpecFragment',
          })
          const data = delta.payload.__typename === Typename.PAPER_SPEC
            ? deepmerge(cacheData, delta.payload, mergeOptions)
            : deepmerge(cacheData, delta.payload.fields, mergeOptions)
          apolloClient.writeFragment({
            id: `${Typename.PAPER_SPEC}:${delta.payload.id}`,
            fragment: PAPER_SPEC_FRAGMENT,
            fragmentName: 'PaperSpecFragment',
            data,
          })
        }
      },
      error: (error) => {
        this.$logger.warn('Error: ', error)
      },
    })
  },
  methods: {
    getPreviewImage (images) {
      return (images || []).slice(0, 1)
    },
    getAdditionImages (images) {
      return (images || []).slice(1)
    },
    expand (id) {
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
  },
}
</script>

<style scoped lang="postcss">
.preview-invoice-wrapper {
  margin-bottom: 20px;
  -webkit-box-shadow: 0px 0px 42px -3px rgba(18,18,18,0.32);
  -moz-box-shadow: 0px 0px 42px -3px rgba(18,18,18,0.32);
  box-shadow: 0px 0px 42px -3px rgba(18,18,18,0.32);
}
.notes-count-wrapper {
  position: relative;
  width: 86px;
}
.notes-count-bubble {
  position: absolute;
  top: -7px;
  right: 23px;
  padding: 0 6px;
  font-size: 12px;
  color: #fff;
  background-color: tomato;
  border-radius: 50px;
}
.preview-summary {
  margin: 70px 0 50px;
  @apply bg-background;
}

.preview-summary__wrapper {
  @apply flex justify-between;
}

.preview-summary__info {
  max-width: 320px;
}

.preview-summary__cost {
  @apply flex-grow;
  max-width: 490px;
}
.preview-summary__cost__card {
  margin-top: 20px;
  padding: 18px 14px;
  background-color: #272727;
  border-radius: 4px;
  font-size: 16px;
  background: linear-gradient(to top, #f4f4f4 70%, #e5e5e5 100%);
  @apply text-accent1;
}
@screen sm {
  .preview-summary__cost__card {
    padding: 40px 60px;
    font-size: 18px;
  }
}
@screen lg {
  .preview-summary__cost__card {
    margin-top: 0;
  }
}

.preview-summary__actions {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
}
.preview-summary__actions > div {
  @apply flex items-center text-primary cursor-pointer;
}
.preview-summary__actions > div:not(:last-child) {
  margin-bottom: 25px;
}
.preview-summary__actions div:hover {
  color: #6996B2;
}
@screen lg {
  .preview-summary__actions {
    width: 180px;
  }
  .preview-summary__cost {
    @apply mx-4;
  }
  .preview-summary__info {
    width: 320px;
  }
}

.preview-summary__container {
  width: 210px;
  @apply mb-4 relative;
}
.preview-summary__container__label {
  @apply absolute inset-0 w-full h-full font-bold text-2xl text-white;
  @apply flex items-center justify-center;
}
/* TODO image import on component */
.preview-summary__container__image {
  @apply absolute inset-0 w-full h-full bg-cover bg-left bg-no-repeat;
}
.preview-summary__container__image--full {
  background-image: url("/img/container-full.png");
}
.preview-summary__container__image--full-sm {
  background-image: url("/img/container-full-40.png");
}
.preview-summary__container__image--shipped {
  background-image: url("/img/container-shipped.png");
}

.preview-summary__info ul.leaders span:first-child,
.preview-summary__info ul.leaders span + span {
  @apply bg-background;
}
.preview-summary__cost ul.leaders span:first-child,
.preview-summary__cost ul.leaders span + span {
  background-color: #f4f4f4;
}

.preview-footer .leaders,
.preview-summary .leaders {
  line-height: 1.625rem;
  padding: 0;
  overflow-x: hidden;
  list-style: none}
.preview-footer .leaders li:after,
.preview-summary .leaders li:after {
  float: left;
  width: 0;
  white-space: nowrap;
  content:
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 }
.preview-footer .leaders span:first-child,
.preview-summary .leaders span:first-child {
  padding-right: 0.33em;
}
.preview-footer .leaders span + span,
.preview-summary .leaders span + span {
  float: right;
  padding-left: 0.33em;
  position: relative;
  z-index: 1
}
.preview-summary .leaders__num {
  @apply text-black font-bold;
}
.preview-summary .currency-picker__item {
  @apply flex cursor-pointer py-1 px-2 outline-none;
}
.preview-summary .currency-picker__item:hover {
  @apply text-primary;
}
</style>
