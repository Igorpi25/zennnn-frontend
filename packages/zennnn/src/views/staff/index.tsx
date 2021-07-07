import {
  ref,
  computed,
  watch,
  defineComponent,
  onBeforeMount,
  nextTick,
} from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { convertToUnit } from 'vue-supp'
import { ziSearch, ziDelete, ziUserPlus, ziChevronRight } from '@zennnn/icons'
import { Btn, Icon, TextField, DataTable, Switch } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { parseDate } from 'shared/utils/date'
import { SpecStatus, InvitationStatus } from '@/graphql/types'
import { LIST_STAFF } from '@/graphql/queries'
import { CANCEL_INVITATION, REMOVE_USER_FROM_ORG } from '@/graphql/mutations'
import StaffCreateForm from '@/components/StaffCreateForm'
import { useProfile } from '@/composables/profile'
import { logger } from '@/plugins'

import type {
  ListStaff,
  ListStaffVariables,
  CancelInvitation,
  CancelInvitationVariables,
  RemoveUserFromOrg,
  RemoveUserFromOrgVariables,
  ListStaff_listStaff_items,
  ListStaff_listStaff_invitations,
  ListStaff_listStaff_items_specs,
} from '@/graphql/types'

type DataTableItem = ListStaff_listStaff_items &
  ListStaff_listStaff_invitations & {
    fullName?: string
    isStaff?: boolean
    type?: 'staff' | 'invitations'
    role?: string
    isInvitation?: boolean
    statusText?: string
  } & {
    group?: boolean
    groupName?: string
    groupItemsCount?: number
  }

interface DataTableHeaderProp {
  text: string
  value: string
  width?: string | number
}

