<template>
  <tr>
    <td class="relative p-0">
      <span
        :class="[
          'status-indicator__bordered',
          item.productStatus === ProductStatus.IN_PRODUCTION
            ? 'status-indicator__bordered--orange' : item.productStatus === ProductStatus.IN_STOCK
              ? 'status-indicator__bordered--green' : 'status-indicator__bordered--pink'
        ]"
      >
      </span>
    </td>
    <td class="text-gray-lighter text-xs leading-none py-2 align-top">
      {{ index + 1 }}
    </td>
    <td class="text-primary text-center">
      <ProductImage
        :product-id="item.id"
        :images="info.images"
      />
    </td>
    <td>
      <span>{{ item.name || $t('shipping.name') }}</span>
    </td>
    <td>
      <span>{{ item.article || $t('shipping.model') }}</span>
    </td>
    <td class="text-right">
      <span>{{ $n(item.qty, 'formatted') || $t('placeholder.emptyNumber') }}</span>
    </td>

    <template v-if="activeTab === 1">
      <td class="text-right">
        <span v-if="!profitForAll">
          {{ $n(purchasePrice, 'decimal') || $t('placeholder.emptyNumber') }}
        </span>
        <span v-else>
          {{ $n(cost.purchasePrice, 'decimal') || $t('placeholder.emptyNumber') }}
        </span>
      </td>
      <td class="text-right">
        {{ $n(cost.purchaseAmount, 'decimal') }}
      </td>
      <td class="text-right">
        <span v-if="!profitForAll">
          {{ $n(clientPrice, 'decimal') }}
        </span>
        <span v-else>
          {{ $n(cost.clientPrice, 'decimal') || $t('placeholder.emptyNumber') }}
        </span>
      </td>
      <td class="text-right">
        {{ $n(cost.clientAmount, 'decimal') }}
      </td>
    </template>

    <template v-else-if="activeTab === 2">
      <td class="text-right">
        <div v-if="info.images && info.images.length > 0">
          <ProductImagesList
            :product-id="item.id"
            :images="info.images"
          />
        </div>
      </td>
      <td class="text-left">
        <span>{{ info.description || $t('placeholder.emptyText') }}</span>
      </td>
      <td></td>
    </template>

    <template v-else-if="activeTab === 3">
      <td class="text-left text-primary">
        <span>{{ link.url || $t('placeholder.emptyText') }}</span>
      </td>
      <td class="text-right">
        <i><a href="#"></a></i>
      </td>
    </template>

  </tr>
</template>

<script>
import { mdiClose } from '@mdi/js'
import {
  ProductStatus,
} from '@/graphql/enums'
import product from '../../mixins/product'

export default {
  name: 'AccountantProduct',
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
    activeTab: {
      type: Number,
      default: 1,
    },
    profitType: {
      type: String,
      default: '',
    },
    profitForAll: {
      type: Boolean,
      default: true,
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
}
</script>
