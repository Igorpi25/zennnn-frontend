import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_ROLE_IN_PROJECT } from '@/graphql/queries'
import { RoleInProject } from '@/graphql/types'

import type {
  GetRoleInProject,
  GetRoleInProjectVariables,
} from '@/graphql/types'

interface RoleInProjectProps {
  specId: string
}

export function useRoleInProject(props: RoleInProjectProps) {
  const { result, loading, refetch } = useQuery<
    GetRoleInProject,
    GetRoleInProjectVariables
  >(
    GET_ROLE_IN_PROJECT,
    () => ({
      specId: props.specId,
    }),
    {
      fetchPolicy: 'cache-only',
    }
  )

  const roleInProject = computed(() => result.value?.roleInProject)

  function hasAccess(...roles: RoleInProject[]) {
    const accessRoles = roles.reduce(
      (acc, r) => [...acc, ...getAccessRoles(r)],
      [] as (RoleInProject | undefined)[]
    )
    return accessRoles.includes(roleInProject.value)
  }

  function getAccessRoles(role: RoleInProject) {
    switch (role) {
      case RoleInProject.OWNER:
        return [RoleInProject.OWNER]
      case RoleInProject.MANAGER:
        return [RoleInProject.OWNER, RoleInProject.MANAGER]
      case RoleInProject.ACCOUNTANT:
        return [RoleInProject.OWNER, RoleInProject.ACCOUNTANT]
      case RoleInProject.WAREHOUSEMAN:
        return [RoleInProject.OWNER, RoleInProject.ACCOUNTANT]
      case RoleInProject.FREELANCER:
        return [RoleInProject.OWNER, RoleInProject.FREELANCER]
      default:
        return []
    }
  }

  return {
    loading,
    roleInProject,
    refetch,
    hasAccess,
  }
}
