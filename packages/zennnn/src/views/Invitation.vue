<template>
  <div class="container">
    <div class="py-10">
      <div class="pt-12 pb-6">
        <div class="text-center text-white pb-8">
          <p>
            {{ $t('invitation.text', { company }) }}
          </p>
          <p>{{ $t('invitation.hint') }}</p>
        </div>
        <div class="flex items-center justify-center">
          <Btn
            :loading="acceptLoading || declineLoading"
            outlined
            class="mx-1"
            @click="declineInvitation"
          >
            {{ $t('invitation.decline') }}
          </Btn>
          <Btn
            :loading="acceptLoading || declineLoading"
            class="mx-1"
            @click="acceptInvitation"
          >
            {{ $t('invitation.accept') }}
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import { CHECK_INVITATION } from '../graphql/queries'
import { ACCEPT_INVITATION, DECLINE_INVITATION } from '../graphql/mutations'

import { Btn } from '@zennnn/core'

export default {
  name: 'Invitation',
  components: {
    Btn,
  },
  setup() {
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const route = useRoute()
    const invitationId = route.params.invitationId

    const { result } = useQuery(
      CHECK_INVITATION,
      () => ({
        id: invitationId,
      }),
      {
        fetchPolicy: 'cache-only',
      }
    )
    const checkInvitation = useResult(result)

    return {
      apolloClient,
      invitationId,
      checkInvitation,
    }
  },
  data() {
    return {
      acceptLoading: false,
      declineLoading: false,
    }
  },
  computed: {
    company() {
      if (!this.checkInvitation) return ''
      return this.checkInvitation.orgName
    },
  },
  methods: {
    async acceptInvitation() {
      try {
        this.acceptLoading = true
        await this.apolloClient.mutate({
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
    async declineInvitation() {
      try {
        this.declineLoading = true
        await this.apolloClient.mutate({
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
