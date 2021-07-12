import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { Btn, Progress } from '@zennnn/core'
import ZAppBar from '@/components/core/ZAppBar'
import Copyright from '@/components/core/Copyright'
import { CHECK_INVITATION } from '@/graphql/queries'
import { ACCEPT_INVITATION, DECLINE_INVITATION } from '@/graphql/mutations'

import type {
  CheckInvitation,
  CheckInvitationVariables,
  AcceptInvitation,
  AcceptInvitationVariables,
  DeclineInvitation,
  DeclineInvitationVariables,
} from '@/graphql/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()

    const invitationId = route.params.invitationId

    const {
      result: checkInvitationResult,
      loading: checkInvitationLoading,
      onError: onCheckInvitationError,
    } = useQuery<CheckInvitation, CheckInvitationVariables>(
      CHECK_INVITATION,
      () => ({
        id: invitationId as string,
      })
    )

    onCheckInvitationError(() => {
      router.push({ name: 'forbidden' })
    })

    const invitation = computed(
      () => checkInvitationResult.value?.checkInvitation
    )

    const {
      mutate: acceptInvitationMutate,
      loading: acceptInvitationLoading,
      onDone: onAcceptInvitationDone,
    } = useMutation<AcceptInvitation, AcceptInvitationVariables>(
      ACCEPT_INVITATION,
      () => ({
        variables: {
          id: invitationId as string,
        },
      })
    )

    const {
      mutate: declineInvitationMutate,
      loading: declineInvitationLoading,
      onDone: onDeclineInvitationDone,
    } = useMutation<DeclineInvitation, DeclineInvitationVariables>(
      DECLINE_INVITATION,
      () => ({
        variables: {
          id: invitationId as string,
        },
      })
    )

    onAcceptInvitationDone(() => {
      router.push({
        name: 'specs',
        params: { orgId: invitation.value?.orgId as string },
      })
    })

    onDeclineInvitationDone(() => {
      router.push({ name: 'main' })
    })

    return () => (
      <>
        <ZAppBar />

        <main class="container flex-grow relative py-10">
          <div class="pt-12 pb-6">
            <div class="text-center text-white pb-8">
              <p>
                {t('invitation.text', {
                  company: invitation.value?.orgName || '',
                })}
              </p>
              <p>{t('invitation.hint')}</p>
            </div>
            <div class="flex items-center justify-center space-x-4">
              <Btn
                disabled={acceptInvitationLoading.value}
                loading={declineInvitationLoading.value}
                outlined
                {...{ onClick: () => declineInvitationMutate() }}
              >
                {t('invitation.decline')}
              </Btn>
              <Btn
                disabled={declineInvitationLoading.value}
                loading={acceptInvitationLoading.value}
                {...{ onClick: () => acceptInvitationMutate() }}
              >
                {t('invitation.accept')}
              </Btn>
            </div>
          </div>
          {checkInvitationLoading.value && (
            <div class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 backdrop-blur-lg transition-all">
              <Progress class="text-blue-500" size={42} indeterminate />
            </div>
          )}
        </main>

        <footer class="container h-12 text-center">
          <Copyright />
        </footer>
      </>
    )
  },
})
