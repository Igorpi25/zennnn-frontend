<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">
      <div class="flex flex-wrap sm:flex-nowrap items-center justify-between pb-4">
        <TextField
          v-model="search"
          :placeholder="clientsFilter.length === 0 ? $t('placeholder.pageSearch') : ''"
          :content-class="[search || clientsFilter.length > 0 ? 'shadow-blue-500' : '', 'bg-transparent overflow-x-auto']"
          class="w-full pb-4 sm:pb-0 sm:pr-8"
          input-class="placeholder-blue-500"
          prepend-slot-class="w-auto"
        >
          <template v-slot:prepend>
            <span class="w-10 flex items-center justify-center flex-shrink-0">
              <i class="zi-magnifier text-2xl text-gray-100"></i>
            </span>
            <span v-if="clientsFilter.length > 0" class="text-base text-white pr-2">
              <span
                v-for="filter in clientsFilter"
                :key="filter.value"
                class="h-6 inline-flex items-center rounded-lg bg-gray-400 whitespace-nowrap pl-1 mr-1"
              >
                <span class="flex-grow pl-xs -mr-xs">
                  {{ filter.text }}
                </span>
                <i
                  class="w-6 flex-shrink-0 zi-close text-2xl text-gray-200 cursor-pointer focus:outline-none focus:text-gray-100 hover:text-gray-100"
                  @click="clearClientFilter(filter.value)"
                />
              </span>
            </span>
          </template>
          <template v-slot:append v-if="search || clientsFilter.length > 0">
            <i
              class="zi-close text-2xl text-gray-200 cursor-pointer focus:outline-none focus:text-gray-100 hover:text-gray-100"
              @click="clearFilters"
            />
          </template>
        </TextField>
        <div class="flex w-full sm:w-auto items-center justify-end" style="min-width: 165px;">
          <Menu
            v-model="filterMenu"
            :content-class="'locale-picker__menu'"
            :nudge-bottom="25"
            bottom
            left
          >
            <template v-slot:activator="{ on }">
              <div
                class="group flex items-center cursor-pointer whitespace-nowrap"
                v-on="on"
              >
                <span class="text-gray-100 group-hover:text-light-gray-400 pr-2">
                  {{ currentFilterText }}
                </span>
                <i class="zi-filter relative text-2xl text-gray-200 group-hover:text-gray-100">
                  <div
                    v-if="hasFilter"
                    :class="[
                      'absolute top-0 right-0 -mt-xs -mr-1 w-sm h-sm rounded-full border-2 bg-gray-900 border-gray-900 transition-colors duration-100 ease-out',
                    ]"
                  >
                    <div class="w-full h-full bg-blue-500 rounded-full" />
                  </div>
                </i>
              </div>
            </template>
            <template>
              <ul
                :class="[
                  'rounded py-2',
                  'border-gray-400 text-gray-100 bg-gray-400'
                ]"
                role="menu"
              >
                <li
                  v-for="item in filters"
                  :key="item.value"
                  :value="item.value"
                  :class="[
                    'hover:bg-gray-300 focus:bg-gray-300',
                    'flex items-center h-9 cursor-pointer focus:outline-none px-5',
                    'transition-colors duration-100 ease-out',
                    { 'text-white': item.value === currentFilter },
                  ]"
                  tabindex="0"
                  role="menuitem"
                  @click="changeClientType(item.value)"
                >
                  <span>{{ item.text }}</span>
                </li>
              </ul>
            </template>
          </Menu>
        </div>
      </div>

      <div class="overflow-x-auto scrolling-touch pb-4">
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          v-model:sort-by="sortBy"
          v-model:sort-desc="sortDesc"
          :group-by="groupBy"
          :group-desc="groupDesc"
          :custom-group="customGroup"
          table-width="100%"
          table-class="table-fixed"
          hoverable
          hide-no-data
        >
          <template v-slot:[`header.status`]="{ header }">
            <td
              :width="header.width + 'px'"
            >
              <div class="ml-6 w-3 h-3 rounded-full border border-gray-400" />
            </td>
          </template>
          <template v-slot:[`header.isMoneyRecieved`]="{ header }">
            <td :width="header.width + 'px'">
              <div class="flex items-center">
                <svg class="mr-xs" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.9 19.2561V17.6561C3.8 17.5561 2.7 17.2561 2 16.9561L2.5 14.9561C3.2 15.3561 4.2 15.7561 5.4 15.7561C6.4 15.7561 7.1 15.3561 7.1 14.6561C7.1 13.9561 6.5 13.5561 5.3 13.1561C3.5 12.5561 2.2 11.6561 2.2 9.9561C2.1 8.4561 3.2 7.2561 5 6.8561V5.2561H6.7V6.7561C7.9 6.7561 8.6 7.0561 9.2 7.2561L8.7 9.2561C8.3 9.0561 7.5 8.6561 6.2 8.6561C5.1 8.6561 4.7 9.1561 4.7 9.6561C4.7 10.2561 5.3 10.5561 6.8 11.1561C8.9 11.8561 9.7 12.8561 9.7 14.3561C9.7 15.8561 8.6 17.1561 6.6 17.5561V19.2561H4.9Z" fill="#404040"/>
                  <path d="M17 7.2561C14.2 7.2561 12 9.4561 12 12.2561C12 15.0561 14.2 17.2561 17 17.2561C19.8 17.2561 22 15.0561 22 12.2561C22 9.4561 19.8 7.2561 17 7.2561ZM20.2 12.8561H17.6V15.5561H16.4V12.8561H13.8V11.6561H16.4V9.0561H17.6V11.7561H20.2V12.8561Z" fill="#404040"/>
                </svg>
                <Tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
                  </template>
                  <span>
                    {{ $t('deals.moneyRecieved') }}
                  </span>
                </Tooltip>
              </div>
            </td>
          </template>
          <template v-slot:[`header.isExpensesPaid`]="{ header }">
            <td :width="header.width + 'px'">
              <div class="flex items-center">
                <svg class="mr-xs" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.9 19.2561V17.6561C3.7 17.5561 2.6 17.2561 2 16.9561L2.5 14.9561C3.2 15.3561 4.2 15.7561 5.4 15.7561C6.4 15.7561 7.1 15.3561 7.1 14.6561C7.1 13.9561 6.5 13.5561 5.3 13.1561C3.5 12.5561 2.2 11.6561 2.2 9.95613C2.1 8.35613 3.2 7.15613 5 6.85613V5.15613H6.7V6.65613C7.9 6.75613 8.6 6.95613 9.2 7.25613L8.7 9.25613C8.3 9.05613 7.5 8.65613 6.2 8.65613C5.1 8.65613 4.7 9.15613 4.7 9.65613C4.7 10.2561 5.3 10.5561 6.8 11.1561C8.9 11.8561 9.7 12.8561 9.7 14.3561C9.7 15.8561 8.6 17.1561 6.6 17.5561V19.3561H4.9V19.2561Z" fill="#404040"/>
                  <path d="M17 7.2561C14.2 7.2561 12 9.4561 12 12.2561C12 15.0561 14.2 17.2561 17 17.2561C19.8 17.2561 22 15.0561 22 12.2561C22 9.4561 19.8 7.2561 17 7.2561ZM19.7 12.8561H14.3V11.6561H19.7V12.8561Z" fill="#404040"/>
                </svg>

                <Tooltip top>
                  <template v-slot:activator="{ on }">
                    <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
                  </template>
                  <span>
                    {{ $t('deals.expensesPaid') }}
                  </span>
                </Tooltip>
              </div>
            </td>
          </template>
          <template v-slot:[`header.finalCost-content`]="{ header }">
            <td :width="header.width + 'px'">
              <span class="inline-block align-middle mr-xs">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.0729 19.0593V17.4593C9.87285 17.3593 8.77285 17.0593 8.17285 16.7593L8.67285 14.7593C9.37285 15.1593 10.3729 15.5593 11.5729 15.5593C12.5729 15.5593 13.2729 15.1593 13.2729 14.4593C13.2729 13.7593 12.6729 13.3593 11.4729 12.9593C9.67285 12.3593 8.37285 11.4593 8.37285 9.75933C8.37285 8.25933 9.47285 7.05933 11.2729 6.65933V5.05933H12.9729V6.55933C14.1729 6.65933 14.8729 6.85933 15.4729 7.15933L14.8729 9.05933C14.4729 8.85933 13.6729 8.45933 12.3729 8.45933C11.2729 8.45933 10.8729 8.95933 10.8729 9.45933C10.8729 10.0593 11.4729 10.3593 12.9729 10.9593C15.0729 11.6593 15.8729 12.6593 15.8729 14.1593C15.8729 15.6593 14.7729 16.9593 12.7729 17.3593V19.0593H11.0729Z" fill="#404040"/>
                  <path d="M15.9726 0.759408C15.0726 0.359408 14.1726 0.159408 13.2726 0.0594082C7.0726 -0.540592 1.4726 3.45941 0.272596 9.55941C-0.227404 11.9594 -0.0274037 14.2594 0.772596 16.3594C0.972596 16.7594 1.4726 16.9594 1.8726 16.7594C2.1726 16.5594 2.3726 16.1594 2.1726 15.8594C1.6726 14.5594 1.4726 13.2594 1.4726 11.7594C1.6726 6.65941 5.6726 2.25941 10.6726 1.65941C12.2726 1.45941 13.8726 1.65941 15.2726 2.15941L14.9726 2.85941L19.1726 3.45941C19.4726 3.45941 19.5726 3.15941 19.3726 2.95941L16.4726 0.0594082L15.9726 0.759408Z" fill="#404040"/>
                  <path d="M7.97241 23.2595C8.87241 23.6595 9.77241 23.8595 10.6724 23.9595C16.8724 24.5595 22.4724 20.6595 23.7724 14.5595C24.2724 12.1595 24.0724 9.85946 23.2724 7.75946C22.9724 7.25946 22.5724 7.05946 22.1724 7.35946C21.8724 7.55946 21.6724 7.95946 21.8724 8.25946C22.3724 9.55946 22.5724 10.8595 22.5724 12.3595C22.3724 17.4595 18.3724 21.8595 13.3724 22.4595C11.7724 22.6595 10.1724 22.4595 8.77241 21.9595L9.07241 21.2595L4.87241 20.6595C4.57241 20.6595 4.47241 20.9595 4.67241 21.1595L7.77241 24.0595L7.97241 23.2595Z" fill="#404040"/>
                </svg>
              </span>

              <Tooltip top max-width="158">
                <template v-slot:activator="{ on }">
                  <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
                </template>
                <span>
                  {{ $t('deals.turnoverHint') }}
                </span>
              </Tooltip>
            </td>
          </template>
          <template v-slot:[`header.margin-content`]="{ header }">
            <td :width="header.width + 'px'">
              <span class="inline-block align-middle mr-xs">%</span>
              <Tooltip top max-width="158">
                <template v-slot:activator="{ on }">
                  <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
                </template>
                <span>
                  {{ $t('deals.marginHint') }}
                </span>
              </Tooltip>
            </td>
          </template>
          <template v-slot:[`header.hasNewComment`]="{ header }">
            <td :width="header.width + 'px'" />
          </template>
           <template v-slot:[`header.specNo-content`]="{ header }">
            <span>
              {{ header.text }}
            </span>
            <Tooltip top max-width="220">
              <template v-slot:activator="{ on }">
                <i class="zi-help align-middle text-xl text-blue-300 cursor-pointer" v-on="on" />
              </template>
              <span v-html="$t('deals.numberHint')" />
            </Tooltip>
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
                  :style="{ height: '32px', paddingLeft: '26px' }"
                  class="text-gray-200 text-base leading-tight align-bottom p-0"
                >
                  <span class="text-white">{{ item.groupName }}</span> <span class="text-gray-200">({{ item.groupItemsCount }})</span>
                </td>
              </tr>
              <tr
                v-else
                :key="item.id"
                class="cursor-pointer"
                tabindex="0"
                @click="goToSpec(item.id)"
                @keydown.enter.exact.self="goToSpec(item.id)"
              >
                <td class="relative">
                  <div
                    :class="[
                      'ml-6 w-3 h-3 rounded-full',
                      item.specStatus === SpecStatus.IN_STOCK
                      ? 'bg-green-500' : item.specStatus === SpecStatus.IN_PRODUCTION
                        ? 'bg-yellow-500' : item.specStatus === SpecStatus.IN_PROCESSING
                          ? 'bg-pink-500' : 'bg-gray-800'
                    ]"
                  />
                </td>
                <td class="text-center">
                  <i v-if="item.isMoneyRecieved" class="zi-check text-2xl text-gray-200 align-middle" />
                </td>
                <td class="text-center">
                  <i v-if="item.isExpensesPaid" class="zi-check text-2xl text-gray-200 align-middle" />
                </td>
                <td class="truncate text-right">{{ $n(item.finalCost || 0) }}</td>
                <td class="truncate text-right text-gray-200">{{ item.margin || 0 }}%</td>
                <td class="truncate pl-6 pr-2">{{ item.client.fullName }}</td>
                <td class="truncate pr-2">{{ item.client.contactPersonFullName }}</td>
                <td class="truncate pl-3">
                  <span>
                    <Tooltip top>
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          <i class="zi-number text-2xl text-gray-200 align-middle" />
                          <span v-if="item.specNoCount" class="align-middle text-light-gray-400">
                            - {{ item.specNoCount }}
                          </span>
                        </span>
                      </template>
                      <span>
                        {{ item.specNo }}
                      </span>
                    </Tooltip>
                  </span>
                </td>
                <td>
                  {{ $d($parseDate(item.createdAt), 'short') }}
                </td>
                <td class="truncate pointer-events-none" @click.stop>
                  <span v-if="item.client.contactPhone" class="pointer-events-auto">
                    <a
                      :href="`tel:${item.client.contactPhone}`"
                      class="inline-block align-middle text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.23 15.26L16.69 14.97C16.08 14.9 15.48 15.11 15.05 15.54L13.21 17.38C10.38 15.94 8.06004 13.63 6.62004 10.79L8.47004 8.94001C8.90004 8.51001 9.11004 7.91001 9.04004 7.30001L8.75004 4.78001C8.63004 3.77001 7.78004 3.01001 6.76004 3.01001H5.03004C3.90004 3.01001 2.96004 3.95001 3.03004 5.08001C3.56004 13.62 10.39 20.44 18.92 20.97C20.05 21.04 20.99 20.1 20.99 18.97V17.24C21 16.23 20.24 15.38 19.23 15.26Z" fill="currentColor"/>
                      </svg>
                    </a>
                    <i class="zi-action text-2xl text-gray-200 align-middle cursor-default ml-1" />
                  </span>
                </td>
                <td class="truncate text-right">{{ (item.client.uid) }}</td>
                <td class="text-center pointer-events-none" @click.prevent.stop>
                  <button
                    class="cursor-pointer pointer-events-auto flex items-center text-2xl text-gray-200 focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none mx-auto"
                    @click="deleteSpec(item.id)"
                  >
                    <i class="zi-delete" />
                  </button>
                </td>
                <td>
                  <span v-if="item.shipped" class="inline-block align-middle h-2 w-2 rounded-full bg-blue-400"></span>
                </td>
                <td :class="{ 'bg-purple-500': item.hasNewComment }"></td>
              </tr>
            </template>
          </template>
        </DataTable>
      </div>
      <div
        v-if="items.length === 0 && loading"
        class="text-center text-gray-200 leading-tight py-4"
      >
        <Progress
          indeterminate
          size="24"
          width="2"
        />
      </div>
      <div
        v-else-if="items.length === 0"
        v-html="$t('deals.noData')"
        class="text-center text-gray-200 leading-tight py-4"
      />
      <Btn
        v-if="canCreateSpec"
        block
        outlined
        class="mt-4"
        @click="createSpecDialog = true"
      >
        <template v-slot:icon>
          <i class="zi-bag text-gray-100 text-2xl" />
        </template>
        <span>{{ $t('deals.createDeal') }}</span>
      </Btn>
    </div>
    <Modal
      v-if="canCreateSpec"
      v-model="createSpecDialog"
      max-width="458"
      content-class="bg-gray-400"
    >
      <div ref="createSpecContainer" class="relative">
        <div class="bg-gray-500 flex items-center text-lg text-white font-semibold px-8 py-5">
          <i class="zi-user-plus text-3xl text-blue-500 mr-4" />
          <div>
            {{ $t('deals.createSpecDialogHeader') }}
          </div>
        </div>
        <div class="px-8 py-6">
          <Select
            ref="createSpecSelect"
            :value="createSpecClient"
            :label="$t('deals.createSpecDialogSearchPlaceholder')"
            :placeholder="$t('placeholder.startTyping')"
            v-model:search="clientSearch"
            :items="clients"
            :rules="[rules.required]"
            label-no-wrap
            searchable
            return-object
            no-filter
            item-value="id"
            item-text="fullName"
            state-icon
            state-color="none"
            @input="v => createSpecClient = v"
            @click:prepend-item="createClient"
          >
            <template v-slot:prepend-item>
              <span class="flex items-center jusitfy-center text-blue-500">
                <i class="zi-plus-outline text-2xl mr-1" />
                <span>{{ $t('deals.createSpecDialogAddClient') }}</span>
              </span>
            </template>
            <template v-slot:prepend>
              <i class="zi-magnifier text-gray-200" />
            </template>
          </Select>
        </div>
        <div
          class="flex justify-between px-8 pb-8"
        >
          <Btn
            :disabled="createWithClientLoading"
            :loading="createWithoutClientLoading"
            outlined
            merge-class="border-gray-200"
            @click="createSpec(true)"
          >
            {{ $t('deals.createSpecDialogWithoutClient') }}
          </Btn>
          <Btn
            v-if="createSpecClient"
            :disabled="createWithoutClientLoading"
            :loading="createWithClientLoading"
            @click="createSpec()"
          >
            {{ $t('deals.createSpecDialogAdd') }}
          </Btn>
        </div>
        <span
          class="absolute top-0 right-0 text-2xl text-gray-200 hover:text-gray-100 cursor-pointer mt-2 mr-2"
          @click="createSpecDialog = false"
        >
          <i class="zi-close" />
        </span>
      </div>
    </Modal>
    <Modal
      v-if="canCreateSpec"
      ref="clientDialog"
      v-model="clientDialog"
      :fullscreen="$breakpoint.smAndDown"
      scrollable
      max-width="1110"
      content-class="dialog-full-height scrolling-touch"
    >
      <ClientCard
        ref="clientCard"
        :org-id="orgId"
        create
        is-component
        @close="clientDialog = false"
        @create="setCreateSpecClient"
      />
    </Modal>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useResult } from '@vue/apollo-composable'

