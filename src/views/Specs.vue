<template>
  <div class="container container--sm">
    <div class="py-10">
      <div v-if="loading">{{ `${$t('action.loading')}...` }}</div>

      <div class="pt-5 pb-6">
        <TextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          solo
          outlined
          background-dark
          hide-details
          class="max-w-2xl text-2xl leading-normal mx-auto"
        >
          <template v-slot:append>
            <Icon size="24">{{ icons.mdiMagnify }}</Icon>
          </template>
        </TextField>
      </div>

      <div class="overflow-x-auto">
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          table-width="100%"
          table-class="table-fixed"
          thead-class="text-accent2 border-b border-accent2"
        >
          <template v-slot:header.status="{ header }">
            <td
              :width="header.width + 'px'"
              class="px-3"
            >
              <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:avocode="https://avocode.com/" viewBox="0 0 10 10"><defs><clipPath id="ClipPath1016"><path d="M5.00003,0c2.76138,0 4.99994,2.23864 4.99994,5.00005c0,2.76141 -2.23856,4.99997 -4.99994,4.99997c-2.76152,0 -5.00007,-2.23855 -5.00007,-4.99997c0,-2.76141 2.23856,-5.00005 5.00007,-5.00005z" fill="currentColor"></path></clipPath></defs><g><g><title>Status</title><path d="M5.00003,0c2.76138,0 4.99994,2.23864 4.99994,5.00005c0,2.76141 -2.23856,4.99997 -4.99994,4.99997c-2.76152,0 -5.00007,-2.23855 -5.00007,-4.99997c0,-2.76141 2.23856,-5.00005 5.00007,-5.00005z" fill-opacity="0" fill="currentColor" stroke-dashoffset="0" stroke-dasharray="" stroke-linejoin="miter" stroke-linecap="butt" stroke-opacity="1" stroke="#414141" stroke-miterlimit="50" stroke-width="2" clip-path="url(&quot;#ClipPath1016&quot;)"></path></g></g></svg>
            </td>
          </template>
          <template v-slot:header.coming="{ header }">
            <td :width="header.width + 'px'">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    +$
                  </span>
                </template>
                <span>
                  {{ $t('deals.moneyRecieved') }}
                </span>
              </v-tooltip>
            </td>
          </template>
          <template v-slot:header.spending="{ header }">
            <td :width="header.width + 'px'">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">-$</span>
                </template>
                <span>
                  {{ $t('deals.expensesPaid') }}
                </span>
              </v-tooltip>
            </td>
          </template>
          <template v-slot:items="{ items }">
            <tr
              v-for="(item) in items"
              :key="item.id"
              class="items bg-background hover:bg-accent3 border-none"
              @click="$router.push({
                name: 'spec',
                params: {
                  specId: item.id
                }
              })"
            >
              <td class="relative px-3">
                <span
                  :class="[
                    'status-indicator inline-block',
                    item.specStatus === SpecStatus.IN_STOCK
                      ? 'status-indicator--green' : item.specStatus === SpecStatus.IN_PRODUCTION
                        ? 'status-indicator--orange' : item.specStatus === SpecStatus.IN_PROCESSING
                          ? 'status-indicator--pink' : 'bg-transparent'
                  ]"
                >
                </span>
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
                  class="cursor-pointer pointer-events-auto"
                  @click="deleteSpec(item.id)"
                >
                  <i class="icon-delete text-lg text-gray-200" />
                </div>
              </td>
            </tr>
          </template>
        </DataTable>
      </div>
      <Button
        v-if="canCreateSpec"
        outline
        class="mt-6"
        @click="createSpecDialog = true"
      >
        <template v-slot:icon>
          <Icon>{{ icons.mdiPlusCircleOutline }}</Icon>
        </template>
        <span>{{ $t('deals.createDeal') }}</span>
      </Button>
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
                  <span>{{ $t('action.create') }}</span>
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
        { text: '', value: 'status', align: 'left', width: 45, bgcolor: 'tansparent', sortable: true },
        { text: '', value: 'coming', align: 'left', width: 45, bgcolor: 'tansparent', sortable: true },
        { text: '', value: 'spending', align: 'left', width: 45, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('deals.clientUid'), value: 'client.uid', align: 'left', width: 80, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('deals.clientName'), value: 'clientFillName', align: 'left', width: 200, minWidth: 200, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('deals.clientPhone'), value: 'clientPhone', align: 'left', width: 165, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('deals.specNo'), value: 'specNo', align: 'left', width: 220, minWidth: 220, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('deals.createdAt'), value: 'createdAt', width: 120, minWidth: 120, bgcolor: 'tansparent' },
        { text: '', value: 'actions', width: 48, bgcolor: 'tansparent' },
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
