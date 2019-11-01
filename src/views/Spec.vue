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
        v-else
        ref="name"
        :contenteditable="!updateLoading"
        placeholder="----"
        @keydown.enter.stop.prevent="updateSpec"
        @blur="updateSpec"
      >
        {{ spec.name }}
      </span>
      <div v-if="updateLoading" class="spinner">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </h1>
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

const OPERATION = {
  INSERT: 'Insert',
  UPDATE: 'Update',
  DELETE: 'Delete'
}

const TYPENAME = {
  PRODUCT: 'Product',
  INVOICE: 'Invoice',
  INVOICE_WITH_PRODUCTS: 'InvoiceWithProducts',
  SPEC: 'Spec',
  SPEC_WITH_INVOICES: 'SpecWithInvoices'
}

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
      query: gql`
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
              }
              totalPrice
            }
            totalPrice
          }
        }
      `,
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
      subscription delta {
        delta {
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
            }
            ... on Invoice {
              id
              name
              totalPrice
            }
            ... on InvoiceWithProducts {
              id
              name
              totalPrice
              products {
                id
                name
                price
                count
                amount
              }
            }
            ... on Spec {
              id
              name
              totalPrice
            }
          }
        }
      }
    `

    const observer = this.$apollo.subscribe({
      query: subQuery
    })

    const apolloClient = this.$apollo.provider.defaultClient

    observer.subscribe({
      next ({ data }) {
        const operation = data.delta.operation
        const typename = data.delta.payload.__typename

        console.log(`[${typename}]: ${JSON.stringify(data)}`)

        // PRODUCT

        if (operation === OPERATION.INSERT && typename === TYPENAME.PRODUCT) {
          const parentInvoice = apolloClient.readFragment({
            id: `${TYPENAME.INVOICE}:${data.delta.parentId}`,
            fragment: gql`
              fragment CreateProductInvoiceReadFragment on Invoice {
                id
                name
                totalPrice
                products {
                  id
                  name
                  count
                  price
                  amount
                }
              }
            `
          })

          if (!parentInvoice.products.some(el => el.id === data.delta.payload.id)) {
            parentInvoice.products.push(data.delta.payload)

            apolloClient.writeFragment({
              id: `${TYPENAME.INVOICE}:${data.delta.parentId}`,
              fragment: gql`
                fragment CreateProductInvoiceWriteFragment on Invoice {
                  id
                  name
                  totalPrice
                  products {
                    id
                    name
                    count
                    price
                    amount
                  }
                }
              `,
              data: parentInvoice,
            })
          }
        }

        if (operation === OPERATION.DELETE && typename === TYPENAME.PRODUCT) {
          let parentInvoice = apolloClient.readFragment({
            id: `${TYPENAME.INVOICE}:${data.delta.parentId}`,
            fragment: gql`
              fragment DeleteProductInvoiceReadFragment on Invoice {
                id
                name
                totalPrice
                products {
                  id
                  name
                  count
                  price
                  amount
                }
              }
            `
          })

          const index = parentInvoice.products.findIndex(p => p.id === data.delta.payload.id)

          if (index !== -1) {
            parentInvoice.products.splice(index, 1)
            apolloClient.writeFragment({
              id: `${TYPENAME.INVOICE}:${data.delta.parentId}`,
              fragment: gql`
                fragment DeleteProductInvoiceWriteFragment on Invoice {
                  id
                  name
                  totalPrice
                  products {
                    id
                    name
                    count
                    price
                    amount
                  }
                }
              `,
              data: parentInvoice,
            })
          }
        }

        // INVOICE

        if (operation === OPERATION.INSERT && typename === TYPENAME.INVOICE_WITH_PRODUCTS) {
          const parentSpec = apolloClient.readFragment({
            id: `${TYPENAME.SPEC}:${data.delta.parentId}`,
            fragment: gql`
              fragment CreateInvoiceSpecReadFragment on Spec {
                id
                invoices {
                  id
                  name
                  totalPrice
                  products {
                    id
                    name
                    count
                    price
                    amount
                  }
                }
              }
            `
          })

          if (!parentSpec.invoices.some(el => el.id === data.delta.payload.id)) {
            // InvoiceWithProducts type to Invoice
            const newInvoice = {
              ...data.delta.payload,
              __typename: TYPENAME.INVOICE
            }
            parentSpec.invoices.push(newInvoice)

            apolloClient.writeFragment({
              id: `${TYPENAME.SPEC}:${data.delta.parentId}`,
              fragment: gql`
                fragment CreateInvoiceSpecWriteFragment on Spec {
                  id
                  invoices {
                    id
                    name
                    totalPrice
                    products {
                      id
                      name
                      count
                      price
                      amount
                    }
                  }
                }
              `,
              data: parentSpec,
            })
          }
        }

        if (operation === OPERATION.DELETE && typename === TYPENAME.INVOICE) {
          let parentSpec = apolloClient.readFragment({
            id: `${TYPENAME.SPEC}:${data.delta.parentId}`,
            fragment: gql`
              fragment DeleteInvoiceSpecReadFragment on Spec {
                id
                invoices {
                  id
                  name
                  totalPrice
                  products {
                    id
                    name
                    count
                    price
                    amount
                  }
                }
              }
            `
          })

          const index = parentSpec.invoices.findIndex(p => p.id === data.delta.payload.id)

          if (index !== -1) {
            parentSpec.invoices.splice(index, 1)
            apolloClient.writeFragment({
              id: `${TYPENAME.SPEC}:${data.delta.parentId}`,
              fragment: gql`
                fragment DeleteInvoiceSpecWriteFragment on Spec {
                  id
                  invoices {
                    id
                    name
                    totalPrice
                    products {
                      id
                      name
                      count
                      price
                      amount
                    }
                  }
                }
              `,
              data: parentSpec,
            })
          }
        }
      },
      error (error) {
        console.error(error)
      },
    })

  },
  methods: {
    async createInvoice () {
      try {
        this.createLoading = true
        await this.$apollo.mutate({
          mutation: gql`
            mutation CreateInvoice($specId: ID!) {
              createInvoice(specId: $specId) {
                id
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
    async updateSpec (e) {
      try {
        this.updateLoading = true
        const value = e.target.textContent || e.target.innerText
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
            specInput: {
              name: value
            }
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
