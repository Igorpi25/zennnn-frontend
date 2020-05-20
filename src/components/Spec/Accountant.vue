<template>
  <div class="container container--sm">
    <div
      v-if="isSpecSync"
      class="fixed opacity-50 simple-rotation-anim mr-4 mb-6"
    >
      <Icon>
        {{ icons.mdiSync }}
      </Icon>
    </div>
    <div class="py-10">
      <div class="flex flex-wrap items-center justify-between pb-4">
        <h1 class="text-2xl text-white font-semibold">
          Накладные и товары
        </h1>
        <div class="text-gray-300">
          <span v-if="spec.client">
            {{ `Клиент: ${spec.client.uid} ${spec.client.fullName}` }}
          </span>
        </div>
      </div>

      <div class="bg-gray-800 bg-opacity-90 rounded-md px-sm pb-sm">
        <div class="h-12 flex items-center">
          <div class="flex-grow" />
          <div class="flex text-gray-200 text-lg overflow-hidden">
            <span v-html="specTitleHtml" :title="specTitleText" class="truncate" />
            <div class="inline-block text-2xl pl-sm pr-3 md:pr-md">
              <button
                v-if="expanded.length === 0"
                class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="expandAll"
              >
                <i class="zi-expand" :title="$t('action.expandAll')" />
              </button>
              <button
                v-else
                class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="collapseAll"
              >
                <i class="zi-collapse" :title="$t('action.collapseAll')" />
              </button>
            </div>
          </div>
        </div>
        <div
          v-for="(item, i) in items"
          :key="item.id"
          :class="{ 'mb-1': i + 1 < items.length }"
          style="box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);"
        >
          <InvoiceHeader
            :item="item"
            :is-expanded="expanded.includes(item.id)"
            :role="Role.ACCOUNTANT"
            @update="updateInvoice"
            @click="expand"
          />
          <InvoiceContent
            v-if="expanded.includes(item.id)"
            :currency="spec.currency"
            :invoice="item"
            :active-tab="invoiceActiveTab"
            :scroll-left="invoiceScrollLeft"
            :scroll-invoice-id="invoiceScrollId"
            :role="Role.ACCOUNTANT"
            @change:tab="setInvoiceActiveTab"
            @change:scrollLeft="setScrollLeft"
            @update:currency="updateSpec({ currency: $event })"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end pb-8">
      <SpecCostInfo
        :role="Role.ACCOUNTANT"
        :spec="spec"
        @update-spec="updateSpec"
      />
    </div>

    <!-- <div class="flex pt-5">
      <Button
        outlined
        @click="createInvoice"
      >
        <template v-slot:icon>
          <i class="zi-plus text-lg block align-middle" />
        </template>
        <span>{{ $t('shipping.addInvoice') }}</span>
      </Button>
      <div class="flex-grow" />
      <Comments
        :items="spec.comments"
        :spec-id="specId"
        left
      />
    </div> -->

  </div>
</template>

<script>
import InvoiceHeader from '../InvoiceHeader.vue'
import InvoiceContent from '../InvoiceContent.vue'
// import Comments from '../Comments.vue'
import SpecCostInfo from '../SpecCostInfo.vue'

import spec from '../../mixins/spec'

export default {
  name: 'Accountant',
  components: {
    InvoiceHeader,
    InvoiceContent,
    // Comments,
    SpecCostInfo,
  },
  mixins: [spec],
  data () {
    return {
      defaultTab: 2,
    }
  },
}
</script>
