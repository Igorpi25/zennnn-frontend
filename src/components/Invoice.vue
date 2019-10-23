<template>
  <div>
    <h3>Накладная: {{content.name}}</h3>
    <Product
      v-for="(item, index) in content.products"
      :key="index"
      :content="item" />
    <br>
  </div>
</template>

<script>
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
