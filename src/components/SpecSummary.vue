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
        <div class="spec-summary__info">
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
                  {{ ` ${$t('shipping.container')} ${$t('shipping.containerLoaded')}` }}
                </span>
                <span class="leaders__num">
                  {{ c.loaded }}%
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
            <ToggleButton
              :value="spec.shipped"
              class="my-6"
              @input="updateSpec({ shipped: $event })"
            >
              <span>{{ $t('shipping.setShipped') }}</span>
            </ToggleButton>
          </div>
        </div>
        <div class="spec-summary__cost">
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
                    <div style="color: #00ff16;">{{ slotProps.integer }}</div>
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
                    <div style="color: #ff2900;">{{ slotProps.integer }}</div>
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
          <div class="flex items-center bg-gray-700 rounded-md p-5 mt-4">
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

    <div class="py-10">
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

    <div class="pb-10">
      <h4 class="text-xl font-semibold leading-6 mb-4">
        {{ $t('shipping.actions') }}
      </h4>
      <div class="bg-gray-700 rounded-md p-3 select-none">
        <div class="flex flex-wrap lg:justify-between">
          <div class="w-full md:w-auto p-2">
            <a
              :href="`/paper/${$route.params.specId}`"
              target="_blank"
              class="w-full inline-block rounded-md border border-gray-400 hover:border-primary"
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
              class="w-full inline-block rounded-md border border-transparent hover:border-primary"
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
              class="w-full inline-block rounded-md border border-transparent hover:border-primary"
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
              class="w-full inline-block rounded-md border border-transparent hover:border-primary"
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
            <a
              class="w-full inline-block rounded-md border border-transparent hover:border-primary pointer-events-none"
              @click.prevent
            >
              <div class="h-12 flex items-center px-2 text-gray-400">
                <i class="icon-mail text-2xl mr-2" />
                <span class="whitespace-nowrap">
                  {{ $t('shipping.notifyCustomer') }}
                </span>
              </div>
            </a>
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

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from '../plugins/pdfmake/vfs_fonts'

import { mdiClose, mdiPlusThick } from '@mdi/js'
import { ziSettings, ziPaperPlane, ziPrint, ziShare } from '@/assets/icons'

import PaperListModal from '@/components/PaperListModal.vue'
import PaperConfiguratorModal from '@/components/PaperConfiguratorModal.vue'
import PrintSettings from '../components/PrintSettings.vue'
import SpecShipment from '../components/SpecShipment.vue'
import SpecCustoms from '../components/SpecCustoms.vue'

import Countries from '../config/countries-iso3.json'

