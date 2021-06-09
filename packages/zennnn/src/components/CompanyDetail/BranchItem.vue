<template>
  <div>
    <div class="pb-2">
      <label
        class="block text-base text-gray-100 whitespace-nowrap leading-5 py-2"
      >
        {{ $t('companyDetail.label.branchType') }}
      </label>
      <div class="flex justify-end items-center">
        <transition name="fade-transition">
          <div v-if="isWarehouse" class="flex items-center pr-1">
            <Tooltip
              placement="top-start"
              distance="2"
              skidding="-16"
              origin="24px 100%"
              max-width="180"
            >
              <template v-slot:activator>
                <Icon class="text-blue-500 align-middle">
                  {{ icons.ziQuestionSign }}
                </Icon>
              </template>
              <span v-html="$t('companyDetail.hint.branchDeliveryAddress')" />
            </Tooltip>
            <div class="pr-4">
              <img
                src="@/assets/icons/colorful/Shield-yellow.svg"
                aria-hidden="true"
              />
            </div>
          </div>
        </transition>
        <Select
          :model-value="internalItem.branchType"
          :items="branchTypeItems"
          :placeholder="$t('placeholder.notChosen')"
          :loading="loading"
          @update:model-value="updateData('branchType', $event)"
        />
        <button
          class="
            text-gray-200
            focus:text-gray-100
            hover:text-gray-100
            focus:outline-none
            ml-1
          "
          @click="$emit('delete', internalItem.id)"
        >
          <Icon>
            {{ icons.ziCloseDelete }}
          </Icon>
        </button>
      </div>
    </div>
    <TextField
      :model-value="internalItem.name"
      :label="$t('companyDetail.label.branchName')"
      :placeholder="$t('companyDetail.placeholder.branchName')"
      :loading="loading"
      :debounce="500"
      :rules="[rules.required]"
      state-icon
      state-error-color="none"
      class="pb-2"
      @update:model-value="updateData('name', $event)"
    />
    <TextField
      :model-value="internalItem.address"
      :label="$t('companyDetail.label.branchAddress')"
      :placeholder="$t('companyDetail.placeholder.address')"
      :loading="loading"
      :debounce="500"
      :rules="[rules.required]"
      state-icon
      state-error-color="none"
      class="pb-2"
      @update:model-value="updateData('address', $event)"
    />
    <div class="flex items-end pb-2">
      <TextField
        v-model="firstName"
        :label="$t('companyDetail.label.contactPerson')"
        :placeholder="$t('companyDetail.placeholder.firstName')"
        :loading="loading"
        :debounce="500"
        :rules="[rules.required]"
        state-icon
        state-error-color="none"
        label-no-wrap
        class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
      />
      <TextField
        v-model="lastName"
        :placeholder="$t('companyDetail.placeholder.lastName')"
        :loading="loading"
        :debounce="500"
        :rules="[rules.required]"
        state-icon
        state-error-color="none"
        class="flex-grow"
      />
    </div>
    <Phone
      :model-value="internalItem.mobilePhone"
      :locale="locale"
      :label="$t('companyDetail.label.mobilePhone')"
      :loading="loading"
      state-icon
      state-error-color="none"
      required
      class="pb-2"
      @update:model-value="updateData('mobilePhone', $event)"
    />
    <Phone
      :model-value="internalItem.workPhone"
      :locale="locale"
      :label="$t('companyDetail.label.phone')"
      :loading="loading"
      state-icon
      state-error-color="none"
      required
      @update:model-value="updateData('workPhone', $event)"
    />
    <div v-if="contactItems.length > 0" class="flex flex-wrap -mx-5">
      <div v-for="(item, i) in contactItems" :key="i" class="w-full pt-11 px-5">
        <ContactItem
          :loading="loading"
          :value="item"
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
import { ziCloseDelete, ziQuestionSign } from '@zennnn/icons'
import { Icon, Tooltip, Select, TextField } from '@zennnn/core'

import { BranchType, ContactType } from '../../graphql/enums'

import Phone from '../Phone.vue'
import ContactItem from './ContactItem.vue'

export default {
  name: 'BranchItem',
  components: {
    Icon,
    Tooltip,
    Select,
    TextField,
    Phone,
    ContactItem,
  },
  props: {
    locale: String,
    loading: Boolean,
    create: Boolean,
    item: {
      type: Object,
    },
  },
  emits: ['update', 'delete'],
  data() {
    return {
      lazyItem: undefined,
      rules: {
        required: (v) => !!v || this.$t('rule.required'),
      },
      icons: {
        ziCloseDelete,
        ziQuestionSign,
      },
    }
  },
  computed: {
    internalItem: {
      get() {
        return this.lazyItem || {}
      },
      set(val) {
        this.lazyItem = val
      },
    },
    contactItems() {
      return (this.internalItem.contacts || []).map((item) => {
        return {
          contactType: item.contactType,
          contact: item.contact,
        }
      })
    },
    isWarehouse() {
      return this.internalItem.branchType === BranchType.WAREHOUSE
    },
    branchTypeItems() {
      return Object.values(BranchType).map((el) => {
        return {
          text: this.$t(`branchType.${el}`),
          value: el,
        }
      })
    },
    firstName: {
      get() {
        return (
          this.internalItem.contactPerson &&
          this.internalItem.contactPerson.firstName
        )
      },
      set(val) {
        const person = Object.assign(
          {},
          {
            firstName: val,
            lastName:
              this.internalItem.contactPerson &&
              this.internalItem.contactPerson.lastName,
          }
        )
        this.updateData('contactPerson', person)
      },
    },
    lastName: {
      get() {
        return (
          this.internalItem.contactPerson &&
          this.internalItem.contactPerson.lastName
        )
      },
      set(val) {
        const person = Object.assign(
          {},
          {
            firstName:
              this.internalItem.contactPerson &&
              this.internalItem.contactPerson.firstName,
            lastName: val,
          }
        )
        this.updateData('contactPerson', person)
      },
    },
  },
  watch: {
    item: {
      handler(val) {
        this.$nextTick(() => {
          this.internalItem = val
        })
      },
      immediate: true,
    },
  },
  methods: {
    updateData(key, value) {
      this.$emit('update', { [key]: value })
    },
    addContact(val) {
      const item = val || {}
      const contactType = item.contactType || ContactType.QQ
      const contact = item.contact || null
      this.$emit('update', {
        contacts: [...this.contactItems, { contactType, contact }],
      })
      this.$nextTick(() => {
        this.$refs.contactCreate.setValue()
        this.$refs.contactCreate.$refs.inputRef.reset()
      })
    },
    updateContact(i, item, value) {
      const updatedItem = Object.assign({}, item, value)
      const items = this.contactItems.slice()
      items.splice(i, 1, updatedItem)
      this.$emit('update', { contacts: items })
    },
    deleteContact(i) {
      const items = this.contactItems.slice()
      items.splice(i, 1)
      this.$emit('update', { contacts: items })
    },
  },
}
</script>
