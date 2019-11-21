<template>
  <div>
    <h3>Накладная:
      <span>
        {{ content.invoiceNo }}
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
      Purchase date: {{ content.purchaseDate }}
      Сумма: {{ content.totalPrice }}
    </div>
  </div>
</template>

<script>
import Product from './Product.vue'
import invoice from '../../mixins/invoice'

export default {
  name: 'WarehousemanInvoice',
  components: {
    Product,
  },
  mixins: [invoice],
}
</script>
