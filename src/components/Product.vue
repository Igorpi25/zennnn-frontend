<template>
  <div>
    Продукт: {{content.name}} стоимость: {{content.count}} x {{content.price}} = {{content.amount}}
  </div>
</template>

<script>

export default {
  name: 'Product',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
}
</script>
