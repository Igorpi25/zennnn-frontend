import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ziSearch, ziPlusOutline, ziLanguages } from '@zennnn/icons'
import {
  Checkbox,
  Btn,
  Icon,
  ExpandTransition,
  Autocomplete,
} from '@zennnn/core'
import { SEARCH_WORDS } from '@/graphql/queries'
import {
  ADD_PRODUCTS_TO_WORD,
  CREATE_WORD_WITH_PRODUCTS,
} from '@/graphql/mutations'

import Dialog from 'shared/components/Dialog'
import WordProduct from '@/components/WordProduct'
import WordForm from '@/components/WordForm'

import type { PropType } from 'vue'
import type {
  ListWords_listWords_items,
  SearchWords,
  SearchWordsVariables,
  SearchWords_searchWords_items,
  AddProductsToWord,
  AddProductsToWordVariables,
  CreateWordWithProducts,
  CreateWordWithProductsVariables,
} from '@/graphql/types'
import type { WordFormSubmitInput } from '@/components/WordForm'

export default defineComponent({
  props: {
    item: Object as PropType<ListWords_listWords_items>,
  },

  setup(props) {
    const { t, locale } = useI18n()

    const search = ref('')
    const selectedItemId = ref()
    const selected = ref<string[]>([])

    const createDialog = ref(false)
    const createFormRef = ref()

    const addToDialog = ref(false)
    const addToSelectRef = ref()

    const { result: searchWordsResult, loading: searchWordsLoading } = useQuery<
      SearchWords,
      SearchWordsVariables
    >(
      SEARCH_WORDS,
      () => ({
        search: search.value,
      }),
      () => ({
        enabled: !!(search.value && addToDialog.value),
        fetchPolicy: 'cache-and-network',
        debounce: 300,
      })
    )

    const {
      mutate: createWordWithProductsMutate,
      loading: createWordWithProductsLoading,
      onDone: onCreateWordWithProductsDone,
    } = useMutation<CreateWordWithProducts, CreateWordWithProductsVariables>(
      CREATE_WORD_WITH_PRODUCTS,
      // TODO: return created item in result for update cache and not refetch
      {
        refetchQueries: ['ListWords'],
      }
    )

    const {
      mutate: addProductsToWordMutate,
      loading: addProductsToWordLoading,
      onDone: onAddProductsToWordDone,
    } = useMutation<AddProductsToWord, AddProductsToWordVariables>(
      ADD_PRODUCTS_TO_WORD,
      // TODO: return created item in result for update cache and not refetch
      {
        refetchQueries: ['ListWords'],
      }
    )

    onCreateWordWithProductsDone(() => {
      selected.value = []
      createDialog.value = false
    })

    onAddProductsToWordDone(() => {
      selected.value = []
      addToDialog.value = false
    })

    const products = computed(() => props.item && props.item.products)

    const words = computed(() => {
      const items =
        (searchWordsResult.value &&
          searchWordsResult.value.searchWords &&
          searchWordsResult.value.searchWords.items) ||
        []
      return items.map((item) => {
        const values = item.values || []
        const result = {} as SearchWords_searchWords_items & {
          [x: string]: string
        }
        values.forEach((el) => {
          const v = el.v || el.tr
          if (v) {
            result[el.k] = v
          }
        })
        let text = result[locale.value]
        if (!text) {
          if (item && item.defaultLocale) {
            text = result[item.defaultLocale]
          }
        }
        return {
          ...item,
          text,
        }
      })
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

    watch(addToDialog, (val) => {
      if (val) {
        search.value = ''
        selectedItemId.value = undefined
        nextTick(() => {
          nextTick(() => {
            addToSelectRef.value && addToSelectRef.value.focus()
          })
        })
      }
    })

    return () => (
      <div class="w-full grid grid-cols-4 gap-2">
        {products.value &&
          products.value.map((item) => (
            <div key={item.id} class="text-gray-100">
              <div class="flex space-x-2">
                <Checkbox
                  v-model={selected.value}
                  id={item.id}
                  value={item.id}
                  class="self-center"
                />
                <WordProduct images={item.images} />
                <label
                  for={item.id}
                  class="flex items-center leading-none overflow-hidden"
                  // @ts-ignore
                  title={item.article}
                >
                  <div class="truncate" style="min-height: 16px">
                    {item.article}
                  </div>
                </label>
              </div>
            </div>
          ))}

        <ExpandTransition>
          {selected.value.length > 0 && (
            <div class="col-span-4 justify-self-end space-x-3 pt-2">
              <Btn
                loading={addProductsToWordLoading.value}
                minWidth="100px"
                xSmall
                {...{
                  onClick: () => {
                    addToDialog.value = true
                  },
                }}
              >
                {t('words.addToWord')}
              </Btn>
              <Btn
                loading={createWordWithProductsLoading.value}
                minWidth="100px"
                xSmall
                outlined
                {...{
                  onClick: () => {
                    createDialog.value = true
                  },
                }}
              >
                {t('words.newWord')}
              </Btn>
            </div>
          )}
        </ExpandTransition>

        <Dialog
          v-model={createDialog.value}
          title={t('words.addWordTitle')}
          icon={ziLanguages}
          maxWidth={720}
        >
          <WordForm
            ref={createFormRef}
            loading={createWordWithProductsLoading.value}
            actionText={t('action.add')}
            {...{
              onCancel: () => {
                createDialog.value = false
              },
              onSubmit: (input: WordFormSubmitInput) => {
                if (!selected.value) return
                createWordWithProductsMutate({
                  productsIds: selected.value,
                  input,
                })
              },
            }}
          />
        </Dialog>

        <Dialog
          v-model={addToDialog.value}
          title={t('words.addToWord')}
          icon={ziPlusOutline}
        >
          <Autocomplete
            v-model={[search.value, 'search']}
            ref={addToSelectRef}
            modelValue={selectedItemId.value}
            loading={searchWordsLoading.value}
            placeholder={t('placeholder.startTyping')}
            items={words.value}
            label={t('words.wordFromDictionary')}
            itemValue="id"
            itemText="text"
            noFilter
            {...{
              'onUpdate:modelValue': (v: string) => {
                selectedItemId.value = v
              },
            }}
            v-slots={{
              'prepend-item': () => (
                <Btn
                  text
                  block
                  class="h-10 justify-start px-2"
                  {...{
                    onClick: () => {
                      addToDialog.value = false
                      nextTick(() => {
                        createDialog.value = true
                      })
                    },
                  }}
                >
                  <Icon class="mr-1">{ziPlusOutline}</Icon>
                  <span>{t('words.addNewWord')}</span>
                </Btn>
              ),
              prepend: () => <Icon>{ziSearch}</Icon>,
            }}
          />
          <div class="flex justify-between pt-8">
            <Btn
              disabled={addProductsToWordLoading.value}
              outlined
              minWidth={96}
              {...{
                onClick: () => {
                  addToDialog.value = false
                },
              }}
            >
              <span>{t('action.cancel')}</span>
            </Btn>
            <Btn
              loading={addProductsToWordLoading.value}
              disabled={!selectedItemId.value}
              {...{
                onClick: () => {
                  addProductsToWordMutate({
                    productsIds: selected.value,
                    wordId: selectedItemId.value as string,
                  })
                },
              }}
            >
              {t('action.add')}
            </Btn>
          </div>
        </Dialog>
      </div>
    )
  },
})
