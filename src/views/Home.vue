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

const GET_SPECS = gql`
  query GetSpecs {
    getSpecs {
      id
      name
      totalPrice
      estimateShippingDate
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

    const subQuery = gql`
      subscription delta {
        delta {
          operation
          parentId
          payload {
            __typename
            ... on Spec {
              id
              name
              totalPrice
              estimateShippingDate
            }
          }
        }
      }
    `

    const observer = this.$apollo.subscribe({
      query: subQuery,
      fetchPolicy: 'no-cache'
    })

    const apolloClient = this.$apollo.provider.defaultClient

    observer.subscribe({
      next ({ data }) {
        const operation = data.delta.operation
        const typename = data.delta.payload.__typename

        console.log(`[${typename}]: ${JSON.stringify(data)}`)

        if (operation === OPERATION.INSERT_SPEC) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS
          })

          if (!getSpecs.some(el => el.id === data.delta.payload.id)) {
            getSpecs.push(data.delta.payload)

            apolloClient.writeQuery({
              query: GET_SPECS,
              data: {
                getSpecs
              }
            })
          }
        }

        if (operation === OPERATION.UPDATE_SPEC) {
          apolloClient.writeFragment({
            id: `${TYPENAME.SPEC}:${data.delta.payload.id}`,
            fragment: SPEC_FRAGMENT,
            data: data.delta.payload
          })
        }

        if (operation === OPERATION.DELETE_SPEC) {
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
