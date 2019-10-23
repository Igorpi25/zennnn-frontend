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
        spec(id:"5da54114f323ee162603d430"){
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
    // setTimeout(()=>{
    //   const fun = this.$apollo.provider.defaultClient.readFragment({
    //     id: "Product:5da54114f323ee162603d432",
    //     fragment: gql`
    //       fragment myProduct on Product{
    //         id
    //         name
    //       }
    //     `
    //   })
    //   // eslint-disable-next-line
    //   console.log(fun)
    // }, 2000)
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
