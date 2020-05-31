<template>
  <div class="container container--sm">
    <div class="pt-4 pb-10">
      <div v-if="loading">{{ `${$t('action.loading')}...` }}</div>

      <div class="flex items-end flex-wrap md:flex-no-wrap justify-between">
        <TextField
          v-model="search"
          :placeholder="$t('placeholder.pageSearch')"
          class="w-full md:w-64 flex-shrink-0 pb-4"
          content-class="input-transparent"
          input-class="placeholder-blue-500"
        >
          <template v-slot:prepend>
            <i class="zi-magnifier text-2xl text-gray-100"></i>
          </template>
        </TextField>
        <div class="h-11 flex overflow-x-auto overflow-scroll-touch pl-4">
          <div
            v-for="(tab, i) in tabs"
            :aria-selected="clientType === tab.value"
            :key="tab.value"
            :class="[
              'w-full sm:w-auto flex items-center justify-center rounded-t',
              'select-none whitespace-no-wrap cursor-pointer',
              'transition-colors duration-100 ease-in px-10',
              { 'mr-1': i + 1 < tabs.length },
              tab.disabled ? 'pointer-events-none opacity-40' : 'focus:outline-none focus:text-white hover:text-white',
              clientType === tab.value ? 'text-white bg-gray-800' : 'bg-transparent',
            ]"
            :role="tab.disabled ? null : 'tab'"
            :tabindex="tab.disabled ? null : 0"
            @click="switchClientType(tab.value)"
            @keydown.enter.exact="switchClientType(tab.value)"
          >
            {{ tab.text }}
          </div>
        </div>
      </div>

      <div class="overflow-x-auto overflow-scroll-touch pb-4">
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          table-width="100%"
          table-class="table-fixed"
          hoverable
        >
          <template v-slot:header.debt-content>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  ($→)
                </span>
              </template>
              <span>
                {{ $t('clients.clientsDebt') }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:header.deals-content>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <i class="zi-bag text-lg align-middle mr-1" v-on="on" />
              </template>
              <span>
                {{ $t('clients.currentDealsAmount') }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:items="{ items }">
            <tr
              v-for="(item) in items"
              :key="item.id"
              class="cursor-pointer"
              tabindex="0"
              @click="goToClient(item)"
              @keydown.enter.exact.self="goToClient(item)"
            >
              <td></td>
              <td>{{ item.fullName }}</td>
              <td>{{ item.clientPhone }}</td>
              <td>{{ item.contactPerson && item.contactPerson.fullName }}</td>
              <td></td>
              <td>{{ item.uid }}</td>
              <td>{{ item.deals }}</td>
              <td class="text-center pointer-events-none" @click.prevent.stop>
                <button
                  class="cursor-pointer pointer-events-auto flex items-center text-2xl text-gray-200 focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none"
                  @click="deleteClient(item.id)"
                >
                  <i class="zi-delete" />
                </button>
              </td>
            </tr>
          </template>

        </DataTable>
      </div>
      <Button
        block
        outlined
        class="mt-4"
        @click="$router.push({
          name: 'client-create',
          query: {
            clientType,
          },
        })"
      >
        <template v-slot:icon>
          <i class="zi-user-plus text-gray-100 text-2xl" />
        </template>
        <span>{{ $t('clients.createClient') }}</span>
      </Button>
    </div>
  </div>
</template>

<script>
import { ClientType } from '../graphql/enums'
import { LIST_CLIENTS } from '../graphql/queries'
import { DELETE_CLIENT } from '../graphql/mutations'

import { confirmDialog } from '../util/helpers'

export default {
  name: 'ClientList',
  apollo: {
    listClients: {
      query: LIST_CLIENTS,
      variables () {
        return {
          orgId: this.$route.params.orgId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
    return {
      search: '',
      loading: false,
      createLoading: false,
      deleteLoading: null,
      errors: [],
    }
  },
  computed: {
    tabs () {
      return [
        {
          value: 1,
          text: this.$t('client.legalPerson'),
        },
        {
          value: 2,
          text: this.$t('client.privatePerson'),
        },
        {
          value: 3,
          text: this.$t('client.other'),
        },
      ]
    },
    clientType () {
      return Number.parseInt(this.$route.query.clientType, 10) || 1
    },
    clientTypeEnum () {
      switch (this.clientType) {
        case 1: return ClientType.LEGAL
        case 2: return ClientType.PRIVATE
        case 3: return ClientType.OTHER
        default: return ClientType.LEGAL
      }
    },
    headers () {
      return [
        { text: '', value: 'debt', align: 'left', width: 60, sortable: true, tooltip: this.$t('clients.clientsDebt') },
        { text: this.$t('clients.companyName'), value: 'fullName', align: 'left', width: 220, minWidth: 220, sortable: true },
        { text: this.$t('clients.phone'), value: 'clientPhone', align: 'left', width: 120, minWidth: 120, sortable: true },
        { text: this.$t('clients.contactPerson'), value: 'contactPerson.fullName', align: 'left', width: 165, sortable: true },
        { text: '', value: 'coming', align: 'left', width: 45 },
        { text: this.$t('clients.ucn'), value: 'uid', align: 'left', width: 120, minWidth: 120, sortable: true },
        { text: '', value: 'deals', width: 60, minWidth: 60, sortable: true, tooltip: this.$t('clients.currentDealsAmount') },
        { text: '', value: 'actions', align: 'right', width: 48 },
      ]
    },
    items () {
      const items = (this.listClients && this.listClients.items) || []
      const itemsMapped = items.map(item => {
        return {
          ...item,
          clientPhone: (item.mobilePhone && item.mobilePhone.phone) || (item.phone && item.phone.phone),
        }
      })
      return itemsMapped.filter(el => el.clientType === this.clientTypeEnum)
    },
  },
  methods: {
    switchClientType (type) {
      this.$router.push({ query: { clientType: type } }).catch(() => {})
    },
    getClientTypeNumeric (type) {
      switch (type) {
        case ClientType.LEGAL: return 1
        case ClientType.PRIVATE: return 2
        case ClientType.OTHER: return 3
        default: return 1
      }
    },
    goToClient (item) {
      this.$router.push({
        name: 'client',
        params: {
          groupId: item.groupId,
          clientId: item.id,
        },
        query: {
          clientType: this.getClientTypeNumeric(item.clientType),
        },
      })
    },
    async deleteClient (id) {
      try {
        const msg = this.$t('alert.removeClient')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        const response = await this.$apollo.mutate({
          mutation: DELETE_CLIENT,
          variables: { id },
          update: (store) => {
            const data = store.readQuery({
              query: LIST_CLIENTS,
              variables: {
                orgId: this.$route.params.orgId,
              },
            })
            const index = data.listClients.items.findIndex(item => item.id === id)
            if (index !== -1) {
              data.listClients.items.splice(index, 1)
            }
            store.writeQuery({
              query: LIST_CLIENTS,
              variables: {
                orgId: this.$route.params.orgId,
              },
              data,
            })
          },
        })
        if (response && response.errors && response.errors.length > 0) {
          throw response
        }
      } catch (error) {
        if (error === 'not_confirmed') return
        this.errors = error.errors || []
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'DeleteClientError',
        //   attributes: {
        //     error: message
        //   }
        // })
      } finally {
        this.deleteLoading = null
      }
    },
  },
}
</script>
