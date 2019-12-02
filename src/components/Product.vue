<template>
  <tr>
    <td class="relative p-0">
      <span
        :class="[
          'status-indicator__bordered',
          item.status === ProductStatus.IN_PRODUCTION
            ? 'status-indicator__bordered--orange' : item.status === ProductStatus.IN_STOCK
              ? 'status-indicator__bordered--green' : 'status-indicator__bordered--pink'
        ]"
      >
      </span>
    </td>
    <td class="text-gray-lighter text-xs leading-none py-2 align-top">
      {{ index + 1 }}
    </td>
    <td class="text-primary text-center">
      <img style="width:35px;height:35px">
    </td>
    <td>
      <Editable
        :value="item.name"
        :placeholder="$t('shipping.name')"
        @input="updateProduct(item.id, { name: $event })"
      />
    </td>
    <td>
      <Editable
        :value="item.article"
        :placeholder="$t('shipping.model')"
        @input="updateProduct(item.id, { article: $event })"
      />
    </td>
    <td>
      <Editable
        type="number"
        inputmode="numeric"
        :value="item.qty"
        :placeholder="$t('placeholder.emptyNumber')"
        @input="updateProduct({ qty: $event })"
      />
    </td>

    <td v-if="isInvoiceProfitTypeMargin || !profitForAll">
      <Editable
        type="number"
        inputmode="decimal"
        :value="item.cost && item.cost.obtainPrice"
        :placeholder="$t('placeholder.emptyNumber')"
        @input="updateProduct({
          id: item.id,
          cost: { obtainPrice: $event }
        })"
      />
    </td>
    <td v-else class="text-right">
      {{ item.cost && item.cost.obtainPrice }}
    </td>
    <td class="text-right">
      {{ item.cost && item.cost.obtainAmount }}
    </td>
    <td v-if="isInvoiceProfitTypeCommission || !profitForAll">
      <Editable
        type="number"
        inputmode="decimal"
        :value="item.cost && item.cost.sellingPrice"
        :placeholder="$t('placeholder.emptyNumber')"
        @input="updateProduct({
          id: item.id,
          cost: { sellingPrice: $event }
        })"
      />
    </td>
    <td
      v-else
      class="text-right"
    >{{ item.cost && item.cost.sellingPrice }}</td>
    <td class="text-right">
      {{ item.cost && item.cost.sellingAmount }}
    </td>
    <td
      class="text-gray-lighter text-center cursor-pointer px-0"
      @click="deleteProduct(item.id)"
    >
      <Icon>{{ icons.mdiClose }}</Icon>
    </td>
  </tr>
</template>

<script>
import { mdiClose } from '@mdi/js'
import {
  ProductStatus,
  InvoiceProfitType,
} from '@/graphql/enums'
import product from '../mixins/product'

export default {
  name: 'Product',
  mixins: [product],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    profitType: {
      type: String,
      default: '',
    },
    profitForAll: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      ProductStatus,
      icons: {
        mdiClose,
      },
    }
  },
  computed: {
    isInvoiceProfitTypeMargin () {
      return this.profitType === InvoiceProfitType.MARGIN
    },
    isInvoiceProfitTypeCommission () {
      return this.profitType === InvoiceProfitType.COMMISSION
    },
  },
}
</script>

<style>

</style>
