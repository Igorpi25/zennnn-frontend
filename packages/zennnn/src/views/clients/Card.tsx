import { defineComponent, ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Progress } from '@zennnn/core'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_CLIENT, GET_CLIENT_GROUP } from '@/graphql/queries'
import { CREATE_CLIENT, UPDATE_CLIENT } from '@/graphql/mutations'
import { ClientType } from '@/graphql/types'
import Form from '@/components/client/Form'
import { useNotify } from '@/plugins'

import type {
  GetClient,
  GetClientVariables,
  CreateClient,
  CreateClientVariables,
  UpdateClient,
  UpdateClientVariables,
  GetClientGroup,
  GetClientGroupVariables,
} from '@/graphql/types'

export default defineComponent({
  props: {
    create: Boolean,
  },

  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const notify = useNotify()

    const routeReplaceLoading = ref(false)
    const clientType = ref(ClientType.LEGAL)

    const clientTypeNumeric = computed(() => {
      switch (clientType.value) {
        case ClientType.LEGAL:
          return 1
        case ClientType.PRIVATE:
          return 2
        case ClientType.OTHER:
          return 3
        default:
          return 1
      }
    })

    const { loading: getClientLoading, result: getClientResult } = useQuery<
      GetClient,
      GetClientVariables
    >(
      GET_CLIENT,
      () => ({
        id: route.params.clientId as string,
      }),
      () => ({
        enabled: !props.create,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      })
    )

    const { result: getClientGroupResult } = useQuery<
      GetClientGroup,
      GetClientGroupVariables
    >(
      GET_CLIENT_GROUP,
      () => ({
        orgId: route.params.orgId as string,
        groupId: route.params.groupId as string,
      }),
      () => ({
        enabled: !!route.params.groupId,
        fetchPolicy: 'cache-and-network',
      })
    )

    const item = computed(() => getClientResult.value?.getClient)

    const clientGroup = computed(
      () => getClientGroupResult.value?.getClientGroup
    )

    const { mutate: createMutate } = useMutation<
      CreateClient,
      CreateClientVariables
    >(CREATE_CLIENT)

    const { mutate: updateMutate } = useMutation<
      UpdateClient,
      UpdateClientVariables
    >(UPDATE_CLIENT)

    onBeforeMount(() => {
      const type = route.query.clientType as string
      if (type === '1') {
        clientType.value = ClientType.LEGAL
      } else if (type === '2') {
        clientType.value = ClientType.PRIVATE
      } else if (type === '3') {
        clientType.value = ClientType.OTHER
      } else {
        clientType.value = ClientType.LEGAL
      }
    })

    async function onUpdate(input: any) {
      if (props.create) {
        const response = await createMutate({
          orgId: route.params.orgId as string,
          groupId: clientGroup.value?.id ? clientGroup.value.id : undefined,
          input: {
            ...input,
            clientType: clientType.value,
          },
        })
        if (response?.data?.createClient) {
          notify(t('client.created'))
          await router.replace({
            name: 'client',
            params: {
              orgId: route.params.orgId,
              clientId: response.data.createClient.id,
              groupId: response.data.createClient.groupId,
            },
            query: {
              clientType: clientTypeNumeric.value,
            },
          })
        }
      } else if (item.value?.id) {
        await updateMutate({
          id: item.value.id,
          input: input,
        })
      }
    }

    function onUpdateClientType(type: ClientType) {
      clientType.value = type
      const groupId = clientGroup.value?.id
      const clientId = clientGroup.value?.[type]
      if (groupId && clientId) {
        router.push({
          name: 'client',
          params: {
            orgId: route.params.orgId,
            groupId: groupId,
            clientId: clientId,
          },
          query: { clientType: clientTypeNumeric.value },
        })
      } else {
        router.push({
          name: 'client-create',
          params: clientGroup.value?.id
            ? {
                orgId: route.params.orgId,
                groupId: clientGroup.value.id,
              }
            : {
                orgId: route.params.orgId,
              },
          query: { clientType: clientTypeNumeric.value },
        })
      }
    }

    return () => (
      <div class="container relative pt-8 pb-12">
        <Form
          key={route.fullPath}
          orgId={route.params.orgId as string}
          clientId={route.params.clientId as string}
          clientType={clientType.value}
          clientGroup={clientGroup.value}
          item={!props.create && item.value ? item.value : undefined}
          loading={getClientLoading.value}
          create={props.create}
          {...{
            onUpdate: onUpdate,
            'onUpdate:clientType': onUpdateClientType,
          }}
        />

        {routeReplaceLoading.value && (
          <div class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 backdrop-blur-lg transition-all">
            <Progress class="text-blue-500" size={42} indeterminate />
          </div>
        )}
      </div>
    )
  },
})
