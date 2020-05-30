<template>
  <div>
    <div class="pb-2">
      <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
        {{ $t('companyDetail.label.branchType') }}
      </label>
      <div class="flex justify-end items-center">
        <v-fade-transition>
          <div v-if="isWarehouse" class="flex items-center pr-1">
            <v-tooltip top max-width="180" nudge-right="60">
              <template v-slot:activator="{ on }">
                <i class="zi-help align-middle text-base text-blue-500 cursor-pointer" v-on="on" />
              </template>
              <span v-html="$t('companyDetail.hint.branchDeliveryAddress')" />
            </v-tooltip>
            <div class="pr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V4L12 2L4 4V12C4 18 12 22 12 22Z" fill="#FDB600" stroke="#FDB600" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="11" r="5" fill="#2F2F2F"/>
                <path d="M14.5391 9.48438L11.8694 12.3024L10.0859 10.4609" stroke="#FDB600" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </v-fade-transition>
        <Select
          :value="item.branchType"
          :items="branchTypeItems"
          :placeholder="$t('placeholder.notChosen')"
          :loading="loading"
          item-value="value"
          item-text="text"
          @input="updateData('branchType', $event)"
        />
        <button
          class="flex justify-center items-center text-2xl text-gray-200 cursor-pointer focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none mx-1"
          @click="$emit('delete', item.id)"
        >
          <i class="zi-close" />
        </button>
      </div>
    </div>
    <TextField
      :value="item.name"
      :label="$t('companyDetail.label.branchName')"
      :placeholder="$t('companyDetail.placeholder.branchName')"
      :loading="loading"
      :debounce="500"
      class="pb-2"
      @input="updateData('name', $event)"
    />
    <TextField
      :value="item.address"
      :label="$t('companyDetail.label.branchAddress')"
      :placeholder="$t('companyDetail.placeholder.address')"
      :loading="loading"
      :debounce="500"
      class="pb-2"
      @input="updateData('address', $event)"
    />
    <div class="flex items-end pb-2">
      <TextField
        v-model="firstName"
        :label="$t('companyDetail.label.contactPerson')"
        :placeholder="$t('companyDetail.placeholder.firstName')"
        :loading="loading"
        :debounce="500"
        label-no-wrap
        class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
      />
      <TextField
        v-model="lastName"
        :placeholder="$t('companyDetail.placeholder.lastName')"
        :loading="loading"
        :debounce="500"
        class="flex-grow"
      />
    </div>
    <PhoneInput
      :value="item.mobilePhone"
      :locale="locale"
      :label="$t('companyDetail.label.mobilePhone')"
      :loading="loading"
      class="pb-2"
      @input="updateData('mobilePhone', $event)"
    />
    <PhoneInput
      :value="item.workPhone"
      :locale="locale"
      :label="$t('companyDetail.label.phone')"
      :loading="loading"
      @input="updateData('workPhone', $event)"
    />
    <div
      v-if="contactItems.length > 0"
      class="flex flex-wrap -mx-5"
    >
      <div
        v-for="(item, i) in contactItems"
        :key="i"
        class="w-full pt-11 px-5"
      >
        <ContactItem
          :loading="loading"
          :item="item"
          @update="updateContact(i, item, $event)"
          @delete="deleteContact(i)"
        />
      </div>
    </div>
    <ContactItem
      ref="contactCreate"
      create
      class="pt-11 pr-8"
      @update="addContact"
    />
  </div>
</template>

<script>
import { BranchType, ContactType } from '../../graphql/enums'
import ContactItem from './ContactItem'

export default {
  name: 'BranchItem',
  components: {
    ContactItem,
  },
  props: {
    locale: String,
    loading: Boolean,
    create: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    contactItems () {
      return (this.item.contacts || []).map(item => {
        return {
          contactType: item.contactType,
          contact: item.contact,
        }
      })
    },
    isWarehouse () {
      return this.item.branchType === BranchType.WAREHOUSE
    },
    branchTypeItems () {
      return Object.values(BranchType).map(el => {
        return {
          text: this.$t(`branchType.${el}`),
          value: el,
        }
      })
    },
    firstName: {
      get () {
        return this.item.contactPerson && this.item.contactPerson.firstName
      },
      set (val) {
        const person = Object.assign({}, {
          firstName: val,
          lastName: this.item.contactPerson && this.item.contactPerson.lastName,
        })
        this.updateData('contactPerson', person)
      },
    },
    lastName: {
      get () {
        return this.item.contactPerson && this.item.contactPerson.lastName
      },
      set (val) {
        const person = Object.assign({}, {
          firstName: this.item.contactPerson && this.item.contactPerson.firstName,
          lastName: val,
        })
        this.updateData('contactPerson', person)
      },
    },
  },
  methods: {
    updateData (key, value) {
      this.$emit('update', { [key]: value })
    },
    addContact (val) {
      const item = val || {}
      const contactType = item.contactType || ContactType.QQ
      const contact = item.contact || null
      this.$emit('update', { 'contacts': [...this.contactItems, { contactType, contact }] })
      this.$nextTick(() => {
        this.$refs.contactCreate.setItem()
      })
    },
    updateContact (i, item, value) {
      const updatedItem = Object.assign({}, item, value)
      const items = this.contactItems.slice()
      items.splice(i, 1, updatedItem)
      this.$emit('update', { 'contacts': items })
    },
    deleteContact (i) {
      const items = this.contactItems.slice()
      items.splice(i, 1)
      this.$emit('update', { 'contacts': items })
    },
  },
}
</script>
