<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">
      <div v-if="loading">{{ `${$t('action.loading')}...` }}</div>

      <div class="flex flex-wrap sm:flex-no-wrap items-center justify-between pb-4">
        <ZTextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          outlined
          class="w-full sm:w-64"
          content-class="input-transparent"
          input-class="placeholder-blue-500"

        >
          <template v-slot:prepend>
            <i class="icon-search text-2xl text-gray-100"></i>
          </template>
        </ZTextField>
        <div class="flex w-full sm:w-auto items-center justify-end">
          <span class="pr-2 whitespace-no-wrap">Без сортировки</span>
          <i class="icon-filter text-2xl text-gray-200" />
        </div>
      </div>

      <div class="overflow-x-auto overflow-scroll-touch pb-8">
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          table-width="100%"
          table-class="table-fixed"
        >
          <template v-slot:header.status="{ header }">
            <td
              :width="header.width + 'px'"
            >
              <div class="ml-6 w-3 h-3 rounded-full border border-gray-400" />
            </td>
          </template>
          <template v-slot:header.coming="{ header }">
            <td :width="header.width + 'px'">
              <div class="flex items-center">
                <svg class="mr-1" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.9 19.2561V17.6561C3.8 17.5561 2.7 17.2561 2 16.9561L2.5 14.9561C3.2 15.3561 4.2 15.7561 5.4 15.7561C6.4 15.7561 7.1 15.3561 7.1 14.6561C7.1 13.9561 6.5 13.5561 5.3 13.1561C3.5 12.5561 2.2 11.6561 2.2 9.9561C2.1 8.4561 3.2 7.2561 5 6.8561V5.2561H6.7V6.7561C7.9 6.7561 8.6 7.0561 9.2 7.2561L8.7 9.2561C8.3 9.0561 7.5 8.6561 6.2 8.6561C5.1 8.6561 4.7 9.1561 4.7 9.6561C4.7 10.2561 5.3 10.5561 6.8 11.1561C8.9 11.8561 9.7 12.8561 9.7 14.3561C9.7 15.8561 8.6 17.1561 6.6 17.5561V19.2561H4.9Z" fill="#404040"/>
                  <path d="M17 7.2561C14.2 7.2561 12 9.4561 12 12.2561C12 15.0561 14.2 17.2561 17 17.2561C19.8 17.2561 22 15.0561 22 12.2561C22 9.4561 19.8 7.2561 17 7.2561ZM20.2 12.8561H17.6V15.5561H16.4V12.8561H13.8V11.6561H16.4V9.0561H17.6V11.7561H20.2V12.8561Z" fill="#404040"/>
                </svg>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on" class="cursor-pointer">
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8.2561" r="8" fill="#6377A0"/>
                        <path d="M8.786 9.9621L8.772 9.6681C8.744 8.9961 8.968 8.4221 9.514 7.7781C10.116 7.0921 10.732 6.3921 10.732 5.3841C10.732 4.2641 9.934 3.2561 8.198 3.2561C7.316 3.2561 6.504 3.5081 6 3.8301L6.42 5.0621C6.77 4.7961 7.33 4.6421 7.82 4.6421C8.604 4.6561 8.968 5.0481 8.968 5.6361C8.968 6.1821 8.618 6.6721 8.086 7.3021C7.428 8.1001 7.176 8.8701 7.246 9.5981L7.274 9.9621H8.786ZM7.988 13.0001C8.632 13.0001 9.052 12.5241 9.052 11.9081C9.038 11.2641 8.618 10.8161 7.988 10.8161C7.372 10.8161 6.924 11.2641 6.924 11.9081C6.924 12.5241 7.358 13.0001 7.988 13.0001Z" fill="#222222"/>
                      </svg>
                    </span>
                  </template>
                  <span>
                    {{ $t('deals.moneyRecieved') }}
                  </span>
                </v-tooltip>
              </div>
            </td>
          </template>
          <template v-slot:header.spending="{ header }">
            <td :width="header.width + 'px'">
              <div class="flex items-center">
                <svg class="mr-1" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.9 19.2561V17.6561C3.7 17.5561 2.6 17.2561 2 16.9561L2.5 14.9561C3.2 15.3561 4.2 15.7561 5.4 15.7561C6.4 15.7561 7.1 15.3561 7.1 14.6561C7.1 13.9561 6.5 13.5561 5.3 13.1561C3.5 12.5561 2.2 11.6561 2.2 9.95613C2.1 8.35613 3.2 7.15613 5 6.85613V5.15613H6.7V6.65613C7.9 6.75613 8.6 6.95613 9.2 7.25613L8.7 9.25613C8.3 9.05613 7.5 8.65613 6.2 8.65613C5.1 8.65613 4.7 9.15613 4.7 9.65613C4.7 10.2561 5.3 10.5561 6.8 11.1561C8.9 11.8561 9.7 12.8561 9.7 14.3561C9.7 15.8561 8.6 17.1561 6.6 17.5561V19.3561H4.9V19.2561Z" fill="#404040"/>
                  <path d="M17 7.2561C14.2 7.2561 12 9.4561 12 12.2561C12 15.0561 14.2 17.2561 17 17.2561C19.8 17.2561 22 15.0561 22 12.2561C22 9.4561 19.8 7.2561 17 7.2561ZM19.7 12.8561H14.3V11.6561H19.7V12.8561Z" fill="#404040"/>
                </svg>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on" class="cursor-pointer">
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8.2561" r="8" fill="#6377A0"/>
                        <path d="M8.786 9.9621L8.772 9.6681C8.744 8.9961 8.968 8.4221 9.514 7.7781C10.116 7.0921 10.732 6.3921 10.732 5.3841C10.732 4.2641 9.934 3.2561 8.198 3.2561C7.316 3.2561 6.504 3.5081 6 3.8301L6.42 5.0621C6.77 4.7961 7.33 4.6421 7.82 4.6421C8.604 4.6561 8.968 5.0481 8.968 5.6361C8.968 6.1821 8.618 6.6721 8.086 7.3021C7.428 8.1001 7.176 8.8701 7.246 9.5981L7.274 9.9621H8.786ZM7.988 13.0001C8.632 13.0001 9.052 12.5241 9.052 11.9081C9.038 11.2641 8.618 10.8161 7.988 10.8161C7.372 10.8161 6.924 11.2641 6.924 11.9081C6.924 12.5241 7.358 13.0001 7.988 13.0001Z" fill="#222222"/>
                      </svg>
                    </span>
                  </template>
                  <span>
                    {{ $t('deals.expensesPaid') }}
                  </span>
                </v-tooltip>
              </div>
            </td>
          </template>
          <template v-slot:items="{ items }">
            <tr
              v-for="(item) in items"
              :key="item.id"
              class="cursor-pointer"
              @click="$router.push({
                name: 'spec',
                params: {
                  specId: item.id
                }
              })"
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
              <td></td>
              <td></td>
              <td>{{ (item.client && item.client.uid) || '-' }}</td>
              <td>{{ item.client && item.client.fullName }}</td>
              <td>{{ ((item.client && item.client.phone) || (item.client && item.client.mobilePhone)) || '-' }}</td>
              <td>{{ item.customNumber || item.specNo || '-' }}</td>
              <td class="text-center">
                {{ $d($parseDate(item.createdAt), 'short') }}
              </td>
              <td class="text-center pointer-events-none" @click.prevent.stop>
                <div
                  class="cursor-pointer pointer-events-auto flex items-center"
                  @click="deleteSpec(item.id)"
                >
                  <i class="icon-delete text-lg text-gray-200 hover:text-gray-100" />
                </div>
              </td>
            </tr>
          </template>
        </DataTable>
      </div>
      <ZButton
        v-if="canCreateSpec"
        block
        outlined
        @click="createSpecDialog = true"
      >
        <template v-slot:icon>
          <i class="icon-portdolio text-gray-100 text-lg" />
        </template>
        <span>{{ $t('deals.createDeal') }}</span>
      </ZButton>
    </div>
    <v-dialog
      v-if="canCreateSpec"
      v-model="createSpecDialog"
      max-width="458"
    >
      <div class="relative bg-gray-400">
        <div class="pt-6 px-6 pb-8">
          <div class="flex">
            <i class="icon-add-user text-primary text-2xl mr-2" />
            <div class="w-64 text-white font-semibold pb-6">
              {{ $t('deals.createSpecDialogHeader') }}
            </div>
          </div>
          <div class="pb-8">
            <Select
              ref="createSpecSelect"
              :value="createSpecClient"
              :placeholder="$t('deals.createSpecDialogSearchPlaceholder')"
              :search.sync="clientSearch"
              :items="clients"
              searchable
              return-object
              no-filter
              item-value="id"
              item-text="fullName"
              solo
              squared
              hide-details
              class="text-sm select_nd"
              input-class="h-8 text-primary placeholder-gray-100"
              @input="v => createSpecClient = v"
              @click:prepend-item="createClient"
            >
              <template v-slot:prepend-item>
                <span class="flex items-center jusitfy-center text-primary">
                  <i class="icon-add mr-1" />
                  <span>{{ $t('deals.createSpecDialogAddClient') }}</span>
                </span>
              </template>
              <template v-slot:append>
                <div class="text-green-500 select-none">
                  <Icon v-if="createSpecClient" size="12">{{ icons.mdiCheck }}</Icon>
                </div>
              </template>
            </Select>
          </div>
          <div>
            <button
              v-if="createSpecClient"
              :disabled="createLoading"
              :class="{ 'hover:bg-primary-accent focus:bg-primary-accent': !createLoading }"
              style="min-width: 120px"
              class="relative ml-auto px-3 h-10 flex items-center justify-center relative rounded-md bg-primary text-white focus:outline-none select-none align-middle transition-colors duration-100 ease-out"
              @click="createSpec"
            >
              <div
                v-if="createLoading"
                class="absolute inset-0 flex items-center justify-center"
              >
                <v-progress-circular
                  indeterminate
                  size="24"
                  width="2"
                />
              </div>
              <span
                :class="{ 'opacity-0': createLoading }"
              >
                {{ $t('deals.createSpecDialogAdd') }}
              </span>
            </button>
            <button
              v-else
              :disabled="createLoading"
              :class="{ 'hover:border-primary focus:border-primary': !createLoading }"
              style="min-width: 120px"
              class="relative px-3 h-10 flex items-center justify-center relative rounded-md border border-gray-200 text-primary focus:outline-none select-none align-middle transition-colors duration-100 ease-out"
              @click="createSpec"
            >
              <div
                v-if="createLoading"
                class="absolute inset-0 flex items-center justify-center"
              >
                <v-progress-circular
                  indeterminate
                  size="24"
                  width="2"
                />
              </div>
              <span
                :class="{ 'opacity-0': createLoading }"
              >
                {{ $t('deals.createSpecDialogWithoutClient') }}
              </span>
            </button>
          </div>
        </div>
        <span
          class="absolute top-0 right-0 mt-4 mr-4 text-gray-200 hover:text-gray-100 cursor-pointer"
          @click="createSpecDialog = false"
        >
          <i class="icon-close" />
        </span>
      </div>
    </v-dialog>
    <v-dialog
      v-if="canCreateSpec"
      ref="clientDialog"
      v-model="clientDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      scrollable
      max-width="1024"
      content-class="text-gray-100"
    >
      <ClientCard
        ref="clientCard"
        :org-id="orgId"
        create
        is-component
        @close="clientDialog = false"
        @create="setCreateSpecClient"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mdiPlusCircleOutline, mdiMagnify, mdiCheck } from '@mdi/js'

