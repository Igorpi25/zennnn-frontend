<template>
  <div>
    <div class="content view">
      <StatusBar />
      <div class="container container--sm">
        <div class="pt-10 md:pb-32">
          <div class="flex flex-col sm:flex-row justify-between">
            <span class="mb-3">
              <span>{{ $t('shipping.shippingTitle') }}</span>&nbsp;
              <span class="text-primary">
                {{ spec.specNo }}
              </span>&nbsp;
              <span>{{ $t('preposition.from') }}:</span>&nbsp;
              <span>
                {{ $d($parseISO(spec.createdAt), 'short') }}
              </span>
            </span>
            <span
              class="mb-2 md:m-0 text-right text-primary text-sm cursor-pointer whitespace-no-wrap"
              @click="collapseAll"
            >{{ $t('action.collapseAll') }}</span>
          </div>

          <div v-for="(item) in items" :key="item.id" class="invoice-wrapper">
            <div class="invoice-header">
              <span
                :class="[
                  'status-indicator mr-2 md:mr-6 flex-shrink-0',
                  item.status === InvoiceStatus.IN_PRODUCTION
                    ? 'status-indicator--orange' : item.status === InvoiceStatus.IN_STOCK
                      ? 'status-indicator--green' : 'status-indicator--pink'
                ]"
              >
              </span>

              <div class="flex flex-col md:flex-row pr-2 w-full md:w-auto text-left">
                <div>
                  <span>{{ item.number }}</span>&nbsp;
                  <span>{{ $t('preposition.from') }}</span>&nbsp;
                  <span>{{ item.purchaseDate }}</span>&nbsp;
                </div>
                <span class="hidden md:block">//</span>&nbsp;
                <div>
                  <span>ожидаемая готовность:</span>&nbsp;
                  <span>{{ item.shippingdate }}</span>
                </div>
              </div>

              <div @click="expand(item.id)" class="invoice-header__expand text-primary">
                <template v-if="expanded.includes(item.id)">
                  <div class="invoice-header__expand__icon">
                    <svg width="10" height="2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 10 2"><defs></defs><g><g><title>{{ $t('action.collapse') }}</title><path d="M10,0v0h-10v0v1.998v0h10v0z"></path></g></g></svg>
                  </div>
                </template>
                <template v-else>
                  <div class="invoice-header__expand__icon">
                    <svg width="10" height="10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 10 10"><defs></defs><g><g><title>{{ $t('action.expand') }}</title><path d="M4.0017,10v0h1.998v0v-4.002v0h4.001v0v-1.998v0h-4.001v0v-4v0h-1.998v0v4v0h-4.001v0v1.998v0h4.001v0z"></path></g></g></svg>
                  </div>
                </template>
              </div>
            </div>
            <div v-if="expanded.includes(item.id)">
              <div class="data-table-wrapper">
                <DataTable
                  :headers="headers"
                  :items="item.products"
                  table-width="100%"
                  table-class="table-fixed"
                  thead-class="text-accent2"
                >
                  <template v-slot:items="{ items }">
                    <tr
                      v-for="(item, index) in items"
                      :key="item.id"
                      class="items base-accent3 border-none"
                    >
                      <td class="text-gray-lighter text-right leading-none py-2 align-top">
                        {{ index + 1 }}
                      </td>
                      <td>{{ item.photo }}</td>
                      <td>
                        <span>{{ item.name }}</span> <br>
                        <span class="text-gray-light">{{ item.model }}</span>
                        <span class="flex">
                          <img src="../assets/icons/factory-green.png" width="21px">
                          <span class="ml-2 text-orange">{{ item.status }}</span>
                        </span>
                      </td>
                      <td class="text-right">{{ item.morePhoto }}</td>
                      <td class="text-right">{{ item.cost }}</td>
                      <td class="text-right">{{ item.qty }}</td>
                      <td class="text-right font-bold">{{ item.cost }}</td>
                      <td class="text-right">{{ item.cargoQty }}</td>
                      <td class="text-right">{{ item.cargoNum }}</td>
                      <td class="text-right">{{ item.note }}</td>
                    </tr>
                  </template>
                </DataTable>
              </div>
              <div class="invoice-footer p-2 md:p-6 w-full flex justify-end">
                <div class="invoice-footer__total md:mr-12 w-full md:w-1/2 flex">
                  <ul class="leaders w-2/3">
                    <li>
                      <span class="bg-white font-black text-right">Итого: {{ $t('currency.CNY.symbol') }}</span>
                      <span class="bg-white font-bold">7 210</span>
                    </li>
                    <li class="text-gray-lightest">
                      <span class="bg-white font-semibold">Скидка: {{ $t('currency.CNY.symbol') }}</span>
                      <span class="bg-white font-bold">0</span>
                    </li>
                    <li>
                      <span class="bg-white font-semibold min-w-1/2">Предоплата: {{ $t('currency.CNY.symbol') }}</span>
                      <span class="bg-white font-bold">2 000</span>
                    </li>
                    <li>
                      <span class="bg-white font-semibold">Остаток: {{ $t('currency.CNY.symbol') }}</span>
                      <span class="bg-white font-bold" style="color:#ff0000">5 210</span>
                    </li>
                  </ul>
                  <ul class="invoice-footer__details ml-5 text-sm text-gray-light">
                    <li class="mt-1">(без скидки)</li>
                    <br>
                    <li class="mt-1">18.06.2019</li>
                    <li class="mt-1">--.--.--</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="spec-summary">
            <h4 class="text-lg mb-4">
              {{ $t('shipping.summaryTitle') }}
            </h4>
            <div class="spec-summary__wrapper flex-col lg:flex-row">
              <div class="spec-summary__info">
                <div class="relative">
                  <div
                    class="spec-summary__container"
                  >
                    <div
                      class="spec-summary__container__image spec-summary__container__image--full"
                      :style="{
                        width: 25 + '%',
                        height: '85px'
                      }"
                    />
                    <img width="210" height="85" src="/img/container-empty.svg" alt="">
                  </div>
                </div>
                <div>
                  <ul class="leaders">
                    <li
                      v-for="(c, i) in unloadedContainers"
                      :key="i"
                    >
                      <span>
                        <span class="leaders__num">
                          {{ c.type || '20' }}{{ $t('shipping.containerMeasure') }}
                        </span>
                        {{ ` ${$t('shipping.container')} ${$t('shipping.containerLoaded')}` }}
                      </span>
                      <span class="leaders__num">
                        {{ c.loaded }}%
                      </span>
                    </li>
                    <li>
                      <span>{{ $t('shipping.estimateDate') }}</span>
                      <span class="leaders__num">
                        {{ $d($parseISO(spec.estimateShippingDate), 'short') }}
                      </span>
                    </li>
                    <li>
                      <span>{{ $t('shipping.totalVolume') }}</span>
                      <span class="leaders__num">
                        {{ $n(spec.totalVolume, 'formatted') }} {{ $t('measure.m') }}<sup>3</sup>
                      </span>
                    </li>
                    <li>
                      <span>{{ $t('shipping.totalWeight') }}</span>
                      <span class="leaders__num">
                        {{ $n(spec.totalWeight, 'formatted') }} {{ $t('measure.kg') }}
                      </span>
                    </li>
                    <li>
                      <span>{{ $t('shipping.qtyOfPackages') }}</span>
                      <span class="leaders__num">
                        {{ $n(spec.qtyOfPackages, 'formatted') }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="spec-summary__cost">
                <div class="spec-summary__cost__card">
                  <ul class="leaders">
                    <li class="pb-2">
                      <span class="font-bold">
                        {{ $t('shipping.finalCost') }} {{ $t('currency.CNY.symbol') }}
                      </span>
                      <!-- TODO to custom component or Intl polyfill -->
                      <!-- i18n-n has Error formatter.formatToParts is not a function. -->
                      <span class="flex font-bold">
                        <div class="cost-card__cost">{{ $n(spec.finalCost, 'integer') }}</div>
                        <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalCost, 'decimal').slice(-3, -2) }}</div>
                        <div class="text-sm">{{ $n(spec.finalCost, 'decimal').slice(-2) }}</div>
                      </span>
                    </li>
                    <li class="pb-2">
                      <span>
                        {{ $t('shipping.finalObtainCost') }} {{ $t('currency.CNY.symbol') }}
                      </span>
                      <span class="flex ">
                        <div class="cost-card__cost">{{ $n(spec.finalObtainCost, 'integer') }}</div>
                        <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalObtainCost, 'decimal').slice(-3, -2) }}</div>
                        <div class="text-sm">{{ $n(spec.finalObtainCost, 'decimal').slice(-2) }}</div>
                      </span>
                    </li>
                    <li class="pb-2">
                      <span>
                        {{ $t('shipping.profit') }}  {{ $t('currency.CNY.symbol') }}
                      </span>
                      <span class="flex font-bold" style="color: #ff0000;">
                        <div>{{ $n(spec.profit, 'integer') }}</div>
                        <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.profit, 'decimal').slice(-3, -2) }}</div>
                        <div class="text-sm">{{ $n(spec.profit, 'decimal').slice(-2) }}</div>
                      </span>
                    </li>
                  </ul>
                  <div class="mt-8 text-sm text-right">
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
                            <span>Rubl ebat</span>
                          </li>
                        </ul>
                      </template>
                    </v-menu>
                  </div>
                </div>
              </div>
              <div class="spec-summary__actions">
                <div @click.prevent>
                  <img src="@/assets/icons/printer.png" class="mr-3">
                  <span class="text-left">Распечатать</span>
                </div>
                <div @click.prevent>
                  <img src="@/assets/icons/pdf.png" class="mr-3">
                  <span class="text-left">Скачать PDF</span>
                </div>
                <div @click.prevent>
                  <img src="@/assets/icons/message.png" class="mr-3">
                  <span class="text-left">Оставить комментарий</span>
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Copyright />
    </div>
  </div>
