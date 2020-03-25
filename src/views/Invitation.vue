<template>
  <div class="container container--sm">
    <div class="py-10">

      <div class="pt-12 pb-6">
        <div class="text-center text-white pb-8">
          <p>
            {{ $t('invitation.text', { company }) }}
          </p>
          <p>{{ $t('invitation.hint') }}</p>
        </div>
        <div class="flex items-center justify-center">
          <Button
            :loading="declineLoading"
            :disabled="acceptLoading || declineLoading"
            large
            gray
            class="mx-1"
            @click="declineInvitation"
          >
            {{ $t('invitation.decline') }}
          </Button>
          <Button
            :loading="acceptLoading"
            :disabled="acceptLoading || declineLoading"
            large
            secondary
            class="mx-1"
            @click="acceptInvitation"
          >
            {{ $t('invitation.accept') }}
          </Button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { CHECK_INVITATION } from '../graphql/queries'
import { ACCEPT_INVITATION, DECLINE_INVITATION } from '../graphql/mutations'

export default {
  name: 'Invitation',
  apollo: {
    checkInvitation: {
      query: CHECK_INVITATION,
      variables () {
        return {
          id: this.invitationId,
        }
      },
      fetchPolicy: 'cache-only',
    },
  },
  data () {
    return {
      acceptLoading: false,
      declineLoading: false,
    }
  },
  computed: {
    invitationId () {
      return this.$route.params.invitationId
    },
    company () {
      if (!this.checkInvitation) return ''
      return this.checkInvitation.orgName
    },
  },
  methods: {
    async acceptInvitation () {
      try {
        this.acceptLoading = true
        await this.$apollo.mutate({
          mutation: ACCEPT_INVITATION,
          variables: {
            id: this.invitationId,
          },
        })
        const orgId = this.checkInvitation.orgId
        this.$router.push({ name: 'specs', params: { orgId } })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.acceptLoading = false
      }
    },
    async declineInvitation () {
      try {
        this.declineLoading = true
        await this.$apollo.mutate({
          mutation: DECLINE_INVITATION,
          variables: {
            id: this.invitationId,
          },
        })
        this.$router.push({ name: 'home' })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.declineLoading = false
      }
    },
  },
}
</script>
