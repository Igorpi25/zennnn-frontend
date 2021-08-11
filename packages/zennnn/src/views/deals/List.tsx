import {
  ref,
  computed,
  watch,
  defineComponent,
  onBeforeMount,
  reactive,
  onMounted,
  nextTick,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation, useQuery, useApolloClient } from '@vue/apollo-composable'
import {
  ziSearch,
  ziDelete,
  ziBagDeal,
  ziAction,
  ziPhone,
  ziUserPlus,
  ziMoneyPlus,
  ziMoneyMinus,
  ziMoneyTernover,
  ziQuestionSign,
  ziFilter,
  ziFilterOutline,
  ziChecked,
  ziNumberOffDocument,
  ziPlusOutline,
  ziCloseDelete,
} from '@zennnn/icons'
import {
  Btn,
  Icon,
  Tooltip,
  TextField,
  DataTable,
  Modal,
  Menu,
  MenuItem,
  Autocomplete,
} from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { parseDate } from 'shared/utils/date'
import {
  RoleInProject,
  Operation,
  SpecStatus,
  ClientType,
} from '@/graphql/types'
import { GET_SPECS, SEARCH_CLIENTS, GET_CLIENTS_BY_ID } from '@/graphql/queries'
import { CREATE_SPEC, DELETE_SPEC, CREATE_CLIENT } from '@/graphql/mutations'
import { SPECS_DELTA } from '@/graphql/subscriptions'
import { SPEC_FRAGMENT } from '@/graphql/fragments'
import ClientForm from '@/components/client/Form'
import { useProfile } from '@/composables/profile'
import { useOrgs } from '@/composables/orgs'
import { logger } from '@/plugins'
import { Typename } from '@/types'

import type {
  SearchClients,
  SearchClientsVariables,
  GetSpecs,
  GetSpecsVariables,
  CreateSpec,
  CreateSpecVariables,
  DeleteSpec,
  DeleteSpecVariables,
  GetSpecs_getSpecs,
  CreateClientInput,
  CreateClient,
  CreateClientVariables,
  GetClientsById,
  GetClientsByIdVariables,
  SearchClients_searchClients_items,
  CreateClient_createClient,
} from '@/graphql/types'

interface DataTableHeaderProp {
  text: string
  value: string
  width?: string | number
}

type DataTableItem = GetSpecs_getSpecs & {
  specNoCount?: string
  group?: boolean
  groupName?: string
  groupItemsCount?: number
}

