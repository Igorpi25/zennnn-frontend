<template>
  <div class="spec">
    <component
      ref="spec"
      v-if="roleInProject"
      :is="componentName"
      :loading="loading"
    />
  </div>
</template>

<script>
import deepmerge from 'deepmerge'

import Owner from '@/components/Spec/Owner.vue'
import Manager from '@/components/Spec/Manager.vue'
import Accountant from '@/components/Spec/Accountant.vue'
import Warehouseman from '@/components/Spec/Warehouseman.vue'
import Freelancer from '@/components/Spec/Freelancer.vue'

import { Role, Typename, Operation, emptyInvoice, emptyProduct } from '../graphql/enums' // eslint-disable-line
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
  SPEC_INVOICES_FRAGMENT,
  INVOICE_PRODUCTS_FRAGMENT,
  CLIENT_FRAGMENT,
} from '../graphql/typeDefs'
import {
  GET_SPEC,
  GET_ROLE_IN_PROJECT,
  LIST_ORG_REQUISITES,
} from '../graphql/queries'
import { SPEC_DELTA } from '../graphql/subscriptions'

export default {
  name: 'Spec',
  components: {
    Owner,
    Manager,
    Accountant,
    Warehouseman,
    Freelancer,
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
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
    return {
      role: null,
    }
  },
  computed: {
    loading () {
      return this.$apollo.queries.getSpec.loading
    },
    specId () {
      return this.$route.params.specId
    },
    componentName () {
      switch (this.roleInProject) {
        case Role.OWNER: return 'Owner'
        case Role.MANAGER: return 'Manager'
        case Role.ACCOUNTANT: return 'Accountant'
        case Role.WAREHOUSEMAN: return 'Warehouseman'
        case Role.FREELANCER: return 'Freelancer'
        default: return null
      }
    },
  },
  mounted () {
    const commentsMerge = (target, source) => {
      const destination = target.slice()
      source.forEach(s => {
        const index = target.findIndex(el => el.id === s.id)
        if (index === -1) {
          destination.push(s)
        } else {
          destination.splice(index, 1, Object.assign(target[index], s))
        }
      })
      return destination
    }

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
            fragmentName: 'InvoiceProductsFragment',
          })

          if (!parentInvoice.products.some(el => el.id === delta.payload.id)) {
            const products = parentInvoice.products
            const emptyId = `empty-${delta.parentId}`
            const emptyIndex = products.findIndex(el => el.id === emptyId)
            if (emptyIndex !== -1) {
              products.splice(emptyIndex, 1, delta.payload)
              products.push(Object.assign({}, emptyProduct, { id: emptyId }))
              parentInvoice.products = products
            } else {
              parentInvoice.products.push(delta.payload)
            }

            setTimeout(() => {
              apolloClient.writeFragment({
                id: `${Typename.INVOICE}:${delta.parentId}`,
                fragment: INVOICE_PRODUCTS_FRAGMENT,
                fragmentName: 'InvoiceProductsFragment',
                data: parentInvoice,
              })
            }, 75)
          }
        }

        if (operation === Operation.UPDATE_PRODUCT) {
          const mergeOptions = {
            customMerge: (key) => {
              if (key === 'name') {
                const merge = (_, source) => {
                  return source
                }
                return merge
              }
              if (key === 'comments') {
                return commentsMerge
              }
              if (key === 'images') {
                const merge = (_, source) => {
                  const images = source || []
                  return images.map(el => {
                    return {
                      ...el,
                      __typename: 'AttachFile',
                    }
                  })
                }
                return merge
              }
            },
          }
          const cacheData = apolloClient.readFragment({
            id: `${Typename.PRODUCT}:${delta.payload.id}`,
            fragment: PRODUCT_FRAGMENT,
            fragmentName: 'ProductFragment',
          })
          const data = deepmerge(cacheData, delta.payload.fields, mergeOptions)
          apolloClient.writeFragment({
            id: `${Typename.PRODUCT}:${delta.payload.id}`,
            fragment: PRODUCT_FRAGMENT,
            fragmentName: 'ProductFragment',
            data,
          })
        }

        if (operation === Operation.DELETE_PRODUCT) {
          const parentInvoice = apolloClient.readFragment({
            id: `${Typename.INVOICE}:${delta.parentId}`,
            fragment: INVOICE_PRODUCTS_FRAGMENT,
            fragmentName: 'InvoiceProductsFragment',
          })

          const index = parentInvoice.products.findIndex(p => p.id === delta.payload.id)

          if (index !== -1) {
            parentInvoice.products.splice(index, 1)
            apolloClient.writeFragment({
              id: `${Typename.INVOICE}:${delta.parentId}`,
              fragment: INVOICE_PRODUCTS_FRAGMENT,
              fragmentName: 'InvoiceProductsFragment',
              data: parentInvoice,
            })
          }
        }

        // INVOICE

        if (operation === Operation.INSERT_INVOICE) {
          const parentSpec = apolloClient.readFragment({
            id: `${Typename.SPEC}:${delta.parentId}`,
            fragment: SPEC_INVOICES_FRAGMENT,
            fragmentName: 'SpecInvoicesFragment',
          })

          if (!parentSpec.invoices.some(el => el.id === delta.payload.id)) {
            const invoices = parentSpec.invoices
            const emptyId = `empty-${delta.parentId}`
            const emptyIndex = invoices.findIndex(el => el.id === emptyId)
            if (emptyIndex !== -1) {
              if (parentSpec.invoices.length === 1) {
                this.$refs.spec.expanded = [delta.payload.id]
                this.$refs.spec.setExpandedInvoices([delta.payload.id])
              }
              const product = Object.assign({}, emptyProduct, { id: `empty-${delta.payload.id}` })
              const invoice = Object.assign({}, delta.payload, { products: [product] })
              invoices.splice(emptyIndex, 1, invoice)
              invoices.push(Object.assign({}, emptyInvoice, { id: emptyId, products: [product, product] }))
              parentSpec.invoices = invoices
            } else {
              parentSpec.invoices.push(delta.payload)
            }

            apolloClient.writeFragment({
              id: `${Typename.SPEC}:${delta.parentId}`,
              fragment: SPEC_INVOICES_FRAGMENT,
              fragmentName: 'SpecInvoicesFragment',
              data: parentSpec,
            })
          }
        }

        if (operation === Operation.UPDATE_INVOICE) {
          const cacheData = apolloClient.readFragment({
            id: `${Typename.INVOICE}:${delta.payload.id}`,
            fragment: INVOICE_FRAGMENT,
            fragmentName: 'InvoiceFragment',
          })
          const data = delta.payload.__typename === Typename.INVOICE
            ? Object.assign({}, cacheData, delta.payload)
            : Object.assign({}, cacheData, delta.payload.fields)
          apolloClient.writeFragment({
            id: `${Typename.INVOICE}:${delta.payload.id}`,
            fragment: INVOICE_FRAGMENT,
            fragmentName: 'InvoiceFragment',
            data,
          })
        }

        if (operation === Operation.DELETE_INVOICE) {
          const parentSpec = apolloClient.readFragment({
            id: `${Typename.SPEC}:${delta.parentId}`,
            fragment: SPEC_INVOICES_FRAGMENT,
            fragmentName: 'SpecInvoicesFragment',
          })

          const index = parentSpec.invoices.findIndex(p => p.id === delta.payload.id)

          if (index !== -1) {
            parentSpec.invoices.splice(index, 1)
            apolloClient.writeFragment({
              id: `${Typename.SPEC}:${delta.parentId}`,
              fragment: SPEC_INVOICES_FRAGMENT,
              fragmentName: 'SpecInvoicesFragment',
              data: parentSpec,
            })
          }
        }

        // SPEC

        if (operation === Operation.UPDATE_SPEC) {
          const mergeOptions = {
            customMerge: (key) => {
              if (key === 'comments') {
                return commentsMerge
              }
              if (key === 'containers') {
                const merge = (_, source) => {
                  return source || []
                }
                return merge
              }
            },
          }
          const cacheData = apolloClient.readFragment({
            id: `${Typename.SPEC}:${delta.payload.id}`,
            fragment: SPEC_FRAGMENT,
            fragmentName: 'SpecFragment',
          })
          const data = delta.payload.__typename === Typename.SPEC
            ? deepmerge(cacheData, delta.payload, mergeOptions)
            : deepmerge(cacheData, delta.payload.fields, mergeOptions)
          apolloClient.writeFragment({
            id: `${Typename.SPEC}:${delta.payload.id}`,
            fragment: SPEC_FRAGMENT,
            fragmentName: 'SpecFragment',
            data,
          })
        }

        // CLIENT

        if (operation === Operation.UPDATE_CLIENT) {
          const cacheData = apolloClient.readFragment({
            id: `${Typename.CLIENT}:${delta.payload.id}`,
            fragment: CLIENT_FRAGMENT,
            fragmentName: 'ClientFragment',
          })
          const data = deepmerge(cacheData, delta.payload)
          apolloClient.writeFragment({
            id: `${Typename.CLIENT}:${delta.payload.id}`,
            fragment: CLIENT_FRAGMENT,
            fragmentName: 'ClientFragment',
            data,
          })
        }

        // REQUISITE

        if (operation === Operation.SET_REQUISITES || Operation.UPDATE_REQUISITES) {
          let listOrgRequisites = null
          try {
            const data = apolloClient.readQuery({
              query: LIST_ORG_REQUISITES,
              variables: {
                orgId: this.$route.params.orgId,
              },
            })
            listOrgRequisites = data.listOrgRequisites
          } catch (error) {} // eslint-disable-line
          if (listOrgRequisites) {
            const items = delta.payload.items || []
            let cacheItems = listOrgRequisites
            if (operation === Operation.SET_REQUISITES) {
              cacheItems = items
            }
            if (operation === Operation.UPDATE_REQUISITES) {
              items.forEach(item => {
                const index = cacheItems.findIndex(el => el.id === item.id)
                if (index === -1) {
                  cacheItems.push(item)
                } else {
                  cacheItems.splice(index, 1, item)
                }
              })
            }
            const data = {
              listOrgRequisites: cacheItems,
            }
            apolloClient.writeQuery({
              query: LIST_ORG_REQUISITES,
              variables: {
                orgId: this.$route.params.orgId,
              },
              data,
            })
          }
        }
      },
      error: (error) => {
        this.$logger.warn('Error: ', error)
      },
    })
  },
}
</script>