</template>

<script>
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import {
  ziSettings,
  ziPaperPlane,
  ziPrint,
  ziShare,
} from '@/assets/icons'

import StatusBar from '@/components/StatusBar'
import Copyright from '@/components/Copyright'

import { InvoiceStatus } from '@/graphql/enums'
import { GET_SPEC } from '../graphql/queries'

export default {
  name: 'Preview',
  components: {
    StatusBar,
    Copyright,
  },
  apollo: {
    getSpec: {
      query: GET_SPEC,
      variables () {
        return {
          id: this.specId,
        }
      },
    },
  },
  data () {
    return {
      headers: [
        { text: '#', value: 'number', align: 'right', width: 55 },
        { text: 'Фото', value: 'name', align: 'left', width: 80 },
        { text: 'Наименование', value: 'status', align: 'left', width: 360 },
        { text: 'Доп. изобр.', value: 'status', align: 'left', width: 70 },
        { text: 'Цена (¥)', value: 'status', width: 80 },
        { text: 'Кол-во', value: 'status', width: 70 },
        { text: 'Стоимость (¥)', value: 'status', align: 'left', width: 100 },
        { text: 'Кол-во гр. мест', value: 'status', align: 'left', width: 70 },
        { text: 'Номера гр. мест', value: 'status', align: 'left', width: 70 },
        { text: 'Оставить заметку', value: 'status', align: 'left', width: 85 },
      ],
      containers: [
        { type: '20', loaded: 100 },
        { type: '20', loaded: 28 },
      ],
      expanded: [],
      icons: {
        mdiChevronDown,
        mdiChevronUp,
        ziSettings,
        ziPaperPlane,
        ziPrint,
        ziShare,
      },
      menuCurrency: false,
      InvoiceStatus,
    }
  },
  computed: {
    specId () {
      return this.$route.params.specId
    },
    spec () {
      return this.getSpec || {}
    },
    items () {
      return this.getSpec && this.getSpec.invoices
    },
    unloadedContainers () {
      return this.containers.filter(c => c.loaded !== 100)
    },
  },
  methods: {
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
  created () {
    console.log(this.items)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$el.classList.add('light-theme')
    })
  },
}
</script>

