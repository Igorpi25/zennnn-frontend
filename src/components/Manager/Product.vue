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
      <div class="pb-2">
        {{ index + 1 }}
      </div>
      <div>
        <Comments
          :items="item.comments"
          :product-id="item.id"
          :spec-id="specId"
          is-product
          sm
          right
          class="inline-block"
        />
      </div>
    </td>
    <td class="text-primary text-center">
      <ProductImage
        :product-id="item.id"
        :images="info.images"
        sortable
      />
    </td>
    <td>
      <TextField
        :value="item.name"
        :placeholder="$t('shipping.name')"
        solo
        @input="updateProduct({ name: $event })"
      />
    </td>
    <td>
      <TextField
        :value="item.article"
        :placeholder="$t('shipping.model')"
        solo
        @input="updateProduct({ article: $event })"
      />
    </td>
    <td>
      <div class="flex items-center">
        <TextField
          :value="item.qty"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          @input="updateProduct({ qty: $event })"
        />
        <select
          :value="item.unit || 'pcs'"
          class="simple-select text-primary text-xs"
          @change="updateProduct({ unit: $event.target.value })"
        >
          <option
            v-for="unit of unitsItems"
            :key="unit.value"
            :value="unit.value"
          >
            {{ unit.text }}
          </option>
        </select>
      </div>
    </td>

    <template v-if="activeTab === 1">
      <td v-if="isInvoiceProfitTypeMargin || !profitForAll">
        <TextField
          :value="purchasePrice"
          :placeholder="$t('placeholder.emptyNumber')"
          :text-color="hasCustomPurchasePrice ? '#4C51BF': ''"
          lazy
          solo
          number
          number-format="currency"
          @input="updateProductCost({ purchasePrice: $event })"
        />
      </td>
      <td
        v-else
        class="text-right"
        style="padding-left: 11px; padding-right: 11px;"
      >
        {{ $n(cost.purchasePrice, 'fixed') }}
      </td>

      <td class="text-right">
        {{ $n(cost.purchaseAmount, 'fixed') }}
      </td>

      <td v-if="isInvoiceProfitTypeCommission || !profitForAll">
        <TextField
          :value="clientPrice"
          :placeholder="$t('placeholder.emptyNumber')"
          :text-color="hasCustomClientPrice ? '#4C51BF': ''"
          lazy
          solo
          number
          number-format="currency"
          @input="updateProductCost({ clientPrice: $event })"
        />
      </td>
      <td
        v-else
        class="text-right"
        style="padding-left: 11px; padding-right: 11px;"
      >
        {{ $n(cost.clientPrice, 'fixed') }}
      </td>

      <td class="text-right">
        {{ $n(cost.clientAmount, 'fixed') }}
      </td>
    </template>

    <template v-else-if="activeTab === 2">
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

    <template v-else-if="activeTab === 3">
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

    <template v-else-if="activeTab === 4">
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

    <td
      class="text-gray-lighter text-center cursor-pointer px-0"
      @click="deleteProduct(item.id)"
    >
      <Icon>{{ icons.mdiClose }}</Icon>
    </td>
  </tr>
</template>

<script>
import { InvoiceProfitType } from '@/graphql/enums'
import product from '../../mixins/product'
import Comments from '../Comments'

export default {
  name: 'ManagerProduct',
  components: {
    Comments,
  },
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
