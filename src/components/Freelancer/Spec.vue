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
              outlined
              colored
              hide-details
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
                  <div v-on="on" class="inline-block">
                    <TextField
                      :value="item.purchaseDate ? $d($parseDate(item.purchaseDate), 'short') : null"
                      :placeholder="$t('shipping.purchaseDate')"
                      solo
                      outlined
                      colored
                      readonly
                      hide-details
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
              :nudge-bottom="23"
              :search.sync="supplierSearch"
              :items="suppliers"
              return-object
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
                  <i class="icon-add text-lg text-primary block align-middle" />
                </a>
              </template>
            </Select>
            <DatePicker
              :value="item.shippingDate"
              @input="updateInvoice({ shippingDate: $event }, item.id)"
            >
              <template v-slot:activator="{ on }">
                <div class="text-left">
                  <div v-on="on" class="inline-block">
                    <TextField
                      :value="item.shippingDate ? $d($parseDate(item.shippingDate), 'short') : null"
                      :placeholder="$t('shipping.shippingDate')"
                      solo
                      outlined
                      colored
                      readonly
                      hide-details
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
          :invoice="item"
          :active-tab="invoiceActiveTab"
          :scroll-left="invoiceScrollLeft"
          :scroll-invoice-id="invoiceScrollId"
          style="margin-top: 1px"
          @change:tab="setInvoiceActiveTab"
          @change:scrollLeft="setScrollLeft"
        />
      </div>
    </div>
    <Button
      outline
      class="mt-6"
    >
      <template v-slot:icon>
        <i class="icon-add text-lg block align-middle" />
      </template>
      <span>{{ $t('shipping.addInvoice') }}</span>
    </Button>

  </div>
</template>

<script>
import InvoiceHeader from './InvoiceHeader.vue'
import Invoice from './Invoice.vue'

import spec from '../../mixins/spec'
import invoice from '../../mixins/invoice'

export default {
  name: 'FreelancerSpec',
  components: {
    InvoiceHeader,
    Invoice,
  },
  mixins: [spec, invoice],
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
