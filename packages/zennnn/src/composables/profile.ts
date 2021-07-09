import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { GET_PROFILE } from '@/graphql/queries'

import type { GetProfile } from '@/graphql/types'

export function useProfile() {
  const { t } = useI18n()

  const { result, loading, refetch } = useQuery<GetProfile>(GET_PROFILE, null, {
    fetchPolicy: 'cache-only',
  })

  const profile = computed(() => result.value?.getProfile)

  const fullName = computed(() =>
    [profile.value?.familyName, profile.value?.givenName]
      .filter((e) => !!e)
      .join(' ')
  )

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

  const subscriptionStatus = computed(() => {
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

  return {
    loading,
    refetch,
    profile,
    fullName,
    productName,
    subscriptionStatus,
  }
}
