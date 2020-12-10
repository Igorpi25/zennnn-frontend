<template>
  <tr>
    <td class="relative p-0">
      <span
        :class="[
          'absolute top-0 left-0 w-xs h-full',
          productStatusColor,
        ]"
      >
      </span>
    </td>
    <td class="pl-4 text-base text-gray-100">
      {{ index }}
    </td>
    <td class="text-center pl-1">
      <ProductImage
        v-if="isOwnerOrManager && create"
        :caption="info.description"
        upload
        @upload-start="$emit('create', {})"
      />
      <ProductImage
        v-else
        :product-id="item.id"
        :images="info.images"
        :upload="isOwnerOrManager"
        :removable="isOwnerOrManager"
        :sortable="isOwnerOrManager"
        :caption="info.description"
      />
    </td>
    <td class="pr-sm">
      <Select
        v-if="isOwnerOrManager"
        :value="wordItem"
        :placeholder="hasNoTranslation ? $t('words.noTranslation') : $t('shipping.name')"
        :lazy="create"
        v-model:search="wordSearch"
        :items="words"
        :has-arrow-icon="false"
        :input-class="hasNoTranslation ? 'placeholder-yellow-300': ''"
        :active-style="{ width: '180px', zIndex: 10 }"
        min-width="180px"
        max-width="180px"
        item-value="id"
        item-text="text"
        solo
        searchable
        no-filter
        class="relative"
        append-slot-class="w-auto pr-sm"
        @click:prepend-item="openWordCreateDialog"
        @input="createOrUpdateProduct({ name: $event })"
      >
        <template v-slot:item="{ item }">
          <span class="truncate">
            {{ item.text }}
          </span>
        </template>
        <template v-slot:prepend-item>
          <span class="flex items-center jusitfy-center text-blue-500">
            <i class="zi-plus-outline text-2xl mr-1" />
            <span>{{ $t('words.addWord') }}</span>
          </span>
        </template>
        <template v-slot:append="{ open }">
          <button
            v-if="open && canEdit"
            class="flex items-center jusitfy-center text-blue-500 focus:outline-none cursor-pointer"
            @click="wordEditDialog = true"
          >
            <i class="zi-edit text-xl" />
          </button>
        </template>
      </Select>
      <span v-else class="pl-sm">
        {{ wordItem.text }}
      </span>
      <WordDialog
        v-if="isOwnerOrManager"
        v-model="wordCreateDialog"
        :org-id="orgId"
        :product-id="item.id"
        :init-value="wordCreateText"
        create
        @create="onWordCreate"
      />
      <WordDialog
        v-if="isOwnerOrManager && canEdit"
        v-model="wordEditDialog"
        :org-id="orgId"
        :product-id="item.id"
        :item="item.name"
        @update="onWordUpdate"
      />
    </td>
    <td class="pr-sm">
      <TextField
        v-if="isOwnerOrManager"
        :value="item.article"
        :placeholder="$t('shipping.model')"
        :lazy="create"
        solo
        @input="createOrUpdateProduct({ article: $event })"
      />
      <span v-else class="pl-sm">
        {{ item.article }}
      </span>
    </td>
    <td class="text-right">
     <template v-if="!create">
        <TextField
          v-if="isOwnerOrManager"
          :value="item.qty"
          :placeholder="$t('placeholder.emptyNumber')"
          lazy
          solo
          number
          @input="updateProduct({ qty: $event })"
        />
        <span v-else class="pl-sm">
          {{ $n(item.qty) || 0 }}
        </span>
     </template>
    </td>

    <td>
      <template v-if="!create">
        <select
          v-if="isOwnerOrManager"
          :value="item.unit || 'pcs'"
          class="simple-select text-gray-100 text-base"
          @change="updateProduct({ unit: $event.target.value })"
        >
          <option
            v-for="unit of unitsItems"
            :key="unit.value"
            :value="unit.value"
          >
            {{ unit.text }}
          </option>
        </select>
        <span v-else>{{ $t(`unit.${item.unit || 'pcs'}`) }}</span>
      </template>
    </td>

    <template v-if="activeTab === 1">
      <template v-if="create">
        <td /><td /><td /><td />
      </template>
      <template v-else>
        <td v-if="(isInvoiceProfitTypeMargin || !profitForAll) && isOwnerOrManager" class="pl-sm">
          <TextField
            :value="purchasePrice"
            :placeholder="$t('placeholder.emptyNumber')"
            :input-class="hasCustomPurchasePrice ? 'text-blue-900' : null"
            lazy
            solo
            number
            number-format="currency"
            @input="updateProductCost({ purchasePrice: $event })"
          />
        </td>
        <td
          v-else
          class="text-right px-sm"
        >
          {{ $n(cost.purchasePrice, 'fixed') }}
        </td>

        <td class="text-right px-sm">
          {{ $n(cost.purchaseAmount, 'fixed') }}
        </td>

        <td v-if="(isInvoiceProfitTypeCommission || !profitForAll) && isOwnerOrManager" class="pl-sm">
          <TextField
            :value="clientPrice"
            :placeholder="$t('placeholder.emptyNumber')"
            :input-class="hasCustomClientPrice ? 'text-blue-900' : null"
            lazy
            solo
            number
            number-format="currency"
            @input="updateProductCost({ clientPrice: $event })"
          />
        </td>
        <td
          v-else
          class="text-right px-sm"
        >
          {{ $n(cost.clientPrice, 'fixed') }}
        </td>

        <td class="text-right px-sm">
          {{ $n(cost.clientAmount, 'fixed') }}
        </td>
      </template>
    </template>

    <template v-else-if="activeTab === 2">
      <template v-if="create">
        <td /><td /><td /><td /><td /><td />
      </template>
      <template v-else>
        <td class="pl-1">
          <TextField
            :value="store.net"
            :placeholder="$t('placeholder.emptyNumber')"
            solo
            number
            @input="updateProductStore({ net: $event })"
          />
        </td>
        <td>
          <TextField
            :value="store.gross"
            :placeholder="$t('placeholder.emptyNumber')"
            solo
            number
            @input="updateProductStore({ gross: $event })"
          />
        </td>
        <td>
          <div class="flex items-center">
            <TextField
              :value="store.width"
              :placeholder="$t('placeholder.emptyNumber')"
              solo
              number
              @input="updateProductStore({ width: $event })"
            />
            <TextField
              :value="store.height"
              :placeholder="$t('placeholder.emptyNumber')"
              solo
              number
              @input="updateProductStore({ height: $event })"
            />
            <TextField
              :value="store.length"
              :placeholder="$t('placeholder.emptyNumber')"
              solo
              number
              @input="updateProductStore({ length: $event })"
            />
          </div>
        </td>
        <td>
          <TextField
            v-if="isOwnerOrManager || isWarehouseman"
            :value="store.pkgQty"
            :placeholder="$t('placeholder.emptyNumber')"
            solo
            number
            number-format="integer"
            @input="updateProductStore({ pkgQty: $event })"
          />
        </td>
        <td>
          <TextField
            v-if="isOwnerOrManager || isWarehouseman"
            :value="store.pkgNo"
            :placeholder="$t('placeholder.emptyNumber')"
            solo
            number
            number-format="integer"
            @input="updateProductStore({ pkgNo: $event })"
          />
        </td>
        <td class="pl-1">
          <div
            v-if="isOwnerOrManager || isWarehouseman"
            class="h-4 relative"
          >
            <SwitchInput
              :value="store.atWhouse"
              hide-details
              small
              class="absolute left-0 top-0"
              @input="updateProductStore({ atWhouse: $event })"
            />
          </div>
        </td>
      </template>
    </template>

    <template v-else-if="activeTab === 3">
      <template v-if="create">
        <td /><td />
      </template>
      <template v-else>
        <td class="text-left pl-6">
          <div v-if="info.images">
            <ProductImagesList
              :product-id="item.id"
              :images="info.images"
              :upload="isOwnerOrManager"
              :removable="isOwnerOrManager"
              :caption="info.description"
            />
          </div>
        </td>
        <td class="text-left pl-sm">
          <TextField
            v-if="isOwnerOrManager || isWarehouseman"
            :value="info.description"
            :placeholder="$t('placeholder.emptyText')"
            solo
            @input="updateProductInfo({ description: $event })"
          />
          <span v-else class="truncate">
            {{ info.description }}
          </span>
        </td>
      </template>
    </template>

    <template v-else-if="activeTab === 4">
      <template v-if="create">
        <td /><td />
      </template>
      <template v-else>
        <td class="pl-6 pr-3">
          <div v-if="isOwnerOrManager" class="opacity-40 pointer-events-none flex items-center text-gray-200 h-8 bg-gray-800 rounded px-sm">
            <div class="mr-sm">
              <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5425 7.99658L7.47656 13.0625L8.7998 14.3857L11.6068 11.5787V20.8754H13.4782V11.5787L16.2852 14.3857L17.6084 13.0625L12.5425 7.99658Z" fill="currentColor"/>
                <path d="M20.0255 7.61465C19.9148 3.53146 16.5588 0.243652 12.4494 0.243652C10.5615 0.243652 8.7527 0.94209 7.35606 2.2102C6.15264 3.30286 5.33945 4.73943 5.02103 6.31317C3.88337 6.55781 2.84495 7.14628 2.04152 8.01239C1.06005 9.07064 0.519531 10.4487 0.519531 11.8927C0.519531 15.0399 3.07994 17.6003 6.22713 17.6003C6.23458 17.6003 6.24194 17.6002 6.24733 17.6002H7.20958V15.7288H6.23959L6.22178 15.729C4.10894 15.7261 2.39088 14.0063 2.39088 11.8927C2.39088 9.90689 3.9392 8.22731 5.91583 8.06911L6.69245 8.00695L6.772 7.23197C7.0713 4.31479 9.51208 2.11495 12.4494 2.11495C15.5965 2.11495 18.157 4.67536 18.157 7.82254V9.45998H19.5137C21.242 9.45998 22.6481 10.8661 22.6481 12.5945C22.6481 14.3228 21.242 15.7289 19.5137 15.7289L17.8762 15.7286V17.6001H19.4832C19.4934 17.6002 19.5035 17.6004 19.5137 17.6004C22.2739 17.6004 24.5195 15.3547 24.5195 12.5945C24.5195 10.007 22.5463 7.87171 20.0255 7.61465Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="text-13">
              {{ $t('shipping.linkFile') }}
            </div>
          </div>
        </td>
        <td class="pl-3">
          <div v-if="isOwnerOrManager || isWarehouseman" class="flex items-center relative">
            <TextField
              ref="link-input"
              :value="link.url"
              :placeholder="$t('placeholder.emptyText')"
              solo
              class="flex-grow"
              @focus="isLinkUrlFocus = true"
              @blur="isLinkUrlFocus = false"
              @input="updateProductLink({ url: $event })"
            />
            <a
              v-show="linkUrl && !isLinkUrlFocus"
              :href="linkUrl"
              target="_blank"
              class="inline-flex text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
            >
              <i class="zi-open-in-new text-2xl" />
            </a>
            <div
              v-if="!link.url && !isLinkUrlFocus"
              class="absolute inset-0 flex items-center justify-end"
            >
              <button
                class="h-8 w-full flex items-center justify-center rounded bg-gray-800 text-center text-gray-300 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="$refs['link-input'].focus()"
              >
                <i class="text-2xl zi-link mr-sm" />
                <span>
                  {{ $t('shipping.linkAdd') }}
                </span>
              </button>
            </div>
          </div>
          <span v-else class="truncate">
            {{ link.url }}
          </span>
        </td>
      </template>
    </template>

    <template v-else-if="activeTab === 5">
      <template v-if="create">
        <td /><td /><td />
      </template>
      <template v-else>
        <td class="px-6">
          <div v-if="commentators.length === 1" class="flex items-center">
            <div class="w-8 h-8 flex items-center flex-shrink-0 mr-sm">
              <div class="w-full h-full rounded-full flex items-center justify-center border border-gray-200">
                <i class="zi-user text-2xl text-gray-200" />
              </div>
            </div>
            <div class="flex-grow text-sm truncate">
              {{ commentators[0][1] }}
            </div>
          </div>
          <div v-else-if="commentators.length > 0" class="flex">
            <!-- TODO: should stacked -->
            <div
              v-for="([key, value]) in commentators"
              :key="key"
              :title="value || ''"
            >
              <div class="w-8 h-8 flex items-center flex-shrink-0 mr-xs">
                <div class="w-full h-full rounded-full flex items-center justify-center border border-gray-200">
                  <i class="zi-user text-2xl text-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </td>
        <td class="px-5 text-sm whitespace-no-wrap">
          <template v-if="item.comments && item.comments.length > 0">
            <span class="mr-sm">{{ $t('shipping.chatMessages') }}:</span>
            <span
              :class="[newCommentsCount ? 'bg-purple-500 text-white' : 'bg-gray-800 bg-opacity-90']"
              class="font-semibold h-5 inline-flex items-center justify-center rounded-50 px-1 pt-px"
              style="min-width: 20px;"
            >{{ item.comments.length }}</span>
          </template>
        </td>
        <td class="text-center px-5">
          <Comments
            :items="item.comments"
            :product-id="item.id"
            :spec-id="specId"
            is-product
            left
            class="inline-block"
          >
            <template v-slot:activator="{ on }">
              <button
                class="h-8 w-32 inline-block rounded text-blue-500 border border-gray-400 hover:border-blue-500 focus:border-blue-500 focus:outline-none select-none transition-colors duration-100 ease-out"
                v-on="on"
              >
                {{ $t('shipping.chatStart') }}
              </button>
            </template>
          </Comments>
        </td>
      </template>
    </template>

    <td
      v-if="activeTab !== 5"
    >
      <button
        v-if="isOwnerOrManager && !create"
        class="flex justify-end text-2xl text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none pr-3 md:pr-md ml-auto"
        @click="deleteProduct(item.id)"
      >
        <i class="zi-close" />
      </button>
    </td>
  </tr>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuery, useResult } from '@vue/apollo-composable'

