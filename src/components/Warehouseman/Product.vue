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
        sortable
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
      <td>
        <TextField
          :value="store.net"
          :placeholder="$t('placeholder.emptyNumber')"
          solo
          number
          @input="updateProductStore({ net: $event })"
        />
      </td>
      <td>
        <TextField
          :value="store.gross"
          :placeholder="$t('placeholder.emptyNumber')"
          solo
          number
          @input="updateProductStore({ gross: $event })"
        />
      </td>
      <td>
        <div class="flex items-center">
          <TextField
            :value="store.width"
            :placeholder="$t('placeholder.emptyNumber')"
            solo
            number
            @input="updateProductStore({ width: $event })"
          />
          <TextField
            :value="store.height"
            :placeholder="$t('placeholder.emptyNumber')"
            solo
            number
            @input="updateProductStore({ height: $event })"
          />
          <TextField
            :value="store.length"
            :placeholder="$t('placeholder.emptyNumber')"
            solo
            number
            @input="updateProductStore({ length: $event })"
          />
        </div>
      </td>
      <td>
        <TextField
          :value="store.pkgQty"
          :placeholder="$t('placeholder.emptyNumber')"
          solo
          number
          number-format="integer"
          @input="updateProductStore({ pkgQty: $event })"
        />
      </td>
      <td>
        <TextField
          :value="store.pkgNo"
          :placeholder="$t('placeholder.emptyNumber')"
          solo
          number
          number-format="integer"
          @input="updateProductStore({ pkgNo: $event })"
        />
      </td>
      <td class="text-center text-primary">
        <Checkbox
          :value="store.atWhouse"
          hide-details
          vertical-align
          horizontal-align
          @input="updateProductStore({ atWhouse: $event })"
        />
      </td>
    </template>

    <template v-else-if="activeTab === 2">
      <td class="text-right">
        <div v-if="info.images">
          <ProductImagesList
            :product-id="item.id"
            :images="info.images"
          />
        </div>
      </td>
      <td class="text-left">
        <TextField
          :value="info.description"
          :placeholder="$t('placeholder.emptyText')"
          solo
          @input="updateProductInfo({ description: $event })"
        />
      </td>
    </template>

    <template v-else-if="activeTab === 3">
      <td class="text-left text-primary">
        <TextField
          :value="link.url"
          :placeholder="$t('placeholder.emptyText')"
          solo
          @input="updateProductLink({ url: $event })"
        />
      </td>
      <td class="text-right">
        <i><a href="#"></a></i>
      </td>
    </template>
    <td></td>
  </tr>
</template>

<script>
import product from '../../mixins/product'

export default {
  name: 'WarehousemanProduct',
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
