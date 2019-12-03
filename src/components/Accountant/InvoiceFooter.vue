<template>
  <div class="invoice-footer">
    <div class="flex sm:flex-wrap w-full sm:w-auto md:px-3 max-w-xs">
      <div class="flex flex-col items-end w-full sm:w-32 pr-1 md:pr-0 lg:pr-1">
        <label class="text-xs text-gray-light select-none pr-2">
          {{ $t('shipping.discount') }}
        </label>
        <span class="mr-2 leading-none">{{ item.discount || $t('placeholder.emptyNumber') }} {{ $t('currency.CNY.symbol') }}</span>
      </div>
      <div class="flex flex-col items-end w-full sm:w-32 pl-1 md:pl-0 lg:pl-1">
        <label class="text-xs text-gray-light select-none pr-2">
          {{ $t('shipping.prepay') }}
        </label>
        <span class="mr-2 leading-none">{{ item.prepayment || $t('placeholder.emptyNumber') }} {{ $t('currency.CNY.symbol') }}</span>
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
                :value="formatDate(prepaymentDate)"
                :placeholder="$t('placeholder.emptyDate')"
                right
                colored
                borderless
                readonly
                hide-details
                class="text-xs text-right pr-2 pt-1 pb-0"
                @input="updateInvoice(item.id, {
                  prepaymentDate: $event && $event.toISOString() || null
                })"
              />
            </div>
          </template>
          <v-date-picker
            v-model="prepaymentDate"
            :locale="$i18n.locale"
            :next-icon="icons.mdiChevronRight"
            :prev-icon="icons.mdiChevronLeft"
            color="#5a8199"
            no-title
            dark
            @change="menuPrepaymentDate = false"
          ></v-date-picker>
        </v-menu>
      </div>
    </div>

    <div class="flex w-full sm:w-auto max-w-xs">
      <div class="flex flex-col items-end w-full pr-3 md:pr-0">
        <label class="text-xs text-gray-light select-none">
          {{ $t('shipping.obtainCost') }}
        </label>
        <span class="leading-none">
          {{ $n(item.residue, 'formatted') }} {{ $t('currency.CNY.symbol') }}
        </span>
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
                :value="formatDate(residueDate)"
                :placeholder="$t('placeholder.emptyDate')"
                right
                colored
                borderless
                readonly
                hide-details
                class="text-xs text-right pr-2 pt-1 pb-0"
                @input="updateInvoice(item.id, {
                  residueDate: $event && $event.toISOString() || null
                })"
              />
            </div>
          </template>
          <v-date-picker
            v-model="residueDate"
            :locale="$i18n.locale"
            :next-icon="icons.mdiChevronRight"
            :prev-icon="icons.mdiChevronLeft"
            color="#5a8199"
            no-title
            dark
            @change="menuResidueDate = false"
          ></v-date-picker>
        </v-menu>
      </div>
      <div class="flex flex-col items-end w-full pr-2 md:pr-0">
        <label class="text-xs text-gray-light select-none">
          {{ $t('shipping.clientDebt') }}
        </label>
        <span class="leading-none text-white">
          {{ $n(item.clientDebt, 'formatted') }} {{ $t('currency.CNY.symbol') }}
        </span>
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
                :value="formatDate(clientDebtDate)"
                :placeholder="$t('placeholder.emptyDate')"
                right
                colored
                borderless
                readonly
                hide-details
                class="text-xs text-right pr-2 pt-1 pb-0"
                @input="updateInvoice(item.id, {
                  clientDebtDate: $event && $event.toISOString() || null
                })"
              />
            </div>
          </template>
          <v-date-picker
            v-model="clientDebtDate"
            :locale="$i18n.locale"
            :next-icon="icons.mdiChevronRight"
            :prev-icon="icons.mdiChevronLeft"
            color="#5a8199"
            no-title
            dark
            @change="menuClientDebtDate = false"
          ></v-date-picker>
        </v-menu>
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
