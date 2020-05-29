<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest uppercase" @click="toggleExpand">
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
    <v-expand-transition>
      <div v-show="expanded">
        <div
          v-if="items.length > 0"
          class="pb-10">
          <div>
          </div>
        </div>
        <div class="pt-10 w-1/2">
          <Button
            block
            outlined
            merge-class="h-10 text-sm pr-6"
            disabled
          >
            {{ $t('companyDetail.addContact') }}
          </Button>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import clientDetail from '../../mixins/clientDetail'

export default {
  name: 'ContactList',
  mixins: [clientDetail],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      items: [],
    }
  },
}
</script>
