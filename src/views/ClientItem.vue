<template>
  <ClientCard
    :org-id="$route.params.orgId"
    :create="create"
  />
</template>

<script>
import ClientCard from '../components/ClientCard.vue'

export default {
  name: 'ClientItem',
  components: {
    ClientCard,
  },
  props: {
    create: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
