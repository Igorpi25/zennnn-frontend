<template>
  <div>
    <h1>
      Спецификация:
      <span>
        {{ spec.specNo }}
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
import Invoice from './Invoice.vue'
import spec from '../../mixins/spec'

export default {
  name: 'FreelancerSpec',
  components: {
    Invoice,
  },
  mixins: [spec],
}
</script>
