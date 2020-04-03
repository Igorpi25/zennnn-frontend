<template>
  <tr>
    <td class="relative p-0">
      <span
        :class="[
          'status-indicator__bordered',
          productStatus,
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
        :upload="false"
        :removable="false"
      />
    </td>
    <td>
      <span>{{ item.name || $t('shipping.name') }}</span>
    </td>
    <td>
      <span>{{ item.article || $t('shipping.model') }}</span>
    </td>
    <td class="text-right">
      <span class="mr-1">{{ $n(item.qty) || $t('placeholder.emptyNumber') }}</span>
      <span>{{ $t(`unit.${item.unit || 'pcs'}`) }}</span>
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
            :upload="false"
            :removable="false"
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
}
</script>