import {
  Role,
  Typename,
  Operation,
  SpecStatus,
  ClientType,
} from '../graphql/enums'
import { SPEC_FRAGMENT } from '../graphql/typeDefs'
import { GET_SPECS, GET_ORGS, SEARCH_CLIENTS, GET_CLIENTS_BY_ID } from '../graphql/queries'
import { CREATE_SPEC, DELETE_SPEC } from '../graphql/mutations'
import { SPECS_DELTA } from '../graphql/subscriptions'

import Btn from '../components/Base/Btn'
import Menu from '../components/Base/Menu'
import Modal from '../components/Base/Modal'
import Tooltip from '../components/Base/Tooltip'
import Progress from '../components/Base/Progress'
import DataTable from '../components/Base/DataTable'
import TextField from '../components/Base/TextField'
import Select from '../components/Base/Select'
import ClientCard from '../components/ClientCard.vue'

import { confirmDialog, wrapInArray } from '../util/helpers'

export default {
  name: 'Specs',
  components: {
    Btn,
    Menu,
    Modal,
    Tooltip,
    Progress,
    DataTable,
    TextField,
    Select,
    ClientCard,
  },
  setup () {
    const route = useRoute()
    const orgId = route.params.orgId
    const clientSearch = ref('')
    const filter = ref({
      clientsIds: [],
      clientType: null,
      group: false,
    })

    const { result: result1 } = useQuery(SEARCH_CLIENTS, () => ({
      orgId: orgId,
      search: clientSearch.value,
    }), {
      enabled: () => clientSearch.value,
      fetchPolicy: 'cache-and-network',
      debounce: 300,
    })
    const searchClients = useResult(result1)

    const clientTypeEnum = computed(() => {
      switch (filter.value.clientType) {
        case 1: return ClientType.LEGAL
        case 2: return ClientType.PRIVATE
        case 3: return ClientType.OTHER
        default: return null
      }
    })

    const { result: result2, loading } = useQuery(GET_SPECS, () => ({
      orgId: orgId,
      clientsIds: filter.value.clientsIds,
      clientType: clientTypeEnum.value,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const getSpecs = useResult(result2)

    const { result: result3 } = useQuery(GET_ORGS, null, { fetchPolicy: 'cache-only' })
    const getOrgs = useResult(result3)

    const { result: result4 } = useQuery(GET_CLIENTS_BY_ID, () => ({
      orgId: orgId,
      ids: filter.value.clientsIds,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const getClientsById = useResult(result4)

    return {
      orgId,
      clientSearch,
      filter,
      loading,
      searchClients,
      getSpecs,
      getOrgs,
      getClientsById,
      clientTypeEnum,
    }
  },
  data () {
    return {
      clientDialog: false,
      createSpecClient: null,
      createSpecDialog: false,
      SpecStatus,
      sortBy: ['createdAt'],
      sortDesc: [true],
      search: undefined,
      createWithoutClientLoading: false,
      createWithClientLoading: false,
      deleteLoading: null,
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
      filterMenu: false,
      currentFilter: null,
    }
  },
  computed: {
    hasFilter () {
      return this.filter.clientType || this.filter.group
    },
    filters () {
      return [
        {
          text: this.$t('label.noSort'),
          value: null,
        },
        {
          text: this.$t('client.legalPerson'),
          value: 1,
        },
        {
          text: this.$t('client.privatePerson'),
          value: 2,
        },
        {
          text: this.$t('client.other'),
          value: 3,
        },
        {
          text: this.$t('deals.byEmployees'),
          value: 4,
        },
      ]
    },
    groupBy () {
      return this.filter.group ? ['employeeId'] : null
    },
    groupDesc () {
      return this.filter.group ? [false] : null
    },
    currentFilterText () {
      switch (this.currentFilter) {
        case 1: return this.$t('client.legalPerson')
        case 2: return this.$t('client.privatePerson')
        case 3: return this.$t('client.other')
        case 4: return this.$t('deals.byEmployees')
        default: return this.$t('label.noSort')
      }
    },
    clientsFilter () {
      return this.filter.clientsIds.map(id => {
        const clients = (this.getClientsById && this.getClientsById.items) || []
        const client = clients.find(item => item.id === id) || {}
        const text = ((client.contactPerson && client.contactPerson.fullName) || client.uid) || ''
        return {
          text,
          value: id,
        }
      })
    },
    clients () {
      return (this.searchClients && this.searchClients.items) || []
    },
    canCreateSpec () {
      return this.roleInOrg === Role.OWNER ||
        this.roleInOrg === Role.MANAGER ||
        this.roleInOrg === Role.FREELANCER
    },
    roleInOrg () {
      const orgs = this.getOrgs || []
      const org = orgs.find(el => el.id === this.orgId) || {}
      return org.role || null
    },
    headers () {
      return [
        { text: '', value: 'status', align: 'left', width: 45, sortable: true },
        { text: '', value: 'isMoneyRecieved', align: 'left', width: 50, sortable: false },
        { text: '', value: 'isExpensesPaid', align: 'left', width: 50, sortable: false },
        { text: '', value: 'finalCost', align: 'right', width: 100, sortable: true },
        { text: '', value: 'margin', align: 'right', width: 58, sortable: true },
        { text: this.$t('deals.clientName'), value: 'client.fullName', align: 'left', width: 230, minWidth: 230, class: 'whitespace-nowrap text-left pl-6', sortable: true },
        { text: this.$t('deals.contactPerson'), value: 'client.contactPersonFullName', align: 'left', width: 152, sortable: true },
        { text: this.$t('deals.number'), value: 'specNo', align: 'left', width: 80, minWidth: 80, class: 'whitespace-nowrap', sortable: true },
        { text: this.$t('deals.createdAt'), value: 'createdAt', align: 'left', width: 100, minWidth: 100, class: 'whitespace-nowrap', sortable: true },
        { text: this.$t('deals.contact'), value: 'client.contactPhone', align: 'left', width: 85, class: 'whitespace-nowrap', sortable: true },
        { text: this.$t('deals.clientUcn'), value: 'client.uid', align: 'right', width: 60, class: 'whitespace-nowrap', sortable: true },
        { text: '', value: 'actions', width: 54 },
        { text: '', value: 'isShipped', width: 28 },
        { text: '', value: 'hasNewComment', width: 5 },
      ]
    },
    items () {
      const items = this.getSpecs || []
      return items.map(item => {
        let specNoCount = null
        const specNo = item.specNo || ''
        const specNoSplit = specNo.split('-')
        const hasClientUid = specNo.split(/\d{4,4}-\d{2,2}-\d{2,2}/)[0]
        if (hasClientUid) {
          specNoCount = specNoSplit[4]
        } else {
          specNoCount = specNoSplit[3]
        }
        const client = item.client || {}
        return {
          ...item,
          client,
          specNoCount,
        }
      })
    },
  },
  watch: {
    createSpecDialog (val) {
      if (!val) {
        setTimeout(() => {
          this.createSpecClient = null
        }, 300)
      }
    },
  },
  created () {
    if (this.$route.query.clients) {
      this.filter.clientsIds = !Array.isArray(this.$route.query.clients) ? [this.$route.query.clients] : this.$route.query.clients
    }
    const clientType = Number.parseInt(this.$route.query.clientType, 10) || null
    if (this.$route.query.group) {
      this.filter.group = true
      this.currentFilter = 4
    }
    if (clientType) {
      this.filter.clientType = clientType
      this.currentFilter = clientType
    }
    if (this.$route.query.q) {
      this.search = this.$route.query.q
    }
    if (this.$route.query.sort) {
      this.sortBy = wrapInArray(this.$route.query.sort)
      const desc = this.$route.query.desc === true || this.$route.query.desc === 'true'
      this.sortDesc = [!!(this.$route.query.sort && desc)]
    }
    // on search on server, escape input string
    this.$watch('search', (val, old) => {
      if (val === old) return
      this.updateRouteQuery()
    })
    this.$watch('sortBy', this.updateRouteQuery)
    this.$watch('sortDesc', this.updateRouteQuery)
    this.$watch('$route.query', (query, old) => {
      // TODO: deep equal query 'clients' and 'filter.clientsIds'
      if (!query.clients) {
        this.filter.clientsIds = []
      }
      this.filter.group = !!query.group
      const clientType = Number.parseInt(query.clientType, 10) || null
      if (clientType !== this.filter.clientType) {
        this.filter.clientType = clientType
      }
      if (query.q !== this.search) {
        this.search = query.q
      }
      if (query.sort !== this.sortBy[0]) {
        this.sortBy = query.sort ? wrapInArray(query.sort) : []
      }
      this.sortDesc = this.sortBy.length > 0 ? [query.desc === true || query.desc === 'true'] : []
    })
    this.$watch('filter', this.updateRouteQuery, { deep: true })
  },
  mounted () {
    const observer = this.$apollo.subscribe({
      query: SPECS_DELTA,
      fetchPolicy: 'no-cache',
    })

    const apolloClient = this.$apollo.provider.defaultClient

    observer.subscribe({
      next: ({ data }) => {
        const operation = data.delta.operation
        const typename = data.delta.payload.__typename

        this.$logger.info(`[${typename}]: ${JSON.stringify(data)}`)

        if (operation === Operation.INSERT_SPEC) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS,
            variables: {
              orgId: this.orgId,
              clientsIds: this.filter.clientsIds,
              clientType: this.clientTypeEnum,
            },
          })

          if (!getSpecs.some(el => el.id === data.delta.payload.id)) {
            getSpecs.push(data.delta.payload)

            apolloClient.writeQuery({
              query: GET_SPECS,
              variables: {
                orgId: this.orgId,
                clientsIds: this.filter.clientsIds,
                clientType: this.clientTypeEnum,
              },
              data: {
                getSpecs,
              },
            })
          }
        }

        if (operation === Operation.UPDATE_SPEC) {
          apolloClient.writeFragment({
            id: `${Typename.SPEC}:${data.delta.payload.id}`,
            fragment: SPEC_FRAGMENT,
            data: data.delta.payload,
          })
        }

        if (operation === Operation.DELETE_SPEC) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS,
            variables: {
              orgId: this.orgId,
              clientsIds: this.filter.clientsIds,
              clientType: this.clientTypeEnum,
            },
          })

          const index = getSpecs.findIndex(el => el.id === data.delta.payload.id)

          if (index !== -1) {
            getSpecs.splice(index, 1)
            apolloClient.writeQuery({
              query: GET_SPECS,
              variables: {
                orgId: this.orgId,
                clientsIds: this.filter.clientsIds,
                clientType: this.clientTypeEnum,
              },
              data: {
                getSpecs,
              },
            })
          }
        }
      },
      error: (error) => {
        this.$logger.warn('Error: ', error)
      },
    })
  },
  methods: {
    customGroup (items, groupBy) {
      const key = groupBy[0]
      const others = []
      const grouped = items.reduce((acc, curr) => {
        const id = curr[key]
        if (id) {
          if (Object.prototype.hasOwnProperty.call(acc, id)) {
            acc[id].push(curr)
          } else {
            acc[id] = [curr]
          }
        } else {
          others.push(curr)
        }
        return acc
      }, {})
      const result = []
      const roles = Object.keys(Role).reduce((acc, curr, index) => {
        return { ...acc, [curr]: index + 1 }
      }, {})
      // sort by roles
      const keys = Object.keys(grouped).sort((a, b) => {
        const itemA = grouped[a][0]
        const itemB = grouped[b][0]
        return roles[itemA.employeeRole] - roles[itemB.employeeRole]
      })
      keys.map(k => {
        const groupItems = grouped[k]
        const item = groupItems[0]
        const fullName = item.employeeFullName || ''
        const role = this.$te(`role.${item.employeeRole}`) ? this.$t(`role.${item.employeeRole}`) : item.employeeRole || ''
        const name = `${fullName} (${role})`
        const group = { name, items: groupItems }
        result.push(group)
      })
      if (others.length > 0) {
        result.push({ name: '#', items: others })
      }
      return result
    },
    updateRouteQuery () {
      const query = {}
      if (this.filter.clientsIds.length > 0) {
        query.clients = this.filter.clientsIds
      }
      if (this.filter.group) {
        query.group = true
      }
      if (this.filter.clientType) {
        query.clientType = this.filter.clientType
      }
      if (this.search) {
        query.q = this.search
      }
      if (this.sortBy[0]) {
        query.sort = this.sortBy[0]
      }
      if (this.sortDesc[0]) {
        query.desc = true
      }
      this.$router.replace({
        path: this.$route.path,
        query,
      }).catch(() => {})
    },
    changeClientType (value) {
      this.currentFilter = value
      if (value === 4) {
        this.filter.clientType = null
        this.filter.group = true
      } else {
        this.filter.clientType = value
        this.filter.group = false
      }
    },
    clearClientFilter (id) {
      this.filter.clientsIds = this.filter.clientsIds.filter(el => el !== id)
    },
    clearFilters () {
      this.search = null
      this.filter.clientsIds = []
    },
    goToSpec (specId) {
      this.$router.push({
        name: 'spec',
        params: { specId },
      })
    },
    createClient () {
      this.clientDialog = true
      this.$nextTick(() => {
        if (this.$refs.clientCard) {
          this.$refs.clientCard.reset()
          if (this.$refs.clientDialog.$refs.dialog) {
            this.$refs.clientDialog.$refs.dialog.scrollTop = 0
          }
        }
      })
    },
    setCreateSpecClient (client) {
      this.clientDialog = false
      this.createSpecClient = client
    },
    async createSpec (withoutClient) {
      const loading = withoutClient ? 'createWithoutClientLoading' : 'createWithClientLoading'
      this[loading] = true
      try {
        const variables = { orgId: this.orgId }
        if (!withoutClient && this.createSpecClient && this.createSpecClient.id) {
          variables.clientId = this.createSpecClient.id
        }
        const response = await this.$apollo.mutate({
          mutation: CREATE_SPEC,
          variables,
        })
        if (response && response.data && response.data.createSpec) {
          const spec = response.data.createSpec

          const { getSpecs } = this.$apollo.provider.defaultClient.readQuery({
            query: GET_SPECS,
            variables: {
              orgId: this.orgId,
              clientsIds: this.filter.clientsIds,
              clientType: this.clientTypeEnum,
            },
          })

          if (!getSpecs.some(el => el.id === spec.id)) {
            getSpecs.push(spec)

            this.$apollo.provider.defaultClient.writeQuery({
              query: GET_SPECS,
              variables: {
                orgId: this.orgId,
                clientsIds: this.filter.clientsIds,
                clientType: this.clientTypeEnum,
              },
              data: {
                getSpecs,
              },
            })
          }
          this.$router.push({ name: 'spec', params: { orgId: this.orgId, specId: spec.id } })
        }
      } catch (error) {
        if (error.graphQLErrors) {
          for (const err of error.graphQLErrors) {
            const { message } = err
            if (message === 'ForbiddenError: Insufficient access rights') {
              // alert(this.$t('alert.insufficientAccess'))
            }
          }
        } else {
          throw new Error(error)
        }
      } finally {
        setTimeout(() => {
          this[loading] = false
        }, 150)
      }
    },
    async deleteSpec (id) {
      try {
        const msg = this.$t('alert.removeDeal')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        await this.$apollo.mutate({
          mutation: DELETE_SPEC,
          variables: {
            id,
          },
        })
        const { getSpecs } = this.$apollo.provider.defaultClient.readQuery({
          query: GET_SPECS,
          variables: {
            orgId: this.orgId,
            clientsIds: this.filter.clientsIds,
            clientType: this.clientTypeEnum,
          },
        })

        const index = getSpecs.findIndex(el => el.id === id)

        if (index !== -1) {
          getSpecs.splice(index, 1)
          this.$apollo.provider.defaultClient.writeQuery({
            query: GET_SPECS,
            variables: {
              orgId: this.orgId,
              clientsIds: this.filter.clientsIds,
              clientType: this.clientTypeEnum,
            },
            data: {
              getSpecs,
            },
          })
        }
      } catch (error) {
        if (error === 'not_confirmed') return
        throw new Error(error)
      } finally {
        this.deleteLoading = null
      }
    },
  },
}
</script>
