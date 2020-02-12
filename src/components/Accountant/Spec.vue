<template>
  <div class="container container--sm">
    <div
      v-if="isSpecSync"
      class="fixed opacity-50 simple-rotation-anim"
      style="bottom: 26px; right: 16px;"
    >
      <Icon>
        {{ icons.mdiSync }}
      </Icon>
    </div>
    <div class="pt-10">
      <div class="flex justify-between">
        <span class="mb-3">
          <span>{{ $t('shipping.shippingTitle') }}</span>&nbsp;
          <span class="text-primary">
            {{ spec.specNo }}
          </span>&nbsp;
          <span>{{ $t('preposition.from') }}:</span>&nbsp;
          <span>
            {{ $d($parseDate(spec.createdAt), 'short') }}
          </span>
        </span>
        <span
          v-if="expanded.length === 0"
          class="text-gray text-sm cursor-pointer whitespace-no-wrap select-none"
          @click="expandAll"
        >
          {{ $t('action.expandAll') }}
        </span>
        <span
          v-else
          class="text-gray text-sm cursor-pointer whitespace-no-wrap select-none"
          @click="collapseAll"
        >
          {{ $t('action.collapseAll') }}
        </span>
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
          :invoice="item"
          :active-tab="invoiceActiveTab"
          style="margin-top: 1px"
          @change:tab="setInvoiceActiveTab"
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
  name: 'AccountantSpec',
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
