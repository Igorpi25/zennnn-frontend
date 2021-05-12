<template>
  <div class="flex flex-wrap lg:flex-nowrap justify-between bg-gray-600 rounded-b py-2 px-3 md:px-5">

    <div v-if="isOwnerOrManager" class="w-full lg:max-w-xs">
      <div class="pt-2 pb-4">
        <BtnToggle
          v-model="internalProfitType"
          :items="buttonGroupItems"
          @update:model-value="updateInvoice({
            profitType: $event
          })"
        />
      </div>
      <div class="flex items-center">
        <TextField
          :model-value="invoice.profitPercent"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          class="w-16 mr-2"
          @update:model-value="updateInvoice({
            profitPercent: $event
          })"
        >
          <template v-slot:append>
            <span class="text-base text-gray-100 pl-xs pr-sm">%</span>
          </template>
        </TextField>
        <Switch
          :model-value="invoice.profitForAll"
          @update:model-value="updateInvoice({
            profitForAll: $event
          })"
        >
          <span class="text-white">{{ $t('shipping.forAll') }}</span>
        </Switch>
      </div>
    </div>

    <div v-if="isOwnerOrManager" class="w-full lg:w-px h-px lg:h-auto bg-gray-900 lg:mx-4 my-3" />

    <div class="w-full md:w-2/5 lg:w-full lg:max-w-sm flex justify-end">
      <div
        :class="{ 'opacity-0': isInvoiceProfitTypeMargin }"
        class="flex-grow transition-opacity duration-75 ease-in-out sm:pr-4"
      >
        <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-sm">
          {{ $t('shipping.discount') }}
        </label>
        <TextField
          v-if="isOwnerOrManager"
          :model-value="invoice.discount"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          number-format="currency"
          @update:model-value="updateInvoice({
            discount: $event
          })"
        >
          <template v-slot:append>
            <span class="text-base text-gray-100 pl-xs pr-sm">{{ $t(`currency.${currency}.symbol`) }}</span>
          </template>
        </TextField>
        <div v-else class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-sm">
          <span class="text-white">{{ $n(invoice.discount || 0, 'fixed') }}</span>
          <span class="text-gray-100 pl-xs">{{ $t(`currency.${currency}.symbol`) }}</span>
        </div>
      </div>
      <div class="sm:pl-4">
        <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-sm">
          {{ $t('shipping.prepay') }}
        </label>
        <TextField
          v-if="isOwnerOrManager"
          :model-value="invoice.prepayment"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          number-format="currency"
          @update:model-value="updateInvoice({
            prepayment: $event
          })"
        >
          <template v-slot:append>
            <span class="text-base text-gray-100 pl-xs pr-sm">{{ $t(`currency.${currency}.symbol`) }}</span>
          </template>
        </TextField>
        <div v-else class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-sm">
          <span class="text-white">{{ $n(invoice.prepayment || 0, 'fixed') }}</span>
          <span class="text-gray-100 pl-xs">{{ $t(`currency.${currency}.symbol`) }}</span>
        </div>
        <DatePicker
          :model-value="invoice.prepaymentDate"
          :placeholder="$t('placeholder.emptyDate')"
          @update:model-value="updateInvoice({ prepaymentDate: $event })"
        />
      </div>
    </div>

    <div class="w-full md:w-px h-px md:h-auto bg-gray-900 lg:mx-4 xl:mx-12 my-3" />

    <div class="w-full md:w-auto lg:w-full lg:max-w-xs flex justify-end lg:pl-sm">
      <div class="flex-grow sm:pr-4">
        <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-sm">
          {{ $t('shipping.obtainCost') }}
        </label>
        <div class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-sm">
          <span class="text-white">{{ $n(invoice.obtainCost || 0, 'fixed') }}</span>
          <span class="text-gray-100 pl-xs">{{ $t(`currency.${currency}.symbol`) }}</span>
        </div>
        <DatePicker
          :model-value="invoice.obtainCostDate"
          :placeholder="$t('placeholder.emptyDate')"
          @update:model-value="updateInvoice({ obtainCostDate: $event })"
        />
      </div>
      <div class="sm:pl-4">
        <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-sm">
          {{ $t('shipping.clientDebt') }}
        </label>
        <div class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-sm">
          <span class="text-white">{{ $n(invoice.clientDebt || 0, 'fixed') }}</span>
          <span class="text-gray-100 pl-xs">{{ $t(`currency.${currency}.symbol`) }}</span>
        </div>
        <DatePicker
          :model-value="invoice.clientDebtDate"
          :placeholder="$t('placeholder.emptyDate')"
          @update:model-value="updateInvoice({ clientDebtDate: $event })"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useApolloClient } from '@vue/apollo-composable'

import { DEFAULT_CURRENCY } from '../config/globals'

import { GET_SPEC, GET_IS_SPEC_SYNC } from '../graphql/queries'
import { UPDATE_INVOICE } from '../graphql/mutations'
import { Role, InvoiceProfitType } from '../graphql/enums'

import { Switch, TextField, DatePicker, BtnToggle } from '@zennnn/core'

export default {
  name: 'InvoiceSummary',
  components: {
    Switch,
    TextField,
    DatePicker,
    BtnToggle,
  },
  props: {
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
    },
    invoice: {
      type: Object,
      default: () => ({}),
    },
    role: {
      type: String,
      required: true,
    },
  },
  setup () {
    const route = useRoute()
    const specId = route.params.specId

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const updateLoading = (null)
    const internalProfitType = ref('')

    return {
      specId,
      apolloClient,
      updateLoading,
      // TODO: need RadioButtonGroup component for control radio values
      internalProfitType,
    }
  },
  computed: {
    isInvoiceProfitTypeMargin () {
      return this.invoice.profitType === InvoiceProfitType.MARGIN
    },
    isInvoiceProfitTypeCommission () {
      return this.invoice.profitType === InvoiceProfitType.COMMISSION
    },
    buttonGroupItems () {
      return [{
        text: this.$t('shipping.margin').toLowerCase(),
        value: InvoiceProfitType.MARGIN,
      }, {
        text: this.$t('shipping.commission').toLowerCase(),
        value: InvoiceProfitType.COMMISSION,
      }]
    },
    isOwnerOrManager () {
      return this.role === Role.OWNER || this.role === Role.MANAGER
    },
    profitType: {
      get () {
        return this.internalProfitType
      },
      set (val) {
        this.internalProfitType = val
      },
    },
  },
  watch: {
    'invoice.profitType': {
      handler (val) {
        this.internalProfitType = val
      },
      immediate: true,
    },
  },
  methods: {
    async updateInvoice (input) {
      try {
        const id = this.invoice.id
        this.updateLoading = id
        await this.apolloClient.mutate({
          mutation: UPDATE_INVOICE,
          variables: {
            id,
            input,
          },
        })
      } catch (error) {
        if (error.message && error.message.includes('GraphQL error: MongoError: WriteConflict')) {
          this.refetchSpec()
        }
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = null
      }
    },
    async refetchSpec () {
      try {
        this.apolloClient.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: true },
        })
        await this.apolloClient.query({
          query: GET_SPEC,
          variables: {
            id: this.specId,
          },
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        this.apolloClient.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: false },
        })
      }
    },
  },
}
</script>
