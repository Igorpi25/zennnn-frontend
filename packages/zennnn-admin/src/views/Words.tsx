import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery, useMutation } from '@vue/apollo-composable'
import {
  ziEdit,
  ziGlobe,
  ziLanguages,
  ziSearch,
  ziFilter,
  ziFilterOutline,
  ziChevronRight,
} from '@zennnn/icons'
import {
  Btn,
  Icon,
  Menu,
  MenuItem,
  Progress,
  TextField,
  DataTable,
  Checkbox,
} from '@zennnn/core'

import { WordStatus } from '@/graphql/types'
import { LIST_WORDS } from '@/graphql/queries'
import {
  APPROVE_WORDS,
  HIDE_WORDS,
  MERGE_WORDS,
  CREATE_WORD,
  UPDATE_WORD,
} from '@/graphql/mutations'

import { LOCALES_LIST } from 'shared/config'
import Dialog from 'shared/components/Dialog'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import WordProducts from '@/components/WordProducts'
import WordForm from '@/components/WordForm'
import { isLoggedInVar } from '@/plugins/apollo'

import type {
  ListWords,
  ListWordsVariables,
  ListWords_listWords_items,
  ApproveWords,
  ApproveWordsVariables,
  HideWords,
  HideWordsVariables,
  CreateWord,
  CreateWordVariables,
  UpdateWord,
  UpdateWordVariables,
  MergeWords,
  MergeWordsVariables,
} from '@/graphql/types'
import type { WordFormSubmitInput } from '@/components/WordForm'

interface DataTableHeader {
  text: string
  value: string
  align?: 'start' | 'left' | 'center' | 'end' | 'right'
  sortable?: boolean
  class?: string | string[]
  width?: string | number
}

interface DataTableHeaderContent {
  value: string
  header: DataTableHeader
}

type DataTableItem = ListWords_listWords_items & {
  [x: string]: string
} & {
  group?: boolean
  groupName?: string
  groupItemsCount?: number
}

enum CustomFilter {
  HIDDEN = 'HIDDEN',
  ALL = 'ALL',
}

