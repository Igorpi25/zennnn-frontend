import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import { GET_ORGS } from '@/graphql/queries'
import { RoleInProject } from '@/graphql/types'
import { currentOrgIdVar } from '@/plugins/apollo'
import { CURRENT_ORG_STORE_KEY } from '@/config'

import type { GetOrgs, GetOrgs_getOrgs } from '@/graphql/types'

export type OrgsGroup = Record<RoleInProject, GetOrgs_getOrgs[]>

export function setOrgId(orgId: string | undefined) {
  currentOrgIdVar(orgId || null)
  if (orgId) {
    localStorage.setItem(CURRENT_ORG_STORE_KEY, orgId)
  } else {
    localStorage.removeItem(CURRENT_ORG_STORE_KEY)
  }
}

interface OrgsProps {
  orgId?: string | null
}

export function useOrgs(props?: OrgsProps) {
  const route = useRoute()
  const currentOrgId = useReactiveVar(currentOrgIdVar)

  const { result, loading, refetch } = useQuery<GetOrgs>(GET_ORGS, null, {
    fetchPolicy: 'cache-only',
  })

  const orgs = computed(() => result.value?.getOrgs || [])

  const orgId = computed(
    () => props?.orgId || route.params.orgId || currentOrgId.value
  )

  const currentOrg = computed(
    () => orgs.value.find((el) => el.id === orgId.value) || orgs.value[0]
  )

  const sortedRoles = computed(() => [
    RoleInProject.OWNER,
    RoleInProject.MANAGER,
    RoleInProject.ACCOUNTANT,
    RoleInProject.WAREHOUSEMAN,
    RoleInProject.FREELANCER,
  ])

  const orgsByRole = computed(() => {
    const groups = {} as OrgsGroup
    orgs.value.forEach((org) => {
      const key = org.role as RoleInProject
      if (groups[key]) {
        groups[key].push(org)
      } else {
        groups[key] = [org]
      }
    })

    return sortedRoles.value
      .map((role) => {
        return [role, groups[role]]
      })
      .filter((item) => item[1] && item[1].length > 0)
  })

  const isOwner = computed(() => currentOrg.value?.role === RoleInProject.OWNER)
  const isManager = computed(
    () => currentOrg.value?.role === RoleInProject.MANAGER
  )
  const isAccountant = computed(
    () => currentOrg.value?.role === RoleInProject.ACCOUNTANT
  )
  const isWarehouseman = computed(
    () => currentOrg.value?.role === RoleInProject.WAREHOUSEMAN
  )
  const isFreelancer = computed(
    () => currentOrg.value?.role === RoleInProject.FREELANCER
  )

  return {
    loading,
    refetch,
    orgs,
    currentOrg,
    orgsByRole,
    isOwner,
    isManager,
    isAccountant,
    isWarehouseman,
    isFreelancer,
  }
}