enum CustomFilter {
  EMPLOYEE = 'EMPLOYEE',
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, te, n, d } = useI18n()
    const { profile } = useProfile()
    const { isOwner, isManager, isFreelancer } = useOrgs()

    const orgId = route.params.orgId
    const sortBy = ref(['createdAt'])
    const sortDesc = ref([true])
    const search = ref<string>()
    // TODO: add id on deleteClient mutation
    const deleteDealId = ref<string>()

    const clientSearch = ref('')
    const clientsIds = ref<string[]>([])
    const clientSearchInputRef = ref()
    const clientDialogRef = ref()
    const clientFormRef = ref()
    const createClientDialog = ref(false)
    const createClientInput = ref<CreateClientInput>({
      clientType: ClientType.LEGAL,
    })
    const createDealClientItem = ref<
      CreateClient_createClient | SearchClients_searchClients_items
    >()
    const createDealDialog = ref(false)
    const createWithoutClientLoading = ref(false)
    const createWithClientLoading = ref(false)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })
    const filterMenu = ref(false)
    const currentFilter = ref<ClientType | CustomFilter | null>(null)

    const clientTypeEnum = computed(() => {
      switch (currentFilter.value) {
        case ClientType.LEGAL:
          return ClientType.LEGAL
        case ClientType.PRIVATE:
          return ClientType.PRIVATE
        case ClientType.OTHER:
          return ClientType.OTHER
        default:
          return null
      }
    })

    const { result: searchClientsResult, loading: searchClientsLoading } =
      useQuery<SearchClients, SearchClientsVariables>(
        SEARCH_CLIENTS,
        () => ({
          orgId: orgId as string,
          search: clientSearch.value,
        }),
        () => ({
          enabled: !!clientSearch.value,
          fetchPolicy: 'cache-and-network',
          debounce: 300,
        })
      )

    const { result: getDealsResult, loading: getDealsLoading } = useQuery<
      GetSpecs,
      GetSpecsVariables
    >(
      GET_SPECS,
      () => ({
        orgId: orgId as string,
        clientsIds: clientsIds.value,
        clientType: clientTypeEnum.value,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )

    const { result: getClientsByIdResult } = useQuery<
      GetClientsById,
      GetClientsByIdVariables
    >(
      GET_CLIENTS_BY_ID,
      () => ({
        orgId: orgId as string,
        ids: clientsIds.value,
      }),
      () => ({
        enabled: clientsIds.value.length > 0,
        fetchPolicy: 'cache-and-network',
      })
    )

    const { mutate: createDealMutate } = useMutation<
      CreateSpec,
      CreateSpecVariables
    >(CREATE_SPEC)

    const { mutate: createClientMutate, loading: createClientLoading } =
      useMutation<CreateClient, CreateClientVariables>(CREATE_CLIENT)

    const { mutate: deleteDealMutate, loading: deleteDealLoading } =
      useMutation<DeleteSpec, DeleteSpecVariables>(DELETE_SPEC, {
        update: (cache, { data: result }) => {
          const id = deleteDealId.value
          // TODO: return in result id
          logger.info('Deal delete', result?.deleteSpec)

          const data = cache.readQuery<GetSpecs, GetSpecsVariables>({
            query: GET_SPECS,
            variables: {
              orgId: orgId as string,
            },
          })
          if (data?.getSpecs?.some((item) => item.id === id)) {
            cache.writeQuery<GetSpecs, GetSpecsVariables>({
              query: GET_SPECS,
              variables: {
                orgId: orgId as string,
              },
              data: {
                getSpecs: data.getSpecs.filter((item) => item.id !== id),
              },
            })
          }
        },
      })

    const filters = computed(() => [
      {
        text: t('label.noSort'),
        value: null,
      },
      {
        text: t('client.legalPerson'),
        value: ClientType.LEGAL,
      },
      {
        text: t('client.privatePerson'),
        value: ClientType.PRIVATE,
      },
      {
        text: t('client.other'),
        value: ClientType.OTHER,
      },
      {
        text: t('deals.byEmployees'),
        value: CustomFilter.EMPLOYEE,
      },
    ])

    const clientsFilters = computed(() => {
      return clientsIds.value.map((id) => {
        const clients = getClientsByIdResult.value?.getClientsById?.items || []
        const client = clients.find((item) => item.id === id)
        const text = client?.contactPerson?.fullName || client?.uid || ''
        return {
          text,
          value: id,
        }
      })
    })

    const groupBy = computed(() =>
      currentFilter.value === CustomFilter.EMPLOYEE ? ['employeeId'] : undefined
    )

    const groupDesc = computed(() =>
      currentFilter.value === CustomFilter.EMPLOYEE ? [false] : undefined
    )

    const currentFilterText = computed(() => {
      switch (currentFilter.value) {
        case ClientType.LEGAL:
          return t('client.legalPerson')
        case ClientType.PRIVATE:
          return t('client.privatePerson')
        case ClientType.OTHER:
          return t('client.other')
        case CustomFilter.EMPLOYEE:
          return t('deals.byEmployees')
        default:
          return t('label.noSort')
      }
    })

    const canCreateDeal = computed(
      () => isOwner.value || isManager.value || isFreelancer.value
    )

    const headers = computed(() => [
      {
        text: '',
        value: 'status',
        align: 'left' as const,
        width: 45,
        sortable: true,
      },
      {
        text: '',
        value: 'isMoneyRecieved',
        align: 'left' as const,
        width: 50,
        sortable: false,
      },
      {
        text: '',
        value: 'isExpensesPaid',
        align: 'left' as const,
        width: 50,
        sortable: false,
      },
      {
        text: '',
        value: 'finalCost',
        align: 'right' as const,
        width: 100,
        sortable: true,
      },
      {
        text: '',
        value: 'margin',
        align: 'right' as const,
        width: 62,
        sortable: true,
      },
      {
        text: t('deals.clientName'),
        value: 'client.fullName',
        align: 'left' as const,
        width: 230,
        minWidth: 230,
        class: 'whitespace-nowrap text-left pl-6',
        sortable: true,
      },
      {
        text: t('deals.contactPerson'),
        value: 'client.contactPersonFullName',
        align: 'left' as const,
        width: 152,
        sortable: true,
      },
      {
        text: t('deals.number'),
        value: 'specNo',
        align: 'left' as const,
        width: 80,
        minWidth: 80,
        class: 'whitespace-nowrap',
        sortable: true,
      },
      {
        text: t('deals.createdAt'),
        value: 'createdAt',
        align: 'left' as const,
        width: 100,
        minWidth: 100,
        class: 'whitespace-nowrap',
        sortable: true,
      },
      {
        text: t('deals.contact'),
        value: 'client.contactPhone',
        align: 'left' as const,
        width: 85,
        class: 'whitespace-nowrap',
        sortable: true,
      },
      {
        text: t('deals.clientUcn'),
        value: 'client.uid',
        align: 'right' as const,
        width: 60,
        class: 'whitespace-nowrap',
        sortable: true,
      },
      { text: '', value: 'actions', width: 54 },
      { text: '', value: 'isShipped', width: 28 },
      { text: '', value: 'hasNewComment', width: 5 },
    ])

    const items = computed(() => {
      const items = getDealsResult.value?.getSpecs || []
      return items.map((item) => {
        let specNoCount = undefined
        const specNo = item.specNo || ''
        const specNoSplit = specNo.split('-')
        const hasClientUid = specNo.split(/\d{4,4}-\d{2,2}-\d{2,2}/)[0]
        if (hasClientUid) {
          specNoCount = specNoSplit[4]
        } else {
          specNoCount = specNoSplit[3]
        }
        return {
          ...item,
          specNoCount,
        }
      })
    })

    onBeforeMount(() => {
      if (route.query.clients) {
        clientsIds.value = Array.isArray(route.query.clients)
          ? (route.query.clients as string[])
          : route.query.clients.split(',')
      }
      if (profile.value?.id) {
        const searchKey = `${profile.value.id}.deals.search`
        const sortKey = `${profile.value.id}.deals.sortBy`
        const descKey = `${profile.value.id}.deals.sortDesc`
        const filterKey = `${profile.value.id}.deals.filter`

        // clear filters on clients filter
        if (route.query.clients) {
          sessionStorage.removeItem(filterKey)

          watch(clientsIds, (val) => {
            router.replace({
              path: route.path,
              query: val.length ? { clients: val } : {},
            })
          })
        }

        const searchVal = sessionStorage.getItem(searchKey)
        if (searchVal) search.value = searchVal
        const sortByVal = sessionStorage.getItem(sortKey)
        if (sortByVal) sortBy.value = JSON.parse(sortByVal)
        const sortDescVal = sessionStorage.getItem(descKey)
        if (sortDescVal) sortDesc.value = JSON.parse(sortDescVal)
        const filterVal = sessionStorage.getItem(filterKey)
        if (filterVal)
          currentFilter.value = filterVal as ClientType | CustomFilter

        watch(search, (val) => {
          if (val) {
            sessionStorage.setItem(searchKey, val)
          } else {
            sessionStorage.removeItem(searchKey)
          }
        })
        watch(sortBy, (val) => {
          if (val && val.length) {
            sessionStorage.setItem(sortKey, JSON.stringify(sortBy.value))
          } else {
            sessionStorage.removeItem(sortKey)
          }
        })
        watch(sortDesc, (val) => {
          if (val && val.length) {
            sessionStorage.setItem(descKey, JSON.stringify(sortDesc.value))
          } else {
            sessionStorage.removeItem(descKey)
          }
        })
        watch(currentFilter, (val) => {
          if (val) {
            sessionStorage.setItem(filterKey, val)
          } else {
            sessionStorage.removeItem(filterKey)
          }
        })
      }
    })

    onMounted(() => {
      const { resolveClient } = useApolloClient()
      const apolloClient = resolveClient()

      const observer = apolloClient.subscribe({
        query: SPECS_DELTA,
        fetchPolicy: 'no-cache',
      })

      observer.subscribe({
        next: ({ data }) => {
          const operation = data.delta.operation
          const typename = data.delta.payload.__typename

          logger.info(`[${typename}]: ${JSON.stringify(data)}`)

          if (operation === Operation.INSERT_SPEC) {
            const dealsData = apolloClient.readQuery<
              GetSpecs,
              GetSpecsVariables
            >({
              query: GET_SPECS,
              variables: {
                orgId: orgId as string,
                clientsIds: clientsIds.value,
                clientType: clientTypeEnum.value,
              },
            })

            if (
              !dealsData?.getSpecs?.some(
                (el) => el.id === data.delta.payload.id
              )
            ) {
              apolloClient.writeQuery<GetSpecs, GetSpecsVariables>({
                query: GET_SPECS,
                variables: {
                  orgId: orgId as string,
                  clientsIds: clientsIds.value,
                  clientType: clientTypeEnum.value,
                },
                data: {
                  getSpecs: dealsData?.getSpecs
                    ? [...dealsData.getSpecs, data.delta.payload]
                    : [data.delta.payload],
                },
              })
            }
          }

          if (operation === Operation.UPDATE_SPEC) {
            apolloClient.writeFragment({
              id: `${Typename.SPEC}:${data.delta.payload.id}`,
              fragment: SPEC_FRAGMENT,
              data: data.delta.payload,
            })
          }

          if (operation === Operation.DELETE_SPEC) {
            const dealsData = apolloClient.readQuery<
              GetSpecs,
              GetSpecsVariables
            >({
              query: GET_SPECS,
              variables: {
                orgId: orgId as string,
                clientsIds: clientsIds.value,
                clientType: clientTypeEnum.value,
              },
            })

            if (
              dealsData?.getSpecs?.some((el) => el.id === data.delta.payload.id)
            ) {
              apolloClient.writeQuery<GetSpecs, GetSpecsVariables>({
                query: GET_SPECS,
                variables: {
                  orgId: orgId as string,
                  clientsIds: clientsIds.value,
                  clientType: clientTypeEnum.value,
                },
                data: {
                  getSpecs: dealsData.getSpecs.filter(
                    (el) => el.id !== data.delta.payload.id
                  ),
                },
              })
            }
          }
        },
        error: (error) => {
          logger.warn('Error: ', error)
        },
      })
    })

    function customGroup(items: DataTableItem[]) {
      const key = 'employeeId'
      const others = [] as DataTableItem[]
      const grouped = items.reduce((acc, curr) => {
        const name = curr[key] || ''
        if (name) {
          if (Object.prototype.hasOwnProperty.call(acc, name)) {
            acc[name].push(curr)
          } else {
            acc[name] = [curr]
          }
        } else {
          others.push(curr)
        }
        return acc
      }, {} as Record<string, DataTableItem[]>)
      const result = []
      const roles = Object.keys(RoleInProject).reduce((acc, curr, index) => {
        return { ...acc, [curr]: index + 1 }
      }, {} as Record<keyof RoleInProject, number>)
      // sort by roles
      const keys = Object.keys(grouped).sort((a, b) => {
        const itemA = grouped[a][0]
        const itemB = grouped[b][0]
        return (
          roles[itemA.employeeRole as keyof RoleInProject] -
          roles[itemB.employeeRole as keyof RoleInProject]
        )
      })
      keys.forEach((k) => {
        const groupItems = grouped[k]
        const item = groupItems[0]
        const fullName = item.employeeFullName || ''
        const role = te(`role.${item.employeeRole}`)
          ? t(`role.${item.employeeRole}`)
          : item.employeeRole || ''
        const name = `${fullName} (${role})`
        const group = { name, items: groupItems }
        result.push(group)
      })
      if (others.length > 0) {
        result.push({ name: '#', items: others })
      }
      return result
    }

    function removeClientFilter(id: string) {
      clientsIds.value = clientsIds.value.filter((el) => el !== id)
    }

    function goToDeal(id: string) {
      router.push({
        name: 'spec',
        params: {
          orgId: orgId,
          specId: id,
        },
      })
    }

    async function createDeal(withoutClient = false) {
      try {
        if (withoutClient) {
          createWithoutClientLoading.value = true
        } else {
          createWithClientLoading.value = true
        }
        const response = await createDealMutate({
          orgId: orgId as string,
          clientId:
            !withoutClient && createDealClientItem.value?.id
              ? createDealClientItem.value.id
              : null,
        })
        if (response && response.data && response.data.createSpec) {
          const spec = response.data.createSpec
          await router.push({
            name: 'spec',
            params: { orgId: orgId, specId: spec.id },
          })
        }
      } catch (error) {
        // eslint-disable-line
      } finally {
        createWithoutClientLoading.value = false
        createWithClientLoading.value = false
      }
    }

    async function deleteDeal(variables: DeleteSpecVariables) {
      try {
        deleteDealId.value = variables.id
        await deleteDealMutate(variables)
      } catch (error) {
        logger.warn('[DeleteDeal]: ', error)
      } finally {
        deleteDealId.value = undefined
      }
    }

    return () => (
      <div class="container pt-4 pb-10">
        <div class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:space-x-6 pb-4">
          <TextField
            v-model={search.value}
            placeholder={t('placeholder.pageSearch')}
            controlClass={
              search.value || clientsIds.value.length > 0
                ? 'ring-1 ring-blue-500 ring-inset'
                : undefined
            }
            class="flex-grow"
            inputClass="placeholder-blue-500 dark:placeholder-blue-500"
            clearable
            onClearClick={() => {
              clientsIds.value = []
            }}
            v-slots={{
              prepend: () => (
                <>
                  <Icon class="text-gray-100 dark:text-gray-200 flex-shrink-0">
                    {ziSearch}
                  </Icon>
                  {clientsFilters.value.map((item) => (
                    <span class="h-6 inline-flex items-center rounded-lg text-white bg-gray-400 whitespace-nowrap pl-1 mr-1">
                      <span class="flex-grow pl-0.5 -mr-0.5">{item.text}</span>
                      <Btn
                        icon
                        mini
                        text
                        class="flex-shrink-0 text-gray-200"
                        onClick={() => removeClientFilter(item.value)}
                      >
                        <Icon>{ziCloseDelete}</Icon>
                      </Btn>
                    </span>
                  ))}
                </>
              ),
              // TODO: search value not cleared
              append: () =>
                clientsIds.value.length > 0 &&
                !search.value && (
                  <Btn
                    icon
                    mini
                    text
                    class="absolute right-1 rounded-full ring-inset"
                    onClick={() => {
                      clientsIds.value = []
                    }}
                  >
                    <Icon
                      base={false}
                      class="rounded-full text-lg bg-light-gray-200 dark:bg-gray-600"
                    >
                      {ziCloseDelete}
                    </Icon>
                  </Btn>
                ),
            }}
          />
          <div class="flex w-full sm:w-auto items-center justify-end">
            <Menu
              v-slots={{
                activator: () => (
                  <Btn
                    text
                    small
                    class={[
                      'group space-x-2 text-base rounded pl-2 pr-0',
                      filterMenu.value
                        ? 'text-blue-550'
                        : 'text-gray-900 dark:text-gray-100',
                    ]}
                  >
                    <span>{currentFilterText.value}</span>
                    <Icon
                      right
                      class={[
                        'group-hover:text-blue-400 group-active:text-blue-550',
                        filterMenu.value
                          ? 'text-blue-550'
                          : 'text-gray-100 dark:text-gray-200',
                      ]}
                    >
                      {currentFilter.value ? ziFilter : ziFilterOutline}
                    </Icon>
                  </Btn>
                ),
              }}
              v-models={[
                [filterMenu.value, 'modelValue'],
                [currentFilter.value, 'value'],
              ]}
              placement="bottom-end"
              arrow={false}
              skidding={8}
            >
              {filters.value.map((item, i) => (
                <MenuItem
                  key={item.value as string}
                  index={i}
                  value={item.value as string}
                  class="px-4"
                >
                  <span>{item.text}</span>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        <DataTable
          v-models={[
            [sortBy.value, 'sortBy'],
            [sortDesc.value, 'sortDesc'],
          ]}
          headers={headers.value}
          items={items.value}
          search={search.value}
          groupBy={groupBy.value}
          groupDesc={groupDesc.value}
          customGroup={customGroup}
          loading={getDealsLoading.value}
          tableClass="w-full table-fixed"
          hoverable
          v-slots={{
            'header-status': ({ header }: { header: DataTableHeaderProp }) => (
              <th style={{ width: header.width + 'px' }}>
                <div class="ml-6 w-3 h-3 rounded-full border border-gray-400" />
              </th>
            ),
            'header-hasNewComment': ({
              header,
            }: {
              header: DataTableHeaderProp
            }) => <th style={{ width: header.width + 'px' }} />,
            'header-content-isMoneyRecieved': () => (
              <>
                <Icon class="align-middle">{ziMoneyPlus}</Icon>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('deals.moneyRecieved'),
                  }}
                />
              </>
            ),
            'header-content-isExpensesPaid': () => (
              <>
                <Icon class="align-middle">{ziMoneyMinus}</Icon>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('deals.expensesPaid'),
                  }}
                />
              </>
            ),
            'header-content-finalCost': () => (
              <>
                <Icon class="align-middle">{ziMoneyTernover}</Icon>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="158"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('deals.turnoverHint'),
                  }}
                />
              </>
            ),
            'header-content-margin': () => (
              <>
                <span class="inline-block align-middle">%</span>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="158"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('deals.marginHint'),
                  }}
                />
              </>
            ),
            'header-content-specNo': ({
              header,
            }: {
              header: DataTableHeaderProp
            }) => (
              <>
                <span>{header.text}</span>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="220"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('deals.numberHint'),
                  }}
                />
              </>
            ),
            'no-data': () => (
              <div
                v-html={t('deals.noData')}
                class="text-center text-gray-200 leading-tight py-4"
              />
            ),
            items: ({ items }: { items: DataTableItem[] }) =>
              items.map((item, i) =>
                item.group ? (
                  <tr
                    key={item.groupName}
                    style={{ background: 'transparent' }}
                  >
                    <td
                      colspan={headers.value.length}
                      style={{
                        height: i === 0 ? '16px' : '32px',
                        paddingLeft: '26px',
                      }}
                      class="text-gray-200 text-base leading-tight align-bottom p-0"
                    >
                      <span class="text-gray-900 dark:text-white">
                        {item.groupName}
                      </span>{' '}
                      ({item.groupItemsCount})
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={item.id}
                    class="cursor-default"
                    tabindex="0"
                    onClick={() => goToDeal(item.id)}
                    onKeydown={(e: KeyboardEvent) => {
                      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)
                        return
                      if (e.target !== e.currentTarget) return
                      if (e.key === 'Enter') {
                        goToDeal(item.id)
                      }
                    }}
                  >
                    <td class="relative">
                      <div
                        class={[
                          'ml-6 w-3 h-3 rounded-full',
                          item.specStatus === SpecStatus.IN_STOCK
                            ? 'bg-green-500'
                            : item.specStatus === SpecStatus.IN_PRODUCTION
                            ? 'bg-yellow-500'
                            : item.specStatus === SpecStatus.IN_PROCESSING
                            ? 'bg-pink-500'
                            : 'bg-gray-800',
                        ]}
                      />
                    </td>
                    <td class="text-center">
                      {item.isMoneyRecieved && (
                        <Icon class="text-gray-200 align-middle">
                          {ziChecked}
                        </Icon>
                      )}
                    </td>
                    <td class="text-center">
                      {item.isExpensesPaid && (
                        <Icon class="text-gray-200 align-middle">
                          {ziChecked}
                        </Icon>
                      )}
                    </td>
                    <td class="truncate text-right">
                      {n(item.finalCost || 0)}
                    </td>
                    <td class="truncate text-right text-gray-200">
                      {n(item.margin || 0)}%
                    </td>
                    <td class="truncate pl-6 pr-2">{item.client?.fullName}</td>
                    <td class="truncate pr-2">
                      {item.client?.contactPersonFullName}
                    </td>
                    <td class="truncate pl-3">
                      <Tooltip
                        placement="top-start"
                        skidding="-16"
                        origin="24px 100%"
                        v-slots={{
                          activator: () => (
                            <Icon class="align-middle text-gray-200">
                              {ziNumberOffDocument}
                            </Icon>
                          ),
                        }}
                      >
                        <span>{item.specNo}</span>
                      </Tooltip>
                      {item.specNoCount && (
                        <span class="align-middle text-light-gray-400">
                          {' '}
                          - {item.specNoCount}
                        </span>
                      )}
                    </td>
                    <td>{d(parseDate(item.createdAt), 'short')}</td>
                    <td
                      class="pl-1"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                      }}
                    >
                      {item.client?.contactPhone && (
                        <>
                          <Btn
                            icon
                            text
                            mini
                            href={`tel:${item.client.contactPhone}`}
                            class="text-gray-200"
                          >
                            <Icon>{ziPhone}</Icon>
                          </Btn>
                          <Btn
                            icon
                            text
                            mini
                            disabled
                            class="text-gray-200 ml-1"
                          >
                            <Icon>{ziAction}</Icon>
                          </Btn>
                        </>
                      )}
                    </td>
                    <td class="truncate text-right">{item.client?.uid}</td>
                    <td
                      class="text-center"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                      }}
                    >
                      <Dialog
                        v-slots={{
                          activator: () => (
                            <Btn icon text mini class="text-gray-200">
                              <Icon>{ziDelete}</Icon>
                            </Btn>
                          ),
                          actionStart: () => (
                            <Btn
                              loading={deleteDealLoading.value}
                              primary={false}
                              class="text-white bg-red-700 hover:bg-red-600 active:bg-red-700 active:brightness-90 focus:ring-red-600"
                              onClick={() => deleteDeal({ id: item.id })}
                            >
                              {t('action.delete')}
                            </Btn>
                          ),
                        }}
                        bodyClass="dark:text-white p-6"
                        hideOverlay
                        icon={ziDelete}
                        title={t('action.delete')}
                        showActions
                        cancelText={t('action.cancel')}
                        loading={deleteDealLoading.value}
                      >
                        <div class="text-yellow-400 font-semibold pb-4">
                          {item.specNo}
                        </div>
                        <div>{t('alert.removeDeal')}</div>
                      </Dialog>
                    </td>
                    <td>
                      {item.shipped && (
                        <span class="inline-block align-middle h-2 w-2 rounded-full bg-cold-blue-400" />
                      )}
                    </td>
                    <td class={{ 'bg-purple-500': item.hasNewComment }} />
                  </tr>
                )
              ),
          }}
        />
        {canCreateDeal.value && (
          <>
            <Btn
              block
              outlined
              class="mt-4"
              onClick={() => {
                createDealDialog.value = true
              }}
            >
              <Icon left>{ziBagDeal}</Icon>
              <span>{t('deals.createDeal')}</span>
            </Btn>
            <Dialog
              v-model={createDealDialog.value}
              icon={ziUserPlus}
              title={t('deals.createSpecDialogHeader')}
            >
              <Autocomplete
                ref={clientSearchInputRef}
                v-models={[
                  [createDealClientItem.value, 'modelValue'],
                  [clientSearch.value, 'search'],
                ]}
                label={t('deals.createSpecDialogSearchPlaceholder')}
                placeholder={t('placeholder.startTyping')}
                items={searchClientsResult.value?.searchClients?.items || []}
                rules={[rules.required]}
                prependIcon={ziSearch}
                noFilter
                itemValue="id"
                itemText="fullName"
                returnObject
                stateIcon
                stateErrorColor="none"
                loading={searchClientsLoading.value}
                v-slots={{
                  prependItem: () => (
                    <div
                      role="option"
                      class="flex items-center jusitfy-center text-blue-500 hover:text-blue-400 cursor-pointer h-10 px-4"
                      onClick={() => {
                        createClientDialog.value = true
                      }}
                    >
                      <Icon class="mr-1">{ziPlusOutline}</Icon>
                      <span>{t('deals.createSpecDialogAddClient')}</span>
                    </div>
                  ),
                }}
              />
              <div class="flex justify-between mt-8">
                <Btn
                  disabled={createWithClientLoading.value}
                  loading={createWithoutClientLoading.value}
                  outlined
                  onClick={() => createDeal(true)}
                >
                  {t('deals.createSpecDialogWithoutClient')}
                </Btn>
                {createDealClientItem.value && (
                  <Btn
                    disabled={createWithoutClientLoading.value}
                    loading={createWithClientLoading.value}
                    onClick={() => createDeal()}
                  >
                    {t('deals.createSpecDialogAdd')}
                  </Btn>
                )}
              </div>
            </Dialog>
            <Modal
              ref={clientDialogRef}
              v-model={createClientDialog.value}
              maxWidth="1110"
              contentClass="bg-white dark:bg-gray-900 pt-8 pb-12 px-4 sm:px-5"
              // TODO: focusin error
              retainFocus={false}
            >
              <ClientForm
                ref={clientFormRef}
                orgId={orgId as string}
                create
                {...{
                  onUpdate: (input: CreateClientInput) => {
                    createClientInput.value = Object.assign(
                      {},
                      createClientInput.value,
                      input
                    )
                  },
                  'onUpdate:clientType': (val: ClientType) => {
                    createClientInput.value.clientType = val
                  },
                }}
                v-slots={{
                  actions: () => (
                    <Btn
                      loading={createClientLoading.value}
                      outlined
                      class="w-40"
                      onClick={async () => {
                        const response = await createClientMutate({
                          orgId: orgId as string,
                          input: createClientInput.value,
                        })
                        if (response?.data?.createClient) {
                          createDealClientItem.value =
                            response.data.createClient
                          createClientDialog.value = false
                          nextTick(() => {
                            createClientInput.value = {
                              clientType: ClientType.LEGAL,
                            }
                          })
                        }
                      }}
                    >
                      {t('client.save')}
                    </Btn>
                  ),
                }}
              />
            </Modal>
          </>
        )}
      </div>
    )
  },
})
