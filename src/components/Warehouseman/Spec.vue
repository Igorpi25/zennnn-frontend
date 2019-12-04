<template>
  <div class="container container--sm">
    <div class="pt-10">
      <div class="flex justify-between">
        <span class="mb-3">
          <span>{{ $t('shipping.shippingTitle') }}</span>&nbsp;
          <span class="text-primary">
            {{ spec.specNo }}
          </span>&nbsp;
          <span>{{ $t('preposition.from') }}:</span>&nbsp;
          <span>
            {{ $d($parseISO(spec.createdAt), 'short') }}
          </span>
        </span>
        <span
          class="text-gray text-sm cursor-pointer whitespace-no-wrap"
          @click="collapseAll"
        >{{ $t('action.collapseAll') }}</span>
      </div>

      <div v-for="(item) in items" :key="item.id" class="mb-6">
        <InvoiceHeader
          :item="item"
          :expanded="expanded"
          has-icon-text
          @click="expand"
        >
          <div class="flex flex-col md:flex-row pr-2 w-full md:w-auto text-sm" style="color:#aaaaaa">
            <span class="mr-2">{{ item.invoiceNo || 'A-123-666-8d' }} </span>
          </div>
        </InvoiceHeader>
        <Invoice
          v-if="expanded.includes(item.id)"
          style="margin-top: 1px"
          :invoice="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InvoiceHeader from './InvoiceHeader.vue'
import Invoice from './Invoice.vue'

import spec from '../../mixins/spec'

export default {
  name: 'WarehousemanSpec',
  components: {
    InvoiceHeader,
    Invoice,
  },
  mixins: [spec],
  data () {
    return {
      //
    }
  },
  computed: {
    //
  },
  methods: {
    //
  },
}
</script>
