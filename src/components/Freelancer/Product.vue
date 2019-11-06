<template>
  <div style="padding-bottom: 8px">
    Продукт: 
    <div>
      <div>
        <input
          v-model="content.name"
          type="text"
          size="20"
          @change="e => updateProduct({ name: e.target.value })"
        > стоимость:
        <input
          v-model="content.count"
          type="text"
          size="5"
          @change="e => updateProduct({ count: Number(e.target.value) })"
        > *
        <input
          v-model="content.price"
          type="text"
          size="5"
          @change="e => updateProduct({ price: Number(e.target.value) })"
        > = {{ content.amount }}
        <button
          :disabled="deleteLoading"
          @click="deleteProduct"
        >x</button>
        <div class="spinner">
          <div v-if="updateLoading" class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'Product',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      updateLoading: false,
      deleteLoading: false
    }
  },
  methods: {
    async updateProduct (productInput) {
      try {
        this.updateLoading = true
        // Call to the graphql mutation
        await this.$apollo.mutate({
          // Query
          mutation: gql`
            mutation updateProduct($productId: ID!, $productInput: ProductInput!) {
              updateProduct(productId: $productId, productInput: $productInput) {
                id
                name
                price
                count
                amount
              }
            }
          `,
          // Parameters
          variables: {
            productId: this.content.id,
            productInput
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async deleteProduct () {
      try {
        this.deleteLoading = true
        // Call to the graphql mutation
        await this.$apollo.mutate({
          // Query
          mutation: gql`
            mutation deleteProduct(
              $productId: ID!
            ) {
              deleteProduct(
                productId: $productId
              )
            }
          `,
          // Parameters
          variables: {
            productId: this.content.id,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.deleteLoading = false
      }
    },
  },
}
</script>
