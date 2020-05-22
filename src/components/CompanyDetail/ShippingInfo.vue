<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase" @click="toggleExpand">
        {{ $t('companyDetail.shippingInfo') }}
      </div>
      <div>
        <button
          class="w-6 h-6 flex items-center justify-center text-2xl text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none select-none"
           @click="toggleExpand"
        >
          <i v-if="expanded" class="zi-chevron-down" />
          <i v-else class="zi-chevron-up" />
        </button>
      </div>
    </div>
    <v-expand-transition>
      <div v-show="expanded" class="pt-4">
        <div class="pb-2">
          <TextField
            :value="natural ? '' : item.consignee"
            :disabled="natural"
            :label="$t('companyDetail.label.consignee')"
            :placeholder="$t('companyDetail.placeholder.consignee')"
            @input="$emit('update', 'consignee', $event)"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="natural ? '' : item.shippingAddress"
            :disabled="natural"
            :label="$t('companyDetail.label.deliveryAddress')"
            :placeholder="$t('companyDetail.placeholder.deliveryAddress')"
            @input="$emit('update', 'shippingAddress', $event)"
          />
        </div>
        <div class="pb-2 lg:pb-1">
          <div class="flex justify-between">
            <TextField
              :label="$t('companyDetail.label.deliveryAddressPostcode')"
              :placeholder="$t('companyDetail.placeholder.postcode')"
              class="w-48 pb-2"
              disabled
            />
            <div class="relative flex-shrink-0 relative w-12 pl-sm">
              <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
                {{ $t('companyDetail.label.matches') }}
              </label>
              <div class="h-full flex items-center justify-end pt-8 pb-1">
                <SwitchInput disabled hide-details />
              </div>
            </div>
          </div>
          <div class="relative lg:pb-20">
            <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
              {{ $t('companyDetail.hint.mailingAddress') }}
            </div>
          </div>
        </div>
        <div class="flex items-end pb-2">
          <TextField
            :value="natural ? '' : item.importerContactPerson"
            :disabled="natural"
            :label="$t('companyDetail.label.contactPerson')"
            :placeholder="$t('companyDetail.label.firstName')"
            class="flex-grow"
            @input="$emit('update', 'importerContactPerson', $event)"
          />
          <!-- <TextField
            :label="$t('companyDetail.label.contactPerson')"
            :placeholder="$t('companyDetail.label.firstName')"
            label-no-wrap
            class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          />
          <TextField
            :placeholder="$t('companyDetail.label.lastName')"
            class="flex-grow"
          /> -->
        </div>
        <div>
          <TextField
            :value="natural ? '' : item.contactMobilePhone"
            :disabled="natural"
            :label="$t('companyDetail.label.mobilePhone')"
            :placeholder="$t('companyDetail.label.mobilePhone')"
            @input="$emit('update', 'contactMobilePhone', $event)"
          />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: 'ShippingInfo',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    natural: Boolean,
  },
  data () {
    return {
      expanded: true,
    }
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    },
  },
}
</script>
