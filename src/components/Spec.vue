<template>
  <div>
    <h1>Спецификация: {{spec.name}}</h1>
    <br>
    <Invoice
      v-for="(item, index) in spec.invoices"
      :key="index"
      :content="item" />

  </div>
</template>

<script>
import gql from 'graphql-tag'
import Invoice from './Invoice.vue'

export default {
  name: 'Spec',
  components: {
    Invoice,
  },
  data(){
    return {
      spec: {name:"Загрузка...", invoices: []}
    }
  },
  apollo: {
    spec: gql `
      {
        spec(id:"5da5445ccccfa2162e13978b"){
          id
          name
          invoices{
            id
            name
            products{
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
  },
  mounted(){
    const subQuery = gql`
      subscription delta {
        delta {
          operation
          parentId
          payload{
            __typename
            ... on Product{
              id
              name
              price
              count
              amount
          }
          }
        }
      }
    `

    const observer = this.$apollo.subscribe({
      query: subQuery
    })

    const myapollo = this.$apollo

    observer.subscribe({
      next ({data}) {

        //eslint-disable-next-line
        console.log(JSON.stringify(data))
        if(data.delta.operation === 'Insert' && data.delta.payload.__typename === 'Product'){
          const parentInvoice = myapollo.provider.defaultClient.readFragment({
            id: "Invoice:" + data.delta.parentId,
            fragment: gql`
              fragment parentInvoice on Invoice{
                id
                name
                totalPrice
                products{
                  id
                  name
                  count
                  price
                  amount
                }
              }
            `
          })
          parentInvoice.products.push(data.delta.payload)

          myapollo.provider.defaultClient.writeFragment({
            id: "Invoice:" + data.delta.parentId,
            fragment: gql`
              fragment parentInvoice on Invoice {
                id
                name
                totalPrice
                products{
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
        if(data.delta.operation === 'Delete'){
          // Тут надо доделать
          let parentInvoice = myapollo.provider.defaultClient.readFragment({
            id: "Invoice:" + data.delta.parentId,
            fragment: gql`
              fragment parentInvoice on Invoice{
                id
                name
                totalPrice
                products{
                  id
                  name
                  count
                  price
                  amount
                }
              }
            `
          })

          const index = parentInvoice.products.findIndex(p => p.id == data.delta.payload.id)

          if (index !== -1) {
            parentInvoice.products.splice(index, 1)
          }

          myapollo.provider.defaultClient.writeFragment({
            id: "Invoice:" + data.delta.parentId,
            fragment: gql`
              fragment deleteInvoice on Invoice {
                id
                name
                totalPrice
                products{
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
      },
      error (error) {
        //eslint-disable-next-line
        console.error(error)
      },
    })

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
