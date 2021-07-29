import { ref, computed, watch, defineComponent, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  ziSearch,
  ziDelete,
  ziBagDeal,
  ziAction,
  ziPhone,
  ziMoneyPlus,
  ziMoneyMinus,
  ziMoneyTernover,
  ziQuestionSign,
  ziBoxes,
} from '@zennnn/icons'
import { Btn, Icon, Tooltip, TextField, DataTable } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { LIST_SUPPLIERS } from '@/graphql/queries'
import { DELETE_SUPPLIER } from '@/graphql/mutations'
import { useProfile } from '@/composables/profile'
import { logger } from '@/plugins'

import type {
  ListSuppliers,
  ListSuppliersVariables,
  DeleteSupplier,
  DeleteSupplierVariables,
  ListSuppliers_listSuppliers_items,
} from '@/graphql/types'

type DataTableItem = ListSuppliers_listSuppliers_items & {
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
    const sortBy = ref([])
    const sortDesc = ref([])
    const search = ref<string>()
    // TODO: add id on deleteSupplier mutation
    const deleteSupplierId = ref<string>()

    const { result: listSuppliersResult, loading: listSuppliersLoading } =
      useQuery<ListSuppliers, ListSuppliersVariables>(
        LIST_SUPPLIERS,
        () => ({
          orgId: orgId as string,
        }),
        {
          fetchPolicy: 'cache-and-network',
        }
      )
    const listSuppliers = computed(
      () => listSuppliersResult.value?.listSuppliers?.items
    )

    const { mutate: deleteSupplierMutate, loading: deleteSupplierLoading } =
      useMutation<DeleteSupplier, DeleteSupplierVariables>(DELETE_SUPPLIER, {
        update: (cache, { data: result }) => {
          const id = deleteSupplierId.value
          // TODO: return in result id
          logger.info('Suppliers delete', result?.deleteSupplier)

          const data = cache.readQuery<ListSuppliers, ListSuppliersVariables>({
            query: LIST_SUPPLIERS,
            variables: {
              orgId: orgId as string,
            },
          })
          if (data?.listSuppliers?.items?.some((item) => item.id === id)) {
            cache.writeQuery<ListSuppliers, ListSuppliersVariables>({
              query: LIST_SUPPLIERS,
              variables: {
                orgId: orgId as string,
              },
              data: {
                listSuppliers: {
                  items: data.listSuppliers.items.filter(
                    (item) => item.id !== id
                  ),
                },
              },
            })
          }
        },
      })

    const groupBy = computed(() =>
      sortBy.value.length === 0 || sortBy.value[0] === 'companyName'
        ? ['companyName']
        : []
    )

    const groupDesc = computed(() =>
      groupBy.value[0] === 'companyName' ? sortDesc.value : []
    )

    const headers = computed(() => [
      { text: '', value: 'zAccount', width: 50, sortable: false },
      {
        text: t('suppliers.companyName'),
        value: 'companyName',
        align: 'left' as const,
        width: 222,
        minWidth: 222,
        sortable: true,
      },
      { text: '', value: 'dealsCount', width: 46, sortable: true },
      {
        text: '',
        value: 'cost',
        align: 'right' as const,
        width: 100,
        sortable: true,
      },
      {
        text: '',
        value: 'debt',
        align: 'right' as const,
        width: 100,
        sortable: true,
      },
      {
        text: '',
        value: 'totalCost',
        align: 'right' as const,
        width: 100,
        sortable: true,
      },
      {
        text: t('suppliers.contactPerson'),
        value: 'contactPersonFullName',
        align: 'left' as const,
        width: 186,
        class: 'pl-8 pr-2',
        sortable: true,
      },
      {
        text: t('suppliers.tags'),
        value: 'tagsString',
        align: 'left' as const,
        width: 122,
        sortable: true,
      },
      {
        text: '',
        value: 'contactPhone',
        align: 'left' as const,
        width: 64,
        minWidth: 64,
        class: 'pl-1',
        sortable: true,
      },
      {
        text: t('suppliers.usn'),
        value: 'uid',
        align: 'right' as const,
        width: 60,
        minWidth: 60,
        class: 'whitespace-nowrap',
        sortable: true,
      },
      { text: '', value: 'actions', width: 54 },
    ])

    const items = computed(() => {
      const items = listSuppliers.value || []
      return items.map((item) => {
        const tags = item.tags || []
        return {
          ...item,
          tagsString: tags.join(','),
        }
      })
    })

    onBeforeMount(() => {
      if (profile.value?.id) {
        const searchKey = `${profile.value.id}.suppliers.search`
        const sortKey = `${profile.value.id}.suppliers.sortBy`
        const descKey = `${profile.value.id}.suppliers.sortDesc`

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
      const key = 'companyName'
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

    function goToSupplier(supplierId: string) {
      router.push({
        name: 'supplier',
        params: {
          orgId: orgId,
          supplierId,
        },
      })
    }

    async function deleteSupplier(variables: DeleteSupplierVariables) {
      try {
        deleteSupplierId.value = variables.id
        await deleteSupplierMutate(variables)
      } catch (error) {
        logger.warn('[DeleteSupplier]: ', error)
      } finally {
        deleteSupplierId.value = undefined
      }
    }

    return () => (
      <div class="container pt-4 pb-10">
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
          customFilter={customFilter}
          groupBy={groupBy.value}
          groupDesc={groupDesc.value}
          customGroup={customGroup}
          loading={listSuppliersLoading.value}
          tableClass="w-full table-fixed"
          hoverable
          v-slots={{
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
                    default: () => t('suppliers.currentDealsAmount'),
                  }}
                />
              </>
            ),
            'header-content-cost': () => (
              <>
                <Icon class="align-middle">{ziMoneyPlus}</Icon>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="190"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('suppliers.dealsAmountHint'),
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
                  maxWidth="210"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('suppliers.totalDebtHint'),
                  }}
                />
              </>
            ),
            'header-content-totalCost': () => (
              <>
                <Icon class="align-middle">{ziMoneyTernover}</Icon>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="190"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                    default: () => t('suppliers.turnoverHint'),
                  }}
                />
              </>
            ),
            'header-content-contactPhone': () => <Icon>{ziPhone}</Icon>,
            'no-data': () => (
              <div
                v-html={t('suppliers.noData')}
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
                    onClick={() => goToSupplier(item.id)}
                    onKeydown={(e: KeyboardEvent) => {
                      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)
                        return
                      if (e.target !== e.currentTarget) return
                      if (e.key === 'Enter') {
                        goToSupplier(item.id)
                      }
                    }}
                  >
                    <td></td>
                    <td class="truncate">{item.companyName}</td>
                    <td class="truncate text-right">
                      {n(item.dealsCount || 0)}
                    </td>
                    <td class="truncate text-right">{n(item.cost || 0)}</td>
                    <td
                      class={[
                        'truncate text-right',
                        { 'text-pink-500': item.debt && item.debt > 0 },
                      ]}
                    >
                      {n(item.debt || 0)}
                    </td>
                    <td class="truncate text-right">
                      {n(item.totalCost || 0)}
                    </td>
                    <td class="truncate pl-8 pr-2">
                      {item.contactPersonFullName}
                    </td>
                    <td class="whitespace-nowrap pr-3">
                      <div class="overflow-x-scroll scrolling-touch scrollbar-hidden flex items-center align-middle rounded-lg space-x-1">
                        {item.tags?.map((tag) => (
                          <div class="h-6 inline-flex items-center bg-blue-500 text-white rounded-lg px-1">
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
                              loading={deleteSupplierLoading.value}
                              primary={false}
                              class="text-white bg-red-700 hover:bg-red-600 active:bg-red-600 focus:ring-red-600"
                              {...{
                                onClick: () => deleteSupplier({ id: item.id }),
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
                        loading={deleteSupplierLoading.value}
                      >
                        <div class="text-yellow-400 font-semibold pb-4">
                          {[item.uid, item.companyName]
                            .filter((el) => !!el)
                            .join(' - ')}
                        </div>
                        <div>{t('alert.removeSupplier')}</div>
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
          to={{
            name: 'supplier-create',
            params: { orgId },
          }}
        >
          <Icon left>{ziBoxes}</Icon>
          <span>{t('suppliers.createSupplier')}</span>
        </Btn>
      </div>
    )
  },
})
