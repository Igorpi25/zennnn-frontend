<template>
  <div>
    <component
      v-if="roleInProject"
      :is="componentName"
    />
  </div>
</template>

<script>
import OwnerSpec from '@/components/Owner/Spec.vue'
import ManagerSpec from '@/components/Manager/Spec.vue'
import AccauntantSpec from '@/components/Accauntant/Spec.vue'
import WarehousemanSpec from '@/components/Warehouseman/Spec.vue'
import FreelancerSpec from '@/components/Freelancer/Spec.vue'

import { Role, Typename, Operation } from '../graphql/enums'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
  SPEC_INVOICES_FRAGMENT,
  INVOICE_PRODUCTS_FRAGMENT,
} from '../graphql/typeDefs'
import {
  GET_SPEC,
  GET_ROLE_IN_PROJECT,
} from '../graphql/queries'
import { SPEC_DELTA } from '../graphql/subscriptions'

export default {
  name: 'Spec',
  components: {
    OwnerSpec,
    ManagerSpec,
    AccauntantSpec,
    WarehousemanSpec,
    FreelancerSpec,
  },
  apollo: {
    roleInProject: {
      query: GET_ROLE_IN_PROJECT,
      variables () {
        return {
          specId: this.specId,
        }
      },
      fetchPolicy: 'cache-only',
    },
    getSpec: {
      query: GET_SPEC,
      variables () {
        return {
          id: this.specId,
        }
      },
    },
  },
  data () {
    return {
      role: null,
    }
  },
  computed: {
    specId () {
      return this.$route.params.specId
    },
    componentName () {
      switch (this.roleInProject) {
        case Role.OWNER: return 'OwnerSpec'
        case Role.MANAGER: return 'ManagerSpec'
        case Role.ACCAUNTANT: return 'AccauntantSpec'
        case Role.WAREHOUSEMAN: return 'WarehousemanSpec'
        case Role.FREELANCER: return 'FreelancerSpec'
        default: return null
      }
    },
  },
  mounted () {
    const observer = this.$apollo.subscribe({
      query: SPEC_DELTA,
      variables: {
        specId: this.specId,
      },
      fetchPolicy: 'no-cache',
    })

    const apolloClient = this.$apollo.provider.defaultClient

    observer.subscribe({
      next: ({ data }) => {
        const delta = data.specDelta
        const operation = delta.operation
        const typename = delta.payload.__typename

        this.$logger.info(`[${typename}]: ${JSON.stringify(data)}`)

        // PRODUCT

        if (operation === Operation.INSERT_PRODUCT) {
          const parentInvoice = apolloClient.readFragment({
            id: `${Typename.INVOICE}:${delta.parentId}`,
            fragment: INVOICE_PRODUCTS_FRAGMENT,
          })

          if (!parentInvoice.products.some(el => el.id === delta.payload.id)) {
            parentInvoice.products.push(delta.payload)

            apolloClient.writeFragment({
              id: `${Typename.INVOICE}:${delta.parentId}`,
              fragment: INVOICE_PRODUCTS_FRAGMENT,
              data: parentInvoice,
            })
          }
        }

        if (operation === Operation.UPDATE_PRODUCT) {
          apolloClient.writeFragment({
            id: `${Typename.PRODUCT}:${delta.payload.id}`,
            fragment: PRODUCT_FRAGMENT,
            data: delta.payload,
          })
        }

        if (operation === Operation.DELETE_PRODUCT) {
          let parentInvoice = apolloClient.readFragment({
            id: `${Typename.INVOICE}:${delta.parentId}`,
            fragment: INVOICE_PRODUCTS_FRAGMENT,
          })

          const index = parentInvoice.products.findIndex(p => p.id === delta.payload.id)

          if (index !== -1) {
            parentInvoice.products.splice(index, 1)
            apolloClient.writeFragment({
              id: `${Typename.INVOICE}:${delta.parentId}`,
              fragment: INVOICE_PRODUCTS_FRAGMENT,
              data: parentInvoice,
            })
          }
        }

        // INVOICE

        if (operation === Operation.INSERT_INVOICE) {
          const parentSpec = apolloClient.readFragment({
            id: `${Typename.SPEC}:${delta.parentId}`,
            fragment: SPEC_INVOICES_FRAGMENT,
          })

          if (!parentSpec.invoices.some(el => el.id === delta.payload.id)) {
            parentSpec.invoices.push(delta.payload)

            apolloClient.writeFragment({
              id: `${Typename.SPEC}:${delta.parentId}`,
              fragment: SPEC_INVOICES_FRAGMENT,
              data: parentSpec,
            })
          }
        }

        if (operation === Operation.UPDATE_INVOICE) {
          apolloClient.writeFragment({
            id: `${Typename.INVOICE}:${delta.payload.id}`,
            fragment: INVOICE_FRAGMENT,
            data: delta.payload,
          })
        }

        if (operation === Operation.DELETE_INVOICE) {
          let parentSpec = apolloClient.readFragment({
            id: `${Typename.SPEC}:${delta.parentId}`,
            fragment: SPEC_INVOICES_FRAGMENT,
          })

          const index = parentSpec.invoices.findIndex(p => p.id === delta.payload.id)

          if (index !== -1) {
            parentSpec.invoices.splice(index, 1)
            apolloClient.writeFragment({
              id: `${Typename.SPEC}:${delta.parentId}`,
              fragment: SPEC_INVOICES_FRAGMENT,
              data: parentSpec,
            })
          }
        }

        // SPEC

        if (operation === Operation.UPDATE_SPEC) {
          apolloClient.writeFragment({
            id: `${Typename.SPEC}:${delta.payload.id}`,
            fragment: SPEC_FRAGMENT,
            data: delta.payload,
          })
        }
      },
      error: (error) => {
        this.$logger.warn('Error: ', error)
      },
    })
  },
}
</script>