import {
  Role,
  Typename,
  Operation,
  SpecStatus,
} from '../graphql/enums'
import { SPEC_FRAGMENT } from '../graphql/typeDefs'
import { GET_SPECS, GET_ORGS, SEARCH_CLIENTS } from '../graphql/queries'
import { CREATE_SPEC, DELETE_SPEC } from '../graphql/mutations'
import { SPECS_DELTA } from '../graphql/subscriptions'

import ClientCard from '../components/ClientCard.vue'

import { confirmDialog } from '@/util/helpers'

export default {
  name: 'Specs',
  components: {
    ClientCard,
  },
  apollo: {
    searchClients: {
      query: SEARCH_CLIENTS,
      variables () {
        return {
          orgId: this.orgId,
          search: this.clientSearch,
        }
      },
      fetchPolicy: 'cache-and-network',
      skip () {
        return !this.clientSearch
      },
      debounce: 300,
    },
    getSpecs: {
      query: GET_SPECS,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
    },
    getOrgs: {
      query: GET_ORGS,
      fetchPolicy: 'cache-only',
    },
  },
  data () {
    return {
      clientDialog: false,
      clientSearch: '',
      createSpecClient: null,
      createSpecDialog: false,
      SpecStatus,
      search: '',
      loading: false,
      createLoading: false,
      deleteLoading: null,
      icons: {
        mdiCheck,
        mdiMagnify,
        mdiPlusCircleOutline,
      },
    }
  },
  computed: {
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
    orgId () {
      return this.$route.params.orgId
    },
    headers () {
      return [
        { text: '', value: 'status', align: 'left', width: 45, sortable: true },
        { text: '', value: 'coming', align: 'left', width: 45, sortable: true },
        { text: '', value: 'spending', align: 'left', width: 45, sortable: true },
        { text: this.$t('deals.clientUid'), value: 'client.uid', align: 'left', width: 80, sortable: true },
        { text: this.$t('deals.clientName'), value: 'clientFillName', align: 'left', width: 200, minWidth: 200, sortable: true },
        { text: this.$t('deals.clientPhone'), value: 'clientPhone', align: 'left', width: 165, sortable: true },
        { text: this.$t('deals.specNo'), value: 'specNo', align: 'left', width: 220, minWidth: 220, sortable: true },
        { text: this.$t('deals.createdAt'), value: 'createdAt', width: 120, minWidth: 120 },
        { text: '', value: 'actions', width: 48 },
      ]
    },
    items () {
      const items = this.getSpecs || []
      return items.map(item => {
        const client = item.client || {}
        return {
          ...item,
          // for search
          clientFillName: client.fullName,
          clientPhone: client.phone || client.mobilePhone,
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
            variables: { orgId: this.orgId },
          })

          if (!getSpecs.some(el => el.id === data.delta.payload.id)) {
            getSpecs.push(data.delta.payload)

            apolloClient.writeQuery({
              query: GET_SPECS,
              variables: { orgId: this.orgId },
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
            variables: { orgId: this.orgId },
          })

          const index = getSpecs.findIndex(el => el.id === data.delta.payload.id)

          if (index !== -1) {
            getSpecs.splice(index, 1)
            apolloClient.writeQuery({
              query: GET_SPECS,
              variables: { orgId: this.orgId },
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
    async createSpec () {
      try {
        this.createLoading = true
        const variables = { orgId: this.orgId }
        if (this.createSpecClient && this.createSpecClient.id) {
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
            variables: { orgId: this.orgId },
          })

          if (!getSpecs.some(el => el.id === spec.id)) {
            getSpecs.push(spec)

            this.$apollo.provider.defaultClient.writeQuery({
              query: GET_SPECS,
              variables: { orgId: this.orgId },
              data: {
                getSpecs,
              },
            })
          }
          this.$router.push({ name: 'spec', params: { orgId: this.orgId, specId: spec.id } })
        }
      } catch (error) {
        if (error.graphQLErrors) {
          for (let err of error.graphQLErrors) {
            const { message } = err
            if (message === 'ForbiddenError: Insufficient access rights') {
              alert('Только купившие ПРО аккаунт могут создавать Спецификацию.')
            }
          }
        } else {
          throw new Error(error)
        }
      } finally {
        setTimeout(() => {
          this.createLoading = false
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
          variables: { orgId: this.orgId },
        })

        const index = getSpecs.findIndex(el => el.id === id)

        if (index !== -1) {
          getSpecs.splice(index, 1)
          this.$apollo.provider.defaultClient.writeQuery({
            query: GET_SPECS,
            variables: { orgId: this.orgId },
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
