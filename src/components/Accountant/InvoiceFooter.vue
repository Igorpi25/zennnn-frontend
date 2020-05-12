<template>
  <div class="invoice-footer">
    <div class="flex sm:flex-wrap w-full sm:w-auto md:px-3 max-w-xs">
      <div
        v-if="isInvoiceProfitTypeCommission"
        class="flex flex-col items-end w-full sm:w-32 pr-1 md:pr-0 lg:pr-1"
      >
        <label class="text-xs text-gray-light select-none pr-2">
          {{ $t('shipping.discount') }}
        </label>
        <span class="mr-2 leading-none">{{ $n(item.discount, 'fixed') || $t('placeholder.emptyNumber') }} {{ $t(`currency.${currency}.symbol`) }}</span>
      </div>
      <div class="flex flex-col items-end w-full sm:w-32 pl-1 md:pl-0 lg:pl-1">
        <label class="text-xs text-gray-light select-none pr-2">
          {{ $t('shipping.prepay') }}
        </label>
        <span class="mr-2 leading-none">{{ $n(item.prepayment, 'fixed') || $t('placeholder.emptyNumber') }} {{ $t(`currency.${currency}.symbol`) }}</span>
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
      <div class="flex flex-col items-end w-full pr-3 md:pr-0">
        <label class="text-xs text-gray-light select-none whitespace-no-wrap">
          {{ $t('shipping.obtainCost') }}
        </label>
        <span class="leading-none">
          {{ $n(item.obtainCost, 'fixed') }} {{ $t(`currency.${currency}.symbol`) }}
        </span>
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
        <span class="leading-none text-white">
          {{ $n(item.clientDebt, 'fixed') }} {{ $t(`currency.${currency}.symbol`) }}
        </span>
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
  name: 'AccountantInvoiceFooter',
  mixins: [invoice],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      //
    }
  },
}
</script>

<style scoped lang="postcss">
.invoice-footer {
  @apply flex flex-wrap justify-end items-start py-1 px-4;
  @apply bg-accent1;
  border-radius: 2px;
}
.invoice-footer > div {
  @apply mt-5;
}
@screen md {
  .invoice-footer {
    @apply px-8;
  }
  .invoice-footer > div {
    @apply mt-0
  }
}
</style>
