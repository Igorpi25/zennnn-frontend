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
            <v-menu
              ref="menu"
              v-model="menuPurchaseDate[item.id]"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div class="text-left">
                  <div v-on="on" class="inline-block">
                    <TextField
                      :value="formatDate(item.purchaseDate)"
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
              <v-date-picker
                :value="$toISOString($parseDate(item.purchaseDate))"
                :locale="$i18n.locale"
                :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                :next-icon="icons.mdiChevronRight"
                :prev-icon="icons.mdiChevronLeft"
                color="#5a8199"
                no-title
                dark
                @change="updateInvoice({
                  purchaseDate: $event || null
                }, item.id)"
              ></v-date-picker>
            </v-menu>
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
                  <Icon color="#5a8199">
                    {{ icons.mdiPlusCircleOutline }}
                  </Icon>
                </a>
              </template>
            </Select>
            <v-menu
              ref="menu"
              v-model="menuShippingDate[item.id]"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div class="text-left">
                  <div v-on="on" class="inline-block">
                    <TextField
                      :value="formatDate(item.shippingDate)"
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
              <v-date-picker
                :value="$toISOString($parseDate(item.shippingDate))"
                :locale="$i18n.locale"
                :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                :next-icon="icons.mdiChevronRight"
                :prev-icon="icons.mdiChevronLeft"
                color="#5a8199"
                no-title
                dark
                @change="updateInvoice({
                  shippingDate: $event || null
                }, item.id)"
              ></v-date-picker>
            </v-menu>
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
        <Icon>{{ icons.mdiPlusCircleOutline }}</Icon>
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
