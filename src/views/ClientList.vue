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
      </div>

      <div class="overflow-x-auto overflow-scroll-touch pb-8">
        <DataTable
          :headers="headers"
          :items="items"
          :search="search"
          table-width="100%"
          table-class="table-fixed"
          thead-class="text-accent2 border-b border-accent2"
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
                <i class="icon-portdolio text-lg align-middle mr-1" v-on="on" />
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
              @click="$router.push({
                name: 'client',
                params: {
                  clientId: item.id
                }
              })"
            >
              <td></td>
              <td>{{ item.fullName }}</td>
              <td>{{ item.phone || item.mobilePhone }}</td>
              <td>{{ item.contactPerson }}</td>
              <td></td>
              <td>{{ item.uid }}</td>
              <td>{{ item.deals }}</td>
              <td class="text-right pointer-events-none" @click.prevent.stop>
                <div
                  class="cursor-pointer pointer-events-auto flex items-center"
                  @click="deleteClient(item.id)"
                >
                  <i class="icon-delete text-lg text-gray-200 hover:text-gray-100" />
                </div>
              </td>
            </tr>
          </template>

        </DataTable>
      </div>
      <Button
        block
        outlined
        @click="$router.push({
          name: 'client-create'
        })"
      >
        <template v-slot:icon>
          <i class="icon-add-user text-gray-100 text-2xl" />
        </template>
        <span>{{ $t('clients.createClient') }}</span>
      </Button>
    </div>
  </div>
</template>

<script>
import { mdiPlusCircleOutline, mdiMagnify } from '@mdi/js'

import { LIST_CLIENTS } from '@/graphql/queries'
import { DELETE_CLIENT } from '@/graphql/mutations'

import { confirmDialog } from '@/util/helpers'

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
      icons: {
        mdiMagnify,
        mdiPlusCircleOutline,
      },
    }
  },
  computed: {
    headers () {
      return [
        { text: '', value: 'debt', align: 'left', width: 60, bgcolor: 'tansparent', sortable: true, tooltip: this.$t('clients.clientsDebt') },
        { text: this.$t('clients.companyName'), value: 'fullName', align: 'left', width: 220, minWidth: 220, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('clients.phone'), value: 'clientPhone', align: 'left', width: 120, minWidth: 120, bgcolor: 'tansparent', sortable: true },
        { text: this.$t('clients.contactPerson'), value: 'contactPerson', align: 'left', width: 165, bgcolor: 'tansparent', sortable: true },
        { text: '', value: 'coming', align: 'left', width: 45, bgcolor: 'tansparent' },
        { text: this.$t('clients.uid'), value: 'uid', align: 'left', width: 120, minWidth: 120, bgcolor: 'tansparent', sortable: true },
        { text: '', value: 'deals', width: 60, minWidth: 60, bgcolor: 'tansparent', sortable: true, tooltip: this.$t('clients.currentDealsAmount') },
        { text: '', value: 'actions', align: 'right', width: 48, bgcolor: 'tansparent' },
      ]
    },
    items () {
      const items = (this.listClients && this.listClients.items) || []
      return items.map(item => {
        return {
          ...item,
          // for search
          clientPhone: item.phone || item.mobilePhone,
        }
      })
    },
  },
  methods: {
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
