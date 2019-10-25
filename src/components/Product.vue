<template>
  <div>
    Продукт: <input type="text" size="20"  v-model="content.name" @change="onChanged"> стоимость:
    <input type="text" size="5" v-model="content.count" @change="onChanged"> x
    <input type="text" size="5"  v-model="content.price" @change="onChanged"> = {{content.amount}}
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
  methods: {
    onChanged() {

      // Call to the graphql mutation
      this.$apollo.mutate({
        // Query
        mutation:
        gql`
          mutation updateProduct (
            $productId:ID!,
            $name: String!,
            $price: Float!,
            $count: Int!
          ){
            updateProduct (
              productId: $productId,
              product: {
                name: $name,
                price: $price,
                count: $count
              }
            ){
              id
              name
              price
              count
              amount
            }
          }
        `,
        // gql`
        //   mutation {
        //     updateProduct(
        //       productId: "5db1650ab8ffc416059356cb",
        //       product:{
        //         name: "UAZ-Tentohero",
        //   			price: 70,
        //         count:1
        //       }
        //     ){
        //       id
        //       name
        //       price
        //       count
        //       amount
        //     }
        //   }
        // `,
        // Parameters
        variables: {
          productId: this.content.id,
          name: this.content.name,
          price: this.content.price,
          count: this.content.count,
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
