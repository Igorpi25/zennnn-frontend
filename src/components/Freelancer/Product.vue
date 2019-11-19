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
import product from '../../mixins/product'

export default {
  name: 'FreelancerProduct',
  mixins: [product],
}
</script>
