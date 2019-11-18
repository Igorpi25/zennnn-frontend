<template>
  <div>
    <h3>Накладная:
      <span>
        {{ content.name }}
      </span>
      <div v-if="updateLoading" class="spinner">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </h3>
    <Product
      v-for="(item, index) in content.products"
      :key="index"
      :content="item"
    />
    <div>
      Purchase date:
      <input
        v-model="content.purchaseDate"
        type="text"
        size="20"
        @change="e => updateInvoice({ purchaseDate: e.target.value })"
      >
      Сумма: {{ content.totalPrice }}
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Product from './Product.vue'

export default {
  name: 'Invoice',
  components: {
    Product
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      createLoading: false,
      updateLoading: false
    }
  },
  methods: {
    async createProduct () {
      try {
        this.createLoading = true
        await this.$apollo.mutate({
          mutation: gql`
            mutation CreateProduct($invoiceId: ID!) {
              createProduct(invoiceId: $invoiceId) {
                id
              }
            }
          `,
          variables: {
            invoiceId: this.content.id
          }
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async updateInvoice (invoiceInput) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: gql`
            mutation UpdateInvoice($invoiceId: ID!, $invoiceInput: InvoiceInput!) {
              updateInvoice(invoiceId: $invoiceId, invoiceInput: $invoiceInput) {
                id
                name
              }
            }
          `,
          variables: {
            invoiceId: this.content.id,
            invoiceInput
          }
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
