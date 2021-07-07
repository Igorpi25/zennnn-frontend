import {
  ref,
  computed,
  watch,
  defineComponent,
  Transition,
  onBeforeMount,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { getObjectValueByPath } from 'vue-supp'
import {
  ziQr,
  ziSearch,
  ziRefresh,
  ziHide,
  ziFilter,
  ziStarLg,
  ziViewList,
  ziStarOutlineLg,
  ziQuestionSign,
} from '@zennnn/icons'
import { Btn, Icon, Tooltip, TextField, DataTable } from '@zennnn/core'
import { useProfile } from '@/composables/profile'

enum ItemOwnerType {
  OWNER = 'OWNER',
  SUPPLIER = 'SUPPLIER',
}

interface ListItems_listItems_items {
  id: string
  photo?: string
  name: string
  price?: number
  currency?: string
  unit?: number
  sold?: number
  ownerType: ItemOwnerType
}

type DataTableItem = ListItems_listItems_items & {
  group?: boolean
  groupName?: string
  groupItemsCount?: number
}

interface DataTableHeaderProp {
  text: string
  value: string
  width?: string | number
}

export default defineComponent({
  setup() {
    const { t, n } = useI18n()
    const { profile } = useProfile()

    const sortBy = ref([])
    const sortDesc = ref([])
    const ownerType = ref(ItemOwnerType.OWNER)
    const search = ref<string>()

    const listItemsLoading = ref(false)

    const listItems = computed(() => [] as ListItems_listItems_items[])

    const tabs = computed(() => [
      {
        value: ItemOwnerType.OWNER,
        text: t('goods.myProducts'),
      },
      {
        value: ItemOwnerType.SUPPLIER,
        text: t('goods.supplierProducts'),
      },
    ])

    const groupBy = computed(() =>
      sortBy.value.length === 0 || sortBy.value[0] === 'name' ? ['name'] : []
    )

    const groupDesc = computed(() =>
      groupBy.value[0] === 'name' ? sortDesc.value : []
    )

    const headers = computed(() => [
      { text: '', value: 'select', width: 50, sortable: false },
      {
        text: t('goods.photo'),
        value: 'photo',
        align: 'left' as const,
        width: 230,
        sortable: false,
      },
      {
        text: t('goods.name'),
        value: 'name',
        align: 'left' as const,
        width: 262,
        sortable: true,
      },
      {
        text: t('goods.price'),
        value: 'price',
        align: 'left' as const,
        width: 157,
        sortable: true,
      },
      {
        text: t('goods.currency'),
        value: 'currency',
        align: 'left' as const,
        width: 125,
        sortable: true,
      },
      {
        text: t('goods.sold'),
        value: 'sold',
        align: 'left' as const,
        width: 140,
        sortable: true,
      },
      {
        text: t('goods.show'),
        value: 'show',
        align: 'left' as const,
        width: 168,
        sortable: true,
      },
    ])

    const items = computed(() =>
      listItems.value.filter((el) => el.ownerType === ownerType.value)
    )

    const filteredOwnerItems = computed(() => {
      const _items = items.value.filter(
        (el) => el.ownerType === ItemOwnerType.OWNER
      )
      return filterItems(_items, search.value)
    })

    const filteredSupplierItems = computed(() => {
      const _items = items.value.filter(
        (el) => el.ownerType === ItemOwnerType.SUPPLIER
      )
      return filterItems(_items, search.value)
    })

    const filteredItemsLength = computed(() => {
      return {
        [ItemOwnerType.OWNER]: filteredOwnerItems.value.length,
        [ItemOwnerType.SUPPLIER]: filteredSupplierItems.value.length,
      } as Record<ItemOwnerType, number>
    })

    onBeforeMount(() => {
      if (profile.value?.id) {
        const searchKey = `${profile.value.id}.items.search`
        const sortKey = `${profile.value.id}.items.sortBy`
        const descKey = `${profile.value.id}.items.sortDesc`

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
      const key = 'name'
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

    function switchOwnerType(type: ItemOwnerType) {
      if (type === ownerType.value) return
      ownerType.value = type
    }

    return () => (
      <div class="container pt-4 pb-10">
        <div class="flex items-center flex-wrap lg:flex-nowrap justify-between lg:space-x-4">
          <div class="w-full lg:w-auto h-12 self-end flex lg:inline-flex space-x-1 overflow-x-auto scrolling-touch order-last lg:order-none">
            {tabs.value.map((item) => (
              <button
                aria-selected={ownerType.value === item.value}
                key={item.value}
                class={[
                  'w-full sm:w-auto flex items-center justify-center rounded-t',
                  'select-none whitespace-nowrap cursor-pointer',
                  'transition-colors duration-100 ease-in px-10',
                  'focus:outline-none focus:ring focus:ring-blue-400 focus:ring-inset with-focus-visible hover:text-gray-900 dark:hover:text-white',

                  ownerType.value === item.value
                    ? 'text-gray-900 dark:text-white bg-light-gray-100 dark:bg-gray-800'
                    : 'text-gray-200 dark:text-gray-100 bg-transparent',
                ]}
                role="tab"
                tabindex={0}
                onClick={() => switchOwnerType(item.value)}
              >
                <span class="relative">
                  <div class="absolute -top-1 -right-1 text-[0.8125rem] font-semibold translate-x-full">
                    <Transition
                      name="scale-transition"
                      v-slots={{
                        default: () =>
                          search.value &&
                          ownerType.value !== item.value &&
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
              </button>
            ))}
          </div>
          <TextField
            v-model={search.value}
            placeholder={t('placeholder.pageSearch')}
            controlClass={
              search.value ? 'ring-1 ring-blue-500 ring-inset' : undefined
            }
            prependIcon={ziSearch}
            class="flex-grow sm:pr-4 lg:pr-0"
            inputClass="placeholder-blue-500 dark:placeholder-blue-500"
            clearable
          />
          <div class="w-full sm:w-auto h-12 flex items-center justify-end space-x-4">
            <Btn text class="h-8 text-gray-200 px-1">
              <span>A–Z Suppliers</span>
              <Icon right>{ziFilter}</Icon>
            </Btn>
            <Btn icon xSmall text class="text-gray-200">
              <Icon>{ziStarLg}</Icon>
            </Btn>
            <Btn icon xSmall text class="text-gray-200">
              <Icon>{ziViewList}</Icon>
            </Btn>
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
          customFilter={customFilter}
          groupBy={groupBy.value}
          groupDesc={groupDesc.value}
          customGroup={customGroup}
          loading={listItemsLoading.value}
          table-width="100%"
          table-class="table-fixed rounded-tl-none"
          hoverable
          v-slots={{
            'header-content-price': ({
              header,
            }: {
              header: DataTableHeaderProp
            }) => (
              <>
                <span class="align-middle mr-1">{header.text}</span>
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
                    default: () => t('goods.priceHint'),
                  }}
                />
              </>
            ),
            'header-content-sold': ({
              header,
            }: {
              header: DataTableHeaderProp
            }) => (
              <>
                <span class="align-middle mr-1">{header.text}</span>
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
                    default: () => 'Sold...',
                  }}
                />
              </>
            ),
            'no-data': () => (
              <div
                v-html={t('goods.noData')}
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
                  <tr>
                    <td></td>
                    <td class="truncate">{item.name}</td>
                    <td class="truncate text-right">{n(item.price || 0)}</td>
                    <td class="truncate">
                      {[item.currency, item.unit]
                        .filter((el) => !el)
                        .join(' / ')}
                    </td>
                    <td class="truncate text-right">{n(item.sold || 0)}</td>
                    <td
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                      }}
                    >
                      <div class="flex justify-center space-x-6">
                        <Btn icon text mini class="text-gray-200">
                          <Icon>{ziRefresh}</Icon>
                        </Btn>
                        <Btn icon text mini class="text-gray-200">
                          <Icon>{ziHide}</Icon>
                        </Btn>
                        <Btn icon text mini class="text-gray-200">
                          <Icon>{ziStarOutlineLg}</Icon>
                        </Btn>
                      </div>
                    </td>
                  </tr>
                )
              ),
          }}
        />
        <Btn block outlined class="mt-4">
          <Icon left>{ziQr}</Icon>
          <span>{t('goods.createProduct')}</span>
        </Btn>
      </div>
    )
  },
})
