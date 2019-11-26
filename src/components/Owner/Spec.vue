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
          </span> /
          <span>{{ $t('shipping.shippingClient') }}:</span>&nbsp;
          <span>{{ specClient.uid || '' }}</span>&nbsp;
          <span class="text-primary">
            <Select
              :value="specClient"
              :placeholder="$t('placeholder.emptyText')"
              :nudge-bottom="28"
              :search.sync="clientSearch"
              :items="clients"
              searchable
              item-value="id"
              item-text="name"
              solo
              outlined
              borderless
              hide-details
              class="leading-normal max-w-sm w-auto inline-flex spec-search-input"
              style="min-width: 220px"
              @input="updateSpec({
                client: $event
              })"
            />
          </span>
        </span>
        <span
          class="text-gray text-sm cursor-pointer whitespace-no-wrap"
          @click="collapseAll"
        >{{ $t('action.collapseAll') }}</span>
      </div>

      <div v-for="(item) in items" :key="item.id" class="invoice-wrapper">
        <div class="invoice-header">
          <span
            :class="[
              'status-indicator mr-2 md:mr-6 flex-shrink-0',
              item.status === InvoiceStatus.IN_PRODUCTION
                ? 'status-indicator--orange' : item.status === InvoiceStatus.IN_STOCK
                  ? 'status-indicator--green' : 'status-indicator--pink'
            ]"
          >
          </span>
          <div class="flex flex-col md:flex-row pr-2 w-full md:w-auto">
            <TextField
              :value="item.number"
              :debounce="250"
              :placeholder="$t('shipping.invoiceNo')"
              solo
              outlined
              colored
              hide-details
              class="text-sm w-40 mr-2 md:p-0 leading-normal"
              @input="updateInvoice({
                id: item.id, number: $event
              })"
            />
            <v-menu
              ref="menu"
              v-model="menuPurchaseDate"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <TextField
                    :value="formatDate(purchaseDate)"
                    :placeholder="$t('shipping.purchaseDate')"
                    solo
                    outlined
                    colored
                    readonly
                    hide-details
                    class="text-sm w-40 mr-2 md:p-0 leading-normal"
                    @input="updateInvoice({
                      id: item.id, purchaseDate: $event && $event.toISOString() || null
                    })"
                  />
                </div>
              </template>
              <v-date-picker
                v-model="purchaseDate"
                @change="menuPurchaseDate = false"
                :locale="$i18n.locale"
                :next-icon="icons.mdiChevronRight"
                :prev-icon="icons.mdiChevronLeft"
                color="#5a8199"
                no-title
                dark
              ></v-date-picker>
            </v-menu>
            <!-- TODO on real api, need send id -->
            <Select
              :value="getInvoiceSupplierName(item)"
              :placeholder="$t('shipping.supplierName')"
              :nudge-bottom="23"
              :search.sync="supplierSearch"
              :items="suppliers"
              searchable
              item-value="id"
              item-text="name"
              solo
              outlined
              hide-details
              class="text-sm mr-2 md:p-0 leading-normal max-w-sm"
              @input="updateInvoice({
                id: item.id, invoiceSupplierId: ($event && $event.id), supplier: $event
              })"
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
              v-model="menuShippingDate"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <TextField
                    :value="formatDate(shippingDate)"
                    :placeholder="$t('shipping.shippingDate')"
                    solo
                    outlined
                    colored
                    readonly
                    hide-details
                    class="text-sm w-40 mr-2 md:p-0 leading-normal"
                    @input="updateInvoice({
                      id: item.id, shippingDate: $event && $event.toISOString() || null
                    })"
                  />
                </div>
              </template>
              <v-date-picker
                v-model="shippingDate"
                @change="menuShippingDate = false"
                :locale="$i18n.locale"
                :next-icon="icons.mdiChevronRight"
                :prev-icon="icons.mdiChevronLeft"
                color="#5a8199"
                no-title
                dark
              ></v-date-picker>
            </v-menu>
          </div>
          <div @click="expand(item.id)" class="invoice-header__expand">
            <template v-if="expanded.includes(item.id)">
              <span v-text="$t('action.collapse')" class="mr-2 hidden lg:inline" />
              <div class="invoice-header__expand__icon">
                <svg width="10" height="2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 10 2"><defs></defs><g><g><title>{{ $t('action.collapse') }}</title><path d="M10,0v0h-10v0v1.998v0h10v0z"></path></g></g></svg>
              </div>
            </template>
            <template v-else>
              <span v-text="$t('action.expand')" class="mr-2 hidden lg:inline" />
              <div class="invoice-header__expand__icon">
                <svg width="10" height="10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 10 10"><defs></defs><g><g><title>{{ $t('action.expand') }}</title><path d="M4.0017,10v0h1.998v0v-4.002v0h4.001v0v-1.998v0h-4.001v0v-4v0h-1.998v0v4v0h-4.001v0v1.998v0h4.001v0z"></path></g></g></svg>
              </div>
            </template>
          </div>
        </div>
        <Invoice
          v-if="expanded.includes(item.id)"
          style="margin-top: 1px"
          :invoice="item"
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

    <div>
      <SpecSummary />
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
        :spec-id="$route.params.specId"
        create
        is-component
        @close="supplierDialog = false"
        @create="setCreatedSupplier"
      />
    </v-dialog>
  </div>
</template>

<script>
// import { confirmDialog } from '@/util/helpers'

import Invoice from '@/components/Invoice.vue'
import SpecSummary from '@/components/SpecSummary'
import SupplierCard from '@/components/SupplierCard'

import spec from '../../mixins/spec'

export default {
  name: 'OwnerSpec',
  components: {
    Invoice,
    SpecSummary,
    SupplierCard,
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
