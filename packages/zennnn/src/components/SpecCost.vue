<template>
  <!-- Financial Info -->
  <div class="w-full">
    <h4 class="text-white text-xl font-semibold leading-6 mb-4">
      {{ $t('shipping.financialInfo') }}
    </h4>
    <div class="bg-gray-700 rounded-md leading-5 p-5">
      <div class="flex text-gray-200 px-2.5 pb-3">
        <div class="flex-grow">
          {{ $t('shipping.finalCost') }} {{ $t(`currency.${currency}.symbol`) }}
        </div>
        <div class="text-white text-right">
          {{ $n(spec.finalCost || 0, 'fixed') }}
        </div>
      </div>
      <div class="border-b border-gray-900 mx-2.5" />
      <div class="flex text-gray-200 px-2.5 py-3">
        <div class="flex-grow">
          {{ $t('shipping.finalObtainCost') }}
          {{ $t(`currency.${currency}.symbol`) }}
        </div>
        <div class="text-white text-right">
          {{ $n(spec.finalObtainCost || 0, 'fixed') }}
        </div>
      </div>
      <div class="border-b border-gray-900 mx-2.5" />
      <div class="flex text-gray-200 px-2.5 py-3">
        <div class="flex-grow">
          {{ $t('shipping.profit') }} {{ $t(`currency.${currency}.symbol`) }}
        </div>
        <div
          :class="[
            'text-right',
            spec.profit > 0 ? 'text-green-500' : ' text-white',
          ]"
        >
          {{ $n(spec.profit || 0, 'fixed') }}
        </div>
      </div>
      <div class="rounded-md bg-gray-500 text-gray-200 px-2.5 py-2">
        <div class="flex py-2">
          <div class="flex-grow">
            {{ $t('shipping.totalPrepay') }}
            {{ $t(`currency.${currency}.symbol`) }}
          </div>
          <div class="text-right">
            {{ $n(spec.totalPrepay || 0, 'fixed') }}
          </div>
        </div>
        <div class="border-b border-gray-900" />
        <div class="flex py-2">
          <div class="flex-grow">
            {{ $t('shipping.totalClientDebt') }}
            {{ $t(`currency.${currency}.symbol`) }}
          </div>
          <div
            :class="[
              'text-right',
              spec.totalClientDebt > 0 ? 'text-red-600' : ' text-white',
            ]"
          >
            {{ $n(spec.totalClientDebt || 0, 'fixed') }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isOwnerOrManager"
      class="flex items-center bg-gray-700 rounded-md p-5 mt-4"
    >
      <div class="flex-grow text-gray-100">
        <span>{{ $t('shipping.documentRate') }}</span>
        <select
          :value="currency"
          :class="['simple-select text-sm ml-px']"
          @change="$emit('update-spec', { currency: $event.target.value })"
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
          :model-value="spec.currencyRate"
          :placeholder="$t('placeholder.emptyNumber')"
          :disabled="isCurrencyDisabled"
          lazy
          number
          @update:model-value="$emit('update-spec', { currencyRate: $event })"
        />
      </div>
      <div class="text-gray-200">
        {{ $t(`currency.USD.iso-4217`) }}
      </div>
    </div>
  </div>
</template>

<script>
import { DEFAULT_CURRENCY } from '../config/globals'
import { SpecCurrency, Role } from '../graphql/enums'

import { TextField } from '@zennnn/core'

export default {
  name: 'SpecCost',
  components: {
    TextField,
  },
  props: {
    spec: {
      type: Object,
      default: () => ({}),
    },
    role: {
      type: String,
      required: true,
    },
  },
  computed: {
    isOwnerOrManager() {
      return this.role === Role.OWNER || this.role === Role.MANAGER
    },
    currency() {
      return this.spec.currency || DEFAULT_CURRENCY
    },
    isCurrencyDisabled() {
      return this.currency === SpecCurrency.USD
    },
    currencies() {
      return Object.values(SpecCurrency).map((el) => {
        return {
          text: el,
          value: el,
        }
      })
    },
  },
}
</script>
