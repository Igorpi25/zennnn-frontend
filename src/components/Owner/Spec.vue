<template>
  <div>
    <h1>
      Спецификация:
      <span
        ref="name"
        :contenteditable="!updateLoading"
        placeholder="----"
        @keydown.enter.stop.prevent="e => updateSpec({ specNo: e.target.textContent || e.target.innerText })"
        @blur="onBlur"
      />
      <div v-if="updateLoading" class="spinner">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </h1>
    Estimate Shipping date:
    <input
      v-model="spec.estimateShippingDate"
      type="text"
      size="20"
      @change="e => updateSpec({ estimateShippingDate: e.target.value })"
    >
    <Invoice
      v-for="(item, index) in spec.invoices"
      :key="index"
      :content="item"
    />
    <br>
    <template>
      <button
        :disabled="createLoading"
        @click="createInvoice"
      >
        Создать накладную
      </button>
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
  name: 'OwnerSpec',
  components: {
    Invoice,
  },
  mixins: [spec],
}
</script>
