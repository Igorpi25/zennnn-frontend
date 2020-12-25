<template>
  <div class="w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3">
    <h4 class="text-white text-xl font-semibold leading-6 mb-4">
      {{ $t('shipping.customsAndTaxes') }}
    </h4>
    <div class="bg-gray-700 text-gray-200 rounded-md pt-2 pb-5 px-sm">
      <div class="pb-2">
        <Select
          :value="item.countryOfOrigin"
          :placeholder="$t('shipping.countryOfOrigin')"
          v-model:search="countriesSearch"
          :items="shipmentCountries"
          dense
          searchable
          hide-details
          prepend-slot-class="w-auto pl-2"
          @input="$emit('update', { customs: { countryOfOrigin: $event } })"
        >
          <template v-slot:prepend>
            <img
              v-if="item.countryOfOrigin"
              :src="require(`@/assets/img/flags/square/${item.countryOfOrigin}.svg`).default"
              :alt="item.countryOfOrigin"
              class="w-6 rounded-sm mr-4"
            >
            <img
              v-else
              src="@/assets/icons/earth.svg"
              class="h-5 w-6 rounded-full mr-4"
            >
          </template>
          <template v-slot:item="{ item }">
            <img
              :src="require(`@/assets/img/flags/square/${item.value}.svg`).default"
              class="w-6 rounded-sm mr-4"
            >
            <span>{{ item.text }}</span>
          </template>
        </Select>
      </div>
      <div class="flex items-center pb-2">
        <div class="pl-sm pr-1 w-3/5 truncate" :title="$t('shipping.termsLabel')">
          {{ $t('shipping.termsLabel') }}:
        </div>
        <div class="w-2/5">
          <Select
            :value="item.terms"
            :placeholder="$t('placeholder.notChosen')"
            v-model:search="termsSearch"
            :items="customsTerms"
            :disabled="isTermsDisabled"
            dense
            searchable
            @input="$emit('update', { customs: { terms: $event } })"
          />
        </div>
      </div>
      <div class="flex items-center">
        <div class="pl-sm pr-1 w-3/5 truncate" :title="$t('shipping.costLabel')">
          {{ $t('shipping.costLabel') }}:
        </div>
        <div class="w-2/5">
          <TextField
            :value="item.cost"
            :placeholder="$t('placeholder.emptyNumber')"
            lazy
            dense
            number
            number-format="currency"
            slot-class="w-auto"
            @input="$emit('update', { customs: { cost: $event } })"
          >
            <template v-slot:append>
              <span class="text-base text-white pl-xs pr-sm">
                {{ $t(`currency.USD.symbol`) }}
              </span>
            </template>
          </TextField>
        </div>
      </div>
      <div class="border-t border-gray-900 my-4 mx-5" />
      <div class="flex items-center pb-2">
        <div class="pl-sm pr-1 w-3/5 truncate" :title="$t('shipping.discountLabel')">
          {{ $t('shipping.discountLabel') }}:
        </div>
        <div class="w-2/5">
          <TextField
            :value="item.discount"
            :placeholder="$t('placeholder.emptyNumber')"
            lazy
            dense
            number
            number-format="currency"
            slot-class="w-auto"
            @input="$emit('update', { customs: { discount: $event } })"
          >
            <template v-slot:append>
              <span class="text-base text-white pl-xs pr-sm">
                {{ $t(`currency.USD.symbol`) }}
              </span>
            </template>
          </TextField>
        </div>
      </div>
      <div class="flex items-center pb-2">
        <div class="pl-sm pr-1 w-3/5 truncate" :title="$t('shipping.vatLabel')">
          {{ $t('shipping.vatLabel') }}:
        </div>
        <div class="w-2/5">
          <Select
            :placeholder="$t('placeholder.notChosen')"
            :items="[]"
            dense
            disabled
            squared
            hide-details
          />
        </div>
      </div>
      <div class="flex items-center">
        <div class="pl-sm pr-1 w-3/5 truncate" :title="$t('shipping.incomeTaxLabel')">
          {{ $t('shipping.incomeTaxLabel') }}:
        </div>
        <div class="w-2/5">
          <Select
            :placeholder="$t('placeholder.notChosen')"
            :items="[]"
            dense
            disabled
          />
        </div>
      </div>
    </div>
    <!-- Cost -->
    <div class="bg-gray-700 rounded-md py-5 px-sm mt-5">
      <div class="text-white text-lg text-center font-bold px-2 pt-sm pb-6">
        {{ $n(amount || 0, 'fixed') }} {{ $t(`currency.USD.symbol`) }}
      </div>
      <div class="pb-2">
        <TextArea
          :value="amountInWords"
          :debounce="250"
          :placeholder="$t('shipping.amountInWords')"
          rows="2"
          @input="$emit('update', { amountInWords: $event })"
        />
      </div>
      <div>
        <TextArea
          :value="amountInWordsClientLang"
          :debounce="250"
          :placeholder="$t('shipping.amountInWordsClientLang')"
          rows="2"
          @input="$emit('update', { amountInWordsClientLang: $event })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { CustomsTerms, CustomsTermsMore, ShipmentType } from '../graphql/enums'
import Countries from '../config/countries-iso3.json'

import TextField from './Base/TextField'
import TextArea from './Base/TextArea'
import Select from './Base/Select'

export default {
  name: 'SpecCustoms',
  components: {
    TextField,
    TextArea,
    Select,
  },
  props: {
    shipmentType: {
      type: String,
      default: '',
    },
    item: {
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
  data () {
    return {
      termsSearch: '',
      countriesSearch: '',
    }
  },
  computed: {
    isTermsDisabled () {
      return this.shipmentType === ShipmentType.AIR || this.shipmentType === ShipmentType.EXPRESS
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
      let items = []
      if (this.shipmentType === ShipmentType.RAILWAY || this.shipmentType === ShipmentType.CAR) {
        items = this.customsTermsItems
      }
      if (this.shipmentType === ShipmentType.MARINE || this.shipmentType === ShipmentType.MIXED) {
        items = [...this.customsTermsItems, { divider: true }, ...this.customsTermsMoreItems]
      }
      return items
    },
  },
}
</script>