type SubHeadersKeys =
  | keyof ListStaff_listStaff_items_specs
  | 'status'
  | 'margin'
  | 'actions'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { t, te, n, d } = useI18n()
    const { profile } = useProfile()

    const orgId = route.params.orgId
    const createStaffDialogRef = ref()
    const createStaffDialog = ref(false)
    const expanded = ref<string[]>([])
    const sortBy = ref([])
    const sortDesc = ref([])
    const search = ref<string | undefined>()
    // TODO: add id on removeUser mutation
    const removeUserId = ref<string>()
    // TODO: add id on cancel invitation mutation
    const cancelInvitationId = ref<string>()

    const { result: listStaffResult, loading: listStaffLoading } = useQuery<
      ListStaff,
      ListStaffVariables
    >(
      LIST_STAFF,
      () => ({
        orgId: orgId as string,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )
    const listStaff = computed(() => listStaffResult.value?.listStaff)

    const { mutate: cancelInvitationMutate, loading: cancelInvitationLoading } =
      useMutation<CancelInvitation, CancelInvitationVariables>(
        CANCEL_INVITATION,
        {
          update: (cache, { data: result }) => {
            const id = cancelInvitationId.value
            // TODO: return in result id
            logger.info('Cancel invitation', result?.cancelInvitation)

            const data = cache.readQuery<ListStaff, ListStaffVariables>({
              query: LIST_STAFF,
              variables: {
                orgId: orgId as string,
              },
            })
            if (data?.listStaff?.invitations?.some((item) => item.id === id)) {
              cache.writeQuery<ListStaff, ListStaffVariables>({
                query: LIST_STAFF,
                variables: {
                  orgId: orgId as string,
                },
                data: {
                  listStaff: {
                    ...data.listStaff,
                    invitations: data.listStaff.invitations.filter(
                      (item) => item.id !== id
                    ),
                  },
                },
              })
            }
          },
        }
      )

    const {
      mutate: removeUserFromOrgMutate,
      loading: removeUserFromOrgLoading,
    } = useMutation<RemoveUserFromOrg, RemoveUserFromOrgVariables>(
      REMOVE_USER_FROM_ORG,
      {
        update: (cache, { data: result }) => {
          const id = removeUserId.value
          // TODO: return in result id
          logger.info('Staff remove', result?.removeUserFromOrg)

          const data = cache.readQuery<ListStaff, ListStaffVariables>({
            query: LIST_STAFF,
            variables: {
              orgId: orgId as string,
            },
          })
          if (data?.listStaff?.items?.some((item) => item.id === id)) {
            cache.writeQuery<ListStaff, ListStaffVariables>({
              query: LIST_STAFF,
              variables: {
                orgId: orgId as string,
              },
              data: {
                listStaff: {
                  ...data.listStaff,
                  items: data.listStaff.items.filter((item) => item.id !== id),
                },
              },
            })
          }
        },
      }
    )

    const headers = computed(() => [
      {
        text: t('staff.inWork'),
        value: 'processing',
        align: 'right' as const,
        width: 100,
        minWidth: 100,
        sortable: true,
      },
      {
        text: t('staff.diff'),
        value: 'diff',
        align: 'right' as const,
        width: 105,
        minWidth: 105,
        sortable: true,
      },
      {
        text: t('staff.percent'),
        value: 'totalMargin',
        align: 'right' as const,
        width: 66,
        minWidth: 66,
        sortable: true,
      },
      {
        text: t('staff.revenue'),
        value: 'revenue',
        align: 'right' as const,
        width: 118,
        minWidth: 118,
        sortable: true,
      },
      {
        text: t('staff.costOfGoods'),
        value: 'totalItemsCost',
        align: 'right' as const,
        width: 140,
        minWidth: 140,
        sortable: true,
      },
      {
        text: t('staff.staffName'),
        value: 'fullName',
        align: 'left' as const,
        width: 220,
        minWidth: 220,
        class: 'whitespace-nowrap pl-16',
        sortable: true,
      },
      {
        text: t('staff.access'),
        value: 'role',
        align: 'left' as const,
        width: 132,
        minWidth: 132,
        class: 'whitespace-nowrap',
        sortable: true,
      },
      {
        text: t('staff.accessControl'),
        value: 'accessControl',
        align: 'left' as const,
        width: 75,
        minWidth: 75,
        class: 'whitespace-nowrap',
        sortable: false,
      },
      { text: '', value: 'actions', width: 40, minWidth: 40 },
      { text: '', value: 'expand', width: 50, minWidth: 50 },
    ])

    const subHeaders = computed(() => [
      {
        text: '',
        value: 'status',
        align: 'right' as const,
        width: 100,
        minWidth: 100,
      },
      {
        text: '',
        value: 'diff',
        align: 'right' as const,
        width: 105,
        minWidth: 105,
      },
      {
        text: '',
        value: 'margin',
        align: 'right' as const,
        width: 66,
        minWidth: 66,
      },
      {
        text: '',
        value: 'revenue',
        align: 'right' as const,
        width: 118,
        minWidth: 118,
      },
      {
        text: '',
        value: 'totalItemsCost',
        align: 'right' as const,
        width: 140,
        minWidth: 140,
      },
      {
        text: '',
        value: 'specNo',
        align: 'left' as const,
        width: 220,
        minWidth: 220,
        class: 'whitespace-nowrap pl-16',
      },
      {
        text: '',
        value: 'clientFullName',
        align: 'left' as const,
        width: 207,
        minWidth: 207,
        class: 'whitespace-nowrap',
      },
      { text: '', value: 'actions', width: 40, minWidth: 40 },
      { text: '', value: 'shipped', width: 50, minWidth: 50 },
    ])

    const subHeadersWidthMap = computed(() => {
      return (subHeaders.value || []).reduce((acc, curr) => {
        acc[curr.value as SubHeadersKeys] = convertToUnit(curr.width)
        return acc
      }, {} as Record<SubHeadersKeys, string | undefined>)
    })

    const items = computed(() => {
      const roleFilter = (val: string | null) => {
        return te(`role.${val}`) ? t(`role.${val}`) : val
      }
      const statusFilter = (val: string) => {
        return te(`invitationStatus.${val}`)
          ? t(`invitationStatus.${val}`)
          : val
      }
      const items = listStaff.value?.items || []
      const invitations = listStaff.value?.invitations || []
      const staffItems = items.map((item) => {
        return {
          ...item,
          // for search
          fullName: `${item.givenName} ${item.familyName}`,
          isStaff: true,
          type: 'staff',
          role: roleFilter(item.role),
        }
      })
      const invitationsItems = invitations.map((item) => {
        return {
          ...item,
          // for search
          fullName: `${item.invitationGivenName} ${item.invitationFamilyName}`,
          isInvitation: true,
          type: 'invitations',
          role: roleFilter(item.invitationRole),
          statusText: statusFilter(item.status),
        }
      })
      return [...staffItems, ...invitationsItems]
    })

    watch(createStaffDialog, (val) => {
      if (val) {
        nextTick(() => {
          createStaffDialogRef.value && createStaffDialogRef.value.reset()
          nextTick(() => {
            createStaffDialogRef.value && createStaffDialogRef.value.focus()
          })
        })
      }
    })

    onBeforeMount(() => {
      if (profile.value?.id) {
        const searchKey = `${profile.value.id}.staff.search`
        const sortKey = `${profile.value.id}.staff.sortBy`
        const descKey = `${profile.value.id}.staff.sortDesc`

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

    function toggleExpanded(id: string) {
      if (expanded.value.indexOf(id) > -1) {
        const expIndex = expanded.value.indexOf(id)
        expanded.value.splice(expIndex, 1)
      } else {
        expanded.value.push(id)
      }
    }

    async function removeUser(variables: RemoveUserFromOrgVariables) {
      try {
        removeUserId.value = variables.userId
        await removeUserFromOrgMutate(variables)
      } catch (error) {
        logger.warn('[RemoveUser]: ', error)
      } finally {
        removeUserId.value = undefined
      }
    }

    async function cancelInvitation(variables: CancelInvitationVariables) {
      try {
        cancelInvitationId.value = variables.id
        await cancelInvitationMutate(variables)
      } catch (error) {
        logger.warn('[CancelInvitation]: ', error)
      } finally {
        cancelInvitationId.value = undefined
      }
    }

    return () => (
      <div class="container pt-4 pb-10">
        <Dialog
          v-model={createStaffDialog.value}
          icon={ziUserPlus}
          title={t('staff.addStaff')}
          bodyClass="p-0"
          {...{
            onSuccess: () => {
              createStaffDialog.value = false
            },
          }}
        >
          <StaffCreateForm ref={createStaffDialogRef} orgId={orgId as string} />
        </Dialog>

        <TextField
          v-model={search.value}
          placeholder={t('placeholder.pageSearch')}
          controlClass={
            search.value ? 'ring-1 ring-blue-500 ring-inset' : undefined
          }
          prependIcon={ziSearch}
          class="w-full pb-4"
          inputClass="placeholder-blue-500 dark:placeholder-blue-500"
          clearable
        />

        <DataTable
          v-models={[
            [sortBy.value, 'sortBy'],
            [sortDesc.value, 'sortDesc'],
          ]}
          headers={headers.value}
          items={items.value}
          search={search.value}
          groupBy={['type']}
          groupDesc={[true]}
          loading={listStaffLoading.value}
          table-width="100%"
          table-class="table-fixed"
          v-slots={{
            'header-content-processing': () => (
              <span class="truncate inline-block max-w-full align-middle pl-6">
                {t('staff.inWork')}
              </span>
            ),
            'header-content-fullName': ({
              header,
            }: {
              header: DataTableHeaderProp
            }) => (
              <span
                class="truncate inline-block align-middle"
                style={{ maxWidth: (header.width as number) - 88 + 'px' }}
              >
                {header.text}
              </span>
            ),
            'header-content-role': ({
              header,
            }: {
              header: DataTableHeaderProp
            }) => (
              <span
                class="truncate inline-block align-middle"
                style={{ maxWidth: (header.width as number) - 24 + 'px' }}
              >
                {header.text}
              </span>
            ),
            'no-data': () => (
              <div
                v-html={t('staff.noData')}
                class="text-center text-gray-200 leading-tight py-4"
              />
            ),
            items: ({ items }: { items: DataTableItem[] }) =>
              items.map((item) => (
                <>
                  {!item.group && (
                    <tr
                      key={item.id}
                      class={[
                        { 'hover:bg-gray-500 cursor-default': item.isStaff },
                        {
                          'text-white expanded': expanded.value.includes(
                            item.id
                          ),
                        },
                      ]}
                      onClick={() => {
                        item.isStaff ? toggleExpanded(item.id) : false
                      }}
                    >
                      <td
                        colspan={item.isStaff ? 1 : 2}
                        class={{ 'bg-gray-400': item.isInvitation }}
                      >
                        {item.isStaff ? (
                          <div class="flex items-center justify-between">
                            <div
                              class={[
                                'w-3 h-3 rounded-full ml-5 mr-3',
                                item.specStatus === SpecStatus.IN_STOCK
                                  ? 'bg-green-500'
                                  : item.specStatus === SpecStatus.IN_PRODUCTION
                                  ? 'bg-yellow-500'
                                  : item.specStatus === SpecStatus.IN_PROCESSING
                                  ? 'bg-pink-500'
                                  : 'bg-gray-800',
                              ]}
                            />
                            <div class="truncate">{item.processing}</div>
                          </div>
                        ) : (
                          <span class="whitespace-nowrap pl-4">
                            {t('staff.invitationFrom')}:
                            {d(parseDate(item.createdAt), 'short')}
                          </span>
                        )}
                      </td>
                      {item.isStaff && (
                        <td
                          class={[
                            'truncate text-right',
                            { 'text-green-500': item.diff && item.diff > 0 },
                            { 'text-pink-500': item.diff && item.diff < 0 },
                          ]}
                        >
                          {n(item.diff || 0)}
                        </td>
                      )}
                      <td
                        colspan={item.isStaff ? 1 : 2}
                        class={{
                          'truncate text-right': true,
                          'bg-gray-400': item.isInvitation,
                        }}
                      >
                        {item.isStaff ? (
                          <span>{n(item.totalMargin || 0)}%</span>
                        ) : (
                          <span class="pl-8">{item.invitationEmail}</span>
                        )}
                      </td>
                      {item.isStaff && (
                        <td class="truncate text-right">
                          {n(item.revenue || 0)}
                        </td>
                      )}
                      <td
                        class={{
                          'truncate text-right': true,
                          'bg-gray-400': item.isInvitation,
                        }}
                      >
                        {item.isStaff ? (
                          <span>{n(item.totalItemsCost || 0)}</span>
                        ) : (
                          <span
                            class={[
                              'text-left block align-middle pl-12',
                              item.status === InvitationStatus.PENDING
                                ? 'text-yellow-500'
                                : item.status === InvitationStatus.DECLINED
                                ? 'text-pink-500'
                                : item.status === InvitationStatus.ACCEPTED
                                ? 'text-green-500'
                                : '',
                            ]}
                          >
                            {item.statusText}
                          </span>
                        )}
                      </td>
                      <td
                        class={{
                          'truncate text-left leading-tight pl-16': true,
                          'bg-gray-400': item.isInvitation,
                        }}
                      >
                        {item.fullName}
                      </td>
                      <td
                        class={{
                          'truncate text-left': true,
                          'bg-gray-400': item.isInvitation,
                        }}
                      >
                        {item.role}
                      </td>
                      <td
                        class={{ 'bg-gray-400': item.isInvitation }}
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation()
                        }}
                      >
                        {item.isStaff && <Switch hideDetails disabled />}
                      </td>
                      <td
                        class={{
                          'text-center': true,
                          'bg-gray-400': item.isInvitation,
                        }}
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
                                loading={
                                  removeUserFromOrgLoading.value ||
                                  cancelInvitationLoading.value
                                }
                                primary={false}
                                class="text-white bg-red-700 hover:bg-red-600 active:bg-red-600 focus:ring-red-600"
                                {...{
                                  onClick: () => {
                                    if (item.isStaff) {
                                      removeUser({
                                        orgId: orgId as string,
                                        userId: item.id,
                                      })
                                    } else {
                                      cancelInvitation({
                                        id: item.id,
                                      })
                                    }
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
                          loading={
                            removeUserFromOrgLoading.value ||
                            cancelInvitationLoading.value
                          }
                        >
                          <div class="text-yellow-400 font-semibold pb-4">
                            {[item.fullName, item.role]
                              .filter((el) => !!el)
                              .join(' - ')}
                          </div>
                          <div>{t('alert.removeEmployee')}</div>
                        </Dialog>
                      </td>
                      <td
                        class={{
                          'text-center': true,
                          'bg-gray-400': item.isInvitation,
                        }}
                      >
                        {item.isStaff && (
                          <Btn
                            icon
                            text
                            mini
                            retainFocusOnClick
                            {...{
                              onClick: (e: MouseEvent) => {
                                e.stopPropagation()
                                toggleExpanded(item.id)
                              },
                            }}
                          >
                            <Icon
                              class={{
                                'transition-transform': true,
                                'rotate-90': expanded.value.includes(item.id),
                              }}
                            >
                              {ziChevronRight}
                            </Icon>
                          </Btn>
                        )}
                      </td>
                    </tr>
                  )}
                  {expanded.value.includes(item.id) && (
                    <tr
                      key={`expand-${item.id}`}
                      class="expand bg-gray-700"
                      style="background-color: #282828"
                    >
                      <td colspan={headers.value.length} class="relative p-0">
                        <div class="absolute inset-x-0 top-0 pointer-events-none opacity-50 h-6 bg-gradient-to-b from-gray-900 to-gray-900/0 -mt-1" />
                        {!item.specs ||
                          (item.specs.length === 0 && (
                            <div
                              v-html={t('dataTable.noData')}
                              class="bg-gray-700 rounded-b-md text-center text-gray-200 leading-tight py-4 -mt-1"
                            />
                          ))}
                        {item.specs && item.specs.length > 0 && (
                          <DataTable
                            headers={subHeaders.value}
                            items={item.specs}
                            rounded={false}
                            scrollable={false}
                            hideHeaders
                            class="w-full"
                            tableClass="table-fixed -mt-1"
                            v-slots={{
                              items: ({
                                items: subItems,
                              }: {
                                items: ListStaff_listStaff_items_specs[]
                              }) =>
                                subItems.map((subItem, i) => (
                                  <tr
                                    key={subItem.id}
                                    class="bg-gray-700"
                                    style="background-color: #282828"
                                  >
                                    <td
                                      style={{
                                        width: subHeadersWidthMap.value.status,
                                        minWidth:
                                          subHeadersWidthMap.value.status,
                                      }}
                                      class={{
                                        'bg-gray-700': true,
                                        'rounded-bl-md':
                                          i + 1 === subItems.length,
                                      }}
                                    >
                                      <div class="flex items-center justify-between">
                                        <div class="w-3 h-3 flex items-center justify-center ml-5 mr-3">
                                          <div
                                            class={[
                                              'w-2 h-2 rounded-full',
                                              subItem.specStatus ===
                                              SpecStatus.IN_STOCK
                                                ? 'bg-green-500'
                                                : subItem.specStatus ===
                                                  SpecStatus.IN_PRODUCTION
                                                ? 'bg-yellow-500'
                                                : subItem.specStatus ===
                                                  SpecStatus.IN_PROCESSING
                                                ? 'bg-pink-500'
                                                : 'bg-gray-800',
                                            ]}
                                          />
                                        </div>
                                        <div class="flex">
                                          <div class="w-6 text-right">
                                            {subItem.isMoneyRecieved && (
                                              <span>+$</span>
                                            )}
                                          </div>
                                          <div class="w-6 text-right">
                                            {subItem.isExpensesPaid && (
                                              <span>-$</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        width: subHeadersWidthMap.value.diff,
                                        minWidth: subHeadersWidthMap.value.diff,
                                      }}
                                      class="bg-gray-700 truncate text-right"
                                    >
                                      {n(subItem.diff || 0)}
                                    </td>
                                    <td
                                      style={{
                                        width: subHeadersWidthMap.value.margin,
                                        minWidth:
                                          subHeadersWidthMap.value.margin,
                                      }}
                                      class="bg-gray-700 truncate text-right"
                                    >
                                      {n(subItem.totalMargin || 0)}%
                                    </td>
                                    <td
                                      style={{
                                        width: subHeadersWidthMap.value.revenue,
                                        minWidth:
                                          subHeadersWidthMap.value.revenue,
                                      }}
                                      class="bg-gray-700 truncate text-right"
                                    >
                                      {n(subItem.revenue || 0)}
                                    </td>
                                    <td
                                      style={{
                                        width:
                                          subHeadersWidthMap.value
                                            .totalItemsCost,
                                        minWidth:
                                          subHeadersWidthMap.value
                                            .totalItemsCost,
                                      }}
                                      class="bg-gray-700 truncate text-right"
                                    >
                                      {n(subItem.totalItemsCost || 0)}
                                    </td>
                                    <td
                                      style={{
                                        width: subHeadersWidthMap.value.specNo,
                                        minWidth:
                                          subHeadersWidthMap.value.specNo,
                                      }}
                                      class="bg-gray-700 truncate text-left leading-tight pl-16"
                                    >
                                      <span class="whitespace-nowrap pl-5">
                                        {subItem.specNo || ''}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        width:
                                          subHeadersWidthMap.value
                                            .clientFullName,
                                        minWidth:
                                          subHeadersWidthMap.value
                                            .clientFullName,
                                      }}
                                      class="bg-gray-700 truncate text-left"
                                    >
                                      <span class="whitespace-nowrap pl-5">
                                        {subItem.clientFullName}
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        width: subHeadersWidthMap.value.actions,
                                        minWidth:
                                          subHeadersWidthMap.value.actions,
                                        overflow: 'visible',
                                      }}
                                      class="bg-gray-700 text-right"
                                    >
                                      <Btn
                                        icon
                                        text
                                        mini
                                        {...{ tabindex: -1 }}
                                        class="text-gray-200 -mr-3"
                                        to={{
                                          name: 'spec',
                                          params: {
                                            orgId,
                                            specId: subItem.id,
                                          },
                                        }}
                                      >
                                        <Icon>{ziSearch}</Icon>
                                      </Btn>
                                    </td>
                                    <td
                                      style={{
                                        width: subHeadersWidthMap.value.shipped,
                                        minWidth:
                                          subHeadersWidthMap.value.shipped,
                                      }}
                                      class={{
                                        'bg-gray-700 text-center': true,
                                        'rounded-br-md':
                                          i + 1 === subItems.length,
                                      }}
                                    >
                                      {subItem.shipped && (
                                        <span class="inline-block align-middle h-2 w-2 rounded-full bg-cold-blue-400" />
                                      )}
                                    </td>
                                  </tr>
                                )),
                            }}
                          ></DataTable>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              )),
          }}
        />
        <Btn
          block
          outlined
          class="mt-4"
          {...{
            onClick: () => {
              createStaffDialog.value = true
            },
          }}
        >
          <Icon left>{ziUserPlus}</Icon>
          <span>{t('staff.addStaff')}</span>
        </Btn>
      </div>
    )
  },
})
