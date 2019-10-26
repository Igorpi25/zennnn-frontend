<template>
  <div>
    Продукт: <input type="text" size="20"  v-model="content.name" @change="onChanged"> стоимость:
    <input type="text" size="5" v-model="content.count" @change="onChanged"> x
    <input type="text" size="5"  v-model="content.price" @change="onChanged"> = {{content.amount}}
    <button v-on:click="onDelete">x</button>
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
      deleteLoading: false
    }
  },
  methods: {
    onChanged() {
      // Call to the graphql mutation
      this.$apollo.mutate({
        // Query
        mutation:
        gql`
          mutation updateProduct (
            $productId:ID!,
            $product: ProductInput!
          ){
            updateProduct (
              productId: $productId,
              product: $product
            ){
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
          product: {
            name: this.content.name,
            count: Number.parseInt(this.content.count, 10),
            price: Number(this.content.price),
          }
        },
      }).then((data) => {
        // Result
        //eslint-disable-next-line
        console.log(data)
      }).catch((error) => {
        // Error
        //eslint-disable-next-line
        console.error(error)
      })
    },
    onDelete() {

      // Call to the graphql mutation
      this.$apollo.mutate({
        // Query
        mutation:
        gql`
          mutation deleteProduct (
            $productId:ID!
          ){
            deleteProduct (
              productId: $productId
            )
          }
        `,
        // Parameters
        variables: {
          productId: this.content.id,
        },
      }).then((data) => {
        // Result
        //eslint-disable-next-line
        console.log(data)
      }).catch((error) => {
        // Error
        //eslint-disable-next-line
        console.error(error)
      })
    },
  },
}
</script>
