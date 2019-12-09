<template>
  <div class="invoice-footer">

    <div class="flex items-center">
      <div class="mr-2 flex flex-col items-start">
        <RadioButton
          name="profit-type"
          hide-details
          :value="item.profitType"
          :label="InvoiceProfitType.MARGIN"
          @input="updateInvoice({
            profitType: $event
          })"
        >
          <span class="text-gray-light">
            {{ $t('shipping.margin') }}
          </span>
        </RadioButton>
        <RadioButton
          name="profit-type"
          hide-details
          :value="item.profitType"
          :label="InvoiceProfitType.COMMISSION"
          @input="updateInvoice({
            profitType: $event
          })"
          >
          <span class="text-gray-light">
            {{ $t('shipping.commission') }}
          </span>
        </RadioButton>
      </div>
      <div class="w-16 mr-2">
        <TextField
          :value="item.profitPercent"
          :debounce="250"
          :placeholder="$t('placeholder.emptyNumber')"
          type="number"
          inputmode="numeric"
          solo
          colored
          outlined
          hide-details
          @input="updateInvoice({
            profitPercent: $event
          })"
        >
          <template v-slot:append>
            %
          </template>
        </TextField>
      </div>
      <ToggleButton
        small
        :value="item.profitForAll"
        @input="updateInvoice({
          profitForAll: item.profitForAll
        })"
      >
        <span>{{ $t('shipping.forAll') }}</span>
      </ToggleButton>
    </div>

    <div class="flex sm:flex-wrap w-full sm:w-auto md:px-3 max-w-xs">
      <div class="flex flex-col items-end w-full sm:w-32 pr-1 md:pr-0 lg:pr-1">
        <label class="text-xs text-gray-light select-none pr-2">
          {{ $t('shipping.discount') }}
        </label>
        <TextField
          :value="item.discount"
          :debounce="250"
          :placeholder="$t('placeholder.emptyNumber')"
          type="number"
          inputmode="decimal"
          solo
          outlined
          colored
          hide-details
          persistent-label
          class="p-0"
          @input="updateInvoice({
            discount: $event
          })"
        >
          <template v-slot:append>
            {{ $t('currency.CNY.symbol') }}
          </template>
        </TextField>
      </div>
      <div class="flex flex-col items-end w-full sm:w-32 pl-1 md:pl-0 lg:pl-1">
        <label class="text-xs text-gray-light select-none pr-2">
          {{ $t('shipping.prepay') }}
        </label>
        <TextField
          :value="item.prepayment"
          :debounce="250"
          :placeholder="$t('placeholder.emptyNumber')"
          type="number"
          inputmode="decimal"
          solo
          colored
          outlined
          hide-details
          persistent-label
          class="p-0"
          @input="updateInvoice({
            prepayment: $event
          })"
        >
          <template v-slot:append>
            {{ $t('currency.CNY.symbol') }}
          </template>
        </TextField>
        <v-menu
          ref="menu"
          v-model="menuPrepaymentDate"
          transition="scale-transition"
          min-width="290px"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <div class="p-0 -mr-2 leading-none" v-on="on">
              <TextField
                :value="formatDate(item.prepaymentDate)"
                :placeholder="$t('placeholder.emptyDate')"
                right
                colored
                borderless
                readonly
                hide-details
                class="text-xs text-right pr-2 pt-1 pb-0"
              />
            </div>
          </template>
          <v-date-picker
            :value="$toISOString($parseDate(item.prepaymentDate))"
            :locale="$i18n.locale"
            :next-icon="icons.mdiChevronRight"
            :prev-icon="icons.mdiChevronLeft"
            color="#5a8199"
            no-title
            dark
            @change="updateInvoice({
              prepaymentDate: $event || null
            })"
          ></v-date-picker>
        </v-menu>
      </div>
    </div>

    <div class="flex w-full sm:w-auto max-w-xs">
      <div class="flex flex-col items-end w-full pr-3 md:pr-0">
        <label class="text-xs text-gray-light select-none">
          {{ $t('shipping.obtainCost') }}
        </label>
        <div
          class="leading-none"
          style="padding: 2px 0 2px;"
        >
          {{ $n(item.obtainCost, 'formatted') }} {{ $t('currency.CNY.symbol') }}
        </div>
        <v-menu
          ref="menu"
          v-model="menuResidueDate"
          transition="scale-transition"
          min-width="290px"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <div class="p-0 -mr-2 leading-none" v-on="on">
              <TextField
                :value="formatDate(item.obtainCostDate)"
                :placeholder="$t('placeholder.emptyDate')"
                right
                colored
                borderless
                readonly
                hide-details
                class="text-xs text-right pr-2 pt-1 pb-0"
              />
            </div>
          </template>
          <v-date-picker
            :value="$toISOString($parseDate(item.obtainCostDate))"
            :locale="$i18n.locale"
            :next-icon="icons.mdiChevronRight"
            :prev-icon="icons.mdiChevronLeft"
            color="#5a8199"
            no-title
            dark
            @change="updateInvoice({
              obtainCostDate: $event || null
            })"
          ></v-date-picker>
        </v-menu>
      </div>
      <div class="flex flex-col items-end w-full pr-2 md:pr-0">
        <label class="text-xs text-gray-light select-none">
          {{ $t('shipping.clientDebt') }}
        </label>
        <div
          class="leading-none text-white"
          style="padding: 2px 0 2px;"
        >
          {{ $n(item.clientDebt, 'formatted') }} {{ $t('currency.CNY.symbol') }}
        </div>
        <v-menu
          ref="menu"
          v-model="menuClientDebtDate"
          transition="scale-transition"
          min-width="290px"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <div class="p-0 -mr-2 leading-none" v-on="on">
              <TextField
                :value="formatDate(item.clientDebtDate)"
                :placeholder="$t('placeholder.emptyDate')"
                right
                colored
                borderless
                readonly
                hide-details
                class="text-xs text-right pr-2 pt-1 pb-0"
              />
            </div>
          </template>
          <v-date-picker
            :value="$toISOString($parseDate(item.clientDebtDate))"
            :locale="$i18n.locale"
            :next-icon="icons.mdiChevronRight"
            :prev-icon="icons.mdiChevronLeft"
            color="#5a8199"
            no-title
            dark
            @change="updateInvoice({
              clientDebtDate: $event || null
            })"
          ></v-date-picker>
        </v-menu>
      </div>
    </div>

  </div>
</template>

<script>
import invoice from '../../mixins/invoice'

export default {
  name: 'ManagerInvoiceFooter',
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

<style lang="postcss">
.invoice-footer {
  @apply flex flex-wrap justify-center items-start py-1 px-4;
  @apply bg-accent1;
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
