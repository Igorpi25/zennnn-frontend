<template>
  <div style="padding-bottom: 8px">
    Продукт:
    <div>
      <div>
        {{ content.name }} стоимость:
        {{ content.count }} *
        {{ content.price }} = {{ content.amount }}
        <div class="spinner">
          <div v-if="updateLoading" class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
      <div>
        net: {{ content.net }} *
        gross: {{ content.gross }}
      </div>
    </div>
  </div>
</template>

<script>
import product from '../../mixins/product'

export default {
  name: 'AccauntantProduct',
  mixins: [product],
}
</script>
