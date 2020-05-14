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
          </span> /
          <span>{{ $t('shipping.shippingClient') }}:</span>&nbsp;
          <span>{{ specClient.uid || '' }}</span>&nbsp;
          <span class="text-primary">
            <Select
              :value="specClient"
              :placeholder="$t('placeholder.emptyText')"
              :search.sync="clientSearch"
              :items="clients"
              flat
              return-object
              no-filter
              searchable
              item-value="id"
              item-text="name"
              solo
              outlined
              borderless
              hide-details
              class="leading-normal max-w-sm w-auto inline-flex spec-search-input"
              style="min-width: 220px"
              @input="setSpecClient($event && $event.id)"
              @click:prepend-item="createClient"
            >
              <template v-slot:prepend-item>
                <span class="flex items-center jusitfy-center text-primary">
                  <i class="zi-plus mr-1" />
                  <span>{{ $t('deals.createSpecDialogAddClient') }}</span>
                </span>
              </template>
            </Select>
          </span>
        </span>
        <span
          v-if="expanded.length === 0"
          class="text-gray hover:text-gray-dark text-sm cursor-pointer whitespace-no-wrap select-none"
          @click="expandAll"
        >
          {{ $t('action.expandAll') }}
        </span>
        <span
          v-else
          class="text-gray hover:text-gray-dark text-sm cursor-pointer whitespace-no-wrap select-none"
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
          <div class="flex flex-col md:flex-row pr-2 w-full md:w-auto">
            <TextField
              :value="item.invoiceNo"
              :debounce="250"
              :placeholder="$t('shipping.invoiceNo')"
              solo
              class="text-sm w-48 mr-2 md:p-0 leading-normal"
              @input="updateInvoice({
                invoiceNo: $event
              }, item.id)"
            />
            <DatePicker
              :value="item.purchaseDate"
              @input="updateInvoice({ purchaseDate: $event }, item.id)"
            >
              <template v-slot:activator="{ on }">
                <div class="text-left">
                 <div v-on="on">
                    <TextField
                      :value="item.purchaseDate ? $d($parseDate(item.purchaseDate), 'short') : null"
                      :placeholder="$t('shipping.purchaseDate')"
                      solo
                      readonly
                      class="text-sm w-32 mr-2 md:p-0 leading-normal"
                    />
                 </div>
                </div>
              </template>
            </DatePicker>
            <!-- TODO on real api, need send id -->
            <Select
              :value="getInvoiceSupplier(item)"
              :placeholder="$t('shipping.supplierName')"
              :search.sync="supplierSearch"
              :items="suppliers"
              flat
              return-object
              no-filter
              searchable
              item-value="id"
              item-text="name"
              solo
              outlined
              hide-details
              class="text-sm mr-2 md:p-0 leading-normal max-w-sm"
              @input="setInvoiceSupplier(item.id, ($event && $event.id))"
            >
              <template v-slot:prepend>
                <a
                  href="#"
                  @click.prevent.stop="openCreateSupplierDialog(item)"
                >
                  <i class="zi-plus text-lg text-primary block align-middle" />
                </a>
              </template>
            </Select>
            <DatePicker
              :value="item.shippingDate"
              @input="updateInvoice({ shippingDate: $event }, item.id)"
            >
              <template v-slot:activator="{ on }">
                <div class="text-left">
                  <div v-on="on">
                    <TextField
                      :value="item.shippingDate ? $d($parseDate(item.shippingDate), 'short') : null"
                      :placeholder="$t('shipping.shippingDate')"
                      solo
                      readonly
                      class="text-sm w-32 md:p-0 leading-normal"
                    />
                  </div>
                </div>
              </template>
            </DatePicker>
          </div>
        </InvoiceHeader>
        <Invoice
          v-if="expanded.includes(item.id)"
          :currency="spec.currency"
          :invoice="item"
          :active-tab="invoiceActiveTab"
          :scroll-left="invoiceScrollLeft"
          :scroll-invoice-id="invoiceScrollId"
          style="margin-top: 1px"
          @change:tab="setInvoiceActiveTab"
          @change:scrollLeft="setScrollLeft"
          @update:currency="updateSpec({ currency: $event })"
        />
      </div>
    </div>
    <div class="flex pt-5">
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
    </div>

    <div>
      <SpecSummary
        :spec="spec"
        :role="Role.MANAGER"
      />
    </div>

    <v-dialog
      ref="supplierDialog"
      v-model="supplierDialog"
      scrollable
      max-width="1024"
      :fullscreen="$vuetify.breakpoint.xs"
    >
      <SupplierCard
        ref="supplierCard"
        :org-id="$route.params.orgId"
        create
        is-component
        @close="supplierDialog = false"
        @create="setCreatedSupplier"
      />
    </v-dialog>
    <v-dialog
      ref="clientDialog"
      v-model="clientDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      scrollable
      max-width="1024"
      content-class="text-gray-100"
    >
      <ClientCard
        ref="clientCard"
        :org-id="orgId"
        create
        is-component
        @close="clientDialog = false"
        @create="setCreateSpecClient"
      />
    </v-dialog>
  </div>
</template>

<script>
import InvoiceHeader from './InvoiceHeader.vue'
import Invoice from './Invoice.vue'
import SpecSummary from '../SpecSummary'
import SupplierCard from '../SupplierCard'
import ClientCard from '../ClientCard'
import Comments from '../Comments'

import spec from '../../mixins/spec'

export default {
  name: 'ManagerSpec',
  components: {
    InvoiceHeader,
    Invoice,
    SpecSummary,
    SupplierCard,
    ClientCard,
    Comments,
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
