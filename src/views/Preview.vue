<template>
  <div>
    <div class="content view">
      <StatusBar />
      <div class="container container--sm">
        <div class="pt-10">
          <div class="flex justify-between">
            <span class="mb-3">
              <span>{{ $t('shipping.shippingTitle') }}</span>&nbsp;
              <span class="text-primary">
                {{ spec.specNo }}
              </span>&nbsp;
              <span>{{ $t('preposition.from') }}:</span>&nbsp;
              <span>
                {{ $d($parseISO(spec.createdAt), 'short') }}
              </span> /
              <span>{{ $t('shipping.shippingClient') }}:</span>&nbsp;
              <span>{{ specClient.uid || '' }}</span>&nbsp;
            </span>
            <span
              class="text-gray text-sm cursor-pointer whitespace-no-wrap"
              @click="collapseAll"
            >{{ $t('action.collapseAll') }}</span>
          </div>

          <div v-for="(item) in 2" :key="item.id" class="invoice-wrapper">
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

              <div class="flex flex-col md:flex-row pr-2 w-full md:w-auto">
                <span>{{ item.number }}</span>&nbsp;
                <span>{{ $t('preposition.from') }}</span>&nbsp;
                <span>{{ item.purchaseDate }}</span>&nbsp;
                <span>//</span>&nbsp;
                <span>ожидаемая готовность:</span>&nbsp;
                <span>{{ item.shippingdate }}</span>
                <!-- 18-2072 от 28.10.2018 // ожидаемая готовность: 29.10.2018 -->
              </div>

              <div @click="expand(item.id)" class="invoice-header__expand">
                <template v-if="expanded.includes(item.id)">
                  <span v-text="$t('action.collapse')" class="mr-2 hidden lg:inline" />
                  <div class="invoice-header__expand__icon">
                    <svg width="10" height="2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 10 2"><defs></defs><g><g><title>{{ $t('action.collapse') }}</title><path d="M10,0v0h-10v0v1.998v0h10v0z"></path></g></g></svg>
                  </div>
                </template>
                <template v-else>
                  <span v-text="$t('action.expand')" class="mr-2 hidden lg:inline" />
                  <div class="invoice-header__expand__icon">
                    <svg width="10" height="10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 10 10"><defs></defs><g><g><title>{{ $t('action.expand') }}</title><path d="M4.0017,10v0h1.998v0v-4.002v0h4.001v0v-1.998v0h-4.001v0v-4v0h-1.998v0v4v0h-4.001v0v1.998v0h4.001v0z"></path></g></g></svg>
                  </div>
                </template>
              </div>
            </div>
            <!-- Invoice -->
            <DataTable
              :headers="headers"
              :items="items"
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
                  <td class="text-right">{{ item.price }}</td>
                  <td class="text-right">{{ item.qty }}</td>
                  <td class="text-right">{{ item.cost }}</td>
                  <td class="text-right">{{ item.cargoQty }}</td>
                  <td class="text-right">{{ item.cargoNum }}</td>
                  <td class="text-right">{{ item.note }}</td>
                </tr>
              </template>
            </DataTable>
            <div class="invoice-footer p-10 flex justify-end">
            <div class="invoice-footer__total">
              <ul class="leaders">
                <li>
                  <span>
                    Стоимомть товара
                  </span>
                  <span class="flex">
                    7210
                  </span>
                </li>
                <li>
                  <span>
                    {{ $t('shipping.finalObtainCost') }} {{ $t('currency.CNY.symbol') }}
                  </span>
                  <span class="flex">
                    <div class="cost-card__cost">{{ $n(spec.finalObtainCost, 'integer') }}</div>
                    <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalObtainCost, 'decimal').slice(-3, -2) }}</div>
                    <div class="text-sm">{{ $n(spec.finalObtainCost, 'decimal').slice(-2) }}</div>
                  </span>
                </li>
                <li>
                  <span>
                    {{ $t('shipping.profit') }}  {{ $t('currency.CNY.symbol') }}
                  </span>
                  <span class="flex">
                    <div style="color: #00ff16;">{{ $n(spec.profit, 'integer') }}</div>
                    <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.profit, 'decimal').slice(-3, -2) }}</div>
                    <div class="text-sm">{{ $n(spec.profit, 'decimal').slice(-2) }}</div>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          </div>

          <div class="spec-summary">
            <h4 class="text-lg mb-4">
              {{ $t('shipping.summaryTitle') }}
            </h4>
            <div class="spec-summary__wrapper flex-col lg:flex-row">
              <div class="spec-summary__info">
                <div v-if="spec.containers" class="relative">
                  <div
                    v-if="spec.shipped"
                    class="spec-summary__container__image spec-summary__container__image--shipped w-full"
                    style="left: -20px; width: 350px; background-size: auto; z-index: 1;"
                  />
                  <div
                    v-if="spec.containers.length === 1"
                    class="spec-summary__container"
                  >
                    <div
                      class="spec-summary__container__image spec-summary__container__image--full"
                      :style="{
                        width: (spec.containers[0].loaded || 0) + '%',
                        height: '85px'
                      }"
                    />
                    <img width="210" height="85" src="/img/container-empty.svg" alt="">
                  </div>
                  <div v-else>
                    <div
                      v-for="(c, i) in loadedContainers"
                      :key="`loaded-${i}`"
                      class="spec-summary__container"
                    >
                      <div
                        class="spec-summary__container__image spec-summary__container__image--full-sm"
                        :style="{
                          width: '100%',
                          height: '48px'
                        }"
                      />
                      <div class="spec-summary__container__label">
                        {{ loadedContainers.length }} x {{ c.type }}′
                      </div>
                      <img width="210" height="48" src="/img/container-empty-sm.svg" alt="">
                    </div>
                    <div
                      v-for="(c, i) in unloadedContainers"
                      :key="`unloaded-${i}`"
                      class="spec-summary__container"
                    >
                      <div
                        class="spec-summary__container__image spec-summary__container__image--full-sm"
                        :style="{
                          width: (c.loaded || 0) + '%',
                          height: '48px'
                        }"
                      />
                      <img width="210" height="48" src="/img/container-empty-sm.svg" alt="">
                    </div>
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
                      <span>
                        {{ $t('shipping.finalCost') }} {{ $t('currency.CNY.symbol') }}
                      </span>
                      <!-- TODO to custom component or Intl polyfill -->
                      <!-- i18n-n has Error formatter.formatToParts is not a function. -->
                      <span class="flex">
                        <div class="cost-card__cost">{{ $n(spec.finalCost, 'integer') }}</div>
                        <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalCost, 'decimal').slice(-3, -2) }}</div>
                        <div class="text-sm">{{ $n(spec.finalCost, 'decimal').slice(-2) }}</div>
                      </span>
                    </li>
                    <li class="pb-2">
                      <span>
                        {{ $t('shipping.finalObtainCost') }} {{ $t('currency.CNY.symbol') }}
                      </span>
                      <span class="flex">
                        <div class="cost-card__cost">{{ $n(spec.finalObtainCost, 'integer') }}</div>
                        <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalObtainCost, 'decimal').slice(-3, -2) }}</div>
                        <div class="text-sm">{{ $n(spec.finalObtainCost, 'decimal').slice(-2) }}</div>
                      </span>
                    </li>
                    <li class="pb-2">
                      <span>
                        {{ $t('shipping.profit') }}  {{ $t('currency.CNY.symbol') }}
                      </span>
                      <span class="flex">
                        <div style="color: #00ff16;">{{ $n(spec.profit, 'integer') }}</div>
                        <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.profit, 'decimal').slice(-3, -2) }}</div>
                        <div class="text-sm">{{ $n(spec.profit, 'decimal').slice(-2) }}</div>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="spec-summary__actions">
                <Button text @click.prevent class="mb-4">
                  <template v-slot:icon>
                    <Icon size="32">
                      {{ icons.ziPaperPlane }}
                    </Icon>
                  </template>
                  <span class="text-left">{{ $t('shipping.notifyClient') }}</span>
                </Button>
                <Button text @click.prevent class="mb-4">
                  <template v-slot:icon>
                    <Icon size="32">
                      {{ icons.ziPrint }}
                    </Icon>
                  </template>
                  <span class="text-left">{{ $t('shipping.print') }}</span>
                </Button>
                <Button text @click.prevent>
                  <template v-slot:icon>
                    <Icon size="32">
                      {{ icons.ziShare }}
                    </Icon>
                  </template>
                  <span class="text-left">{{ $t('shipping.share') }}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ziSettings, ziPaperPlane, ziPrint, ziShare } from '@/assets/icons'

