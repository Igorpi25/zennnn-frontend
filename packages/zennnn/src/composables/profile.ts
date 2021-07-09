import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_PROFILE } from '@/graphql/queries'

import type { GetProfile } from '@/graphql/types'

export function useProfile() {
  const { result, loading, refetch } = useQuery<GetProfile>(GET_PROFILE, null, {
    fetchPolicy: 'cache-only',
  })

  const profile = computed(() => result.value?.getProfile)

  const fullName = computed(() =>
    [profile.value?.familyName, profile.value?.givenName]
      .filter((e) => !!e)
      .join(' ')
  )

  return {
    loading,
    refetch,
    profile,
    fullName,
  }
}
