<template>
  <div>
    <RequisiteCard
      ref="card"
      :org-id="$route.params.orgId"
      :create="create"
      :show-fill-later-button="showFillLaterButton"
    />
    <Modal
      v-model="showWelcomeDialog"
      max-width="500"
    >
      <WelcomeModal
        @close="showWelcomeDialog = false"
      />
    </Modal>

  </div>
</template>

<script>
import { useQuery, useResult } from '@vue/apollo-composable'

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
  setup () {
    const { result: result1 } = useQuery(GET_IS_LOGGED_IN)
    const isLoggedIn = useResult(result1)

    const { result: result2 } = useQuery(GET_PROFILE)
    const getProfile = useResult(result2, null, {
      enabled: isLoggedIn.value,
      fetchPolicy: 'cache-only',
    })

    return {
      isLoggedIn,
      getProfile,
    }
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