<style scoped lang="postcss">
.spec-summary {
  margin: 70px 0 50px;
}
.light-theme .spec-summary {
  @apply bg-background;
}

.spec-summary__wrapper {
  @apply flex justify-between;
}

.spec-summary__info {
  max-width: 340px;
}

.spec-summary__cost {
  @apply flex-grow;
  max-width: 490px;
}
.spec-summary__cost__card {
  margin-top: 20px;
  padding: 60px 20px 20px;
  background-color: #272727;
  border-radius: 4px;
  font-size: 14px;
}
.light-theme .spec-summary__cost__card {
  background: linear-gradient(to top, #f4f4f4 70%, #e5e5e5 100%);
  @apply text-accent1;
}
.cost-card__cost {
  @apply text-white;
}
.light-theme .cost-card__cost {
  @apply text-accent1;
}
@screen md {
  .spec-summary__cost__card {
  margin-top: 0;
  padding-left: 60px;
  padding-right: 60px;
  font-size: 18px;
}
}

.spec-summary__actions {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
}
.spec-summary__actions > div {
  @apply flex items-center text-primary cursor-pointer;
}
.spec-summary__actions > div:not(:last-child) {
  margin-bottom: 25px;
}
.spec-summary__actions div:hover {
  color: #6996B2;
}

@screen lg {
  .spec-summary__actions {
    width: 120px;
  }
}
.spec-summary__container {
  width: 210px;
  @apply mb-4 relative;
}
.spec-summary__container__label {
  @apply absolute inset-0 w-full h-full font-bold text-2xl text-white;
  @apply flex items-center justify-center;
}
/* TODO image import on component */
.spec-summary__container__image {
  @apply absolute inset-0 w-full h-full bg-cover bg-left bg-no-repeat;
}
.spec-summary__container__image--full {
  background-image: url("/img/container-full.png");
}
.spec-summary__container__image--full-sm {
  background-image: url("/img/container-full-sm.png");
}
.spec-summary__container__image--shipped {
  background-image: url("/img/container-shipped.png");
}

.spec-summary__info ul.leaders span:first-child,
.spec-summary__info ul.leaders span + span {
  @apply bg-chaos-black;
}
.light-theme .spec-summary__info ul.leaders span:first-child,
.light-theme .spec-summary__info ul.leaders span + span {
  @apply bg-background;
}
@screen md {
  .spec-summary__info ul.leaders span:first-child,
  .spec-summary__info ul.leaders span + span {
    background: #1e1e1e;
  }
  .light-theme .spec-summary__info ul.leaders span:first-child,
  .light-theme .spec-summary__info ul.leaders span + span {
    @apply bg-background;
  }
}
.spec-summary__cost ul.leaders span:first-child,
.spec-summary__cost ul.leaders span + span {
  background-color: #272727;
}

.light-theme .spec-summary__cost ul.leaders span:first-child,
.light-theme .spec-summary__cost ul.leaders span + span {
  background-color: #f4f4f4;
}

ul.leaders {
  line-height: 1.5rem;
  padding: 0;
  overflow-x: hidden;
  list-style: none}
ul.leaders li:after {
  float: left;
  width: 0;
  white-space: nowrap;
  content:
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "}
ul.leaders span:first-child {
  padding-right: 0.33em;}
ul.leaders span + span {
  float: right;
  padding-left: 0.33em;
  position: relative;
  z-index: 1
}
.leaders__num {
  @apply text-white font-bold
}
.light-theme .leaders__num {
  @apply text-black;
}
.currency-picker__item {
  @apply flex cursor-pointer py-1 px-2 outline-none;
}
.currency-picker__item:hover {
  @apply text-primary;
}
</style>
