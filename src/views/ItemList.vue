<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">
      <div class="flex items-end flex-wrap lg:flex-no-wrap justify-between xl:justify-start">
        <TextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          :content-class="[search ? 'shadow-blue-500' : '', 'bg-transparent']"
          class="w-full lg:w-auto lg:flex-grow md:max-w-md pb-4 lg:pr-8"
          input-class="placeholder-blue-500"
        >
          <template v-slot:prepend>
            <i class="zi-magnifier text-2xl text-gray-100"></i>
          </template>
          <template v-slot:append v-if="search">
            <i
              class="zi-close text-2xl text-gray-200 cursor-pointer focus:outline-none focus:text-gray-100 hover:text-gray-100"
              @click="search = null"
            />
          </template>
        </TextField>
        <div class="order-1 sm:order-none h-11 flex lg:inline-flex overflow-x-auto scrolling-touch">
          <div
            v-for="(tab, i) in tabs"
            :aria-selected="tabValue === tab.value"
            :key="tab.value"
            :class="[
              'w-full sm:w-auto flex items-center justify-center rounded-t',
              'select-none whitespace-no-wrap cursor-pointer',
              'transition-colors duration-100 ease-in px-10',
              { 'mr-1': i + 1 < tabs.length },
              tab.disabled ? 'pointer-events-none opacity-40' : 'focus:outline-none focus:text-white hover:text-white',
              tabValue === tab.value ? 'text-white bg-gray-800' : 'bg-transparent',
            ]"
            :role="tab.disabled ? null : 'tab'"
            :tabindex="tab.disabled ? null : 0"
            @click="switchTabValue(tab.value)"
            @keydown.enter.exact="switchTabValue(tab.value)"
          >
            <span>
              {{ tab.text }}
            </span>
          </div>
        </div>
        <div class="w-full sm:w-auto flex-grow flex justify-end space-x-2 pb-4 px-6">
          <Button
            merge-class="text-gray-200 hover:text-gray-100 focus:text-gray-100 hover:border-gray-200 focus:border-gray-200 w-12 h-12 text-sm"
            content-class="w-full flex items-center justify-center px-3"
            outlined
            borderless
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.9742 1.01409C9.97804 1.00811 9.98065 1.00564 9.98139 1.00496C9.98225 1.00417 9.98294 1.0037 9.98382 1.00324C9.98597 1.00211 9.99155 1 10 1C10.0085 1 10.014 1.00211 10.0162 1.00324C10.0171 1.0037 10.0178 1.00417 10.0186 1.00496C10.0194 1.00564 10.022 1.00811 10.0258 1.01409L12.8067 5.34359C13.0816 5.77173 13.5073 6.08102 13.9995 6.21025L18.9764 7.51711C18.9833 7.51891 18.9865 7.52063 18.9873 7.52112C18.9884 7.5217 18.989 7.52221 18.9897 7.5229C18.9915 7.5246 18.9952 7.52925 18.9978 7.53729C19.0004 7.54533 19.0001 7.55129 18.9997 7.55369C18.9996 7.55466 18.9993 7.55546 18.9988 7.55653C18.9984 7.55744 18.9969 7.56069 18.9924 7.56619L15.7341 11.5488L16.462 12.1443L15.7341 11.5488C15.4119 11.9427 15.2493 12.4431 15.2785 12.9511L15.5735 18.0883C15.574 18.0954 15.5733 18.0989 15.5731 18.0999C15.573 18.1003 15.5729 18.1006 15.5729 18.1009C15.5727 18.1015 15.5724 18.1021 15.5721 18.1027C15.5711 18.1049 15.5678 18.1099 15.561 18.1149C15.5541 18.1198 15.5484 18.1214 15.546 18.1217C15.545 18.1219 15.5441 18.1219 15.543 18.1218C15.542 18.1217 15.5384 18.1212 15.5318 18.1186L10.7372 16.2505C10.2631 16.0658 9.7369 16.0658 9.26278 16.2505L4.46821 18.1186C4.46159 18.1212 4.45802 18.1217 4.45703 18.1218C4.45586 18.1219 4.45503 18.1219 4.45405 18.1217C4.45164 18.1214 4.44589 18.1198 4.43905 18.1149C4.43221 18.1099 4.42893 18.1049 4.42786 18.1027C4.42742 18.1018 4.42714 18.101 4.4269 18.0999C4.4267 18.0989 4.42605 18.0954 4.42646 18.0883L4.72152 12.9511C4.75069 12.4431 4.58809 11.9427 4.26589 11.5488L1.00762 7.56619C1.00312 7.56069 1.00157 7.55744 1.00116 7.55653C1.00067 7.55547 1.00044 7.55466 1.00027 7.55369C0.999859 7.55129 0.999577 7.54533 1.00219 7.53729C1.0048 7.52925 1.00853 7.5246 1.01027 7.5229C1.01098 7.52221 1.01164 7.5217 1.01266 7.52112C1.01353 7.52063 1.01669 7.51891 1.02357 7.51711L6.0005 6.21025C6.49265 6.08102 6.91835 5.77173 7.19335 5.34359L9.9742 1.01409Z" fill="currentColor" stroke="currentColor" stroke-width="2"/>
            </svg>
          </Button>
          <Button
            merge-class="text-gray-100 hover:text-gray-100 focus:text-gray-100 hover:border-gray-200 focus:border-gray-200 w-12 h-12 text-sm"
            content-class="w-full flex items-center justify-center px-3"
            outlined
          >
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.89582 0.25H0.9375C0.419727 0.25 0 0.669727 0 1.1875V4.3125C0 4.83027 0.419727 5.25 0.9375 5.25H4.89582C5.41359 5.25 5.83332 4.83027 5.83332 4.3125V1.1875C5.83332 0.669727 5.41359 0.25 4.89582 0.25ZM5.83332 10.5625V7.4375C5.83332 6.91973 5.41359 6.5 4.89582 6.5H0.9375C0.419727 6.5 0 6.91973 0 7.4375V10.5625C0 11.0803 0.419727 11.5 0.9375 11.5H4.89582C5.41359 11.5 5.83332 11.0803 5.83332 10.5625ZM0 16.8125V13.6875C0 13.1697 0.419727 12.75 0.9375 12.75H4.89582C5.41359 12.75 5.83332 13.1697 5.83332 13.6875V16.8125C5.83332 17.3303 5.41359 17.75 4.89582 17.75H0.9375C0.419727 17.75 0 17.3303 0 16.8125ZM19.0625 17.75H8.02082C7.50305 17.75 7.08332 17.3303 7.08332 16.8125V13.6875C7.08332 13.1697 7.50305 12.75 8.02082 12.75H19.0625C19.5803 12.75 20 13.1697 20 13.6875V16.8125C20 17.3303 19.5803 17.75 19.0625 17.75ZM7.08332 1.1875V4.3125C7.08332 4.83027 7.50305 5.25 8.02082 5.25H19.0625C19.5803 5.25 20 4.83027 20 4.3125V1.1875C20 0.669727 19.5803 0.25 19.0625 0.25H8.02082C7.50305 0.25 7.08332 0.669727 7.08332 1.1875ZM19.0625 11.5H8.02082C7.50305 11.5 7.08332 11.0803 7.08332 10.5625V7.4375C7.08332 6.91973 7.50305 6.5 8.02082 6.5H19.0625C19.5803 6.5 20 6.91973 20 7.4375V10.5625C20 11.0803 19.5803 11.5 19.0625 11.5Z" fill="currentColor"/>
            </svg>
          </Button>
          <Button
            merge-class="text-gray-200 hover:text-gray-100 focus:text-gray-100 hover:border-gray-200 focus:border-gray-200 w-12 h-12 text-sm"
            content-class="w-full flex items-center justify-center px-3"
            outlined
            borderless
          >
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.83332 1.1875V4.3125C5.83332 4.83027 5.41359 5.25 4.89582 5.25H0.9375C0.419727 5.25 0 4.83027 0 4.3125V1.1875C0 0.669727 0.419727 0.25 0.9375 0.25H4.89582C5.41359 0.25 5.83332 0.669727 5.83332 1.1875ZM12.9167 10.5625V7.4375C12.9167 6.91973 12.497 6.5 11.9792 6.5H8.02082C7.50305 6.5 7.08332 6.91973 7.08332 7.4375V10.5625C7.08332 11.0803 7.50305 11.5 8.02082 11.5H11.9791C12.497 11.5 12.9167 11.0803 12.9167 10.5625ZM14.1667 4.3125V1.1875C14.1667 0.669727 14.5864 0.25 15.1042 0.25H19.0625C19.5803 0.25 20 0.669727 20 1.1875V4.3125C20 4.83027 19.5803 5.25 19.0625 5.25H15.1042C14.5864 5.25 14.1667 4.83027 14.1667 4.3125ZM12.9167 4.3125V1.1875C12.9167 0.669727 12.497 0.25 11.9792 0.25H8.02082C7.50305 0.25 7.08332 0.669727 7.08332 1.1875V4.3125C7.08332 4.83027 7.50305 5.25 8.02082 5.25H11.9791C12.497 5.25 12.9167 4.83027 12.9167 4.3125ZM0.9375 6.5H4.89582C5.41359 6.5 5.83332 6.91973 5.83332 7.4375V10.5625C5.83332 11.0803 5.41359 11.5 4.89582 11.5H0.9375C0.419727 11.5 0 11.0803 0 10.5625V7.4375C0 6.91973 0.419727 6.5 0.9375 6.5ZM0 13.6875V16.8125C0 17.3303 0.419727 17.75 0.9375 17.75H4.89582C5.41359 17.75 5.83332 17.3303 5.83332 16.8125V13.6875C5.83332 13.1697 5.41359 12.75 4.89582 12.75H0.9375C0.419727 12.75 0 13.1697 0 13.6875ZM19.0625 11.5H15.1042C14.5864 11.5 14.1667 11.0803 14.1667 10.5625V7.4375C14.1667 6.91973 14.5864 6.5 15.1042 6.5H19.0625C19.5803 6.5 20 6.91973 20 7.4375V10.5625C20 11.0803 19.5803 11.5 19.0625 11.5ZM15.1042 17.75H19.0625C19.5803 17.75 20 17.3303 20 16.8125V13.6875C20 13.1697 19.5803 12.75 19.0625 12.75H15.1042C14.5864 12.75 14.1667 13.1697 14.1667 13.6875V16.8125C14.1667 17.3303 14.5864 17.75 15.1042 17.75ZM7.08332 16.8125V13.6875C7.08332 13.1697 7.50305 12.75 8.02082 12.75H11.9791C12.4969 12.75 12.9166 13.1697 12.9166 13.6875V16.8125C12.9166 17.3303 12.4969 17.75 11.9791 17.75H8.02082C7.50305 17.75 7.08332 17.3303 7.08332 16.8125Z" fill="currentColor"/>
            </svg>
          </Button>
        </div>
      </div>

      <div class="overflow-x-auto scrolling-touch pb-4">
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          v-model:sort-by="sortBy"
          v-model:sort-desc="sortDesc"
          :custom-filter="customFilter"
          :group-by="groupBy"
          :group-desc="groupDesc"
          :custom-group="customGroup"
          table-width="100%"
          table-class="table-fixed rounded-tl-none lg:rounded-tl-md"
          hoverable
          hide-no-data
        >
          <template v-slot:[`header.price-content`]="{ header }">
            <v-tooltip top max-width="162">
              <template v-slot:activator="{ on }">
                <span class="mr-1">{{ header.text }}</span> <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
              </template>
              <span>
                {{ $t('goods.priceHint') }}
              </span>
            </v-tooltip>
          </template>

          <template v-slot:items="{ items }">
            <template v-for="(item) in items">
              <tr
                v-if="item.group"
                :key="item.groupName"
                :style="{ background: 'transparent' }"
              >
                <td
                  :colspan="headers.length"
                  :style="{ height: '32px', paddingLeft: '51px' }"
                  class="text-gray-200 text-base leading-tight align-bottom p-0"
                >
                  <span class="text-white">{{ item.groupName }}</span> ({{ item.groupItemsCount }})
                </td>
              </tr>
              <tr
                v-else
                :key="item.id"
                class="cursor-pointer"
                tabindex="0"
              >
                <td></td>
                <td class="truncate">{{ item.photo }}</td>
                <td class="truncate">{{ item.name }}</td>
                <td class="truncate text-right">{{ item.currency }}</td>
                <td class="truncate text-right">{{ item.price }}</td>
                <td class="truncate text-right">{{ $n(item.sold || 0) }}</td>
                <td class="truncate text-right">{{ item.show }}</td>
              </tr>
            </template>
          </template>

        </DataTable>
      </div>
      <div
        v-if="items.length === 0 && loading"
        class="text-center text-gray-200 leading-tight py-4"
      >
        <v-progress-circular
          indeterminate
          size="24"
          width="2"
        />
      </div>
      <div
        v-else-if="items.length === 0"
        v-html="$t('goods.noData')"
        class="text-center text-gray-200 leading-tight py-4"
      />
      <Button
        block
        outlined
        class="mt-4"
      >
        <template v-slot:icon>
          <i class="zi-qc text-gray-100 text-2xl" />
        </template>
        <span>{{ $t('goods.createProduct') }}</span>
      </Button>
    </div>
  </div>