export default defineComponent({
  setup() {
    const { t, locale } = useI18n()

    const search = ref()
    const expanded = ref<string[]>([])
    const selected = ref<string[]>([])
    const selectAll = ref(false)
    const selectAllIndeterminate = ref(false)
    const filterMenu = ref(false)
    const createDialog = ref(false)
    const editDialog = ref(false)
    const mergeDialog = ref(false)
    const createFormRef = ref()
    const editFormRef = ref()
    const mergeFormRef = ref()
    const editItem = ref<ListWords_listWords_items>()
    const mergeItem = ref<Partial<ListWords_listWords_items>>()

    const currentFilter = ref<WordStatus | CustomFilter | null>(null)

    const filters = computed(() => {
      const status =
        currentFilter.value === WordStatus.DRAFT ||
        currentFilter.value === WordStatus.APPROVED
          ? currentFilter.value
          : null
      return {
        status,
        showHiddens: currentFilter.value === CustomFilter.HIDDEN,
        all: currentFilter.value === CustomFilter.ALL,
      }
    })

    const isLoggedIn = useReactiveVar(isLoggedInVar)

    const { result: listWordsResult, loading: listWordsLoading } = useQuery<
      ListWords,
      ListWordsVariables
    >(
      LIST_WORDS,
      () => ({
        filters: filters.value,
      }),
      () => ({
        enabled: isLoggedIn.value,
        fetchPolicy: 'cache-and-network',
      })
    )

    const {
      mutate: approveWordsMutate,
      loading: approveWordsLoading,
      onDone: onApproveWordsDone,
    } = useMutation<ApproveWords, ApproveWordsVariables>(APPROVE_WORDS, {
      update: (cache) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery<ListWords, ListWordsVariables>({
          query: LIST_WORDS,
          variables: { filters: filters.value },
        })
        // Add our tag from the mutation to the end
        if (data?.listWords?.items) {
          const _items = data.listWords.items
          selected.value.forEach((id) => {
            const index = _items.findIndex((el) => el.id === id)
            if (index !== -1) {
              const item = _items[index]
              cache.modify({
                id: cache.identify({
                  // @ts-ignore
                  __typename: item.__typename,
                  id: item.id,
                }),
                fields: {
                  status() {
                    return WordStatus.APPROVED
                  },
                },
              })
            }
          })
        }
      },
    })

    const {
      mutate: hideWordsMutate,
      loading: hideWordsLoading,
      onDone: onHideWordsDone,
    } = useMutation<HideWords, HideWordsVariables>(HIDE_WORDS, {
      update: (cache) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery<ListWords, ListWordsVariables>({
          query: LIST_WORDS,
          variables: { filters: filters.value },
        })
        // Add our tag from the mutation to the end
        if (data?.listWords?.items) {
          const _items = data.listWords.items
          if (filters.value.showHiddens) {
            selected.value.forEach((id) => {
              const index = _items.findIndex((el) => el.id === id)
              if (index !== -1) {
                const item = _items[index]
                cache.modify({
                  id: cache.identify({
                    // @ts-ignore
                    __typename: item.__typename,
                    id: item.id,
                  }),
                  fields: {
                    isHidden() {
                      return true
                    },
                  },
                })
              }
            })
          } else {
            // Write our data back to the cache.
            cache.writeQuery<ListWords, ListWordsVariables>({
              query: LIST_WORDS,
              variables: { filters: filters.value },
              data: {
                listWords: {
                  items: _items.filter(
                    (item) => !selected.value.includes(item.id)
                  ),
                },
              },
            })
          }
        }
      },
    })

    const {
      mutate: createWordMutate,
      loading: createWordLoading,
      onDone: onCreateWordDone,
    } = useMutation<CreateWord, CreateWordVariables>(CREATE_WORD, {
      update: (cache, { data: result }) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery<ListWords, ListWordsVariables>({
          query: LIST_WORDS,
          variables: { filters: filters.value },
        })
        // Add our tag from the mutation to the end
        if (data?.listWords?.items && result?.createWord) {
          // Write our data back to the cache.
          cache.writeQuery<ListWords, ListWordsVariables>({
            query: LIST_WORDS,
            variables: { filters: filters.value },
            data: {
              listWords: {
                items: [
                  ...data.listWords.items,
                  result.createWord as ListWords_listWords_items,
                ],
              },
            },
          })
        }
      },
    })

    const {
      mutate: updateWordMutate,
      loading: updateWordLoading,
      onDone: onUpdateWordDone,
    } = useMutation<UpdateWord, UpdateWordVariables>(UPDATE_WORD)

    const {
      mutate: mergeWordMutate,
      loading: mergeWordLoading,
      onDone: onMergeWordDone,
    } = useMutation<MergeWords, MergeWordsVariables>(MERGE_WORDS, {
      update: (cache, { data: result }) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery<ListWords, ListWordsVariables>({
          query: LIST_WORDS,
          variables: { filters: filters.value },
        })
        // Add our tag from the mutation to the end
        if (data?.listWords?.items && result?.mergeWords) {
          const _items = data.listWords.items.filter(
            (item) => !selected.value.includes(item.id)
          )
          // Write our data back to the cache.
          cache.writeQuery<ListWords, ListWordsVariables>({
            query: LIST_WORDS,
            variables: { filters: filters.value },
            data: {
              listWords: {
                items: [
                  ..._items,
                  result.mergeWords as ListWords_listWords_items,
                ],
              },
            },
          })
        }
      },
    })

    onApproveWordsDone(clearSelected)
    onHideWordsDone(clearSelected)
    onCreateWordDone(() => {
      createDialog.value = false
    })
    onUpdateWordDone(() => {
      editDialog.value = false
    })
    onMergeWordDone(() => {
      clearSelected()
      mergeDialog.value = false
    })

    const filtersItems = computed(() => {
      return [
        {
          text: t('words.noFilter'),
          value: null,
        },
        {
          text: t('words.DRAFT'),
          value: WordStatus.DRAFT,
        },
        {
          text: t('words.APPROVED'),
          value: WordStatus.APPROVED,
        },
        {
          text: t('words.DUPLICATE'),
          value: WordStatus.DUPLICATE,
        },
        {
          text: t('words.HIDDEN'),
          value: CustomFilter.HIDDEN,
        },
        {
          text: t('words.ALL'),
          value: CustomFilter.ALL,
        },
      ]
    })

    const locales = computed(() => {
      const items = LOCALES_LIST.map((el) => {
        return {
          ...el,
          key: el.value,
        }
      })
      const currentLocaleIndex = items.findIndex(
        (el) => el.value === locale.value
      )
      if (currentLocaleIndex !== -1) {
        const removed = items.splice(currentLocaleIndex, 1)
        return [...removed, ...items]
      }
      return items
    })

    const headers = computed(() => {
      const _items = locales.value.map((el) => {
        return {
          text: el.text,
          value: el.value,
          width: '140px',
          sortable: false,
          align: 'left',
          class: 'px-2',
        }
      })
      const status = {
        text: '',
        value: 'status',
        width: '44px',
        sortable: false,
        class: 'p-0',
      }
      const more = {
        text: t('words.more'),
        value: 'more',
        width: '80px',
        sortable: false,
        align: 'left',
        class: 'px-2',
      }
      return [status, ..._items, more]
    })

    const items = computed(() => {
      const items =
        (listWordsResult.value &&
          listWordsResult.value.listWords &&
          listWordsResult.value.listWords.items) ||
        []
      return items.map((item) => {
        let duplicatesSearch = ''
        const result = Object.assign({}, item) as DataTableItem
        const values = item.values || []
        LOCALES_LIST.forEach((localeItem) => {
          const key = localeItem.value
          const value = values.find((v) => v.k === key)
          if (value) {
            result[key] = value.v || value.tr || ''
            result[`${key}_ct`] = !value.v && value.tr ? 'true' : ''
            const search = result[key].trim().toLocaleLowerCase()
            duplicatesSearch += `${search}~`
          }
        })
        result.duplicatesSearch = duplicatesSearch
        return result
      })
    })

    const groupBy = computed(() => {
      return currentFilter.value === WordStatus.DUPLICATE
        ? ['duplicatesSearch']
        : [locale.value]
    })

    const groupDesc = computed(() => {
      return [false]
    })

    watch(selected, (val) => {
      if (val.length > 0 && val.length === items.value.length) {
        selectAllIndeterminate.value = false
        selectAll.value = true
      } else if (val.length > 0 && val.length < items.value.length) {
        selectAllIndeterminate.value = true
        selectAll.value = false
      } else if (val.length === 0) {
        selectAllIndeterminate.value = false
        selectAll.value = false
      }
    })

    watch(currentFilter, clearSelected)

    watch(search, clearSelected)

    watch(createDialog, (val) => {
      nextTick(() => {
        if (val) {
          createFormRef.value && createFormRef.value.focus()
        } else {
          createFormRef.value && createFormRef.value.reset()
        }
      })
    })

    watch(editDialog, (val) => {
      nextTick(() => {
        if (val) {
          if (editFormRef.value) {
            editFormRef.value.setValues(editItem.value)
            editFormRef.value.focus()
          }
        } else {
          editFormRef.value && editFormRef.value.reset()
        }
      })
    })

    watch(mergeDialog, (val) => {
      nextTick(() => {
        if (val) {
          if (mergeFormRef.value) {
            mergeFormRef.value.setValues(mergeItem.value)
            mergeFormRef.value.focus()
          }
        } else {
          mergeFormRef.value && mergeFormRef.value.reset()
        }
      })
    })

    function clearSelected() {
      selected.value = []
    }

    function onSelectAll(val: boolean) {
      if (val || selectAllIndeterminate.value) {
        selected.value = items.value.map((el) => el.id)
      } else {
        selected.value = []
      }
    }

    function toggleExpand(id: string) {
      if (expanded.value.indexOf(id) > -1) {
        const expIndex = expanded.value.indexOf(id)
        expanded.value.splice(expIndex, 1)
      } else {
        expanded.value.push(id)
      }
    }

    function openEditDialog(item: ListWords_listWords_items) {
      editItem.value = item
      nextTick(() => {
        editDialog.value = true
      })
    }

    function openMergeDialog() {
      const _items = items.value.filter((item) =>
        selected.value.includes(item.id)
      )
      const status = _items.some((el) => el.status === WordStatus.APPROVED)
        ? WordStatus.APPROVED
        : WordStatus.DRAFT
      let itemIndex = 0
      if (status === WordStatus.APPROVED) {
        itemIndex = _items.findIndex((el) => el.status === WordStatus.APPROVED)
      } else {
        // TODO: set value with max values?
        itemIndex = 0
      }
      const defaultItem = _items[itemIndex]
      const item = {
        defaultLocale: defaultItem.defaultLocale,
        values: defaultItem.values?.slice(),
      }
      mergeItem.value = item
      nextTick(() => {
        mergeDialog.value = true
      })
    }

    function customGroup(
      items: DataTableItem[],
      groupBy: [string],
      groupDesc: [boolean]
    ) {
      const key = groupBy[0]
      const isDuplicatesSearch = key === 'duplicatesSearch'
      const desc = groupDesc[0]
      const re =
        /[A-ZА-ЯҐЄІЇ\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
      const others = [] as any[]
      const grouped = items.reduce((acc: any, curr: any) => {
        const name = curr[key] || ''
        if (isDuplicatesSearch) {
          if (Object.prototype.hasOwnProperty.call(acc, name)) {
            acc[name].push(curr)
          } else {
            acc[name] = [curr]
          }
        } else {
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
        }
        return acc
      }, {})
      const result = []
      let sorted = Object.keys(grouped).sort()
      if (desc) {
        sorted = sorted.reverse()
      }
      sorted.forEach((k) => {
        const groupItems = grouped[k]
        const group = { name: k, items: groupItems }
        if (isDuplicatesSearch) {
          if (groupItems.length > 1) {
            result.push(group)
          }
        } else {
          result.push(group)
        }
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

    return () => (
      <div class="container relative pb-12">
        <div class="pt-4 pb-10">
          <div class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:space-x-6 pb-4">
            <TextField
              v-slots={{
                prepend: () => (
                  <Icon class="text-gray-200 dark:text-gray-100">
                    {ziSearch}
                  </Icon>
                ),
              }}
              v-model={search.value}
              placeholder={t('placeholder.pageSearch')}
              class="flex-grow"
              controlClass={
                search.value ? 'ring-1 ring-blue-500 ring-inset px-2' : 'px-2'
              }
              inputClass="placeholder-blue-500 dark:placeholder-blue-500 focus:placeholder-gray-100 dark:focus:placeholder-gray-200"
              clearable
            />
            <div class="flex w-full sm:w-auto items-center justify-end">
              <Menu
                v-slots={{
                  activator: () => (
                    <Btn
                      darkIcon
                      text
                      small
                      class={{
                        'group rounded pl-2 pr-0': true,
                        'text-gray-900 dark:text-gray-100': true,
                        'text-blue-550 dark:text-blue-550': filterMenu.value,
                      }}
                      contentClass="space-x-2 text-base"
                    >
                      <span>
                        {t(`words.${currentFilter.value || 'noFilter'}`)}
                      </span>
                      <Icon
                        right
                        class={{
                          'text-gray-100 dark:text-gray-200 group-hover:!text-blue-400':
                            true,
                          '!text-blue-550': filterMenu.value,
                        }}
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
                minWidth={120}
                skidding={8}
              >
                {filtersItems.value.map((item, i) => (
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

          <div class="sticky top-14 z-1 bg-light-gray-100 dark:bg-gray-800 rounded-t-md flex items-center h-12 space-x-3 px-2.5">
            <Btn
              loading={approveWordsLoading.value}
              disabled={selected.value.length === 0}
              xSmall
              minWidth={80}
              {...{
                onClick: () => {
                  if (selected.value.length === 0) return
                  approveWordsMutate({
                    ids: selected.value,
                  })
                },
              }}
            >
              {t('words.approve')}
            </Btn>
            <Btn
              loading={hideWordsLoading.value}
              disabled={selected.value.length === 0}
              outlined
              xSmall
              minWidth={80}
              {...{
                onClick: () => {
                  if (selected.value.length === 0) return
                  hideWordsMutate({
                    ids: selected.value,
                  })
                },
              }}
            >
              {t('words.hide')}
            </Btn>
            <Btn
              loading={mergeWordLoading.value}
              disabled={selected.value.length < 2}
              outlined
              xSmall
              minWidth={80}
              {...{ onClick: openMergeDialog }}
            >
              {t('words.merge')}
            </Btn>
            <div class="flex-grow" />
            {listWordsLoading.value && (
              <Progress indeterminate size="18" width="2" />
            )}
          </div>
          <DataTable
            headers={headers.value}
            items={items.value}
            search={search.value}
            groupBy={groupBy.value}
            groupDesc={groupDesc.value}
            customGroup={customGroup}
            loading={listWordsLoading.value}
            table-width="100%"
            table-class="table-fixed rounded-t-none"
            hoverable
            v-slots={{
              'header-status': ({ header }: DataTableHeaderContent) => (
                <td class="text-left p-0" {...{ width: header.width }}>
                  <Checkbox
                    v-models={[
                      [selectAll.value, 'modelValue'],
                      [selectAllIndeterminate.value, 'indeterminate'],
                    ]}
                    class="ml-3"
                    {...{ onChange: onSelectAll }}
                  />
                </td>
              ),
              ...LOCALES_LIST.reduce((acc, curr) => {
                acc[`header-content-${curr.value}`] = ({
                  header,
                }: DataTableHeaderContent) => (
                  <span class="inline-flex items-center align-middle">
                    <img
                      src={
                        require(`@zennnn/icons/flags/${curr.icon}.svg`).default
                      }
                      class="h-6 w-6 rounded-full mr-2"
                    />
                    <span>{header.text}</span>
                  </span>
                )
                return acc
              }, {} as Record<string, any>),
              'header-content-more': ({ header }: DataTableHeaderContent) => (
                <span class="inline-flex items-center align-middle">
                  <Icon class="mr-2">{ziGlobe}</Icon>
                  <span>{header.text}</span>
                </span>
              ),
              items: (props: { items: DataTableItem[] }) =>
                props.items.map((item, index) => (
                  <>
                    {item.group ? (
                      <tr
                        key={item.groupName}
                        style={{ background: 'transparent' }}
                      >
                        <td
                          colspan={headers.value.length}
                          style={{ height: '32px', paddingLeft: '56px' }}
                          class="text-gray-200 text-base leading-tight align-bottom p-0"
                        >
                          <span class="text-white">{item.groupName}</span> (
                          {item.groupItemsCount})
                        </td>
                      </tr>
                    ) : (
                      <tr
                        key={index}
                        class={{
                          'cursor-default': true,
                          'text-gray-900 dark:text-white expanded':
                            expanded.value.includes(item.id),
                          'text-gray-300': item.isHidden,
                        }}
                        tabindex="0"
                      >
                        {headers.value.map((header) => (
                          <td
                            key={header.value}
                            class={[
                              'truncate',
                              { 'text-right': header.value === 'more' },
                              header.value === 'status'
                                ? 'relative p-0'
                                : 'px-3',
                            ]}
                            onClick={() => {
                              header.value !== 'status'
                                ? toggleExpand(item.id)
                                : undefined
                            }}
                          >
                            {header.value === 'status' ? (
                              <>
                                <span
                                  class={[
                                    'absolute top-0 left-0 w-0.5 h-full',
                                    item.status === WordStatus.DRAFT
                                      ? 'bg-pink-500'
                                      : item.status === WordStatus.APPROVED
                                      ? 'bg-green-500'
                                      : '',
                                  ]}
                                />
                                <Checkbox
                                  v-model={selected.value}
                                  value={item.id}
                                  class="ml-3"
                                />
                              </>
                            ) : header.value === 'more' ? (
                              <div class="inline-flex items-center justify-end align-middle space-x-2">
                                <Btn
                                  icon
                                  primary={false}
                                  class="w-6 h-6 rounded text-blue-500 hover:text-blue-400"
                                  {...{
                                    onClick: (e: MouseEvent) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      openEditDialog(item)
                                    },
                                  }}
                                >
                                  <Icon small>{ziEdit}</Icon>
                                </Btn>
                                <Btn
                                  icon
                                  primary={false}
                                  class={{
                                    'w-6 h-6 rounded text-blue-500 hover:text-blue-400':
                                      true,
                                    'transition-transform': true,
                                    'rotate-90': expanded.value.includes(
                                      item.id
                                    ),
                                  }}
                                  retainFocusOnClick
                                >
                                  <Icon>{ziChevronRight}</Icon>
                                </Btn>
                              </div>
                            ) : (
                              <span class="inline-flex items-center max-w-full">
                                <span class="flex-grow truncate">
                                  {item[header.value]}
                                </span>
                                {item[`${header.value}_ct`] && (
                                  <Icon
                                    base={false}
                                    class="text-gray-200 flex-shrink-0 ml-1"
                                  >
                                    {ziLanguages}
                                  </Icon>
                                )}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )}
                    {expanded.value.includes(item.id) && (
                      <tr
                        key={`expand-${item.id}`}
                        class="expand !bg-transparent"
                      >
                        <td
                          colspan={headers.value.length}
                          class="relative !rounded-t-none p-0"
                          style={{ overflow: 'inherit' }}
                        >
                          <div
                            class="bg-light-gray-50 dark:bg-gray-700 rounded-b-md p-3 -mt-1"
                            style="min-height: 52px"
                          >
                            <WordProducts item={item} />
                          </div>
                          <div class="absolute inset-x-0 top-0 pointer-events-none opacity-20 dark:opacity-50 h-6 bg-gradient-to-b from-gray-900 to-gray-900/0 -mt-1" />
                        </td>
                      </tr>
                    )}
                  </>
                )),
              'no-data': () => (
                <div
                  v-html={t('words.noData')}
                  class="text-center text-gray-200 leading-tight py-4"
                />
              ),
            }}
          />
          <Btn
            block
            outlined
            class="mt-4"
            {...{
              onClick: () => {
                createDialog.value = true
              },
            }}
          >
            <Icon left>{ziEdit}</Icon>
            <span>{t('words.addWord')}</span>
          </Btn>
        </div>

        <Dialog
          v-model={createDialog.value}
          title={t('words.addWordTitle')}
          icon={ziLanguages}
          maxWidth={720}
        >
          <WordForm
            ref={createFormRef}
            loading={createWordLoading.value}
            actionText={t('action.add')}
            {...{
              onCancel: () => {
                createDialog.value = false
              },
              onSubmit: (input: WordFormSubmitInput) =>
                createWordMutate({ input }),
            }}
          />
        </Dialog>

        <Dialog
          v-model={editDialog.value}
          title={t('words.editWord')}
          icon={ziLanguages}
          maxWidth={720}
        >
          <WordForm
            ref={editFormRef}
            item={editItem.value}
            loading={updateWordLoading.value}
            actionText={t('action.apply')}
            {...{
              onCancel: () => {
                editDialog.value = false
              },
              onSubmit: (input: WordFormSubmitInput) =>
                updateWordMutate({ input }),
            }}
          />
        </Dialog>

        <Dialog
          v-model={mergeDialog.value}
          title={t('words.mergeWords')}
          icon={ziLanguages}
          maxWidth={720}
        >
          <WordForm
            ref={mergeFormRef}
            item={mergeItem.value as ListWords_listWords_items}
            loading={mergeWordLoading.value}
            actionText={t('action.apply')}
            {...{
              onCancel: () => {
                mergeDialog.value = false
              },
              onSubmit: (input: WordFormSubmitInput) => {
                if (selected.value.length === 0) return
                mergeWordMutate({ ids: selected.value, input })
              },
            }}
          />
        </Dialog>
      </div>
    )
  },
})