import StatusBar from '@/components/StatusBar'

import spec from '../mixins/spec'

export default {
  name: 'Preview',
  components: {
    StatusBar,
  },
  mixins: [spec],
  data () {
    return {
      headers: [
        { text: '#', value: 'number', align: 'right', width: 55 },
        { text: 'Фото', value: 'name', align: 'left', width: 80 },
        { text: 'Наименование', value: 'status', align: 'left', width: 360 },
        { text: 'Доп. изобр.', value: 'status', align: 'left', width: 80 },
        { text: 'Цена (¥)', value: 'status', width: 100 },
        { text: 'Кол-во', value: 'status', width: 55 },
        { text: 'Стоимость (¥)', value: 'status', width: 100 },
        { text: 'Кол-во гр. мест', value: 'status', width: 70 },
        { text: 'Номера гр. мест', value: 'status', width: 70 },
        { text: 'Оставить заметку', value: 'status', width: 80 },
      ],
      items: [
        {
          photo: null,
          name: 'The Lamp B-00b',
          model: 'D1B11-L E14 LED Corning Gorilla Glass',
          status: 'v proizvodstve',
          morePhoto: null,
          price: '1 375',
          qty: 25,
          cost: '2 700',
          cargoQty: 1,
          cargoNum: 1,
          note: null,
        },
        {
          photo: null,
          name: 'The Lamp B-00b',
          model: 'D1B11-L E14 LED Corning Gorilla Glass',
          status: 'v proizvodstve',
          morePhoto: null,
          price: '1 375',
          qty: 25,
          cost: '2 700',
          cargoQty: 1,
          cargoNum: 1,
          note: null,
        },
        {
          photo: null,
          name: 'The Lamp B-00b',
          model: 'D1B11-L E14 LED Corning Gorilla Glass',
          status: 'v proizvodstve',
          morePhoto: null,
          price: '1 375',
          qty: 25,
          cost: '2 700',
          cargoQty: 1,
          cargoNum: 1,
          note: null,
        },
      ],
      containers: [
        { type: '20', loaded: 100 },
        { type: '20', loaded: 28 },
      ],
      icons: {
        ziSettings,
        ziPaperPlane,
        ziPrint,
        ziShare,
      },
    }
  },
  computed: {
    unloadedContainers () {
      return this.containers.filter(c => c.loaded !== 100)
    },
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
  padding: 50px 0 50px;
}
..light-theme .spec-summary {
  @apply bg-background;
}

.spec-summary__wrapper {
  @apply flex justify-between;
}

.spec-summary__info {
  width: 340px;
}

.spec-summary__cost {
  @apply flex-grow;
  max-width: 490px;
}
.spec-summary__cost__card {
  padding: 40px 60px 60px;
  background-color: #272727;
  border-radius: 4px;
  font-size: 18px;
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

.spec-summary__actions {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
}
.spec-summary__actions > div {
  display: flex;
}
.spec-summary__actions > div:not(:last-child) {
  margin-bottom: 25px;
}
.spec-summary__actions a {
  @apply text-primary;
}
.spec-summary__actions a:hover {
  color: #28ACD9;
}
.spec-summary__actions__icon {
  width: 28px;
  margin-right: 8px;
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
</style>
