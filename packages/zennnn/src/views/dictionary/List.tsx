import {
  defineComponent,
  computed,
  ref,
  watch,
  nextTick,
  Transition,
} from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery, useMutation } from '@vue/apollo-composable'
import {
  ziEdit,
  ziGlobe,
  ziLanguages,
  ziSearch,
  ziChevronRight,
} from '@zennnn/icons'
import { Btn, Icon, TextField, DataTable, Progress } from '@zennnn/core'

import { LIST_WORDS } from '@/graphql/queries'
import { CREATE_WORD, UPDATE_WORD } from '@/graphql/mutations'

import { LOCALES_LIST } from 'shared/config'
import Dialog from 'shared/components/Dialog'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import WordSpecsLinks from '@/components/word/SpecsLinks'
import WordForm from '@/components/word/Form'
import { isLoggedInVar } from '@/plugins/apollo'

import type {
  ListWords,
  ListWordsVariables,
  ListWords_listWords_items,
  CreateWord,
  CreateWordVariables,
  UpdateWord,
  UpdateWordVariables,
} from '@/graphql/types'

import type { WordFormSubmitInput } from '@/components/word/Form'

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

export default defineComponent({
  setup() {
    const route = useRoute()
    const { t, locale } = useI18n()

    const orgId = route.params.orgId
    const search = ref()
    const expanded = ref<string[]>([])
    const createDialog = ref(false)
    const editDialog = ref(false)
    const createFormRef = ref()
    const editFormRef = ref()
    const editItem = ref<ListWords_listWords_items>()

    const isLoggedIn = useReactiveVar(isLoggedInVar)

    const { result: listWordsResult, loading: listWordsLoading } = useQuery<
      ListWords,
      ListWordsVariables
    >(
      LIST_WORDS,
      () => ({
        orgId: orgId as string,
      }),
      () => ({
        enabled: isLoggedIn.value,
        fetchPolicy: 'cache-and-network',
      })
    )

    const {
      mutate: createWordMutate,
      loading: createWordLoading,
      onDone: onCreateWordDone,
    } = useMutation<CreateWord, CreateWordVariables>(CREATE_WORD, {
      update: (cache, { data: result }) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery<ListWords, ListWordsVariables>({
          query: LIST_WORDS,
          variables: { orgId: orgId as string },
        })
        // Add our tag from the mutation to the end
        if (data?.listWords?.items && result?.createWord) {
          // Write our data back to the cache.
          cache.writeQuery<ListWords, ListWordsVariables>({
            query: LIST_WORDS,
            variables: { orgId: orgId as string },
            data: {
              listWords: {
                items: [...data.listWords.items, result.createWord],
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

    onCreateWordDone(() => {
      createDialog.value = false
    })
    onUpdateWordDone(() => {
      editDialog.value = false
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
          width: '130px',
          sortable: false,
          align: 'left' as const,
          class: 'px-3',
        }
      })
      const more = {
        text: t('words.more'),
        value: 'more',
        width: '80px',
        sortable: false,
        align: 'left' as const,
        class: 'px-3',
      }
      return [..._items, more]
    })

    const items = computed(() => {
      const items =
        (listWordsResult.value &&
          listWordsResult.value.listWords &&
          listWordsResult.value.listWords.items) ||
        []
      return items.map((item) => {
        const result = Object.assign({}, item) as DataTableItem
        const values = item.values || []
        LOCALES_LIST.forEach((localeItem) => {
          const key = localeItem.value
          const value = values.find((v) => v.k === key)
          if (value) {
            result[key] = value.v || value.tr || ''
            result[`${key}_ct`] = !value.v && value.tr ? 'true' : ''
          }
        })
        return result
      })
    })

    const groupBy = computed(() => {
      return [locale.value]
    })

    const groupDesc = computed(() => {
      return [false]
    })

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

    function customGroup(
      items: DataTableItem[],
      groupBy: [string],
      groupDesc: [boolean]
    ) {
      const key = groupBy[0]
      const desc = groupDesc[0]
      const re =
        /[A-ZА-ЯҐЄІЇ\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
      const others = [] as any[]
      const grouped = items.reduce((acc: any, curr: any) => {
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
      }, {})
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

    return () => (
      <>
        <div class="container pt-4 pb-10">
          <TextField
            v-model={search.value}
            placeholder={t('placeholder.pageSearch')}
            controlClass={
              search.value ? 'ring-1 ring-blue-500 ring-inset' : undefined
            }
            prependIcon={ziSearch}
            class="w-full pb-6"
            inputClass="placeholder-blue-500 dark:placeholder-blue-500"
            clearable
          />

          <div class="font-semibold text-2xl leading-tight whitespace-nowrap overflow-x-auto scrolling-touch pb-4 px-1">
            <RouterLink
              to={{ name: 'companies', params: { orgId } }}
              class="text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible transition-colors duration-75 ease-out mr-10"
            >
              {t('requisites.title')}
            </RouterLink>
            <span class="relative">
              <span class="text-gray-900 dark:text-white">
                {t('header.dictionary')}
              </span>
              <Transition
                name="fade-transition"
                v-slots={{
                  default: () =>
                    listWordsLoading.value && (
                      <div class="absolute right-0 -mr-6 inline-block text-gray-200">
                        <Progress indeterminate size="20" width="2" />
                      </div>
                    ),
                }}
              />
            </span>
          </div>

          <DataTable
            headers={headers.value}
            items={items.value}
            search={search.value}
            groupBy={groupBy.value}
            groupDesc={groupDesc.value}
            customGroup={customGroup}
            loading={listWordsLoading.value}
            tableClass="w-full table-fixed rounded-t-none"
            class="pt-6"
            hoverable
            v-slots={{
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
                props.items.map((item, i) => (
                  <>
                    {item.group ? (
                      <tr
                        key={item.groupName}
                        style={{ background: 'transparent' }}
                      >
                        <td
                          colspan={headers.value.length}
                          style={{
                            height: i === 0 ? '16px' : '32px',
                            paddingLeft: '12px',
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
                              'truncate px-3',
                              { 'text-right': header.value === 'more' },
                            ]}
                            onClick={() => {
                              header.value !== 'status'
                                ? toggleExpand(item.id)
                                : undefined
                            }}
                          >
                            {header.value === 'more' ? (
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
                            <WordSpecsLinks
                              orgId={orgId as string}
                              wordId={item.id}
                            />
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
            orgId={orgId as string}
            loading={createWordLoading.value}
            actionText={t('action.add')}
            {...{
              onCancel: () => {
                createDialog.value = false
              },
              onSubmit: (input: WordFormSubmitInput) =>
                createWordMutate({
                  orgId: orgId as string,
                  input,
                }),
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
            orgId={orgId as string}
            item={editItem.value}
            loading={updateWordLoading.value}
            actionText={t('action.apply')}
            {...{
              onCancel: () => {
                editDialog.value = false
              },
              onSubmit: (input: WordFormSubmitInput) =>
                updateWordMutate({
                  orgId: orgId as string,
                  input,
                }),
            }}
          />
        </Dialog>
      </>
    )
  },
})
