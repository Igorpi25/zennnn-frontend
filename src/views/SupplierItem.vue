<template>
  <SupplierCard
    :spec-id="$route.params.specId"
    :create="create"
  />
</template>

<script>
import SupplierCard from '../components/SupplierCard.vue'

export default {
  name: 'SupplierItem',
  components: {
    SupplierCard,
  },
  props: {
    create: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
