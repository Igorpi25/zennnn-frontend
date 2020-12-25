<template>
  <div class="flex flex-wrap lg:flex-nowrap justify-between bg-gray-600 rounded-b py-2 px-3 md:px-5">

    <div v-if="isOwnerOrManager" class="w-full lg:max-w-xs">
      <div class="pt-2 pb-4">
        <BtnToggle
          v-model="internalProfitType"
          :items="buttonGroupItems"
          @input="updateInvoice({
            profitType: $event
          })"
        />
      </div>
      <div class="flex items-center">
        <TextField
          :value="item.profitPercent"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          slot-class="w-auto"
          class="w-16 mr-2"
          @input="updateInvoice({
            profitPercent: $event
          })"
        >
          <template v-slot:append>
            <span class="text-base text-gray-100 pl-xs pr-sm">%</span>
          </template>
        </TextField>
        <Switch
          :value="item.profitForAll"
          hide-details
          @input="updateInvoice({
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
          :value="item.discount"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          number-format="currency"
          slot-class="w-auto"
          @input="updateInvoice({
            discount: $event
          })"
        >
          <template v-slot:append>
            <span class="text-base text-gray-100 pl-xs pr-sm">{{ $t(`currency.${currency}.symbol`) }}</span>
          </template>
        </TextField>
        <div v-else class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-sm">
          <span class="text-white">{{ $n(item.discount, 'fixed') }}</span>
          <span class="text-gray-100 pl-xs">{{ $t(`currency.${currency}.symbol`) }}</span>
        </div>
      </div>
      <div class="sm:pl-4">
        <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-sm">
          {{ $t('shipping.prepay') }}
        </label>
        <TextField
          v-if="isOwnerOrManager"
          :value="item.prepayment"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          number-format="currency"
          slot-class="w-auto"
          @input="updateInvoice({
            prepayment: $event
          })"
        >
          <template v-slot:append>
            <span class="text-base text-gray-100 pl-xs pr-sm">{{ $t(`currency.${currency}.symbol`) }}</span>
          </template>
        </TextField>
        <div v-else class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-sm">
          <span class="text-white">{{ $n(item.prepayment, 'fixed') }}</span>
          <span class="text-gray-100 pl-xs">{{ $t(`currency.${currency}.symbol`) }}</span>
        </div>
        <DatePicker
          :model-value="item.prepaymentDate"
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
          <span class="text-white">{{ $n(item.obtainCost, 'fixed') }}</span>
          <span class="text-gray-100 pl-xs">{{ $t(`currency.${currency}.symbol`) }}</span>
        </div>
        <DatePicker
          :model-value="item.obtainCostDate"
          :placeholder="$t('placeholder.emptyDate')"
          @update:model-value="updateInvoice({ obtainCostDate: $event })"
        />
      </div>
      <div class="sm:pl-4">
        <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-sm">
          {{ $t('shipping.clientDebt') }}
        </label>
        <div class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-sm">
          <span class="text-white">{{ $n(item.clientDebt, 'fixed') }}</span>
          <span class="text-gray-100 pl-xs">{{ $t(`currency.${currency}.symbol`) }}</span>
        </div>
        <DatePicker
          :model-value="item.clientDebtDate"
          :placeholder="$t('placeholder.emptyDate')"
          @update:model-value="updateInvoice({ clientDebtDate: $event })"
        />
      </div>
    </div>

  </div>
</template>

<script>
import invoice from '../mixins/invoice'
import { Role } from '../graphql/enums'

import Switch from './Base/Switch'
import TextField from './Base/TextField'
import DatePicker from './Base/DatePicker'
import BtnToggle from './Base/BtnToggle'

export default {
  name: 'InvoiceSummary',
  components: {
    Switch,
    TextField,
    DatePicker,
    BtnToggle,
  },
  mixins: [invoice],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    role: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      // TODO: need RadioButtonGroup component for control radio values
      internalProfitType: '',
    }
  },
  computed: {
    buttonGroupItems () {
      return [{
        text: this.$t('shipping.margin').toLowerCase(),
        value: this.InvoiceProfitType.MARGIN,
      }, {
        text: this.$t('shipping.commission').toLowerCase(),
        value: this.InvoiceProfitType.COMMISSION,
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
    'item.profitType': {
      handler (val) {
        this.internalProfitType = val
      },
      immediate: true,
    },
  },
}
</script>
