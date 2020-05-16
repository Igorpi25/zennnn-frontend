<template>
  <div>
    <div class="container container--sm">
      <div class="pt-4 pb-10">
        <div v-if="loading">{{ `${$t('action.loading')}...` }}</div>

        <div class="flex flex-wrap sm:flex-no-wrap items-center justify-between pb-4">
          <TextField
            v-model="search"
            :placeholder="$t('placeholder.pageSearch')"
            class="w-full sm:w-64"
            content-class="input-transparent"
            input-class="placeholder-blue-500"
          >
            <template v-slot:prepend>
              <i class="zi-magnifier text-2xl text-gray-100"></i>
            </template>
          </TextField>
        </div>

        <div class="overflow-x-auto overflow-scroll-touch pb-8">
          <DataTable
            :headers="headers"
            :items="items"
            :search="search"
            table-width="100%"
            table-class="table-fixed"
            thead-class="text-gray-200 border-b border-gray-200"
          >
            <template v-slot:header.debt-content>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    ($→)
                  </span>
                </template>
                <span>
                  {{ $t('suppliers.suppliersDebt') }}
                </span>
              </v-tooltip>
            </template>
            <template v-slot:header.deals-content>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <i class="zi-bag text-lg align-middle mr-1" v-on="on" />
                </template>
                <span>
                  {{ $t('suppliers.currentDealsAmount') }}
                </span>
              </v-tooltip>
            </template>
            <template v-slot:header.factory-content>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <img class="inline mr-1" src="../assets/icons/factory.png" v-on="on">
                </template>
                <span>
                  {{ $t('suppliers.currentDealsAmount') }}
                </span>
              </v-tooltip>
            </template>

            <template v-slot:items="{ items }">
             <tr
              class="cursor-pointer"
              v-for="(item, index) in items"
              :key="index"
              @click="$router.push({
                name: 'supplier',
                params: {
                  supplierId: item.id
                }
              })"
            >
                <td></td>
                <td>{{ item.companyNameSl || item.companyNameCl }}</td>
                <td>{{ item.contactNumber || item.workPhone || '' }}</td>
                <td>{{ item.responsiblePerson || item.manager || '' }}</td>
                <td>{{ item.inn }}</td>
                <td>{{ item.deals }}</td>
                <td>
                  <img
                    src="../assets/icons/factory-green.png"
                    v-if="item.factory == 'GREEN'"
                  >
                </td>
                <td class="text-right pointer-events-none" @click.prevent.stop>
                  <div
                    class="cursor-pointer pointer-events-auto flex items-center"
                    @click="deleteSupplier(item.id)"
                  >
                    <i class="zi-delete text-2xl text-gray-200 hover:text-gray-100" />
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
            name: 'supplier-create'
          })"
        >
          <template v-slot:icon>
            <i class="zi-boxes text-gray-100 text-2xl" />
          </template>
          <span>{{ $t('suppliers.createSupplier') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mdiPlusCircleOutline, mdiMagnify } from '@mdi/js'

import { LIST_SUPPLIERS } from '@/graphql/queries'
import { DELETE_SUPPLIER } from '@/graphql/mutations'

import { confirmDialog } from '@/util/helpers'

export default {
  name: 'Suppliers',
  apollo: {
    listSuppliers: {
      query: LIST_SUPPLIERS,
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
        { text: '', value: 'debt', align: 'left', width: 60, sortable: true, tooltip: this.$t('suppliers.suppliersDebt') },
        { text: this.$t('suppliers.companyName'), value: 'supplierCompanyName', align: 'left', width: 220, minWidth: 220, sortable: true },
        { text: this.$t('suppliers.phone'), value: 'supplierPhone', align: 'left', width: 120, minWidth: 120, sortable: true },
        { text: this.$t('suppliers.contactPerson'), value: 'supplierContactPerson', align: 'left', width: 165, sortable: true },
        { text: this.$t('suppliers.inn'), value: 'inn', align: 'left', width: 120, minWidth: 120, sortable: true },
        { text: '', value: 'deals', width: 60, minWidth: 60, sortable: true, tooltip: this.$t('suppliers.currentDealsAmount') },
        { text: '', value: 'factory', width: 60, minWidth: 60, sortable: true, tooltip: this.$t('suppliers.currentDealsAmount') },
        { text: '', value: 'actions', align: 'right', width: 48 },
      ]
    },
    items () {
      const items = (this.listSuppliers && this.listSuppliers.items) || []
      return items.map(item => {
        return {
          ...item,
          // for search
          supplierCompanyName: item.companyNameSl || item.companyNameCl,
          supplierPhone: item.contactNumber || item.workPhone,
          supplierContactPerson: item.responsiblePerson || item.manager,
        }
      })
    },
  },
  methods: {
    async deleteSupplier (id) {
      try {
        const msg = this.$t('alert.removeSupplier')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        const response = await this.$apollo.mutate({
          mutation: DELETE_SUPPLIER,
          variables: { id },
          update: (store) => {
            const data = store.readQuery({
              query: LIST_SUPPLIERS,
              variables: {
                orgId: this.$route.params.orgId,
              },
            })
            const index = data.listSuppliers.items.findIndex(item => item.id === id)
            if (index !== -1) {
              data.listSuppliers.items.splice(index, 1)
            }
            store.writeQuery({
              query: LIST_SUPPLIERS,
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
        //   name: 'DeleteSupplierError',
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
