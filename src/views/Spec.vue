<template>
  <div>
    <div style="font-size: 12px; color: grey; text-align: left;">
      <router-link
        :to="{
          name: 'home'
        }"
      >
        Спецификации
      </router-link> / {{ spec.id }}
    </div>
    <h1>
      Спецификация:
      <span v-if="$apollo.queries.getSpec.loading">
        Загрузка...
      </span>
      <span
        v-show="!$apollo.queries.getSpec.loading"
        ref="name"
        :contenteditable="!updateLoading"
        placeholder="----"
        @keydown.enter.stop.prevent="e => updateSpec({ name: e.target.textContent || e.target.innerText })"
        @blur="onBlur"
      />
      <div v-if="updateLoading" class="spinner">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </h1>
    Estimate Shipping date: 
    <input
      v-model="spec.estimateShippingDate"
      type="text"
      size="20"
      @change="e => updateSpec({ estimateShippingDate: e.target.value })"
    >
    <Invoice
      v-for="(item, index) in spec.invoices"
      :key="index"
      :content="item"
    />
    <br>
    <template v-if="!$apollo.queries.getSpec.loading">
      <button
        :disabled="createLoading"
        @click="createInvoice"
      >
        Создать накладную
      </button>
      <div>
        Итого: {{ spec.totalPrice }}
      </div>
    </template>

  </div>
</template>

<script>
import gql from 'graphql-tag'
import Invoice from '@/components/Invoice.vue'

const TYPENAME = {
  SPEC: 'Spec',
  INVOICE: 'Invoice',
  PRODUCT: 'Product'
}

const OPERATION = {
  INSERT_PRODUCT: 'INSERT_PRODUCT',
  INSERT_INVOICE: 'INSERT_INVOICE',
  INSERT_SPEC: 'INSERT_SPEC',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  UPDATE_INVOICE_WITH_PRODUCTS: 'UPDATE_INVOICE_WITH_PRODUCTS',
  UPDATE_SPEC: 'UPDATE_SPEC',
  UPDATE_SPEC_WITH_INVOICES: 'UPDATE_SPEC_WITH_INVOICES',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  DELETE_INVOICE: 'DELETE_INVOICE',
  DELETE_SPEC: 'DELETE_SPEC'
}

const GET_SPEC = gql`
  query GetSpec ($specId: ID!) {
    getSpec (specId: $specId) {
      id
      name
      invoices {
        id
        name
        products {
          id
          name
          count
          price
          amount
          net
          gross
        }
        totalPrice
        purchaseDate
      }
      totalPrice
      estimateShippingDate
    }
  }
`

const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    name
    count
    price
    amount
    net
    gross
  }
`

const INVOICE_PRODUCTS_FRAGMENT = gql`
  fragment InvoiceProductsFragment on Invoice {
    id
    products {
      id
      name
      count
      price
      amount
      net
      gross
    }
  }
`

const INVOICE_FRAGMENT = gql`
  fragment InvoiceFragment on Invoice {
    id
    name
    totalPrice
    purchaseDate
  }
`

const SPEC_INVOICES_FRAGMENT = gql`
  fragment SpecInvoicesFragment on Spec {
    id
    invoices {
      id
      name
      products {
        id
        name
        count
        price
        amount
        net
        gross
      }
      totalPrice
      purchaseDate
    }
  }
`

const SPEC_FRAGMENT = gql`
  fragment SpecFragment on Spec {
    id
    name
    totalPrice
    estimateShippingDate
  }
