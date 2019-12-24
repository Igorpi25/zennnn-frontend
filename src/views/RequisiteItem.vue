<template>
  <RequisiteCard
    ref="card"
    :org-id="$route.params.orgId"
    :create="create"
  />
</template>

<script>
import RequisiteCard from '../components/RequisiteCard.vue'

export default {
  name: 'RequisiteItem',
  components: {
    RequisiteCard,
  },
  props: {
    create: {
      type: Boolean,
      default: false,
    },
  },
  async beforeRouteLeave (to, from, next) {
    await this.$refs.card.checkChangesBeforeLeave(next)
  },
}
</script>
