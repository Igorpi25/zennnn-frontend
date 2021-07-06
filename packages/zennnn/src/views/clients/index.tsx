import {
  ref,
  computed,
  watch,
  defineComponent,
  Transition,
  onBeforeMount,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { getObjectValueByPath } from 'vue-supp'
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
} from '@zennnn/icons'
import { Btn, Icon, Tooltip, TextField, DataTable } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { ClientType } from '@/graphql/types'
import { LIST_CLIENTS } from '@/graphql/queries'
import { DELETE_CLIENT } from '@/graphql/mutations'
import { useProfile } from '@/composables/profile'
import { logger } from '@/plugins'

import type {
  ListClients,
  ListClientsVariables,
  DeleteClient,
  DeleteClientVariables,
  ListClients_listClients_items,
} from '@/graphql/types'

type DataTableItem = ListClients_listClients_items & {
  group?: boolean
  groupName?: string
  groupItemsCount?: number
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, n } = useI18n()
    const { profile } = useProfile()

    const orgId = route.params.orgId

    const { result: listClientsResult, loading: listClientsLoading } = useQuery<
      ListClients,
      ListClientsVariables
    >(
      LIST_CLIENTS,
      () => ({
        orgId: orgId as string,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )
    const listClients = computed(
      () => listClientsResult.value?.listClients?.items
    )

    const { mutate: deleteClientMutate, loading: deleteClientLoading } =
      useMutation<DeleteClient, DeleteClientVariables>(DELETE_CLIENT, {
        update: (cache, { data: result }) => {
          const id = deleteLoading.value
          // TODO: return in result id
          logger.info('Clients delete', result?.deleteClient)

          const data = cache.readQuery<ListClients, ListClientsVariables>({
            query: LIST_CLIENTS,
            variables: {
              orgId: orgId as string,
            },
          })
          if (data?.listClients?.items?.some((item) => item.id === id)) {
            cache.writeQuery({
              query: LIST_CLIENTS,
              variables: {
                orgId: orgId,
              },
              data: {
                listClients: {
                  items: data.listClients.items.filter(
                    (item) => item.id !== id
                  ),
                },
              },
            })
          }
        },
      })

    const sortBy = ref([])
    const sortDesc = ref([])
    const clientType = ref(ClientType.LEGAL)
    const search = ref<string | undefined>()
    const deleteLoading = ref<string | undefined>()

    const tabs = computed(() => [
      {
        value: ClientType.LEGAL,
        text: t('client.legalPerson'),
        disabled: false,
      },
      {
        value: ClientType.PRIVATE,
        text: t('client.privatePerson'),
        disabled: false,
      },
      {
        value: ClientType.OTHER,
        text: t('client.other'),
        disabled: false,
      },
    ])

    const groupBy = computed(() => {
      return sortBy.value.length === 0 || sortBy.value[0] === 'fullName'
        ? ['fullName']
        : []
    })

    const groupDesc = computed(() => {
      return groupBy.value[0] === 'fullName' ? sortDesc.value : []
    })

    const headers = computed(() => {
      return [
        { text: '', value: 'zAccount', width: 50, sortable: false },
        {
          text:
            clientType.value === ClientType.PRIVATE
              ? t('clients.clientName')
              : t('clients.companyName'),
          value: 'fullName',
          align: 'left',
          width: 190,
          minWidth: 190,
          sortable: true,
        },
        { text: '', value: 'dealsSearch', width: 32, sortable: false },
        { text: '', value: 'dealsCount', width: 46, sortable: true },
        {
          text: '',
          value: 'prepayment',
          align: 'right',
          width: 100,
          sortable: true,
        },
        { text: '', value: 'debt', align: 'right', width: 100, sortable: true },
        {
          text: '',
          value: 'turnover',
          align: 'right',
          width: 100,
          sortable: true,
        },
        {
          text: t('clients.contactPerson'),
          value: 'contactPersonFullName',
          align: 'left',
          width: 186,
          class: 'pl-8 pr-2',
          sortable: true,
        },
        {
          text: t('clients.tags'),
          value: 'tagsString',
          align: 'left',
          width: 122,
          sortable: true,
        },
        {
          text: '',
          value: 'contactPhone',
          align: 'left',
          width: 64,
          minWidth: 64,
          class: 'pl-1',
          sortable: true,
        },
        {
          text: t('clients.ucn'),
          value: 'uid',
          align: 'right',
          width: 60,
          minWidth: 60,
          class: 'whitespace-nowrap',
          sortable: true,
        },
        { text: '', value: 'actions', width: 54 },
      ]
    })

    const compItems = computed(() => {
      const items = listClients.value || []
      return items.map((item) => {
        const tags = item.tags || []
        return {
          ...item,
          tagsString: tags.join(','),
        }
      })
    })

    const items = computed(() =>
      compItems.value.filter((el) => el.clientType === clientType.value)
    )

    const filteredLegalItems = computed(() => {
      const items = compItems.value.filter(
        (el) => el.clientType === ClientType.LEGAL
      )
      return filterItems(items, search.value)
    })

    const filteredPrivateItems = computed(() => {
      const items = compItems.value.filter(
        (el) => el.clientType === ClientType.PRIVATE
      )
      return filterItems(items, search.value)
    })

    const filteredOtherItems = computed(() => {
      const items = compItems.value.filter(
        (el) => el.clientType === ClientType.OTHER
      )
      return filterItems(items, search.value)
    })

    const filteredItemsLength = computed(() => {
      return {
        [ClientType.LEGAL]: filteredLegalItems.value.length,
        [ClientType.PRIVATE]: filteredPrivateItems.value.length,
        [ClientType.OTHER]: filteredOtherItems.value.length,
      } as Record<ClientType, number>
    })

    onBeforeMount(() => {
      if (route.query.clientType) {
        clientType.value = getClientTypeFromNumeric(
          Number.parseInt(route.query.clientType as string, 10)
        )
      }
      if (profile.value?.id) {
        const searchKey = `${profile.value.id}.clients.search`
        const sortKey = `${profile.value.id}.clients.sortBy`
        const descKey = `${profile.value.id}.clients.sortDesc`

        const searchVal = sessionStorage.getItem(searchKey)
        if (searchVal) search.value = searchVal
        const sortByVal = sessionStorage.getItem(sortKey)
        if (sortByVal) sortBy.value = JSON.parse(sortByVal)
        const sortDescVal = sessionStorage.getItem(descKey)
        if (sortDescVal) sortDesc.value = JSON.parse(sortDescVal)

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
      }
    })

    function customGroup(
      items: DataTableItem[],
      groupBy: [string],
      groupDesc: [boolean]
    ) {
      const key = 'fullName'
      const desc = groupDesc[0]
      const re =
        /[A-ZА-ЯҐЄІЇ\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
      const others = [] as DataTableItem[]
      const grouped = items.reduce((acc, curr) => {
        const name = curr[key] || ''
        const char = name.charAt(0).toLocaleUpperCase()
        if (re.test(char)) {
          if (Object.prototype.hasOwnProperty.call(acc, char)) {
            acc[char].push(curr)
          } else {
            acc[char] = [curr]
          }
        } else {
          others.push(curr)
        }
        return acc
      }, {} as Record<string, DataTableItem[]>)
      const result = []
      let sorted = Object.keys(grouped).sort()
      if (desc) {
        sorted = sorted.reverse()
      }
      sorted.forEach((k) => {
        const groupItems = grouped[k]
        const group = { name: k, items: groupItems }
        result.push(group)
      })
      if (others.length > 0) {
        if (desc) {
          result.unshift({ name: '#', items: others })
        } else {
          result.push({ name: '#', items: others })
        }
      }
      return result
    }

    function filterItems(items: DataTableItem[], search: string | undefined) {
      let filtered = items
      search = typeof search === 'string' ? search.trim() : undefined
      if (search) {
        filtered = items.filter((item) =>
          headers.value.some((header) => {
            const value = getObjectValueByPath(item, header.value)
            return customFilter(value, search)
          })
        )
      }
      return filtered
    }

    function customFilter(value: any, search: string | undefined) {
      if (search != undefined && value != null && typeof value !== 'boolean') {
        const words = search
          .split(',')
          .map((s) => s.trim().toLocaleLowerCase())
          .filter((s) => !!s)
        const v = value.toString().toLocaleLowerCase()
        return words.every((w) => v.indexOf(w) !== -1)
      } else {
        return false
      }
    }

    function switchClientType(type: ClientType) {
      if (type === clientType.value) return
      clientType.value = type
      const clientTypeNum = getClientTypeNumeric(type)
      router.replace({
        path: route.path,
        query:
          clientTypeNum > 1
            ? {
                clientType: clientTypeNum,
              }
            : {},
      })
    }

    function getClientTypeNumeric(type: ClientType | null) {
      switch (type) {
        case ClientType.LEGAL:
          return 1
        case ClientType.PRIVATE:
          return 2
        case ClientType.OTHER:
          return 3
        default:
          return 1
      }
    }

    function getClientTypeFromNumeric(num: number | undefined) {
      switch (num) {
        case 1:
          return ClientType.LEGAL
        case 2:
          return ClientType.PRIVATE
        case 3:
          return ClientType.OTHER
        default:
          return ClientType.LEGAL
      }
    }

    function goToClient(item: ListClients_listClients_items) {
      router.push({
        name: 'client',
        params: {
          orgId: orgId,
          groupId: item.groupId,
          clientId: item.id,
        },
        query: {
          clientType: getClientTypeNumeric(item.clientType),
        },
      })
    }

    function goToClientSpecs(item: ListClients_listClients_items) {
      router.push({
        name: 'specs',
        params: {
          orgId: orgId,
        },
        query: {
          clients: [item.id],
        },
      })
    }

    async function deleteClient(id: string) {
      try {
        deleteLoading.value = id
        await deleteClientMutate({ id })
      } catch (error) {
        logger.warn('[DeleteClient]: ', error)
      } finally {
        deleteLoading.value = undefined
      }
    }

    return () => (
      <div class="container pt-4 pb-10">
        <div class="flex items-end flex-wrap lg:flex-nowrap justify-between">
          <TextField
            v-model={search.value}
            placeholder={t('placeholder.pageSearch')}
            controlClass={
              search.value ? 'ring-1 ring-blue-500 ring-inset' : undefined
            }
            prependIcon={ziSearch}
            class="w-full lg:w-auto lg:flex-grow md:max-w-md pb-4 lg:pr-8"
            inputClass="placeholder-blue-500 dark:placeholder-blue-500"
            clearable
          />
          <div class="h-11 flex lg:inline-flex space-x-1 overflow-x-auto scrolling-touch">
            {tabs.value.map((item) => (
              <div
                aria-selected={clientType.value === item.value}
                key={item.value}
                class={[
                  'w-full sm:w-auto flex items-center justify-center rounded-t',
                  'select-none whitespace-nowrap cursor-pointer',
                  'transition-colors duration-100 ease-in px-10',
                  item.disabled
                    ? 'pointer-events-none opacity-40'
                    : 'focus:outline-none focus:ring focus:ring-blue-400 focus:ring-inset with-focus-visible hover:text-gray-900 dark:hover:text-white',
                  clientType.value === item.value
                    ? 'text-gray-900 dark:text-white bg-light-gray-100 dark:bg-gray-800'
                    : 'text-gray-200 dark:text-gray-100 bg-transparent',
                ]}
                role={item.disabled ? undefined : 'tab'}
                tabindex={item.disabled ? undefined : 0}
                onClick={() => switchClientType(item.value)}
                onKeydown={(e: KeyboardEvent) => {
                  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return
                  if (e.key === 'Enter') {
                    switchClientType(item.value)
                  }
                }}
              >
                <span class="relative">
                  <div class="absolute -top-1 -right-1 text-13 font-semibold translate-x-full">
                    <Transition
                      name="scale-transition"
                      v-slots={{
                        default: () =>
                          search.value &&
                          clientType.value !== item.value &&
                          filteredItemsLength.value[item.value] > 0 && (
                            <div class="origin-center h-4 min-w-[1rem] flex justify-center items-center relative rounded-full text-white bg-purple-500 px-0.5">
                              {filteredItemsLength.value[item.value] > 99
                                ? '99+'
                                : filteredItemsLength.value[item.value]}
                            </div>
                          ),
                      }}
                    />
                  </div>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DataTable
          v-models={[
            [sortBy.value, 'sortBy'],
            [sortDesc.value, 'sortDesc'],
          ]}
          headers={headers.value as any}
          items={items.value}
          search={search.value}
          customFilter={customFilter}
          groupBy={groupBy.value}
          groupDesc={groupDesc.value}
          customGroup={customGroup}
          loading={listClientsLoading.value}
          table-width="100%"
          table-class="table-fixed rounded-tl-none lg:rounded-tl-md rounded-tr-none sm:rounded-tr-md md:rounded-tr-none"
          hoverable
          v-slots={{
            'header-content-dealsSearch': () => (
              <Tooltip
                placement="top-start"
                distance="2"
                skidding="-16"
                origin="24px 100%"
                maxWidth="162"
                v-slots={{
                  activator: () => (
                    <Icon class="text-blue-500 align-middle">
                      {ziQuestionSign}
                    </Icon>
                  ),
                  default: () => t('clients.dealsSearchHint'),
                }}
              />
            ),
            'header-content-dealsCount': () => (
              <>
                <Icon size="20" class="align-middle">
                  {ziBagDeal}
                </Icon>
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
                    default: () => t('clients.currentDealsAmount'),
                  }}
                />
              </>
            ),
            'header-content-prepayment': () => (
              <>
                <Icon class="align-middle">{ziMoneyPlus}</Icon>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="152"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('clients.totalPrepaymentHint'),
                  }}
                />
              </>
            ),
            'header-content-debt': () => (
              <>
                <Icon class="align-middle">{ziMoneyMinus}</Icon>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="200"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('clients.debtHint'),
                  }}
                />
              </>
            ),
            'header-content-turnover': () => (
              <>
                <Icon class="align-middle">{ziMoneyTernover}</Icon>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="135"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('clients.turnoverHint'),
                  }}
                />
              </>
            ),
            'header-content-contactPhone': () => <Icon>{ziPhone}</Icon>,
            'no-data': () => (
              <div
                v-html={t('clients.noData')}
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
                        paddingLeft: '51px',
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
                    onClick={() => goToClient(item)}
                    onKeydown={(e: KeyboardEvent) => {
                      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)
                        return
                      if (e.target !== e.currentTarget) return
                      if (e.key === 'Enter') {
                        goToClient(item)
                      }
                    }}
                  >
                    <td></td>
                    <td class="truncate">{item.fullName}</td>
                    <td
                      class="text-center"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                      }}
                    >
                      <Btn
                        icon
                        text
                        mini
                        class="text-gray-200"
                        {...{ onClick: () => goToClientSpecs(item) }}
                      >
                        <Icon>{ziSearch}</Icon>
                      </Btn>
                    </td>
                    <td class="truncate text-right">
                      {n(item.dealsCount || 0)}
                    </td>
                    <td class="truncate text-right">
                      {n(item.prepayment || 0)}
                    </td>
                    <td
                      class={[
                        'truncate text-right',
                        { 'text-pink-500': item.debt && item.debt > 0 },
                      ]}
                    >
                      {n(item.debt || 0)}
                    </td>
                    <td class="truncate text-right">{n(item.turnover || 0)}</td>
                    <td class="truncate pl-8 pr-2">
                      {item.contactPersonFullName}
                    </td>
                    <td class="whitespace-nowrap pr-3">
                      <div class="overflow-x-scroll scrolling-touch scrollbar-hidden flex items-center align-middle rounded-lg space-x-1">
                        {item.tags?.map((tag) => (
                          <div class="h-6 inline-flex items-center bg-light-gray-550 dark:bg-gray-400 rounded-lg px-1">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td
                      class="pl-1"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                      }}
                    >
                      {item.contactPhone && (
                        <>
                          <Btn
                            icon
                            text
                            mini
                            href={`tel:${item.contactPhone}`}
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
                    <td class="truncate text-right">{item.uid}</td>
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
                              loading={deleteClientLoading.value}
                              primary={false}
                              class="text-white bg-red-700 hover:bg-red-600 active:bg-red-600 focus:ring-red-600"
                              {...{
                                onClick: () => {
                                  deleteClient(item.id)
                                },
                              }}
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
                        loading={deleteClientLoading.value}
                      >
                        <div class="text-yellow-400 font-semibold pb-4">
                          {[item.uid, item.fullName]
                            .filter((el) => !!el)
                            .join(' - ')}
                        </div>
                        <div>{t('alert.removeClient')}</div>
                      </Dialog>
                    </td>
                  </tr>
                )
              ),
          }}
        />
        <Btn
          block
          outlined
          class="mt-4"
          {...{
            onClick: () => {
              router.push({
                name: 'client-create',
                params: { orgId },
                query: { clientType: clientType.value },
              })
            },
          }}
        >
          <Icon left>{ziUserPlus}</Icon>
          <span>{t('clients.createClient')}</span>
        </Btn>
      </div>
    )
  },
})