`

export default {
  name: 'Spec',
  components: {
    Invoice,
  },
  data () {
    return {
      createLoading: false,
      updateLoading: false,
    }
  },
  computed: {
    spec () {
      return this.getSpec || {}
    }
  },
  watch: {
    'spec.name' (val) {
      this.$refs.name.innerText = val || ''
    }
  },
  apollo: {
    getSpec: {
      query: GET_SPEC,
      variables () {
        return {
          specId: this.$route.params.specId
        }
      }
    }
  },
  mounted () {

    this.$refs.name.innerText = this.spec.name || ''

    const subQuery = gql`
      subscription SpecDelta ($specId: ID!) {
        specDelta (specId: $specId) {
          operation
          parentId
          payload {
            __typename
            ... on Product {
              id
              name
              price
              count
              amount
              net
              gross
            }
            ... on Invoice {
              id
              name
              products {
                id
                name
                price
                count
                amount
                net
                gross
              }
              totalPrice
              purchaseDate
            }
            ... on Spec {
              id
              name
              invoices {
                id
                name
                products {
                  id
                  name
                  price
                  count
                  amount
                  net
                  gross
                }
                totalPrice
                purchaseDate
              }
              totalPrice
              estimateShippingDate
            }
          }
        }
      }
    `

    const observer = this.$apollo.subscribe({
      query: subQuery,
      variables: {
        specId: this.$route.params.specId
      },
      fetchPolicy: 'no-cache'
    })

    const apolloClient = this.$apollo.provider.defaultClient

    observer.subscribe({
      next ({ data }) {
        const delta = data.specDelta
        const operation = delta.operation
        const typename = delta.payload.__typename

        console.log(`[${typename}]: ${JSON.stringify(data)}`)

        // PRODUCT

        if (operation === OPERATION.INSERT_PRODUCT) {
          const parentInvoice = apolloClient.readFragment({
            id: `${TYPENAME.INVOICE}:${delta.parentId}`,
            fragment: INVOICE_PRODUCTS_FRAGMENT
          })

          if (!parentInvoice.products.some(el => el.id === delta.payload.id)) {
            parentInvoice.products.push(delta.payload)

            apolloClient.writeFragment({
              id: `${TYPENAME.INVOICE}:${delta.parentId}`,
              fragment: INVOICE_PRODUCTS_FRAGMENT,
              data: parentInvoice,
            })
          }
        }

        if (operation === OPERATION.UPDATE_PRODUCT) {
          apolloClient.writeFragment({
            id: `${TYPENAME.PRODUCT}:${delta.payload.id}`,
            fragment: PRODUCT_FRAGMENT,
            data: delta.payload,
          })
        }

        if (operation === OPERATION.DELETE_PRODUCT) {
          let parentInvoice = apolloClient.readFragment({
            id: `${TYPENAME.INVOICE}:${delta.parentId}`,
            fragment: INVOICE_PRODUCTS_FRAGMENT
          })

          const index = parentInvoice.products.findIndex(p => p.id === delta.payload.id)

          if (index !== -1) {
            parentInvoice.products.splice(index, 1)
            apolloClient.writeFragment({
              id: `${TYPENAME.INVOICE}:${delta.parentId}`,
              fragment: INVOICE_PRODUCTS_FRAGMENT,
              data: parentInvoice,
            })
          }
        }

        // INVOICE

        if (operation === OPERATION.INSERT_INVOICE) {
          const parentSpec = apolloClient.readFragment({
            id: `${TYPENAME.SPEC}:${delta.parentId}`,
            fragment: SPEC_INVOICES_FRAGMENT
          })

          if (!parentSpec.invoices.some(el => el.id === delta.payload.id)) {
            parentSpec.invoices.push(delta.payload)

            apolloClient.writeFragment({
              id: `${TYPENAME.SPEC}:${delta.parentId}`,
              fragment: SPEC_INVOICES_FRAGMENT,
              data: parentSpec,
            })
          }
        }

        if (operation === OPERATION.UPDATE_INVOICE) {
          apolloClient.writeFragment({
            id: `${TYPENAME.INVOICE}:${delta.payload.id}`,
            fragment: INVOICE_FRAGMENT,
            data: delta.payload
          })
        }

        if (operation === OPERATION.DELETE_INVOICE) {
          let parentSpec = apolloClient.readFragment({
            id: `${TYPENAME.SPEC}:${delta.parentId}`,
            fragment: SPEC_INVOICES_FRAGMENT
          })

          const index = parentSpec.invoices.findIndex(p => p.id === delta.payload.id)

          if (index !== -1) {
            parentSpec.invoices.splice(index, 1)
            apolloClient.writeFragment({
              id: `${TYPENAME.SPEC}:${delta.parentId}`,
              fragment: SPEC_INVOICES_FRAGMENT,
              data: parentSpec,
            })
          }
        }

        // SPEC

        if (operation === OPERATION.UPDATE_SPEC) {
          apolloClient.writeFragment({
            id: `${TYPENAME.SPEC}:${delta.payload.id}`,
            fragment: SPEC_FRAGMENT,
            data: delta.payload
          })
        }

      },
      error (error) {
        console.error(error)
      },
    })

  },
  methods: {
    onBlur () {
      this.$refs.name.innerText = this.spec.name || ''
    },
    async createInvoice () {
      try {
        this.createLoading = true
        await this.$apollo.mutate({
          mutation: gql`
            mutation CreateInvoice($specId: ID!) {
              createInvoice(specId: $specId) {
                id
                totalPrice
                products {
                  id
                }
              }
            }
          `,
          variables: {
            specId: this.spec.id,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async updateSpec (specInput) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: gql`
            mutation UpdateSpec($specId: ID!, $specInput: SpecInput!) {
              updateSpec(specId: $specId, specInput: $specInput) {
                id
                name
              }
            }
          `,
          variables: {
            specId: this.spec.id,
            specInput
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
