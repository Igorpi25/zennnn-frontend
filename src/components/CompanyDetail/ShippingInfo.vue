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
            :value="isPrivate ? '' : item.importerCompanyName"
            :disabled="isPrivate"
            :label="$t('companyDetail.label.consignee')"
            :placeholder="$t('companyDetail.placeholder.consignee')"
            @input="$emit('update', 'importerCompanyName', $event)"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="isPrivate ? '' : item.deliveryAddress"
            :disabled="isPrivate"
            :label="$t('companyDetail.label.deliveryAddress')"
            :placeholder="$t('companyDetail.placeholder.deliveryAddress')"
            @input="$emit('update', 'deliveryAddress', $event)"
          />
        </div>
        <div class="pb-2 lg:pb-1">
          <div class="flex justify-between">
            <TextField
              :value="item.deliveryAddressPostcode"
              :label="$t('companyDetail.label.deliveryAddressPostcode')"
              :placeholder="$t('companyDetail.placeholder.postcode')"
              class="w-48 pb-2"
              @input="$emit('update', 'deliveryAddressPostcode', $event)"
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
            v-model="firstName"
            :label="$t('companyDetail.label.contactPerson')"
            :placeholder="$t('companyDetail.label.firstName')"
            label-no-wrap
            class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          />
          <TextField
            v-model="lastName"
            :placeholder="$t('companyDetail.label.lastName')"
            class="flex-grow"
          />
        </div>
        <div>
          <TextField
            :value="isPrivate ? '' : item.importerMobilePhone"
            :disabled="isPrivate"
            :label="$t('companyDetail.label.mobilePhone')"
            :placeholder="$t('companyDetail.label.mobilePhone')"
            @input="$emit('update', 'importerMobilePhone', $event)"
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
    isPrivate: Boolean,
  },
  data () {
    return {
      expanded: true,
    }
  },
  computed: {
    firstName: {
      get () {
        return (this.item.importerContactPerson && this.item.importerContactPerson.firstName) || ''
      },
      set (val) {
        const person = this.item.importerContactPerson || {}
        person.firstName = val
        this.$emit('update', 'importerContactPerson', person)
      },
    },
    lastName: {
      get () {
        return (this.item.importerContactPerson && this.item.importerContactPerson.lastName) || ''
      },
      set (val) {
        const person = this.item.importerContactPerson || {}
        person.lastName = val
        this.$emit('update', 'importerContactPerson', person)
      },
    },
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    },
  },
}
</script>
