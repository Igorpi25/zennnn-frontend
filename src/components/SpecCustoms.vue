<template>
  <div class="w-full pb-4 md:w-1/2 lg:w-2/6 md:pl-3 md:max-w-sm">
    <h4 class="text-xl font-semibold leading-6 mb-4">
      {{ $t('shipping.customsAndTaxes') }}
    </h4>
    <div class="bg-gray-700 rounded-md py-1 px-2">
      <div class="px-1 pb-1">
        <Select
          v-model="item.countryOfOrigin"
          :placeholder="$t('shipping.countryOfOrigin')"
          :nudge-bottom="32"
          :items="deliveryCountries"
          solo
          squared
          hide-details
          class="text-sm select_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        >
          <template v-slot:append="{ isMenuOpen, toggle }">
            <div class="text-primary cursor-pointer select-none" @click="toggle">
              <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
              <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
            </div>
          </template>
        </Select>
      </div>
      <div class="flex items-center pb-1">
        <div class="pl-2 pr-1 w-3/5 truncate" :title="$t('shipping.termsLabel')">
          {{ $t('shipping.termsLabel') }}:
        </div>
        <div class="px-1 w-2/5">
          <Select
            v-model="item.terms"
            :placeholder="$t('placeholder.notChosen')"
            :nudge-bottom="32"
            :items="deliveryTerms"
            solo
            squared
            hide-details
            class="text-sm select_nd"
            input-class="h-8 text-primary placeholder-gray-200"
          >
            <template v-slot:append="{ isMenuOpen, toggle }">
              <div class="text-primary cursor-pointer select-none" @click="toggle">
                <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
              </div>
            </template>
          </Select>
        </div>
      </div>
      <div class="flex items-center">
        <div class="pl-2 pr-1 w-3/5 truncate" :title="$t('shipping.costLabel')">
          {{ $t('shipping.costLabel') }}:
        </div>
        <div class="px-1 w-2/5">
          <TextField
            v-model="item.cost"
            :placeholder="$t('placeholder.emptyNumber')"
            type="number"
            inputmode="decimal"
            format-style="decimal"
            solo
            squared
            hide-details
            class="text-sm text-field_nd"
            input-class="h-8 text-primary placeholder-gray-200"
          />
        </div>
      </div>
      <div class="border-t border-background my-3 mx-2" />
      <div class="flex items-center pb-1">
        <div class="pl-2 pr-1 w-3/5 truncate" :title="$t('shipping.discountLabel')">
          {{ $t('shipping.discountLabel') }}:
        </div>
        <div class="px-1 w-2/5">
          <TextField
            v-model="item.discount"
            :placeholder="$t('placeholder.emptyNumber')"
            type="number"
            inputmode="decimal"
            format-style="decimal"
            solo
            squared
            hide-details
            class="text-sm text-field_nd"
            input-class="h-8 text-primary placeholder-gray-200"
          />
        </div>
      </div>
      <div class="flex items-center pb-1">
        <div class="pl-2 pr-1 w-3/5 truncate" :title="$t('shipping.vatLabel')">
          {{ $t('shipping.vatLabel') }}:
        </div>
        <div class="px-1 w-2/5">
          <Select
            v-model="item.vat"
            :placeholder="$t('placeholder.notChosen')"
            :nudge-bottom="32"
            :items="[]"
            disabled
            solo
            squared
            hide-details
            class="text-sm select_nd"
            input-class="h-8 text-primary placeholder-gray-200"
          >
            <template v-slot:append="{ isMenuOpen }">
              <div class="text-gray-darkest cursor-not-allowed">
                <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
              </div>
            </template>
          </Select>
        </div>
      </div>
      <div class="flex items-center">
        <div class="pl-2 pr-1 w-3/5 truncate" :title="$t('shipping.incomeTaxLabel')">
          {{ $t('shipping.incomeTaxLabel') }}:
        </div>
        <div class="px-1 w-2/5">
          <Select
            v-model="item.incomeTax"
            :placeholder="$t('placeholder.notChosen')"
            :nudge-bottom="32"
            :items="[]"
            disabled
            solo
            squared
            hide-details
            class="text-sm select_nd"
            input-class="h-8 text-primary placeholder-gray-200"
          >
            <template v-slot:append="{ isMenuOpen }">
              <div class="text-gray-darkest cursor-not-allowed">
                <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
              </div>
            </template>
          </Select>
        </div>
      </div>
    </div>
    <!-- Cost -->
    <h4 class="text-xl font-semibold leading-6 mb-4 mt-8">
      {{ $t('shipping.amount') }}
    </h4>
    <div class="bg-gray-700 rounded-md py-1 px-2">
      <div class="px-1 py-3 mb-1 text-lg text-center">
        {{ $n(item.amount || 0, 'decimal') }}
      </div>
      <div class="px-1 pb-1">
        <TextArea
          v-model="item.amountInWords"
          :placeholder="$t('shipping.amountInWords')"
          rows="2"
          squared
          hide-details
          class="text-sm text-area_nd"
          input-class="text-primary placeholder-gray-200"
        />
      </div>
      <div class="px-1">
        <TextArea
          v-model="item.amountInWordsClientLang"
          :placeholder="$t('shipping.amountInWordsClientLang')"
          rows="2"
          squared
          hide-details
          class="text-sm text-area_nd"
          input-class="text-primary placeholder-gray-200"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'

export default {
  name: 'SpecCustoms',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },
  computed: {
    deliveryCountries () {
      return [
        {
          text: 'CHN',
          value: 'CN',
        },
      ]
    },
    deliveryTerms () {
      return [
        {
          text: 'CFR',
          value: 'CFR',
        },
      ]
    },
  },
}
</script>
