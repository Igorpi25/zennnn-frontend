<template>
  <div>
    <RequisiteCard
      ref="card"
      :org-id="$route.params.orgId"
      :create="create"
      :show-fill-later-button="showFillLaterButton"
    />
    <v-dialog
      v-model="showWelcomeDialog"
      max-width="500"
    >
      <WelcomeModal
        @close="showWelcomeDialog = false"
      />
    </v-dialog>

  </div>
</template>

<script>
import { GET_IS_LOGGED_IN, GET_PROFILE } from '../graphql/queries'
import { NOTE_GREETING } from '../graphql/mutations'
import RequisiteCard from '../components/RequisiteCard.vue'
import WelcomeModal from '../components/WelcomeModal.vue'

export default {
  name: 'RequisiteItem',
  components: {
    RequisiteCard,
    WelcomeModal,
  },
  props: {
    create: {
      type: Boolean,
      default: false,
    },
  },
  apollo: {
    isLoggedIn: {
      query: GET_IS_LOGGED_IN,
    },
    getProfile: {
      query: GET_PROFILE,
      fetchPolicy: 'cache-only',
      skip () {
        return !this.isLoggedIn
      },
    },
  },
  data () {
    return {
      showWelcomeDialog: false,
      showFillLaterButton: false,
    }
  },
  computed: {
    profile () {
      return this.getProfile || {}
    },
    userInitKeyStore () {
      return `zIsUserInit.${this.profile.id}`
    },
  },
  mounted () {
    if (this.$route.query.q === 'welcome') {
      const isUserInit = localStorage.getItem(this.userInitKeyStore)
      if (!isUserInit) {
        this.showWelcomeDialog = true
        this.showFillLaterButton = true
        localStorage.setItem(this.userInitKeyStore, 1)
        this.noteGreeting()
      }
    }
  },
  methods: {
    async noteGreeting () {
      await this.$apollo.mutate({
        mutation: NOTE_GREETING,
      })
    },
  },
}
</script>
