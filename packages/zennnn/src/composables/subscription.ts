import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { GET_PROFILE } from '@/graphql/queries'

import type { GetProfile } from '@/graphql/types'

export function useSubscription() {
  const { t } = useI18n()

  const { result } = useQuery<GetProfile>(GET_PROFILE, null, {
    fetchPolicy: 'cache-only',
  })

  const profile = computed(() => result.value?.getProfile)

  const productName = computed(() => {
    const account = profile.value?.account
    if (!account) return ''
    if (
      !account.subscriptionId ||
      account.price === 'Trial' ||
      account.price === 'Promo'
    ) {
      return ''
    }

    const price = account.price || ''
    if (price.includes('Start')) return t('payment.start')
    if (price.includes('Standard')) return t('payment.standard')
    if (price.includes('Advanced')) return t('payment.advanced')
    if (price.includes('Premium')) return t('payment.premium')
    return ''
  })

  const status = computed(() => {
    const account = profile.value?.account
    if (!account) return undefined
    if (
      account.price === 'Trial' ||
      account.price === 'Promo' ||
      account.subscriptionStatus === 'trialing'
    ) {
      return 'trial'
    }
    if (account.subscriptionStatus === 'active') return 'paid'
    if (account.subscriptionStatus && account.periodEnd) return 'expired'
    return undefined
  })

  const canChange = computed(
    () =>
      profile.value &&
      profile.value.account &&
      profile.value.account.subscriptionId &&
      (profile.value.account.subscriptionStatus === 'active' ||
        profile.value.account.subscriptionStatus === 'trialing')
  )

  const canSelect = computed(() => profile.value?.account?.subscriptionId)

  const canCancel = computed(() => !profile.value?.account?.cancelAtPeriodEnd)

  const isTrialing = computed(
    () => profile.value?.account?.subscriptionStatus === 'trialing'
  )

  const isCanceled = computed(
    () =>
      profile.value &&
      profile.value.account &&
      profile.value.account.subscriptionId &&
      profile.value.account.cancelAtPeriodEnd &&
      !(
        profile.value.account.price === 'Trial' ||
        profile.value.account.price === 'Promo'
      )
  )

  return {
    productName,
    status,
    canChange,
    canSelect,
    canCancel,
    isTrialing,
    isCanceled,
  }
}
