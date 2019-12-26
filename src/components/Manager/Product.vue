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
      <Editable
        :value="item.name"
        :placeholder="$t('shipping.name')"
        @input="updateProduct({ name: $event })"
      />
    </td>
    <td>
      <Editable
        :value="item.article"
        :placeholder="$t('shipping.model')"
        @input="updateProduct({ article: $event })"
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

    <template v-if="activeTab === 1">
      <td v-if="!profitForAll">
        <Editable
          v-if="isInvoiceProfitTypeMargin && !cost.customPurchasePrice"
          type="number"
          inputmode="decimal"
          :value="cost.purchasePrice"
          :placeholder="$t('placeholder.emptyNumber')"
          @input="updateProductCost({ purchasePrice: $event })"
        />
        <Editable
          v-else
          type="number"
          inputmode="decimal"
          :value="cost.customPurchasePrice || cost.purchasePrice"
          :placeholder="$t('placeholder.emptyNumber')"
          :text-color="cost.customPurchasePrice ? '#4C51BF': ''"
          @input="updateProductCost({ customPurchasePrice: $event })"
        />
      </td>
      <td v-else-if="isInvoiceProfitTypeMargin">
        <Editable
          type="number"
          inputmode="decimal"
          :value="cost.purchasePrice"
          :placeholder="$t('placeholder.emptyNumber')"
          @input="updateProductCost({ purchasePrice: $event })"
        />
      </td>
      <td v-else class="text-right">
        {{ $n(cost.purchasePrice, 'formatted') }}
      </td>

      <td class="text-right">
        {{ $n(cost.purchaseAmount, 'formatted') }}
      </td>

      <td v-if="!profitForAll">
        <Editable
          v-if="isInvoiceProfitTypeCommission && !cost.customClientPrice"
          type="number"
          inputmode="decimal"
          :value="cost.clientPrice"
          :placeholder="$t('placeholder.emptyNumber')"
          @input="updateProductCost({ clientPrice: $event })"
        />
        <Editable
          v-else
          type="number"
          inputmode="decimal"
          :value="cost.customClientPrice || cost.clientPrice"
          :placeholder="$t('placeholder.emptyNumber')"
          :text-color="cost.customClientPrice ? '#4C51BF': ''"
          @input="updateProductCost({ customClientPrice: $event })"
        />
      </td>
      <td v-else-if="isInvoiceProfitTypeCommission">
        <Editable
          type="number"
          inputmode="decimal"
          :value="cost.clientPrice"
          :placeholder="$t('placeholder.emptyNumber')"
          @input="updateProductCost({ clientPrice: $event })"
        />
      </td>
      <td
        v-else
        class="text-right"
      >
        {{ $n(cost.clientPrice, 'formatted') }}
      </td>

      <td class="text-right">
        {{ $n(cost.clientAmount, 'formatted') }}
      </td>
    </template>

    <template v-else-if="activeTab === 2">
      <td>
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="store.net"
          @input="updateProductStore({ net: $event })"
        />
      </td>
      <td>
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="store.gross"
          @input="updateProductStore({ gross: $event })"
        />
      </td>
      <td class="flex items-center" style="line-height:35px">
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="store.width"
          @input="updateProductStore({ width: $event })"
        />
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="store.height"
          @input="updateProductStore({ height: $event })"
        />
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="store.length"
          @input="updateProductStore({ length: $event })"
        />
      </td>
      <td>
        <Editable
          type="number"
          inputmode="numeric"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="store.pkgQty"
          @input="updateProductStore({ pkgQty: $event })"
        />
      </td>
      <td>
        <Editable
          type="number"
          inputmode="numeric"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="store.pkgNo"
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

    <template v-else-if="activeTab === 3">
      <td class="text-right">
        <div v-if="info.images && info.images.length > 0">
          <ProductImagesList
            :product-id="item.id"
            :images="info.images"
          />
        </div>
      </td>
      <td class="text-left">
        <Editable
          :value="info.description"
          :placeholder="$t('placeholder.emptyText')"
          @input="updateProductInfo({ description: $event })"
        />
      </td>
    </template>

    <template v-else-if="activeTab === 4">
      <td class="text-left text-primary">
        <Editable
          :value="link.url"
          :placeholder="$t('placeholder.emptyText')"
          @input="updateProductLink({ url: $event })"
        />
      </td>
      <td class="text-right">
        <i><a href="#"></a></i>
      </td>
    </template>

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
import product from '../../mixins/product'

export default {
  name: 'ManagerProduct',
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
