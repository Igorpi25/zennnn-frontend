<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase">
        {{ $t('companyDetail.contactList') }}
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
    <ExpandTransition>
      <div v-show="expanded">
        <div
          v-if="clearedItems.length > 0"
          class="flex flex-wrap -mx-5"
        >
          <div
            v-for="(item, i) in clearedItems"
            :key="i"
            class="w-full lg:w-1/2 pt-10 px-5"
          >
            <ContactItem
              :loading="loading"
              :item="item"
              @update="updateData(i, item, $event)"
              @delete="deleteData(i)"
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 pt-10 pr-5">
          <Btn
            :loading="createLoading"
            block
            outlined
            merge-class="h-10 text-sm"
            @click="addData"
          >
            {{ $t('companyDetail.addContact') }}
          </Btn>
        </div>
      </div>
    </ExpandTransition>
  </div>
</template>

<script>
import clientDetail from '../../mixins/clientDetail'
import { ContactType } from '../../graphql/enums'

import Btn from '../Base/Btn'
import ExpandTransition from '../Base/ExpandTransition'
import ContactItem from './ContactItem.vue'

export default {
  name: 'ContactList',
  components: {
    Btn,
    ExpandTransition,
    ContactItem,
  },
  mixins: [clientDetail],
  props: {
    emitChanges: Boolean,
    supplierId: String,
    items: {
      type: Array,
      default: () => ([]),
    },
  },
  data () {
    return {
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
    }
  },
  computed: {
    // filter items fron __typename for fully array update
    clearedItems () {
      const items = this.items || []
      return items.map(item => {
        return {
          contactType: item.contactType,
          contact: item.contact,
        }
      })
    },
  },
  methods: {
    addData () {
      this.$emit('update', { contacts: [...this.clearedItems, { contactType: ContactType.QQ }] })
    },
    updateData (i, item, value) {
      const updatedItem = Object.assign({}, item, value)
      const items = this.clearedItems.slice()
      items.splice(i, 1, updatedItem)
      this.$emit('update', { contacts: items })
    },
    deleteData (i) {
      const items = this.clearedItems.slice()
      items.splice(i, 1)
      this.$emit('update', { contacts: items })
    },
  },
}
</script>
