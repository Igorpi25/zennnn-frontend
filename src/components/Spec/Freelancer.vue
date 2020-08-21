<template>
  <div class="container container--sm">
    <div
      v-if="isSpecSync"
      class="fixed bottom-0 right-0 z-20 opacity-50 text-2xl mr-2 sm:mr-4 mb-6"
    >
      <Icon class="animate-spin">
        {{ icons.mdiSync }}
      </Icon>
    </div>
    <div class="py-10">
      <div class="flex flex-wrap items-center justify-between pb-4">
        <h1 class="text-2xl text-white font-semibold relative">
          <span class="pr-6">
            {{ $t('shipping.title') }}
          </span>
          <v-fade-transition>
            <div
              v-if="loading"
              class="absolute top-0 right-0 text-gray-200"
            >
              <v-progress-circular
                indeterminate
                size="20"
                width="2"
              />
            </div>
          </v-fade-transition>
        </h1>
        <div class="text-gray-300">
          <span v-if="spec.client">
            {{ `${$t('shipping.shippingClient')}: ${spec.client.uid} ${spec.client.fullName}` }}
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
                :disabled="dataLoading"
                class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="expandAll"
              >
                <i class="zi-expand" :title="$t('action.expandAll')" />
              </button>
              <button
                v-else
                :disabled="dataLoading"
                class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="collapseAll"
              >
                <i class="zi-collapse" :title="$t('action.collapseAll')" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="dataLoading" class="flex items-center justify-center h-12 text-gray-200 bg-gray-700 rounded">
          {{ `${$t('action.loading')}...` }}
        </div>
        <div
          v-else
          v-for="(item, i) in items"
          :key="item.id"
          :class="['shadow-xl', { 'mb-1': i + 1 < items.length }]"
        >
          <InvoiceHeader
            :item="item"
            :is-expanded="expanded.includes(item.id)"
            :role="Role.FREELANCER"
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
            :role="Role.FREELANCER"
            @change:tab="setInvoiceActiveTab"
            @change:scrollLeft="setScrollLeft"
            @update:currency="updateSpec({ currency: $event })"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap lg:flex-no-wrap pb-8">
      <SpecShipping :spec="spec" />
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
import SpecShipping from '../SpecShipping.vue'

import spec from '../../mixins/spec'

export default {
  name: 'Freelancer',
  components: {
    InvoiceHeader,
    InvoiceContent,
    // Comments,
    SpecShipping,
  },
  mixins: [spec],
  data () {
    return {
      defaultTab: 2,
    }
  },
  computed: {
    // TODO: need work with containers
    container () {
      const containers = this.spec.containers || []
      return containers[0] || {}
    },
  },
}
</script>