</template>

<script>
// import { LIST_ITEMS } from '../graphql/queries'

import { getObjectValueByPath } from '../util/helpers'

export default {
  name: 'ItemList',
  // apollo: {
  //   listItems: {
  //     query: LIST_ITEMS,
  //     variables () {
  //       return {
  //         orgId: this.$route.params.orgId,
  //       }
  //     },
  //     fetchPolicy: 'cache-and-network',
  //   },
  // },
  data () {
    return {
      sortBy: [],
      sortDesc: [],
      tabValue: 1,
      search: undefined,
      createLoading: false,
      errors: [],
    }
  },
  computed: {
    loading () {
      return false // this.$apollo.queries.listItems.loading
    },
    tabs () {
      return [
        {
          value: 1,
          text: this.$t('goods.myProducts'),
        },
        {
          value: 2,
          text: this.$t('goods.supplierProducts'),
        },
      ]
    },
    groupBy () {
      return this.sortBy.length === 0 || this.sortBy[0] === 'fullName' ? ['fullName'] : []
    },
    groupDesc () {
      return this.groupBy[0] === 'fullName' ? this.sortDesc : []
    },
    headers () {
      return [
        { text: '', value: 'select', width: 50, sortable: false },
        { text: this.$t('goods.photo'), value: 'photo', align: 'left', width: 230, sortable: false },
        { text: this.$t('goods.name'), value: 'name', align: 'left', width: 262, sortable: true },
        { text: this.$t('goods.currency'), value: 'currency', align: 'left', width: 202, sortable: true },
        { text: this.$t('goods.price'), value: 'price', align: 'left', width: 95, sortable: true },
        { text: this.$t('goods.sold'), value: 'sold', align: 'left', width: 125, sortable: true },
        { text: this.$t('goods.show'), value: 'show', align: 'left', width: 168, sortable: true },
      ]
    },
    compItems () {
      const items = (this.listItems && this.listItems.items) || []
      return items.map(item => {
        return {
          ...item,
        }
      })
    },
    items () {
      return this.compItems
    },
  },
  methods: {
    customGroup (items, groupBy, groupDesc) {
      const key = groupBy[0]
      const desc = groupDesc[0]
      const re = /[A-ZА-ЯҐЄІЇ\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
      const others = []
      const grouped = items.reduce((acc, curr) => {
        const name = curr[key] || ''
        const char = name.charAt(0).toLocaleUpperCase()
        if (re.test(char)) {
          if (Object.prototype.hasOwnProperty.call(acc, char)) {
            acc[char].push(curr)
          } else {
            acc[char] = [curr]
          }
        } else {
          others.push(curr)
        }
        return acc
      }, {})
      const result = []
      let sorted = Object.keys(grouped).sort()
      if (desc) {
        sorted = sorted.reverse()
      }
      sorted.map(k => {
        const groupItems = grouped[k]
        const group = { name: k, items: groupItems }
        result.push(group)
      })
      if (others.length > 0) {
        if (desc) {
          result.unshift({ name: '#', items: others })
        } else {
          result.push({ name: '#', items: others })
        }
      }
      return result
    },
    filterItems (items, search) {
      let filtered = items
      search = typeof search === 'string' ? search.trim() : null
      if (search) {
        filtered = items.filter(item => this.headers.some(header => {
          const value = getObjectValueByPath(item, header.value)
          return this.customFilter(value, search, item)
        }))
      }
      return filtered
    },
    customFilter (value, search) {
      if (search != null && value != null && typeof value !== 'boolean') {
        const words = search
          .split(',')
          .map(s => s.trim().toLocaleLowerCase())
          .filter(s => !!s)
        const v = value.toString().toLocaleLowerCase()
        return words.every(w => v.indexOf(w) !== -1)
      } else {
        return false
      }
    },
    switchTabValue (value) {
      if (value === this.tabValue) return
      this.tabValue = value
    },
  },
}
</script>
