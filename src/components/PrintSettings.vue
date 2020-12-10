<template>
  <div
    ref="container"
    class="flex flex-col relative w-full overflow-y-auto scrolling-touch max-h-screen text-gray-100 bg-gray-800 px-sm py-6"
  >
    <span
      class="absolute top-0 right-0 z-10 pt-1 pr-1"
    >
      <i
        class="zi-close text-2xl text-gray-100 hover:text-white cursor-pointer"
        @click="$emit('close')"
      />
    </span>
    <!-- Header -->
    <div class="px-3">
      <div class="flex flex-col sm:flex-row">
        <div class="mb-3 sm:mb-0">
          <h4 class="text-2xl text-white">
            {{ $t('shipping.toPrintInvoiceTitle') }}
          </h4>
          <p>
            {{ $t('shipping.toPrintInvoiceSubtitle') }}
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center sm:justify-end flex-grow order-last sm:order-none pr-4">
          <v-slide-x-reverse-transition>
            <div v-if="!validationState.isRequiredFilled" class="flex items-center whitespace-nowrap pr-5 pb-1">
              <span class="text-pink-500 mr-2">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
              <span>{{ $t('print.required') }}</span>
            </div>
          </v-slide-x-reverse-transition>
          <v-slide-x-reverse-transition>
            <div v-if="!validationState.isOptionalFilled" class="flex items-center whitespace-nowrap pr-5 pb-1">
              <span class="text-yellow-500 mr-2">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
              <span>{{ $t('print.warning') }}</span>
            </div>
          </v-slide-x-reverse-transition>
        </div>
        <div class="flex items-center">
          <Button
            :disabled="!validationState.isRequiredFilled"
            :loading="loading"
            min-width="200"
            @click="print"
          >
            {{ $t('shipping.doPrint') }}
          </Button>
        </div>
      </div>
    </div>
    <!-- Body -->
    <div class="py-6">
      <div class="bg-gray-600 rounded-md p-5 pt-10">
        <!-- REQUISITE -->
        <h5 class="flex-grow text-lg leading-tight">
          <span class="text-white uppercase font-semibold tracking-widest uppercase">
            {{ $t('shipping.supplierTitle') }}
          </span>
          <span class="text-gray-200 lowercase mr-1">
            {{ $t('shipping.supplierSubtitle') }}
          </span>
        </h5>
        <PrintCompanyInfo
          class="pt-3"
          :item="requisite"
          :items="requisites"
          :readonly="!hasRequisite"
          @update="updateRequisite"
          @select-company="setRequisite"
          @create-company="createRequisite"
        />
        <!-- Divider -->
        <div class="my-10 border-t border-gray-400" />
        <!-- CLIENT -->
        <h5 class="flex-grow text-lg leading-tight">
          <span class="text-white uppercase font-semibold tracking-widest uppercase">
            {{ $t('shipping.clientTitle') }}
          </span>
          <span class="text-gray-200 lowercase mr-1">
            {{ $t('shipping.clientSubtitle') }}
          </span>
        </h5>
        <PrintClient
          class="pt-3"
          v-model:search="clientSearch"
          :client="specClient"
          :clients="clients"
          :readonly="!hasClient"
          @update="updateClient"
          @select-client="setSpecClient"
          @create-client="createClient"
        />
        <!-- Divider -->
        <div class="my-10 border-t border-gray-400" />
        <!-- IMPORTER -->
        <SwitchInput
          v-model="isImporterActive"
          :disabled="!hasClient"
          hide-details
        >
          <h5 class="flex-grow text-lg leading-tight pt-1">
            <span class="text-white uppercase font-semibold tracking-widest uppercase">
              {{ $t('shipping.importerTitle') }}
            </span>
            <span class="text-gray-200 lowercase mr-1">
              {{ $t('shipping.importerSubtitle') }}
            </span>
          </h5>
        </SwitchInput>
        <PrintClientImporter
          class="pt-3"
          :client="specClient"
          :readonly="!hasClient"
          :disabled="!isImporterActive"
          @update="updateClient"
        />
        <!-- Divider -->
        <div class="my-10 border-t border-gray-400" />
        <!-- DELIVERY -->
        <h5 class="flex-grow text-lg leading-tight">
          <span class="text-white uppercase font-semibold tracking-widest uppercase">
            {{ $t('shipping.forDeliver') }}
          </span>
        </h5>
        <PrintDelivery
          :item="shipment"
          class="pt-3"
          @update="$emit('update', $event)"
        />
        <!-- Divider -->
        <div class="my-10 border-t border-gray-400" />
        <!-- CUSTOMS -->
        <h5 class="flex-grow text-lg leading-tight">
          <span class="text-white uppercase font-semibold tracking-widest uppercase">
            {{ $t('shipping.customsAndTaxes') }}
          </span>
        </h5>
        <div class="flex flex-wrap pt-3">
          <div class="w-full sm:w-1/2 sm:pr-5">
            <div class="pb-2">
              <Select
                :value="customsCountryOfOriginValue"
                :menu-attach="$refs.container"
                :label="$t('shipping.countryOfOrigin')"
                :placeholder="$t('companyDetail.placeholder.citizenship')"
                v-model:search="countriesSearch"
                :items="shipmentCountries"
                :rules="[rules.required]"
                lazy-validation
                prepend-slot-class="w-auto pl-2"
                searchable
                state-icon
                required
                @input="$emit('update', { customs: { countryOfOrigin: $event } })"
              >
                <template v-slot:prepend>
                  <img
                    v-if="customs.countryOfOrigin"
                    :src="require(`@/assets/img/flags/square/${item.countryOfOrigin}.svg`)"
                    :alt="customs.countryOfOrigin"
                    class="w-6 rounded-sm mr-4"
                  >
                  <img
                    v-else
                    src="@/assets/icons/earth.svg"
                    class="h-6 w-6 rounded-full mr-4"
                  >
                </template>
                <template v-slot:item="{ item }">
                  <img
                    :src="require(`@/assets/img/flags/square/${item.value}.svg`)"
                    class="w-6 rounded-sm mr-4"
                  >
                  <span>{{ item.text }}</span>
                </template>
              </Select>
            </div>
            <div class="flex pb-2">
              <div class="w-1/2 pr-sm">
                <Select
                  :value="customsTermsValue"
                  :menu-attach="$refs.container"
                  :label="$t('shipping.termsLabel')"
                  :placeholder="$t('shipping.termsPlaceholder')"
                  v-model:search="termsSearch"
                  :items="customsTerms"
                  :disabled="isTermsDisabled"
                  :rules="[rules.required]"
                  searchable
                  state-icon
                  required
                  @input="$emit('update', { customs: { terms: $event } })"
                />
              </div>
              <div class="w-1/2">
                <TextField
                  :value="customs.cost"
                  :label="$t('shipping.costLabel')"
                  :placeholder="$t('placeholder.notChosen')"
                  lazy
                  number
                  number-format="currency"
                  append-slot-class="text-base w-auto pl-xs pr-sm"
                  @input="$emit('update', { customs: { cost: $event } })"
                >
                  <template v-slot:append>
                    {{ $t(`currency.USD.symbol`) }}
                  </template>
                </TextField>
              </div>
            </div>
            <div class="pb-2 flex">
              <div class="w-1/2 pr-sm">
                <Select
                  :value="$t('currency.USD.iso-4217')"
                  :menu-attach="$refs.container"
                  :label="$t('shipping.invoiceCurrency')"
                  :placeholder="$t('currency.USD.iso-4217')"
                  :items="[{ value: $t('currency.USD.iso-4217'), text: $t('currency.USD.iso-4217') }]"
                />
              </div>
            </div>
          </div>
          <div class="w-full sm:w-1/2 sm:pl-5">
            <div class="flex pb-2">
              <div class="w-1/3 pr-2">
                <TextField
                  :value="customs.discount"
                  :label="$t('shipping.discountLabel')"
                  :placeholder="$t('placeholder.notChosen')"
                  lazy
                  number
                  number-format="currency"
                  append-slot-class="text-base w-auto pl-xs pr-sm"
                  @input="$emit('update', { customs: { discount: $event } })"
                >
                  <template v-slot:append>
                    {{ $t(`currency.USD.symbol`) }}
                  </template>
                </TextField>
              </div>
              <div class="w-1/3 px-2">
                <Select
                  :menu-attach="$refs.container"
                  :label="$t('shipping.vatLabel')"
                  :placeholder="$t('placeholder.notChosen')"
                  :items="[]"
                  disabled
                />
              </div>
              <div class="w-1/3 pl-2">
                <Select
                  :menu-attach="$refs.container"
                  :label="$t('shipping.incomeTaxLabel')"
                  :placeholder="$t('placeholder.notChosen')"
                  :items="[]"
                  disabled
                />
              </div>
            </div>
            <div class="pt-9 pb-2"><div class="h-10" /></div>
            <div class="pt-9 pb-2">
              <div class="h-10 flex items-center">
                <div class="text-white w-full flex items-baseline">
                  <div class="text-2xl whitespace-nowrap">{{ $t('shipping.invoiceAmount') }}</div>
                  <div class="flex-grow dots" />
                  <div class="text-2xl whitespace-nowrap">{{ $n(amount || 0, 'fixed') }} {{ $t(`currency.USD.symbol`) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Divider -->
        <div class="my-10 border-t border-gray-400" />
        <!-- AMOUNT -->
        <h5 class="flex-grow text-lg leading-tight">
          <span class="text-white uppercase font-semibold tracking-widest uppercase">
            {{ $t('shipping.amount') }}
          </span>
        </h5>
        <div class="flex flex-wrap pt-3">
          <div class="w-full sm:w-1/2 sm:pr-5">
            <div class="pb-2">
              <label class="block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
                {{ $t('shipping.amountInWords') }}
              </label>
              <TextArea
                :value="amountInWords"
                :debounce="500"
                :rules="[rules.required]"
                :placeholder="$t('placeholder.notIndicated')"
                rows="2"
                state-icon
                state-color="warn"
                @input="$emit('update', { amountInWords: $event })"
              />
            </div>
          </div>
          <div class="w-full sm:w-1/2 sm:pl-5">
            <div class="pb-2">
              <label class="block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
                {{ $t('shipping.amountInWordsClientLang') }}
              </label>
              <TextArea
                :value="amountInWordsClientLang"
                :debounce="500"
                :rules="[rules.required]"
                :placeholder="$t('placeholder.notIndicated')"
                rows="2"
                state-icon
                state-color="warn"
                @input="$emit('update', { amountInWordsClientLang: $event })"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div class="px-5">
      <div class="flex flex-col sm:flex-row">
        <Button
          outlined
          min-width="200"
          @click="$emit('close')"
        >
          {{ $t('shipping.cancelPrint') }}
        </Button>
        <div class="flex flex-wrap items-center justify-center sm:justify-end flex-grow order-first sm:order-none pr-4">
          <v-slide-x-reverse-transition>
            <div v-if="!validationState.isRequiredFilled" class="flex items-center whitespace-nowrap pr-5 pb-1">
              <span class="text-pink-500 mr-2">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
              <span>{{ $t('print.required') }}</span>
            </div>
          </v-slide-x-reverse-transition>
          <v-slide-x-reverse-transition>
            <div v-if="!validationState.isOptionalFilled" class="flex items-center whitespace-nowrap pr-5 pb-1">
              <span class="text-yellow-500 mr-2">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
              <span>{{ $t('print.warning') }}</span>
            </div>
          </v-slide-x-reverse-transition>
        </div>
        <Button
          :disabled="!validationState.isRequiredFilled"
          :loading="loading"
          min-width="200"
          @click="print"
        >
          {{ $t('shipping.doPrint') }}
        </Button>
      </div>
    </div>

    <v-dialog
      ref="requisiteDialog"
      v-model="requisiteDialog"
      :fullscreen="$breakpoint.xs"
      scrollable
      max-width="1024"
      content-class="text-gray-100"
    >
      <RequisiteCard
        ref="requisiteCard"
        :org-id="orgId"
        create
        is-component
        @close="requisiteDialog = false"
        @create="setCreatedRequisite"
      />
    </v-dialog>
    <v-dialog
      ref="clientDialog"
      v-model="clientDialog"
      :fullscreen="$breakpoint.xs"
      scrollable
      max-width="1110"
      content-class="dialog-full-height scrolling-touch"
    >
      <ClientCard
        ref="clientCard"
        :org-id="orgId"
        create
        is-component
        @close="clientDialog = false"
        @create="setSpecClient($event && $event.id)"
      />
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useQuery, useResult } from '@vue/apollo-composable'

import Countries from '../config/countries-iso3.json'

import PrintCompanyInfo from './CompanyDetail/PrintCompanyInfo.vue'
import PrintClient from './CompanyDetail/PrintClient.vue'
import PrintClientImporter from './CompanyDetail/PrintClientImporter.vue'
import PrintDelivery from './CompanyDetail/PrintDelivery.vue'
import RequisiteCard from './RequisiteCard.vue'
import ClientCard from './ClientCard.vue'

import { UPDATE_CLIENT, UPDATE_REQUISITE, SET_SPEC_CLIENT } from '../graphql/mutations'
import { LIST_ORG_REQUISITES, SEARCH_CLIENTS } from '../graphql/queries'
import { ClientType, ShipmentType, CustomsTerms, CustomsTermsMore } from '../graphql/enums'

import { validateInvoicePrint } from '../util/validation'

export default {
  name: 'PrintSettings',
  components: {
    PrintCompanyInfo,
    PrintDelivery,
    PrintClient,
    PrintClientImporter,
    RequisiteCard,
    ClientCard,
  },
  props: {
    orgId: String,
    specId: String,
    requisiteId: String,
    loading: Boolean,
    readyToPrint: Boolean,
    client: {
      type: Object,
      default: () => ({}),
    },
    shipment: {
      type: Object,
      default: () => ({
        activeType: null,
        marine: {},
        air: {},
        railway: {},
        car: {},
        mixed: {},
        express: {},
      }),
    },
    customs: {
      type: Object,
      default: () => ({}),
    },
    amount: {
      type: Number,
      default: 0,
    },
    amountInWords: String,
    amountInWordsClientLang: String,
  },
  setup (props) {
    const clientSearch = ref('')

    const { result: result1 } = useQuery(SEARCH_CLIENTS, () => ({
      orgId: props.orgId,
      search: clientSearch.value,
    }), {
      enabled: () => clientSearch.value,
      fetchPolicy: 'cache-and-network',
      debounce: 300,
    })
    const searchClients = useResult(result1)

    const { result: result2, loading: requisiteLoading } = useQuery(LIST_ORG_REQUISITES, () => ({
      orgId: props.orgId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const listOrgRequisites = useResult(result2)

    return {
      clientSearch,
      searchClients,
      requisiteLoading,
      listOrgRequisites,
    }
  },
  data () {
    return {
      customsCountryOfOriginValue: undefined,
      customsTermsValue: undefined,
      shipmentTypeSearch: '',
      termsSearch: '',
      errorFieldsCount: 0,
      warningFieldsCount: 0,
      countriesSearch: '',
      clientDialog: false,
      updateClientLoading: false,
      requisiteSearch: '',
      requisiteDialog: false,
      requisiteLoading: false,
      isValid: false,
      ShipmentType,
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
    }
  },
  computed: {
    validationState () {
      return validateInvoicePrint(this.requisite, this.client, this.shipment, this.customs, this.amountInWords, this.amountInWordsClientLang)
    },
    isTermsDisabled () {
      const shipmentType = this.shipment.activeType
      return shipmentType === ShipmentType.AIR || shipmentType === ShipmentType.EXPRESS
    },
    isImporterActive: {
      get () {
        return !!this.importer.importerActive
      },
      set (val) {
        this.updateClient({ importerActive: !!val })
      },
    },
    importer () {
      return this.client || {}
    },
    hasClient () {
      return this.client && this.client.id
    },
    isClientTypePrivate () {
      return this.client && this.client.clientType === ClientType.PRIVATE
    },
    hasRequisite () {
      return !!this.requisiteId
    },
    specClient () {
      const client = this.client || {}
      return {
        ...client,
        name: client.fullName,
      }
    },
    clients () {
      const items = (this.searchClients && this.searchClients.items) || []
      return items.map(item => {
        return {
          ...item,
          name: item.fullName,
        }
      })
    },
    requisites () {
      const items = this.listOrgRequisites || []
      return items
    },
    requisite () {
      return (this.listOrgRequisites || []).find(el => el.id === this.requisiteId) || {}
    },
    shipmentTypes () {
      const items = Object.values(ShipmentType).filter(el => el !== ShipmentType.UNDEFINED).map(el => {
        return {
          text: this.$t(`shipmentType.${el}`),
          value: el,
        }
      })
      return items
    },
    countries () {
      return Object.entries(Countries).map(([k, v]) => {
        const name = this.$te(`countries.${k}`, 'en') ? this.$t(`countries.${k}`, 'en') : v
        return {
          text: this.$te(`countries.${k}`) ? this.$t(`countries.${k}`) : name,
          value: k,
          name,
        }
      })
    },
    shipmentCountries () {
      return this.countries
    },
    customsTermsItems () {
      return Object.values(CustomsTerms).map(el => {
        return {
          text: this.$t(`customsTerms.${el}`),
          value: el,
        }
      })
    },
    customsTermsMoreItems () {
      return Object.values(CustomsTermsMore).map(el => {
        return {
          text: this.$t(`customsTerms.${el}`),
          value: el,
        }
      })
    },
    customsTerms () {
      const shipmentType = this.shipment.activeType
      let items = []
      if (shipmentType === ShipmentType.RAILWAY || shipmentType === ShipmentType.CAR) {
        items = this.customsTermsItems
      }
      if (shipmentType === ShipmentType.MARINE || shipmentType === ShipmentType.MIXED) {
        items = [...this.customsTermsItems, { divider: true }, ...this.customsTermsMoreItems]
      }
      return items
    },
  },
  watch: {
    'customs.countryOfOrigin': {
      handler (val) {
        this.$nextTick(() => {
          this.customsCountryOfOriginValue = val
        })
      },
      immediate: true,
    },
    'customs.terms': {
      handler (val) {
        this.$nextTick(() => {
          this.customsTermsValue = val
        })
      },
      immediate: true,
    },
  },
  methods: {
    print () {
      this.$emit('print', this.requisite, this.client, this.shipment, this.customs)
    },
    async updateClient (input) {
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_CLIENT,
          variables: {
            id: this.client.id,
            input,
          },
        })
      } catch (error) {
        const message = error.message
        this.$notify({
          color: 'error',
          text: message,
        })
        throw new Error(error)
      }
    },
    async updateRequisite (input) {
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_REQUISITE,
          variables: {
            id: this.requisiteId,
            input,
          },
        })
      } catch (error) {
        const message = !this.requisiteId ? 'Продавец / Поставщик не установлен.' : error.message
        this.$notify({
          color: 'error',
          text: message,
        })
        throw new Error(error)
      }
    },
    setRequisite (id) {
      this.$emit('update', { requisite: id })
    },
    createRequisite () {
      this.requisiteDialog = true
      this.$nextTick(() => {
        if (this.$refs.requisiteCard) {
          this.$refs.requisiteCard.reset()
          if (this.$refs.requisiteDialog.$refs.dialog) {
            this.$refs.requisiteDialog.$refs.dialog.scrollTop = 0
          }
        }
      })
    },
    setCreatedRequisite (item) {
      this.$emit('update', { requisite: item.id })
      this.requisiteDialog = false
    },
    createClient () {
      this.clientDialog = true
      this.$nextTick(() => {
        if (this.$refs.clientCard) {
          this.$refs.clientCard.reset()
          if (this.$refs.clientDialog.$refs.dialog) {
            this.$refs.clientDialog.$refs.dialog.scrollTop = 0
          }
        }
      })
    },
    async setSpecClient (clientId) {
      if (!clientId) return
      try {
        this.updateClientLoading = true
        await this.$apollo.mutate({
          mutation: SET_SPEC_CLIENT,
          variables: {
            specId: this.specId,
            clientId,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateClientLoading = false
        this.clientDialog = false
      }
    },
  },
}
</script>
