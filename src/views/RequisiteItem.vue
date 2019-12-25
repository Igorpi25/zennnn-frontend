<template>
  <RequisiteCard
    ref="card"
    :org-id="$route.params.orgId"
    :create="create"
    :is-welcome.sync="showWelcomeDialog"
  />
</template>

<script>
import { GET_PROFILE } from '../graphql/queries'
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
  apollo: {
    getProfile: {
      query: GET_PROFILE,
      fetchPolicy: 'cache-only',
      skip () {
        return !this.isLoggedIn
      },
    },
  },
  async beforeRouteLeave (to, from, next) {
    await this.$refs.card.checkChangesBeforeLeave(next)
  },
  data () {
    return {
      showWelcomeDialog: false,
    }
  },
  computed: {
    profile () {
      return this.getProfile || {}
    },
    isUserInitKeyStore () {
      return `zIsUserInit.${this.profile.id}`
    },
  },
  mounted () {
    let isUserInit = localStorage.getItem(this.isUserInitKeyStore)
    if (this.$route.query.q && this.$route.query.q === 'welcome') {
      if (!isUserInit) {
        localStorage.setItem(this.isUserInitKeyStore, 1)
        this.showWelcomeDialog = true
      }
    }
  },
}
</script>
