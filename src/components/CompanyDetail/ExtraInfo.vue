<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <span class="flex-grow text-white font-semibold tracking-widest uppercase">
        {{ $t('companyDetail.note') }}
      </span>
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
          <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
            {{ $t('companyDetail.label.note') }}
          </label>
          <TextArea
            :value="item.note"
            :placeholder="$t('companyDetail.placeholder.note')"
            :loading="loading"
            :debounce="500"
            :lazy="create"
            rows="4"
            @input="updateData({ 'note': $event })"
          />
        </div>
        <div class="pb-2">
          <TextField
            disabled
            :label="$t('companyDetail.label.tags')"
            :placeholder="$t('companyDetail.placeholder.tags')"
            :loading="loading"
            :debounce="500"
            :lazy="create"
          >
            <template v-slot:label>
              <label class="block leading-5 text-base text-gray-100 whitespace-no-wrap py-2">
                <span>{{ $t('companyDetail.label.tags') }}</span> <span class="text-gray-200">{{ $t('companyDetail.label.tagsDesc') }}</span>
              </label>
            </template>
          </TextField>
        </div>
        <div class="inline-block cursor-not-allowed opacity-40">
          <label class="block leading-5 text-base text-gray-100 whitespace-no-wrap py-2">
            <span>
              {{ $t('companyDetail.label.attachFile') }}
            </span>
          </label>
          <div class="flex items-center text-gray-200 h-10 bg-gray-800 rounded px-sm">
            <div class="mr-sm">
              <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5425 7.99658L7.47656 13.0625L8.7998 14.3857L11.6068 11.5787V20.8754H13.4782V11.5787L16.2852 14.3857L17.6084 13.0625L12.5425 7.99658Z" fill="currentColor"/>
                <path d="M20.0255 7.61465C19.9148 3.53146 16.5588 0.243652 12.4494 0.243652C10.5615 0.243652 8.7527 0.94209 7.35606 2.2102C6.15264 3.30286 5.33945 4.73943 5.02103 6.31317C3.88337 6.55781 2.84495 7.14628 2.04152 8.01239C1.06005 9.07064 0.519531 10.4487 0.519531 11.8927C0.519531 15.0399 3.07994 17.6003 6.22713 17.6003C6.23458 17.6003 6.24194 17.6002 6.24733 17.6002H7.20958V15.7288H6.23959L6.22178 15.729C4.10894 15.7261 2.39088 14.0063 2.39088 11.8927C2.39088 9.90689 3.9392 8.22731 5.91583 8.06911L6.69245 8.00695L6.772 7.23197C7.0713 4.31479 9.51208 2.11495 12.4494 2.11495C15.5965 2.11495 18.157 4.67536 18.157 7.82254V9.45998H19.5137C21.242 9.45998 22.6481 10.8661 22.6481 12.5945C22.6481 14.3228 21.242 15.7289 19.5137 15.7289L17.8762 15.7286V17.6001H19.4832C19.4934 17.6002 19.5035 17.6004 19.5137 17.6004C22.2739 17.6004 24.5195 15.3547 24.5195 12.5945C24.5195 10.007 22.5463 7.87171 20.0255 7.61465Z" fill="currentColor"/>
              </svg>
            </div>
            <div style="font-size: 13px;">
              {{ $t('companyDetail.placeholder.attachFile') }}
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import clientDetail from '../../mixins/clientDetail'

export default {
  name: 'ExtraInfo',
  mixins: [clientDetail],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
