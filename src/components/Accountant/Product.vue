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
      <span>{{ item.name || $t('shipping.name') }}</span>
    </td>
    <td>
      <span>{{ item.article || $t('shipping.model') }}</span>
    </td>
    <td class="text-right">
      <span>{{ item.qty || $t('placeholder.emptyNumber') }}</span>
    </td>

    <template v-if="activeTab === 1">
      <td class="text-right">
        <span>{{ item.cost && item.cost.obtainPrice || $t('placeholder.emptyNumber') }}</span>
      </td>
      <td class="text-right">
        {{ item.cost && item.cost.obtainAmount }}
      </td>
      <td class="text-right">
        <span>{{ item.cost && item.cost.sellingPrice || $t('placeholder.emptyNumber') }}</span>
      </td>
      <td class="text-right">
        {{ item.cost && item.cost.sellingAmount }}
      </td>
    </template>

    <template v-else-if="activeTab === 2">
      <td class="text-right">
        <div v-if="item.info && item.info.images && item.info.images.length > 0">
          {{ item.info.images }}
        </div>
      </td>
      <td class="text-left">
        <span>{{ item.info && item.info.description || $t('placeholder.emptyText') }}</span>
      </td>
      <td></td>
    </template>

    <template v-else-if="activeTab === 3">
      <td class="text-left text-primary">
        <span>{{ item.link && item.link.url || $t('placeholder.emptyText') }}</span>
      </td>
      <td class="text-right">
        <i><a href="#"></a></i>
      </td>
    </template>

  </tr>
</template>

<script>
import { mdiClose } from '@mdi/js'
import { ProductStatus } from '@/graphql/enums'
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
