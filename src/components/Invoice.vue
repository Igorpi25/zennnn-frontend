<template>
  <div>
    <h3>Накладная: 
      <span
        ref="name"
        :contenteditable="!updateLoading"
        placeholder="----"
        @keydown.enter.stop.prevent="updateInvoice"
        @blur="updateInvoice"
      />
      <div v-if="updateLoading" class="spinner">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </h3>
    <Product
      v-for="(item, index) in content.products"
      :key="index"
      :content="item"
    />
    <button
      :disabled="createLoading"
      @click="createProduct"
    >
      Добавить
    </button>
    <div>
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
    Product,
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
      updateLoading: false,
    }
  },
  watch: {
    'content.name' (val) {
      this.$refs.name.innerText = val
    }
  },
  mounted () {
    this.$refs.name.innerText = this.content.name
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
            invoiceId: this.content.id,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async updateInvoice (e) {
      try {
        this.updateLoading = true
        const value = e.target.textContent || e.target.innerText
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
            invoiceInput: {
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
