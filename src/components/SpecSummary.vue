<template>
  <div class="spec-summary">

    <v-dialog
      v-model="paperList"
      max-width="443"
    >
      <PaperListModal
        :items="papers"
        @close="paperList = false"
        @openPaper="openContract"
        @createPaper="createContract"
      />
    </v-dialog>

    <v-dialog
      v-model="paperConfigurator"
      :fullscreen="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
      content-class="dialog-full-height rounded-none paper-configurator-dialog"
      max-width="906"
      scrollable
      persistent
    >
      <PaperConfiguratorModal
        :blank="blank"
        :create="create"
        @update="contractCreated"
        @close="paperConfigurator = false"
      />
    </v-dialog>

    <v-dialog
      v-model="printDialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      content-class="dialog-full-height bg-gray-800"
      max-width="900"
      scrollable
      persistent
    >
      <PrintSettings
        :org-id="orgId"
        :spec-id="spec.id"
        :requisite-id="spec.requisite"
        :client="spec.client || {}"
        :shipment="spec.shipment"
        :customs="spec.customs"
        :amount="spec.total"
        :amount-in-words="spec.amountInWords"
        :amount-in-words-client-lang="spec.amountInWordsClientLang"
        :loading="printLoading"
        @update="v => updateSpec(v)"
        @close="printDialog = false"
        @print="doPrint"
      />
    </v-dialog>

    <div>
      <h4 class="text-lg mb-4">
        {{ $t('shipping.summaryTitle') }}
      </h4>
      <div class="spec-summary__wrapper flex-col lg:flex-row">
        <div class="spec-summary__info" v-if="isOwnerOrManager || isWarehouseman">
          <div v-if="containers.length > 0" class="relative pb-5">
            <div
              v-if="spec.shipped"
              class="spec-summary__container__image spec-summary__container__image--shipped w-full"
              style="top: -16px; left: -20px; width: 350px; background-size: contain; height: auto; z-index: 1;"
            />
            <template
              v-for="(container, i) of containers"
            >
              <div
                v-if="!container.full"
                :key="`unloaded-${i}`"
                class="spec-summary__container"
              >
                <div
                  class="spec-summary__container__image"
                  :class="[container.size === '_20' ? 'spec-summary__container__image--full' : 'spec-summary__container__image--full-sm']"
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
                  class="spec-summary__container"
                >
                  <div
                    class="spec-summary__container__image"
                    :class="[container.size === '_20' ? 'spec-summary__container__image--full' : 'spec-summary__container__image--full-sm']"
                    :style="{
                      width: '100%',
                      height: container.size === '_20' ? '85px' : '48px'
                    }"
                  />
                  <div class="spec-summary__container__label">
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
                <div class="spec-summary__container py-2 flex justify-center text-white">
                  <Icon>{{ icons.mdiPlusThick }}</Icon>
                </div>
                <div
                  class="spec-summary__container"
                >
                  <div
                    class="spec-summary__container__image"
                    :class="[container.size === '_20' ? 'spec-summary__container__image--full' : 'spec-summary__container__image--full-sm']"
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
            <ul class="leaders">
              <li
                v-for="(c, i) in containers"
                :key="i"
              >
                <span>
                  <select
                    v-if="isOwnerOrManager"
                    :value="`${c.size}${c.mode}`"
                    :disabled="setContainerSizeLoading"
                    name="container-size"
                    class="simple-select"
                    @change="setContainerSize(c.id, $event)"
                  >
                    <option value="_20_DC">
                      <span class="leaders__num cursor-pointer" style="padding-right:0">
                        20{{ $t('shipping.containerMeasure') }}DC
                      </span>
                    </option>
                    <option value="_40_HC">
                      <span class="leaders__num cursor-pointer" style="padding-right:0">
                        40{{ $t('shipping.containerMeasure') }}HC
                      </span>
                    </option>
                    <option value="_45_HC">
                      <span class="leaders__num cursor-pointer" style="padding-right:0">
                        45{{ $t('shipping.containerMeasure') }}HC
                      </span>
                    </option>
                  </select>
                  <span v-else>
                    {{ `${c.size ? c.size.slice(1) : ''}${$t('shipping.containerMeasure')}${c.mode ? c.mode.slice(1) : ''}` }}
                  </span>
                  {{ ` ${$t('shipping.container')} ${$t('shipping.containerLoaded')}` }}
                </span>
                <span class="leaders__num">
                  {{ c.loaded || 0 }}%
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.estimateDate') }}</span>
                <span class="leaders__num">
                  {{ spec.estimateShippingDate ? $d($parseDate(spec.estimateShippingDate), 'short') : '-' }}
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.totalVolume') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.totalVolume || 0) }} {{ $t('measure.m') }}<sup>3</sup>
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.totalWeight') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.totalWeight || 0) }} {{ $t('measure.kg') }}
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.qtyOfPackages') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.qtyOfPackages || 0) }}
                </span>
              </li>
            </ul>
            <ToggleButton
              v-if="isOwnerOrManager"
              :value="spec.shipped"
              class="my-6"
              @input="updateSpec({ shipped: $event })"
            >
              <span>{{ $t('shipping.setShipped') }}</span>
            </ToggleButton>
          </div>
        </div>
        <div class="spec-summary__cost" v-if="isOwnerOrManager || isAccountant">
          <div class="spec-summary__cost__card">
            <ul>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.finalCost') }} {{ $t(`currency.${currency}.symbol`) }}
                </span>
                <div class="flex-grow dots" />
                <!-- TODO to custom component or Intl polyfill -->
                <!-- i18n-n has Error formatter.formatToParts is not a function. -->
                <!-- <span class="flex">
                  <div class="text-white">{{ $n(spec.finalCost, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalCost, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.finalCost, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.finalCost || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.finalObtainCost') }} {{ $t(`currency.${currency}.symbol`) }}
                </span>
                <div class="flex-grow dots" />
                <!-- <span class="flex">
                  <div class="text-white">{{ $n(spec.finalObtainCost, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalObtainCost, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.finalObtainCost, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.finalObtainCost || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.profit') }}  {{ $t(`currency.${currency}.symbol`) }}
                </span>
                <div class="flex-grow dots" />
                <!-- <span class="flex">
                  <div style="color: #00ff16;">{{ $n(spec.profit, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.profit, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.profit, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.profit || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div :style="{ color: spec.profit > 0 ? '#00ff16' : '#ffffff' }">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
            </ul>
          </div>
          <div class="spec-summary__cost__card" style="background-image: linear-gradient(to top, #272727 0%, #272727 80%, #1d1d1b 95%, #1d1d1b 100%);">
            <ul>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.totalPrepay') }} {{ $t(`currency.${currency}.symbol`) }}
                </span>
                <div class="flex-grow dots" />
                <!-- <span class="flex">
                  <div class="text-white">{{ $n(spec.totalPrepay, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.totalPrepay, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.totalPrepay, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.totalPrepay || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.totalClientDebt') }} {{ $t(`currency.${currency}.symbol`) }}
                </span>
                <div class="flex-grow dots" />
                <!-- <span class="flex">
                  <div style="color: #ff2900;">{{ $n(spec.totalClientDebt, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.totalClientDebt, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.totalClientDebt, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.totalClientDebt || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div :style="{ color: spec.totalClientDebt > 0 ? '#ff2900' : '#ffffff' }">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
            </ul>
          </div>
          <div class="flex items-center bg-gray-700 rounded-md p-5 mt-4" v-if="isOwnerOrManager">
            <div class="flex-grow text-gray-100">
              <span>{{ $t('shipping.documentRate') }}</span>
              <select
                :value="currency"
                :class="[
                  'simple-select text-sm ml-px'
                ]"
                @change="updateSpec({ currency: $event.target.value })"
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
            <div class="w-20 mr-2">
              <TextField
                :value="spec.currencyRate"
                :placeholder="$t('placeholder.emptyNumber')"
                :disabled="isCurrencyDisabled"
                lazy
                type="number"
                inputmode="decimal"
                format-style="decimal"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-gray-200"
                @input="updateSpec({ currencyRate: $event })"
              />
            </div>
            <div class="text-gray-200">
              {{ $t(`currency.USD.iso-4217`) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="py-10" v-if="isOwnerOrManager">
      <div class="flex flex-wrap">
        <!-- Delivery -->
        <SpecShipment
          :item="spec.shipment"
          @update="v => updateSpec(v)"
        />
        <!-- Customs -->
        <SpecCustoms
          :shipment-type="(spec.shipment && spec.shipment.activeType) || ''"
          :item="spec.customs"
          :amount="spec.total"
          :amount-in-words="spec.amountInWords"
          :amount-in-words-client-lang="spec.amountInWordsClientLang"
          @update="v => updateSpec(v)"
        />
      </div>
    </div>

    <div class="pb-10" v-if="isOwnerOrManager">
      <h4 class="text-xl font-semibold leading-6 mb-4">
        {{ $t('shipping.actions') }}
      </h4>
      <div class="bg-gray-700 rounded-md p-3 select-none">
        <div class="flex flex-wrap lg:justify-between">
          <div class="w-full md:w-auto p-2">
            <a
              :href="`/paper/${$route.params.specId}`"
              style="min-width: 85px"
              target="_blank"
              class="w-full inline-block rounded-md border border-gray-400 select-none focus:outline-none focus:border-primary hover:border-primary transition-colors duration-100 ease-out"
            >
              <div class="h-12 flex items-center px-2">
                <i class="icon-eay text-2xl mr-2" />
                <span class="text-primary whitespace-nowrap">
                  {{ $t('shipping.previewAsCustomer') }}
                </span>
              </div>
            </a>
          </div>
          <div class="w-full md:w-auto p-2">
            <a
              href="#"
              style="min-width: 85px"
              class="w-full inline-block rounded-md border border-transparent select-none focus:outline-none focus:border-primary hover:border-primary transition-colors duration-100 ease-out"
              @click.prevent="openPaperList"
            >
              <div class="h-12 flex items-center px-2">
                <i class="icon-settings text-2xl mr-2" />
                <span class="text-primary whitespace-nowrap">
                  {{ $t('shipping.paperConfigurator') }}
                </span>
              </div>
            </a>
          </div>
          <div class="w-full md:w-auto p-2">
            <a
              href="#"
              style="min-width: 85px"
              class="w-full inline-block rounded-md border border-transparent select-none focus:outline-none focus:border-primary hover:border-primary transition-colors duration-100 ease-out"
              @click.prevent="printDialog = true"
            >
              <div class="h-12 flex items-center px-2">
                <i class="icon-printer text-2xl mr-2" />
                <span class="text-primary whitespace-nowrap">
                  {{ $t('shipping.print') }}
                </span>
              </div>
            </a>
          </div>
          <div class="w-full md:w-auto p-2">
            <a
              href="#"
              style="min-width: 85px"
              class="w-full inline-block rounded-md border border-transparent select-none focus:outline-none focus:border-primary hover:border-primary transition-colors duration-100 ease-out"
              @click.prevent="accessControlDialog = true"
            >
              <div class="h-12 flex items-center px-2">
                <i class="icon-add-user text-2xl mr-2" />
                <span class="text-primary whitespace-nowrap">
                  {{ $t('shipping.inviteCustomer') }}
                </span>
              </div>
            </a>
          </div>
          <div class="w-full md:w-auto p-2">
            <button
              disabled
              style="min-width: 85px"
              class="w-full inline-block rounded-md border border-transparent pointer-events-none"
            >
              <div class="h-12 flex items-center px-2 text-gray-400">
                <i class="icon-mail text-2xl mr-2" />
                <span class="whitespace-nowrap">
                  {{ $t('shipping.notifyCustomer') }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="accessControlDialog"
      max-width="320px"
    >
      <div class="p-4 bg-gray" style="color: #aaa;">
        <h3 class="pb-3 font-semibold">{{ $t('shipping.access') }}</h3>
        <Spinner v-if="linkAccessLoading" />
        <template v-else>
          <!-- <ToggleButton
            :value="linkAccess"
            class="mb-2"
            @input="updateLinkAccess"
          >
            <span>{{ $t('shipping.linkAccess') }}</span>
          </ToggleButton> -->
          <TextField
            ref="linkInput"
            :value="link"
            hide-details
            squared
            readonly
            solo
            class="mb-1"
          />
          <Button
            @click="copyLink"
          >
            {{ $t('shipping.copyLink') }}
          </Button>
        </template>
        <template>
          <h4 class="pt-5">
            {{ $t('shipping.sendAccessLink') }}
          </h4>
          <TextField
            ref="emailAccessInput"
            v-model="emailAccessInput"
            :disabled="sendAccessLinkLoading"
            label="Email"
            type="email"
            required
          />
          <Button
            :disabled="sendAccessLinkLoading"
            @click="sendLinkAccessToEmail(emailAccessInput)"
          >
            {{ $t('shipping.sendEmail') }}
          </Button>
        </template>
        <Spinner v-if="emailAccessLoading" />
        <div v-else class="py-4">
          <h4 v-if="emailAccess.length > 0" class="font-semibold">
            {{ $t('shipping.hasAccess') }}
          </h4>
          <div
            v-for="a in emailAccess"
            :key="a.email"
            class="flex py-2"
          >
            <div class="flex-grow">
              {{ a.email }}
            </div>
            <v-slide-x-transition mode="out-in">
              <div v-if="removeEmailAccessLoading === a.email">
                <Spinner />
              </div>
              <div
                v-else
                class="cursor-pointer"
                @click="removeEmailAccess(a.email)"
              >
                <Icon size="18">
                  {{ icons.mdiClose }}
                </Icon>
              </div>
            </v-slide-x-transition>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'

import { mdiClose, mdiPlusThick } from '@mdi/js'
import { ziSettings, ziPaperPlane, ziPrint, ziShare } from '@/assets/icons'

import PaperListModal from '@/components/PaperListModal.vue'
import PaperConfiguratorModal from '@/components/PaperConfiguratorModal.vue'
import PrintSettings from '../components/PrintSettings.vue'
import SpecShipment from '../components/SpecShipment.vue'
import SpecCustoms from '../components/SpecCustoms.vue'

import { SpecCurrency, Role } from '../graphql/enums'
import { LIST_ORG_CONTRACTS, GET_SPEC_LINK_ACCESS, GET_SPEC_EMAIL_ACCESS } from '../graphql/queries'
import {
  UPDATE_SPEC,
  OPEN_LINK_ACCESS,
  CLOSE_LINK_ACCESS,
  ADD_EMAIL_ACCESS_TO_SPEC,
  REMOVE_EMAIL_ACCESS_TO_SPEC,
  SEND_LINK_ACCESS_TO_EMAIL,
  SET_SPEC_CONTAINER_SIZE,
  SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
} from '../graphql/mutations'
import { DEFAULT_CURRENCY } from '../config/globals'

import specPdf from '../components/specPdf'

export default {
  name: 'SpecSummary',
  components: {
    PaperListModal,
    PaperConfiguratorModal,
    PrintSettings,
    SpecShipment,
    SpecCustoms,
  },
  props: {
    spec: {
      type: Object,
      default: () => ({}),
    },
    role: {
      type: String,
      required: true,
    },
  },
  apollo: {
    listOrgContracts: {
      query: LIST_ORG_CONTRACTS,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },

  },
  data () {
    return {
      printLoading: false,
      printDialog: false,
      setContainerSizeLoading: false,
      setContainerCustomCapacityLoading: false,
      sendAccessLinkLoading: false,
      addEmailAccessLoading: false,
      removeEmailAccessLoading: null,
      emailAccessLoading: false,
      emailAccess: [],
      emailAccessInput: '',
      accessControlDialog: false,
      linkAccessLoading: false,
      linkAccess: false,
      blank: {},
      papers: [],
      paperList: false,
      paperConfigurator: false,
      create: false,
      icons: {
        mdiClose,
        mdiPlusThick,
        ziSettings,
        ziPaperPlane,
        ziPrint,
        ziShare,
      },
    }
  },
  computed: {
    isOwnerOrManager () {
      return this.role === Role.OWNER || this.role === Role.MANAGER
    },
    isAccountant () {
      return this.role === Role.ACCOUNTANT
    },
    isWarehouseman () {
      return this.role === Role.WAREHOUSEMAN
    },
    isCurrencyDisabled () {
      return this.currency === SpecCurrency.USD
    },
    currencies () {
      return Object.values(SpecCurrency).map(el => {
        return {
          text: el,
          value: el,
        }
      })
    },
    currency () {
      return this.spec.currency || DEFAULT_CURRENCY
    },
    link () {
      return `${window.location.protocol}//${window.location.host}/paper/${this.specId}`
    },
    orgId () {
      return this.$route.params.orgId
    },
    specId () {
      return this.$route.params.specId
    },
    containers () {
      return this.spec.containers || []
    },
  },
  watch: {
    accessControlDialog (val) {
      if (val) {
        // this.getEmailAccess()
      } else {
        setTimeout(() => {
          this.emailAccessInput = ''
        }, 250)
      }
    },
    paperConfigurator (val) {
      if (!val) {
        setTimeout(() => {
          const dialog = document.querySelector('.paper-configurator-dialog .modal-body')
          if (dialog) dialog.scrollTop = 0
        }, 200)
      }
    },
  },
  methods: {
    async doPrint (requisite, client, shipment, customs) {
      try {
        this.printLoading = true
        const method = 'print'
        await specPdf(this.spec, requisite, client, shipment, customs, method, false)
      } catch (error) {
        this.$notify({
          color: 'red',
          text: `Error creating PDF: ${error.message}`,
        })
        throw new Error(error)
      } finally {
        this.printLoading = false
      }
    },
    async setContainerSize (containerId, e) {
      try {
        const val = e.target.value || ''
        const split = val.split('_')
        const inputSize = `_${split[1]}`
        const inputMode = `_${split[2]}`
        if (!containerId) return
        this.setContainerSizeLoading = true
        await this.$apollo.mutate({
          mutation: SET_SPEC_CONTAINER_SIZE,
          variables: {
            specId: this.specId,
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
        await this.$apollo.mutate({
          mutation: SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
          variables: {
            specId: this.specId,
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
    async getEmailAccess () {
      try {
        this.emailAccessLoading = true
        const { data } = await this.$apollo.query({
          query: GET_SPEC_EMAIL_ACCESS,
          variables: {
            id: this.specId,
          },
          fetchPolicy: 'network-only',
        })
        this.emailAccess = data.getSpecEmailAccess || []
      } catch (error) {
        throw new Error(error)
      } finally {
        this.emailAccessLoading = false
      }
    },
    async addEmailAccess (email) {
      try {
        const errors = this.$refs.emailAccessInput.validate()
        if (errors) return
        this.addEmailAccessLoading = true
        const result = await this.$apollo.mutate({
          mutation: ADD_EMAIL_ACCESS_TO_SPEC,
          variables: {
            specId: this.specId,
            email,
          },
        })
        this.getEmailAccess()
        this.emailAccessInput = ''
        return result
      } catch (error) {
        throw new Error(error)
      } finally {
        this.addEmailAccessLoading = false
      }
    },
    async removeEmailAccess (email) {
      try {
        this.removeEmailAccessLoading = email
        const result = await this.$apollo.mutate({
          mutation: REMOVE_EMAIL_ACCESS_TO_SPEC,
          variables: {
            specId: this.specId,
            email,
          },
        })
        this.getEmailAccess()
        return result
      } catch (error) {
        throw new Error(error)
      } finally {
        this.removeEmailAccessLoading = false
      }
    },
    async sendLinkAccessToEmail (email) {
      try {
        const errors = this.$refs.emailAccessInput.validate()
        if (errors) return
        this.sendAccessLinkLoading = true
        const result = await this.$apollo.mutate({
          mutation: SEND_LINK_ACCESS_TO_EMAIL,
          variables: {
            specId: this.specId,
            email,
          },
        })
        this.emailAccessInput = ''
        this.$notify({
          color: 'green',
          text: this.$t('message.emailSent', { email }),
        })
        return result
      } catch (error) {
        this.$notify({
          color: 'red',
          text: this.$t('message.failedToSent'),
        })
        throw new Error(error)
      } finally {
        this.sendAccessLinkLoading = false
      }
    },
    copyLink () {
      let selection = null
      try {
        const input = this.$refs.linkInput
        if (!input) {
          throw new Error('Input not find.')
        }
        selection = document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false
        input.$el.querySelector('input').select()
        const successful = document.execCommand('copy')
        if (successful) {
          this.$notify({
            color: 'green',
            text: this.$t('message.linkCopied'),
          })
        } else {
          throw new Error('Unsuccessful.')
        }
      } catch (error) {
        this.$logger.info('Copy link error: ', error)
        this.$notify({
          color: 'orange',
          text: this.$t('message.linkNotCopied'),
        })
      }
      document.getSelection().removeAllRanges()
      if (selection) {
        document.getSelection().addRange(selection)
      }
    },
    async getLinkAccess () {
      try {
        this.linkAccessLoading = true
        const { data } = await this.$apollo.query({
          query: GET_SPEC_LINK_ACCESS,
          variables: {
            id: this.specId,
          },
          fetchPolicy: 'network-only',
        })
        this.linkAccess = data.getSpecLinkAccess || null
      } catch (error) {
        throw new Error(error)
      } finally {
        this.linkAccessLoading = false
      }
    },
    async updateLinkAccess (value) {
      try {
        if (value) {
          await this.openLinkAccess()
        } else {
          await this.closeLinkAccess()
        }
        this.$notify({
          color: 'primary',
          text: this.$t('shipping.linkAccessUpdated'),
        })
      } catch (error) {
        throw new Error(error)
      }
    },
    async openLinkAccess () {
      try {
        const result = await this.$apollo.mutate({
          mutation: OPEN_LINK_ACCESS,
          variables: {
            specId: this.specId,
          },
        })
        return result
      } catch (error) {
        throw new Error(error)
      }
    },
    async closeLinkAccess () {
      try {
        const result = await this.$apollo.mutate({
          mutation: CLOSE_LINK_ACCESS,
          variables: {
            specId: this.specId,
          },
        })
        return result
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateSpec (input) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_SPEC,
          variables: {
            id: this.spec.id,
            input,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    openPaperList () {
      this.papers = this.listOrgContracts
      this.paperList = true
    },
    openContract (id) {
      if (id) {
        this.create = false
        this.blank = cloneDeep(this.papers.find(paper => paper.id === id))
      }
      this.paperList = false
      this.paperConfigurator = true
    },
    createContract () {
      this.blank = {
        name: '',
        title: '',
        country: '',
        docHeader: '',
        useDefaultDocHeader: false,
        requisiteId: '',
        items: [{
          title: '',
          paragraphs: [],
        }],
        specItems: [{
          title: '',
          paragraphs: [],
        }],
      }
      this.create = true
      this.paperList = false
      this.paperConfigurator = true
    },
    contractCreated () {
      this.$apollo.queries.listOrgContracts.refetch()
    },
  },
}
</script>

<style lang="postcss" scoped>
.spec-summary {
  padding: 50px 0 50px;
}

.spec-summary__wrapper {
  @apply flex justify-between;
}

.spec-summary__info {
  max-width: 320px;
}

.spec-summary__cost {
  @apply flex-grow;
  max-width: 490px;
}
.spec-summary__cost__card {
  padding: 18px 14px;
  background-color: #272727;
  border-radius: 4px;
  font-size: 16px;
}
@screen sm {
  .spec-summary__cost__card {
    font-size: 18px;
    padding: 40px 60px;
  }
}

.spec-summary__actions {
  width: 100%;
  padding-top: 16px;
  padding-bottom: 20px;
}
.spec-summary__actions > button {
  display: flex;
}
.spec-summary__actions > button:not(:last-child) {
  margin-bottom: 25px;
}

@screen lg {
  .spec-summary__actions {
    width: 180px;
  }
  .spec-summary__cost {
    @apply mx-4;
  }
  .spec-summary__info {
    width: 320px;
  }
}
.spec-summary__container {
  width: 210px;
  @apply relative;
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
  background-image: url("/img/container-full-40.png");
}
.spec-summary__container__image--shipped {
  background-image: url("/img/container-shipped.png");
}

.spec-summary__info ul.leaders span:first-child,
.spec-summary__info ul.leaders span + span {
  @apply bg-gray-900;
}
.spec-summary__cost ul.leaders span:first-child,
.spec-summary__cost ul.leaders span + span {
  background-color: #272727;
}

.spec-summary .leaders {
  line-height: 1.625rem;
  padding: 0;
  overflow-x: hidden;
  list-style: none}
.spec-summary .leaders li:after {
  float: left;
  width: 0;
  white-space: nowrap;
  content:
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "}
.spec-summary .leaders span:first-child {
  padding-right: 0.33em;}
.spec-summary .leaders span + span {
  float: right;
  padding-left: 0.33em;
  position: relative;
  z-index: 1
}
.spec-summary .leaders__num {
  @apply text-white font-bold
}
</style>
