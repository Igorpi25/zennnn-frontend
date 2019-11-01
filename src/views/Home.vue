<template>
  <div>
    <div style="font-size: 12px; color: grey; text-align: left;">
      Спецификации
    </div>
    <h1>Спецификации:</h1>
    <div v-if="$apollo.queries.getSpecs.loading">
      Загрузка...
    </div>
    <div v-else>
      <table style="margin-left: auto; margin-right: auto;">
        <thead>
          <th>
            id
          </th>
          <th>
            name
          </th>
        </thead>
        <tbody>
          <tr
            v-for="spec in specs"
            :key="spec.id"
          >
            <td>
              <router-link
                :to="{
                  name: 'spec',
                  params: {
                    specId: spec.id
                  }
                }"
              >
                {{ spec.id }}
              </router-link>
            </td>
            <td>
              {{ spec.name }}
            </td>
            <td width="48px">
              <button
                :disabled="deleteLoading === spec.id"
                @click="deleteSpec(spec.id)"
              >x</button>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <button
        :disabled="createLoading"
        @click="createSpec"
      >
        Создать
      </button>
    </div>
    <br>
  </div>
</template>

<script>
import gql from 'graphql-tag'

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

const GET_SPECS = gql`
  query GetSpecs {
    getSpecs {
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
    }
  }
`

export default {
  name: 'Spec',
  data () {
    return {
      createLoading: false,
      deleteLoading: null,
    }
  },
  computed: {
    specs () {
      return this.getSpecs || []
    }
  },
  apollo: {
    getSpecs: GET_SPECS
  },
  mounted () {

    const token = localStorage.getItem('token')

    const subQuery = gql`
      subscription delta($token: ID!) {
        delta (token: $token) {
          operation
          parentId
          payload {
            __typename
            ... on SpecWithInvoices {
              id
              name
              totalPrice
              invoices {
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
      query: subQuery,
      variables: {
        token
      }
    })

    const apolloClient = this.$apollo.provider.defaultClient

    observer.subscribe({
      next ({ data }) {
        const operation = data.delta.operation
        const typename = data.delta.payload.__typename

        console.log(`[${typename}]: ${JSON.stringify(data)}`)

        if (operation === OPERATION.INSERT && typename === TYPENAME.SPEC_WITH_INVOICES) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS
          })

          if (!getSpecs.some(el => el.id === data.delta.payload.id)) {
            // SpecWithInvoices type to Spec
            const newSpec = {
              ...data.delta.payload,
              __typename: TYPENAME.SPEC
            }
            getSpecs.push(newSpec)

            apolloClient.writeQuery({
              query: GET_SPECS,
              data: {
                getSpecs
              }
            })
          }
        }

        if (operation === OPERATION.DELETE && typename === TYPENAME.SPEC) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS
          })

          const index = getSpecs.findIndex(el => el.id === data.delta.payload.id)

          if (index !== -1) {
            getSpecs.splice(index, 1)
            apolloClient.writeQuery({
              query: GET_SPECS,
              data: {
                getSpecs
              }
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
    async createSpec () {
      try {
        this.createLoading = true
        await this.$apollo.mutate({
          mutation: gql`
            mutation CreateSpec {
              createSpec {
                id
                invoices {
                  id
                  products {
                    id
                  }
                }
              }
            }
          `
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async deleteSpec (specId) {
      try {
        this.deleteLoading = specId
        await this.$apollo.mutate({
          mutation: gql`
            mutation DeleteSpec($specId: ID!) {
              deleteSpec(specId: $specId)
            }
          `,
          variables: {
            specId
          }
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.deleteLoading = null
      }
    }
  },
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
