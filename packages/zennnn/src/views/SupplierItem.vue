<template>
  <SupplierCard
    :key="$route.fullPath"
    :org-id="$route.params.orgId"
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
