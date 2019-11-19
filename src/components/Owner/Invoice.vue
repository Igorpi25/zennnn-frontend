<template>
  <div>
    <h3>Накладная:
      <span
        ref="name"
        :contenteditable="!updateLoading"
        placeholder="----"
        @keydown.enter.stop.prevent="e => updateInvoice({ name: e.target.textContent || e.target.innerText })"
        @blur="onBlur"
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
      Purchase date:
      <input
        v-model="content.purchaseDate"
        type="text"
        size="20"
        @change="e => updateInvoice({ purchaseDate: e.target.value })"
      >
      Сумма: {{ content.totalPrice }}
    </div>
  </div>
</template>

<script>
import Product from './Product.vue'
import invoice from '../../mixins/invoice'

export default {
  name: 'OwnerInvoice',
  components: {
    Product,
  },
  mixins: [invoice],
}
</script>
