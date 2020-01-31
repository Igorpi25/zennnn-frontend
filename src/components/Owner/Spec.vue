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
              @input="setSpecClient($event && $event.id)"
            />
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
          <div class="flex flex-col md:flex-row pr-2 w-full md:w-auto">
            <TextField
              :value="item.invoiceNo"
              :debounce="250"
              :placeholder="$t('shipping.invoiceNo')"
              solo
              outlined
              colored
              hide-details
              class="text-sm w-40 mr-2 md:p-0 leading-normal"
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
                <div v-on="on">
                  <TextField
                    :value="formatDate(item.purchaseDate)"
                    :placeholder="$t('shipping.purchaseDate')"
                    solo
                    outlined
                    colored
                    readonly
                    hide-details
                    class="text-sm w-40 mr-2 md:p-0 leading-normal"
                  />
                </div>
              </template>
              <v-date-picker
                :value="$toISOString($parseDate(item.purchaseDate))"
                :locale="$i18n.locale"
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
                <div v-on="on">
                  <TextField
                    :value="formatDate(item.shippingDate)"
                    :placeholder="$t('shipping.shippingDate')"
                    solo
                    outlined
                    colored
                    readonly
                    hide-details
                    class="text-sm w-40 mr-2 md:p-0 leading-normal"
                  />
                </div>
              </template>
              <v-date-picker
                :value="$toISOString($parseDate(item.shippingDate))"
                :locale="$i18n.locale"
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
          style="margin-top: 1px"
          :invoice="item"
        />
      </div>
    </div>
    <div class="flex pt-5">
      <Button
        outline
        @click="createInvoice"
      >
        <template v-slot:icon>
          <Icon>{{ icons.mdiPlusCircleOutline }}</Icon>
        </template>
        <span>{{ $t('shipping.addInvoice') }}</span>
      </Button>
      <div class="flex-grow" />
      <Comments
        :items="spec.comments"
        :spec-id="spec.id"
        left
      />
    </div>

    <div>
      <SpecSummary :spec="spec" />
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
  </div>
</template>

<script>
import InvoiceHeader from './InvoiceHeader.vue'
import Invoice from './Invoice.vue'
import SpecSummary from '../SpecSummary'
import SupplierCard from '../SupplierCard'
import Comments from '../Comments'

import spec from '../../mixins/spec'

export default {
  name: 'OwnerSpec',
  components: {
    InvoiceHeader,
    Invoice,
    SpecSummary,
    SupplierCard,
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
