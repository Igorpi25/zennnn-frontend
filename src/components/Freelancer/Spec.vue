<template>
  <div>
    <h1>
      Спецификация:
      <span>
        {{ spec.name }}
      </span>
      <div v-if="updateLoading" class="spinner">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </h1>
    Estimate Shipping date: {{ spec.estimateShippingDate }}
    <Invoice
      v-for="(item, index) in spec.invoices"
      :key="index"
      :content="item"
    />
    <br>
    <template v-if="!$apollo.queries.getSpec.loading">
      <div>
        Итого: {{ spec.totalPrice }}
      </div>
    </template>

  </div>
</template>

<script>
import gql from 'graphql-tag'
import Invoice from './Invoice.vue'

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
  apollo: {
    getSpec: {
      query: GET_SPEC,
      variables () {
        return {
          specId: this.$route.params.specId
        }
      },
      fetchPolicy: 'cache-only'
    }
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