import { ClientType, ShipmentType, SpecCurrency } from '../graphql/enums'
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
    genLabel (path, clientLang, opt = {}) {
      const flat = opt.flat
      const secondary = opt.secondary
      const value = opt.value
      const fallback = opt.fallback || ''
      const args = opt.args || {}
      const defaultLang = this.$i18n.fallbackLocale
      const isDefaultLang = clientLang === defaultLang
      const title = this.$te(path, defaultLang)
        ? this.$t(path, defaultLang, args)
        : fallback
      const subtitle = this.$te(path, clientLang)
        ? this.$t(path, clientLang, args)
        : ''
      if (flat) {
        const v = subtitle && !isDefaultLang ? `${title} / ${subtitle}` : `${title}`
        return secondary ? v : `${v}:`
      }
      const stack = []
      if (secondary) {
        stack.push({
          text: title,
        })
      } else if (value) {
        stack.push({
          text: [
            {
              text: `${title}: `,
              bold: true,
            },
            {
              text: value,
            },
          ],
        })
      } else {
        stack.push({
          text: `${title}:`,
          bold: true,
        })
      }
      if (subtitle && !isDefaultLang) {
        stack.push({
          text: subtitle,
          color: '#595959',
          fontSize: 6.7,
          italics: true,
        })
      }
      return stack
    },
    genValues (...args) {
      let result = ''
      if (args.length > 0) {
        args.forEach(v => {
          const val = v || ''
          result += result ? ` / ${val}` : val
        })
      }
      return result
    },
    genBillToBody (client, clientLang) {
      const items = [
        [
          {
            stack: this.genLabel('print.billTo', clientLang),
          },
          {
            stack: [
              {
                text: client.fullName,
              },
            ],
          },
        ],
        client.clientType === ClientType.LEGAL
          ? [
            {
              stack: this.genLabel('print.addressTelFax', clientLang),
            },
            {
              stack: [
                {
                  text: this.genValues(client.legalAddress, client.phone, client.fax),
                },
              ],
            },
          ]
          : [
            {
              stack: this.genLabel('print.addressTelFax', clientLang),
            },
            {
              stack: [
                {
                  text: this.genValues(client.deliveryAddress, client.mobilePhone, client.additionalPhone),
                },
              ],
            },
          ],
      ]
      if (client.importerActive) {
        items.push([
          {
            stack: this.genLabel('print.importer', clientLang),
          },
          {
            stack: [
              {
                text: client.consignee,
              },
            ],
          },
        ])
        items.push([
          {
            stack: this.genLabel('print.addressTelFax', clientLang),
          },
          {
            stack: [
              {
                text: this.genValues(client.shippingAddress, client.contactMobilePhone, client.importerFax),
              },
            ],
          },
        ])
        items.push([
          {
            stack: this.genLabel('print.contactPersonEmail', clientLang),
          },
          {
            stack: [
              {
                text: this.genValues(client.contactPerson, client.importerEmail),
              },
            ],
          },
        ])
      }
      return items
    },
    genDeliveryInfoTable (shipment, clientLang) {
      const widths = shipment.sentThrough
        ? ['auto', '*', 'auto', '*', 'auto', '*']
        : ['auto', '*', '50%']
      const row1 = [
        {
          stack: this.genLabel('print.from', clientLang),
        },
        {
          fit: ['*', 3],
          margin: [0, 10, 0, 0],
          svg: `<svg viewBox="0 0 110 3" width="110" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="110" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="110" y2="2" stroke="black" stroke-width="1"/></svg>`,
        },
        {
          stack: this.genLabel('print.via', clientLang),
        },
        {
          fit: ['*', 3],
          margin: [0, 10, 0, 0],
          svg: `<svg viewBox="0 0 110 3" width="110" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="110" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="110" y2="2" stroke="black" stroke-width="1"/></svg>`,
        },
        {
          stack: this.genLabel('print.to', clientLang),
        },
        '',
      ]
      const row2 = [
        {
          stack: this.genLabel('print.from', clientLang),
        },
        {
          fit: ['*', 3],
          margin: [0, 10, 0, 0],
          svg: `<svg viewBox="0 0 180 3" width="180" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="180" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="180" y2="2" stroke="black" stroke-width="1"/></svg>`,
        },
        {
          stack: this.genLabel('print.to', clientLang),
        },
      ]
      const row = shipment.sentThrough
        ? [
          {
            colSpan: 2,
            text: shipment.sentFrom,
          },
          '',
          {
            colSpan: 2,
            text: shipment.sentThrough,
          },
          '',
          {
            colSpan: 2,
            text: shipment.sentDestination,
          },
        ]
        : [
          {
            colSpan: 2,
            text: shipment.sentFrom,
          },
          '',
          {
            text: shipment.sentDestination,
          },
        ]
      return {
        widths,
        body: [
          shipment.sentThrough ? row1 : row2,
          row,
        ],
      }
    },
    genShipmentBody (shipment, customs, clientLang) {
      const result = []
      if (shipment.activeType === ShipmentType.MARINE) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          {
            stack: this.genLabel('print.quanitiyOfContainers', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.containersCount,
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.billOfLadingNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.billOfLadingNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.containersAndSealsNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.containersNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.vessel', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.ship || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.exportDate', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.exportDate ? this.$d(this.$parseDate(shipment.marine.exportDate), 'short', clientLang) : '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.incoterms', clientLang),
          },
          {
            stack: [
              {
                text: customs.terms || '',
              },
            ],
          },
          '',
          '',
        ])
      } else if (shipment.activeType === ShipmentType.AIR) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang),
          },
          {
            stack: this.genLabel('print.quanitiyOfCartons', clientLang),
          },
          {
            stack: [
              {
                text: shipment.air.numbersOfPkg,
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.airWaybillNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.air.airWaybillNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.flight', clientLang),
          },
          {
            stack: [
              {
                text: shipment.air.flight || '',
              },
            ],
          },
        ])
      } else if (shipment.activeType === ShipmentType.RAILWAY) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          {
            stack: this.genLabel('print.qtyOfContainersPlatforms', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.containersCount,
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.crmNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.internationalWaybillNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.carriageNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.containersNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.train', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.train || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.exportDate', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.exportDate ? this.$d(this.$parseDate(shipment.railway.exportDate), 'short', clientLang) : '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.incoterms', clientLang),
          },
          {
            stack: [
              {
                text: customs.terms || '',
              },
            ],
          },
          '',
          '',
        ])
      } else if (shipment.activeType === ShipmentType.CAR) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          {
            stack: this.genLabel('print.vehicle', clientLang),
          },
          {
            stack: [
              {
                text: shipment.car.vehicleNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.crmNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.car.internationalWaybillNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.trailer', clientLang),
          },
          {
            stack: [
              {
                text: shipment.car.semitrailerNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.incoterms', clientLang),
          },
          {
            stack: [
              {
                text: customs.terms || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.exportDate', clientLang),
          },
          {
            stack: [
              {
                text: shipment.car.exportDate ? this.$d(this.$parseDate(shipment.car.exportDate), 'short', clientLang) : '',
              },
            ],
          },
        ])
      } else if (shipment.activeType === ShipmentType.MIXED) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          '',
          '',
        ])
        result.push([
          {
            stack: this.genLabel('print.fblNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.internationalWaybillNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.vehicleTrailerFlight', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.containersNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.vessel', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.ship || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.flight', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.flight || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.train', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.train || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.vehicle', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.vehicleNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.incoterms', clientLang),
          },
          {
            stack: [
              {
                text: customs.terms || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.exportDate', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.exportDate ? this.$d(this.$parseDate(shipment.mixed.exportDate), 'short', clientLang) : '',
              },
            ],
          },
        ])
      } else if (shipment.activeType === ShipmentType.EXPRESS) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          {
            stack: this.genLabel('print.quanitiyOfCartons', clientLang),
          },
          {
            stack: [
              {
                text: shipment.express.numbersOfPkg || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.trackingNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.express.postalNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.deliveryCompany', clientLang),
          },
          {
            stack: [
              {
                text: shipment.express.deliveryService || '',
              },
            ],
          },
        ])
      }
      // Static
      result.push([
        {
          stack: this.genLabel('print.shippingMarks', clientLang),
        },
        {
          stack: this.genLabel('print.accordingToContract', clientLang, { secondary: true }),
        },
        {
          stack: this.genLabel('print.exportReference', clientLang),
        },
        {
          stack: this.genLabel('print.accordingToContract', clientLang, { secondary: true }),
        },
      ])
      return result
    },
    genItemBody (clientLang) {
      let index = 0
      const items = []
      const invoices = this.spec.invoices || []
      invoices.forEach(invoice => {
        const products = invoice.products || []
        products.forEach(product => {
          index++
          const price = (product.cost && product.cost.price) || 0
          const amount = (product.cost && product.cost.amount) || 0
          let name = product.name || ''
          if (product.article) {
            name += ` / ${product.article}`
          }
          if (product.info && product.info.description) {
            name += `\n${product.info.description}`
          }
          const unit = product.unit || 'pcs'
          const unitText = this.genLabel(`unit.${unit}`, clientLang, { flat: true, secondary: true })
          const item = [
            { text: `${index}`, alignment: 'center' },
            name,
            { text: `${product.qty || 0} ${unitText}`, alignment: 'right' },
            { text: this.$n(price, 'currency', 'en'), alignment: 'right' },
            { text: this.$n(amount, 'currency', 'en'), alignment: 'right' },
          ]
          items.push(item)
        })
        if (invoice.discountInCurrency) {
          const item = [
            '',
            {
              text: this.genLabel('print.supplierDiscount', clientLang, { flat: true, secondary: true }),
              colSpan: 3,
            },
            '',
            '',
            { text: `-${this.$n(invoice.discountInCurrency, 'currency', 'en')}`, alignment: 'right' },
          ]
          items.push(item)
        }
      })
      return items
    },
    genItemsAmounts (customs, clientLang) {
      const body = [
        [
          '',
          '',
          '',
          {
            text: this.genLabel('print.subtotal', clientLang, { flat: true }),
            alignment: 'right',
          },
          {
            text: this.$n(this.spec.subtotal || 0, 'currency', 'en'),
            alignment: 'right',
          },
        ],
      ]
      if (customs.discount) {
        body.push([
          '',
          '',
          '',
          {
            text: this.genLabel('print.discount', clientLang, { flat: true }),
            alignment: 'right',
          },
          {
            text: this.$n(customs.discount, 'currency', 'en'),
            alignment: 'right',
          },
        ])
      }
      // body.push([
      //   '',
      //   '',
      //   '',
      //   {
      //     text: this.genLabel('print.vat', clientLang, { flat: true }),
      //     alignment: 'right',
      //   },
      //   {
      //     text: this.$n(0, 'currency', 'en'),
      //     alignment: 'right',
      //   },
      // ])
      if (customs.cost) {
        body.push([
          '',
          '',
          '',
          {
            text: this.genLabel('print.shipping', clientLang, { flat: true }),
            alignment: 'right',
          },
          {
            text: this.$n(customs.cost, 'currency', 'en'),
            alignment: 'right',
          },
        ])
      }
      body.push([
        '',
        '',
        '',
        {
          text: this.genLabel('print.total', clientLang, { flat: true }),
          alignment: 'right',
        },
        {
          text: this.$n(this.spec.total || 0, 'currency', 'en'),
          alignment: 'right',
        },
      ])
      // body.push([
      //   '',
      //   '',
      //   '',
      //   {
      //     text: this.genLabel('print.withholdingTax', clientLang, { flat: true }),
      //     alignment: 'right',
      //   },
      //   {
      //     text: this.$n(0, 'currency', 'en'),
      //     alignment: 'right',
      //   },
      // ])
      body.push([
        '',
        '',
        '',
        {
          text: this.genLabel('print.paid', clientLang, { flat: true }),
          alignment: 'right',
        },
        {
          text: this.$n(this.spec.paid || 0, 'currency', 'en'),
          alignment: 'right',
        },
      ])
      const rowIndex = body.length > 3 ? 2 : 1
      body[rowIndex][0] = {
        rowSpan: 2,
        stack: this.genLabel('print.invoiceCurrency', clientLang),
      }
      body[rowIndex][1] = {
        rowSpan: 2,
        stack: this.genLabel('print.currency.usd', clientLang),
      }
      return {
        table: {
          widths: [80, 80, '*', 220, 90],
          body,
        },
        layout: {
          defaultBorder: false,
        },
        margin: [0, 0, 0, 20],
      }
    },
    genAmountBody (depositDueDate, clientLang) {
      const border = depositDueDate
        ? [false, false, false, true]
        : [false, false, false, false]
      const result = [
        [
          '',
          {
            border,
            text: this.genLabel('print.balanceDue', clientLang, { flat: true }),
            alignment: 'right',
            fontSize: 13.3,
          },
          {
            border,
            text: this.$n(this.spec.balanceDue || 0, 'currency', 'en'),
            alignment: 'right',
            fontSize: 13.3,
          },
        ],
      ]
      if (depositDueDate) {
        const date = this.$d(depositDueDate, 'short', clientLang)
        result.push([
          '',
          {
            text: this.genLabel('print.depositeDue', clientLang, { flat: true, args: { date } }),
            alignment: 'right',
          },
          {
            text: this.$n(this.spec.depositDue, 'currency', 'en'),
            alignment: 'right',
          },
        ])
      }
      return result
    },
    genAmountInWords (clientLang) {
      const defaultLang = this.$i18n.fallbackLocale
      const isDefaultLang = clientLang === defaultLang
      const result = []
      if (this.spec.amountInWords) {
        result.push([
          {
            text: `${this.$t('print.amountInWords', defaultLang)}: ${this.spec.amountInWords.toUpperCase()}`,
            alignment: 'right',
          },
        ])
      }
      if (!isDefaultLang && this.spec.amountInWordsClientLang) {
        result.push([
          {
            text: `${this.$t('print.amountInWords', clientLang)}: ${this.spec.amountInWordsClientLang}`,
            alignment: 'right',
          },
        ])
      }
      return result.length > 0
        ? {
          table: {
            widths: ['*'],
            body: result,
          },
          layout: {
            defaultBorder: false,
          },
          margin: [0, 12, 0, 0],
        }
        : null
    },
    doPrint (requisite, client, shipment, customs) {
      // const pdfMake = (await import(/* webpackChunkName: "pdfMake" */ 'pdfmake/build/custom_fonts/pdfmake')).default
      // const pdfFonts = (await import(/* webpackChunkName: "pdfFonts" */ 'pdfmake/build/custom_fonts/vfs_fonts')).default
      const vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs
      pdfMake.vfs = vfs
      pdfMake.fonts = {
        MyriadPro: {
          normal: 'MyriadPro-Regular.ttf',
          bold: 'MyriadPro-Bold.ttf',
          italics: 'MyriadPro-It.ttf',
          bolditalics: 'MyriadPro-BoldIt.ttf',
        },
      }
      const defaultLang = this.$i18n.fallbackLocale
      const clientLang = client.language || defaultLang
      const specCreatedAt = this.$parseDate(this.spec.createdAt)
      const specDueDate = this.$parseDate(this.spec.createdAt)
      const specDepositDueDate = this.spec.depositDueDate ? this.$parseDate(this.spec.depositDueDate) : null
      specDueDate.setTime(specDueDate.getTime() + 7 * 86400000)
      const dd = {
        header: (currentPage, pageCount, pageSize) => {
          return [
            {
              columns: [
                {
                  width: '50%',
                  text: clientLang === 'ru' ? '04021' : '',
                  margin: [4, 0, 4, 0],
                },
                {
                  width: '50%',
                  text: '', // 'Logotype / Логотип',
                  alignment: 'right',
                  margin: [4, 0, 4, 0],
                },
              ],
              fontSize: 10,
              margin: [40, 20, 40, 0],
            },
          ]
        },
        footer: (currentPage, pageCount) => {
          return [
            {
              columns: [
                {
                  width: '50%',
                  margin: [4, 0, 4, 0],
                  text: 'This document created automtically by zennnn.com',
                },
                {
                  width: '50%',
                  margin: [4, 0, 4, 0],
                  text: this.genLabel('print.sheet', clientLang, {
                    flat: true,
                    secondary: true,
                    args: {
                      p: currentPage,
                      t: pageCount,
                    },
                  }),
                  alignment: 'right',
                },
              ],
              fontSize: 8.3,
              italics: true,
              color: '#7b7b7b',
              margin: [40, 10, 40, 0],
            },
          ]
        },
        content: [
          // Requisite block
          {
            table: {
              widths: [110, '*'],
              body: [
                [
                  {
                    stack: this.genLabel('print.seller', clientLang),
                  },
                  requisite.name,
                ],
                [
                  {
                    stack: this.genLabel('print.addressTelFax', clientLang),
                  },
                  this.genValues(requisite.legalAddress, requisite.phone, requisite.fax),
                ],
                [
                  {
                    stack: this.genLabel('print.emailWeb', clientLang),
                  },
                  this.genValues(requisite.email, requisite.website),
                ],
                [
                  {
                    stack: this.genLabel('print.vatNo', clientLang),
                  },
                  requisite.itn || '',
                ],
                [
                  {
                    stack: this.genLabel('print.beneficiyBank', clientLang),
                  },
                  requisite.bankName,
                ],
                [
                  {
                    stack: this.genLabel('print.bankAddress', clientLang),
                  },
                  requisite.bankAddress,
                ],
                [
                  {
                    stack: this.genLabel('print.accountNumberSwift', clientLang),
                  },
                  this.genValues(requisite.bankAccountNumber, requisite.swift),
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 20],
          },
          // Spec info block
          {
            table: {
              widths: [110, '*', 85, 85],
              body: [
                [
                  {
                    fontSize: 17.4,
                    characterSpacing: 4,
                    text: 'INVOICE',
                    bold: true,
                  },
                  {
                    stack: this.genLabel('print.invoiceNo', clientLang, { value: this.spec.specNo }),
                  },
                  {
                    alignment: 'right',
                    stack: this.genLabel('print.invoiceDate', clientLang),
                  },
                  {
                    alignment: 'right',
                    text: this.$d(specDepositDueDate || new Date(), 'short', clientLang),
                  },
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 0],
          },
          // Bill to block
          {
            table: {
              widths: [110, '*'],
              body: this.genBillToBody(client, clientLang),
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === 2 || i === node.table.body.length) ? 1 : 0
              },
              vLineWidth: function (i, node) {
                return 0
              },
            },
            margin: [0, 0, 0, 16],
          },
          // Shipment delivery info
          {
            table: this.genDeliveryInfoTable(shipment, clientLang),
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 16],
          },
          // Shipment
          {
            table: {
              widths: [110, '*', 110, '*'],
              body: this.genShipmentBody(shipment, customs, clientLang),
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 8],
          },
          // Shipment Country of Origin
          {
            table: {
              widths: [110, '*', 110, '*'],
              body: [
                [
                  {
                    stack: this.genLabel('print.countryOfOrigin', clientLang),
                  },
                  {
                    stack: this.genLabel(`countries.${customs.countryOfOrigin}.iso-3`, clientLang, { fallback: Countries[customs.countryOfOrigin], secondary: true }),
                  },
                  {
                    stack: this.genLabel('print.pkgListNo', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: this.spec.specNo,
                      },
                    ],
                  },
                ],
              ],
              margin: [0, 0, 0, 20],
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0) ? 1 : 0
              },
              vLineWidth: function (i, node) {
                return 0
              },
            },
            margin: [0, 0, 0, 16],
          },
          // Items
          {
            table: {
              widths: [40, '*', 90, 90, 90],
              body: [
                [
                  {
                    stack: this.genLabel('print.itemNo', clientLang, { secondary: true }),
                  },
                  {
                    stack: this.genLabel('print.itemDescription', clientLang, { secondary: true }),
                  },
                  {
                    stack: this.genLabel('print.itemQuantityUnit', clientLang, { secondary: true }),
                    alignment: 'right',
                  },
                  {
                    stack: this.genLabel('print.itemRatePrice', clientLang, { secondary: true }),
                    alignment: 'right',
                  },
                  {
                    stack: this.genLabel('print.itemAmount', clientLang, { secondary: true }),
                    alignment: 'right',
                  },
                ],
                ...this.genItemBody(clientLang),
              ],
            },
            headerRows: 1,
            layout: {
              hLineWidth: function (i, node) {
                return (i === 1 || i === node.table.body.length) ? 1 : 0
              },
              vLineWidth: function (i, node) {
                return 0
              },
            },
          },
          // Items Amounts
          this.genItemsAmounts(customs, clientLang),
          // Amount
          {
            table: {
              widths: ['*', '40%', 90],
              body: this.genAmountBody(specDepositDueDate, clientLang),
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 0],
          },
          // Amount in Words
          this.genAmountInWords(clientLang),
          // Contract
          {
            table: {
              widths: [110, '*', 110, '*'],
              body: [
                [
                  {
                    stack: this.genLabel('print.contractNo', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: this.spec.specNo,
                      },
                    ],
                  },
                  {
                    stack: this.genLabel('print.contractDate', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: this.$d(specCreatedAt, 'short', clientLang),
                      },
                    ],
                  },
                ],
                [
                  {
                    stack: this.genLabel('print.terms', clientLang),
                  },
                  {
                    stack: this.genLabel('print.NET7', clientLang, { secondary: true }),
                  },
                  {
                    stack: this.genLabel('print.dateDue', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: this.$d(specDueDate, 'short', clientLang),
                      },
                    ],
                  },
                ],
                [
                  {
                    stack: this.genLabel('print.paymentMethods', clientLang),
                  },
                  {
                    stack: this.genLabel('print.TTaccordingToContract', clientLang, { secondary: true }),
                  },
                  '',
                  '',
                ],
              ],
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1 : 0
              },
              vLineWidth: function (i, node) {
                return 0
              },
            },
            margin: [0, 32, 0, 10],
          },
          // Contract confirmation text
          {
            stack: this.genLabel('print.confirmation', clientLang),
            margin: [4, 0, 4, 20],
          },
          // Sign
          // TODO: manager name transcript
          {
            table: {
              widths: [110, '*'],
              body: [
                [
                  {
                    stack: this.genLabel('print.manager', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: client.ownerFullName,
                      },
                    ],
                  },
                ],
                [
                  {
                    stack: this.genLabel('print.sign', clientLang),
                  },
                  '',
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
          },
        ],
        defaultStyle: {
          font: 'MyriadPro',
          fontSize: 8.3,
        },
      }
      pdfMake.createPdf(dd).open()
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
          timeout: 6000,
        })
        return result
      } catch (error) {
        this.$notify({
          color: 'red',
          text: this.$t('message.failedToSent'),
          timeout: 6000,
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
            timeout: 6000,
          })
        } else {
          throw new Error('Unsuccessful.')
        }
      } catch (error) {
        this.$logger.info('Copy link error: ', error)
        this.$notify({
          color: 'orange',
          text: this.$t('message.linkNotCopied'),
          timeout: 6000,
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
          timeout: 6000,
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

<style lang="postcss">
.text-field_nd {
  min-width: unset!important;
}
.text-area_nd textarea {
  padding-top: 4px!important;
  padding-bottom: 4px!important;
}
.text-field_nd .text-field__slot,
.text-area_nd .text-area__slot {
  border: none!important;
  border-radius: 4px;
  background-color: #222222;
}
.select_nd .select__slot {
  background-color: #222222;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent!important;
}
.text-field_nd.text-field--focused .text-field__slot,
.text-area_nd.text-area--focused .text-area__slot {
  background-color: #1e1e1e!important;
  box-shadow: 0 0 0 1px #5a8199;
}
.select_nd.select--active .select__slot {
  background-color: #1e1e1e!important;
  border-color: #5a8199!important;
  border-bottom-left-radius: 0!important;
  border-bottom-right-radius: 0!important;
}
.select_nd .v-menu__content {
  border: 1px solid #5a8199;
}
.select_nd .select-picker {
  padding-top: 0!important;
  padding-bottom: 0!important;
}
.select_nd .select-picker__item {
  background-color: #1e1e1e!important;
  height: 32px;
}
.select_nd .select-picker__item:not(.select-picker__item--disabled):hover {
  background-color: #353535!important;
}
.text-field_nd input,
.text-area_nd textarea,
.select_nd input {
  color: #5a8199!important;
}
.text-field_nd input:focus,
.text-area_nd textarea:focus,
.select_nd input:focus {
  color: #ffffff!important;
}

.text-field_nd input:disabled,
.text-area_nd textarea:disabled,
.select_nd input:disabled,
.text-field_nd input:disabled::placeholder,
.text-area_nd textarea:disabled::placeholder,
.select_nd input:disabled::placeholder {
  color: #2f2f2f!important;
}

</style>

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
  @apply bg-chaos-black;
}
@screen md {
  .spec-summary__info ul.leaders span:first-child,
  .spec-summary__info ul.leaders span + span {
    background: #1e1e1e;
  }
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
