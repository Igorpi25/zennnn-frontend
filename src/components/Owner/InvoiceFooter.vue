<template>
  <div class="invoice-footer">

    <div class="flex items-center">
      <div class="mr-2 flex flex-col items-start">
        <RadioInput
          v-model="internalProfitType"
          :label="InvoiceProfitType.MARGIN"
          name="profit-type"
          hide-details
          @input="updateInvoice({
            profitType: $event
          })"
        >
          <span class="text-gray-light">
            {{ $t('shipping.margin') }}
          </span>
        </RadioInput>
        <RadioInput
          v-model="internalProfitType"
          :label="InvoiceProfitType.COMMISSION"
          name="profit-type"
          hide-details
          @input="updateInvoice({
            profitType: $event
          })"
          >
          <span class="text-gray-light">
            {{ $t('shipping.commission') }}
          </span>
        </RadioInput>
      </div>
      <div class="w-16 mr-2">
        <TextField
          :value="item.profitPercent"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          @input="updateInvoice({
            profitPercent: $event
          })"
        >
          <template v-slot:append>
            %
          </template>
        </TextField>
      </div>
      <SwitchInput
        small
        :value="item.profitForAll"
        @input="updateInvoice({
          profitForAll: $event
        })"
      >
        <span>{{ $t('shipping.forAll') }}</span>
      </SwitchInput>
    </div>

    <div class="flex sm:flex-wrap w-full sm:w-auto md:px-3 max-w-xs">
      <div
        :class="{ 'opacity-0': isInvoiceProfitTypeMargin }"
        class="flex flex-col items-end w-full sm:w-32 pr-1 md:pr-0 lg:pr-1 transition-opacity duration-75 ease-in-out"
      >
        <label class="text-xs text-gray-light select-none pr-2">
          {{ $t('shipping.discount') }}
        </label>
        <TextField
          :value="item.discount"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          number-format="currency"
          @input="updateInvoice({
            discount: $event
          })"
        >
          <template v-slot:append>
            {{ $t(`currency.${currency}.symbol`) }}
          </template>
        </TextField>
      </div>
      <div class="flex flex-col items-end w-full sm:w-32 pl-1 md:pl-0 lg:pl-1">
        <label class="text-xs text-gray-light select-none pr-2">
          {{ $t('shipping.prepay') }}
        </label>
        <TextField
          :value="item.prepayment"
          :debounce="600"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          number-format="currency"
          @input="updateInvoice({
            prepayment: $event
          })"
        >
          <template v-slot:append>
            {{ $t(`currency.${currency}.symbol`) }}
          </template>
        </TextField>
        <DatePicker
          :value="item.prepaymentDate"
          @input="updateInvoice({ prepaymentDate: $event })"
        >
          <template v-slot:activator="{ on }">
            <div class="p-0 -mr-2 leading-none" v-on="on">
              <TextField
                :value="item.prepaymentDate ? $d($parseDate(item.prepaymentDate), 'short') : null"
                :placeholder="$t('placeholder.emptyDate')"
                solo
                align-right
                readonly
                class="text-xs text-right pr-2 pt-1 pb-0"
              />
            </div>
          </template>
        </DatePicker>
      </div>
    </div>

    <div class="flex w-full sm:w-auto max-w-xs">
      <div class="flex flex-col items-end w-full pr-3 md:pr-1">
        <label class="text-xs text-gray-light select-none whitespace-no-wrap">
          {{ $t('shipping.obtainCost') }}
        </label>
        <div
          class="leading-none whitespace-no-wrap"
          style="padding: 2px 0 2px;"
        >
          {{ $n(item.obtainCost, 'fixed') }} {{ $t(`currency.${currency}.symbol`) }}
        </div>
        <DatePicker
          :value="item.obtainCostDate"
          @input="updateInvoice({ obtainCostDate: $event })"
        >
          <template v-slot:activator="{ on }">
            <div class="p-0 -mr-2 leading-none" v-on="on">
              <TextField
                :value="item.obtainCostDate ? $d($parseDate(item.obtainCostDate), 'short') : null"
                :placeholder="$t('placeholder.emptyDate')"
                solo
                align-right
                readonly
                class="text-xs text-right pr-2 pt-1 pb-0"
              />
            </div>
          </template>
        </DatePicker>
      </div>
      <div class="flex flex-col items-end w-full pr-2 md:pr-0">
        <label class="text-xs text-gray-light select-none whitespace-no-wrap">
          {{ $t('shipping.clientDebt') }}
        </label>
        <div
          class="leading-none text-white whitespace-no-wrap"
          style="padding: 2px 0 2px;"
        >
          {{ $n(item.clientDebt, 'fixed') }} {{ $t(`currency.${currency}.symbol`) }}
        </div>
        <DatePicker
          :value="item.clientDebtDate"
          @input="updateInvoice({ clientDebtDate: $event })"
        >
          <template v-slot:activator="{ on }">
            <div class="p-0 -mr-2 leading-none" v-on="on">
              <TextField
                :value="item.clientDebtDate ? $d($parseDate(item.clientDebtDate), 'short') : null"
                :placeholder="$t('placeholder.emptyDate')"
                solo
                align-right
                readonly
                class="text-xs text-right pr-2 pt-1 pb-0"
              />
            </div>
          </template>
        </DatePicker>
      </div>
    </div>

  </div>
</template>

<script>
import invoice from '../../mixins/invoice'

export default {
  name: 'OwnerInvoiceFooter',
  mixins: [invoice],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      // TODO: need RadioButtonGroup component for control radio values
      internalProfitType: '',
    }
  },
  computed: {
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

<style lang="postcss">
.invoice-footer {
  @apply flex flex-wrap justify-center items-start py-1 px-4;
  @apply bg-gray-400;
  border-radius: 2px;
}
.invoice-footer > div {
  @apply mt-5;
}
@screen sm {
  .invoice-footer {
    @apply justify-between
  }
}
@screen md {
  .invoice-footer {
    @apply flex-no-wrap justify-between items-center px-8;
  }
  .invoice-footer > div {
    @apply mt-0
  }
}
</style>
