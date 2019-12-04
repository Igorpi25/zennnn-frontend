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
      <td>
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="item.store && item.store.net"
          @input="updateProduct({
            store: { net: $event }
          })"
        />
      </td>
      <td>
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="item.store && item.store.gross"
          @input="updateProduct({
            store: { gross: $event }
          })"
        />
      </td>
      <td class="flex items-center" style="line-height:35px">
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="item.store && item.store.width"
          @input="updateProduct({
            store: { width: $event }
          })"
        />
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="item.store && item.store.height"
          @input="updateProduct({
            store: { height: $event }
          })"
        />
        <Editable
          type="number"
          inputmode="decimal"
          :placeholder="$t('placeholder.emptyNumber')"
          :value="item.store && item.store.length"
          @input="updateProduct({
            store: { length: $event }
          })"
        />
      </td>
    </template>

    <template v-else-if="activeTab === 2">
      <td class="text-right">
        <div v-if="item.info && item.info.images && item.info.images.length > 0">
          {{ item.info.images }}
        </div>
      </td>
      <td class="text-left">
        <Editable
          :value="item.info && item.info.description"
          :placeholder="$t('placeholder.emptyText')"
          @input="updateProduct({
            info: { description: $event }
          })"
        />
      </td>
    </template>

    <template v-else-if="activeTab === 3">
      <td class="text-left text-primary">
        <Editable
          :value="item.link && item.link.url"
          :placeholder="$t('placeholder.emptyText')"
          @input="updateProduct({
            link: { url: $event }
          })"
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
import { mdiClose } from '@mdi/js'
import { ProductStatus } from '@/graphql/enums'
import product from '../../mixins/product'

export default {
  name: 'FreelancerProduct',
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
}
</script>

<style>

</style>