import { InvoiceProfitType, Role, WordStatus } from '../graphql/enums'
import { SEARCH_WORDS } from '../graphql/queries'
import product from '../mixins/product'
import { isLink } from '../util/helpers'

import Comments from './Comments.vue'
import WordDialog from './WordDialog.vue'

export default {
  name: 'InvoiceProduct',
  components: {
    Comments,
    WordDialog,
  },
  mixins: [product],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    activeTab: {
      type: Number,
      default: 1,
    },
    profitType: {
      type: String,
      default: '',
    },
    profitForAll: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      required: true,
    },
    create: Boolean,
  },
  setup () {
    const { locale } = useI18n()
    const route = useRoute()
    const orgId = route.params.orgId
    const wordSearch = ref('')

    const { result } = useQuery(SEARCH_WORDS, () => ({
      orgId: orgId,
      search: wordSearch.value,
      locale: locale.value,
    }), {
      enabled: () => wordSearch.value,
      fetchPolicy: 'cache-and-network',
      debounce: 300,
    })
    const searchWords = useResult(result)

    return {
      orgId,
      wordSearch,
      searchWords,
    }
  },
  data () {
    return {
      wordCreateDialog: false,
      wordEditDialog: false,
      isLinkUrlFocus: false,
      wordCreateText: '',
    }
  },
  computed: {
    hasNoTranslation () {
      return this.item.name && !this.wordItem[this.$i18n.locale]
    },
    hasWord () {
      return this.item.name && this.item.name.id
    },
    canEdit () {
      const word = this.item.name || {}
      return this.hasWord && word.status === WordStatus.DRAFT
    },
    wordItem () {
      const word = this.item.name || {}
      const values = word.values || []
      const result = {}
      values.forEach(el => {
        const v = el.v || el.tr
        if (v) {
          result[el.k] = v
        }
      })
      const text = result[this.$i18n.locale] || result[word.defaultLocale]
      return {
        ...word,
        text,
      }
    },
    words () {
      const items = (this.searchWords && this.searchWords.items) || []
      return items.map(word => {
        const values = word.values || []
        const result = {}
        values.forEach(el => {
          const v = el.v || el.tr
          if (v) {
            result[el.k] = v
          }
        })
        const text = result[this.$i18n.locale] || result[word.defaultLocale]
        return {
          ...word,
          text,
        }
      })
    },
    commentators () {
      const result = {}
      const items = this.item.comments || []
      items.forEach(item => {
        result[item.sender] = item.senderName
      })
      return Object.entries(result)
    },
    newCommentsCount () {
      let count = 0
      const items = this.item.comments || []
      items.forEach(item => {
        if (!item.viewed) {
          count++
        }
      })
      return count
    },
    isOwnerOrManager () {
      return this.role === Role.OWNER || this.role === Role.MANAGER
    },
    isAccountant () {
      return this.role === Role.ACCOUNTANT
    },
    isWarehouseman () {
      return this.role === Role.WAREHOUSEMAN
    },
    linkUrl () {
      return isLink(this.link.url) ? this.link.url : ''
    },
    isInvoiceProfitTypeMargin () {
      return this.profitType === InvoiceProfitType.MARGIN
    },
    isInvoiceProfitTypeCommission () {
      return this.profitType === InvoiceProfitType.COMMISSION
    },
  },
  watch: {
    wordCreateDialog (val) {
      if (!val) {
        this.wordCreateText = ''
      }
    },
  },
  methods: {
    openWordCreateDialog () {
      this.wordCreateText = this.wordSearch || ''
      this.wordCreateDialog = true
    },
    async onWordCreate (result) {
      this.wordCreateDialog = false
      try {
        await this.createOrUpdateProduct({ name: result.id })
      } catch (error) {
        throw new Error(error)
      }
    },
    async onWordUpdate () {
      this.wordEditDialog = false
    },
  },
}
</script>
