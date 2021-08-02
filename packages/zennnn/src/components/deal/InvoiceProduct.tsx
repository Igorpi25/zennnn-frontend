import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useApolloClient, useQuery, useMutation } from '@vue/apollo-composable'
import { isNumber } from 'vue-supp'
import {
  ziEdit,
  ziLink,
  ziUser,
  ziOpenInNew,
  ziCloseDelete,
  ziPlusOutline,
  ziLanguages,
} from '@zennnn/icons'
import {
  Btn,
  Icon,
  Switch,
  Select,
  TextField,
  Autocomplete,
} from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import {
  InvoiceProfitType,
  RoleInProject,
  ProductStatus,
} from '@/graphql/types'
import { GET_SPEC, SEARCH_WORDS } from '@/graphql/queries'
import {
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_COST,
  UPDATE_PRODUCT_STORE,
  UPDATE_PRODUCT_INFO,
  UPDATE_PRODUCT_LINK,
  DELETE_PRODUCT,
  CREATE_WORD,
  UPDATE_WORD,
} from '@/graphql/mutations'
import { useRoleInProject } from '@/composables/roleInProject'
import { EmptyString, WordStatus } from '@/types'
import { isDealSyncVar } from '@/plugins/apollo'
import { isLink } from '@/utils/isLink'
import CommentList from '@/components/comment/List'
import WordForm from '@/components/word/Form'
import ProductImage from './ProductImage'
import ProductImageList from './ProductImageList'

import type { PropType } from 'vue'
import type {
  GetSpec,
  GetSpecVariables,
  SearchWords,
  SearchWordsVariables,
  GetSpec_getSpec_invoices_products,
  UpdateProduct,
  UpdateProductVariables,
  UpdateProductCost,
  UpdateProductCostVariables,
  UpdateProductStore,
  UpdateProductStoreVariables,
  UpdateProductInfo,
  UpdateProductInfoVariables,
  UpdateProductLink,
  UpdateProductLinkVariables,
  DeleteProduct,
  DeleteProductVariables,
  ProductInput,
  GetSpec_getSpec_invoices_products_name,
  CreateWord,
  CreateWordVariables,
  UpdateWord,
  UpdateWordVariables,
} from '@/graphql/types'
import type { WordFormSubmitInput } from '@/components/word/Form'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetSpec_getSpec_invoices_products | null>,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    activeTab: {
      type: Number,
      default: 1,
    },
    profitType: {
      type: String as PropType<InvoiceProfitType | null>,
      default: null,
    },
    profitForAll: {
      type: Boolean,
      default: true,
    },
    create: Boolean,
  },

  emits: ['create'],

  setup(props, { emit }) {
    const route = useRoute()
    const { t, n, locale } = useI18n()
    const { hasAccess } = useRoleInProject({
      specId: route.params.specId as string,
    })
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const linkInputRef = ref()
    const wordSearch = ref('')
    const wordCreateFormRef = ref()
    const wordCreateDialog = ref(false)
    const wordEditFormRef = ref()
    const wordEditDialog = ref(false)
    const isLinkUrlFocus = ref(false)
    const wordCreateText = ref('')

    const { result: searchWordsResult } = useQuery<
      SearchWords,
      SearchWordsVariables
    >(
      SEARCH_WORDS,
      () => ({
        orgId: route.params.orgId as string,
        search: wordSearch.value,
        locale: locale.value,
      }),
      () => ({
        enabled: !!wordSearch.value,
        fetchPolicy: 'cache-and-network',
        debounce: 300,
      })
    )

    const { mutate: updateProductMutate } = useMutation<
      UpdateProduct,
      UpdateProductVariables
    >(UPDATE_PRODUCT, { fetchPolicy: 'no-cache' })

    const { mutate: updateProductCostMutate } = useMutation<
      UpdateProductCost,
      UpdateProductCostVariables
    >(UPDATE_PRODUCT_COST, { fetchPolicy: 'no-cache' })

    const { mutate: updateProductStoreMutate } = useMutation<
      UpdateProductStore,
      UpdateProductStoreVariables
    >(UPDATE_PRODUCT_STORE, { fetchPolicy: 'no-cache' })

    const { mutate: updateProductInfoMutate } = useMutation<
      UpdateProductInfo,
      UpdateProductInfoVariables
    >(UPDATE_PRODUCT_INFO, { fetchPolicy: 'no-cache' })

    const { mutate: updateProductLinkMutate } = useMutation<
      UpdateProductLink,
      UpdateProductLinkVariables
    >(UPDATE_PRODUCT_LINK, { fetchPolicy: 'no-cache' })

    const { mutate: deleteProductMutate } = useMutation<
      DeleteProduct,
      DeleteProductVariables
    >(DELETE_PRODUCT)

    const { mutate: createWordMutate, loading: createWordLoading } =
      useMutation<CreateWord, CreateWordVariables>(CREATE_WORD)

    const {
      mutate: updateWordMutate,
      loading: updateWordLoading,
      onDone: onUpdateWordDone,
    } = useMutation<UpdateWord, UpdateWordVariables>(UPDATE_WORD)

    onUpdateWordDone(() => {
      wordEditDialog.value = false
    })

    const searchWords = computed(
      () => searchWordsResult.value?.searchWords?.items
    )

    const hasNoTranslation = computed(
      // TODO: typing of wordItem
      () => props.item?.name && !(wordItem.value as any)[locale.value]
    )

    const hasWord = computed(() => props.item?.name?.id)

    const canEdit = computed(
      () => hasWord.value && props.item?.name?.status === WordStatus.DRAFT
    )

    const wordItem = computed(() => {
      const word = props.item
        ?.name as GetSpec_getSpec_invoices_products_name | null
      const values = word?.values || []
      const result = {} as Record<string, string>
      values.forEach((el) => {
        const v = el.v || el.tr
        if (v) {
          result[el.k] = v
        }
      })
      const text =
        result[locale.value] ||
        (word?.defaultLocale ? result[word.defaultLocale] : '')
      return word
        ? {
            ...word,
            text,
          }
        : {
            text,
          }
    })

    const words = computed(() => {
      const items = searchWords.value || []
      return items.map((word) => {
        const values = word?.values || []
        const result = {} as Record<string, string>
        values.forEach((el) => {
          const v = el.v || el.tr
          if (v) {
            result[el.k] = v
          }
        })
        const text =
          result[locale.value] ||
          (word?.defaultLocale ? result[word.defaultLocale] : '')
        return {
          ...word,
          text,
        }
      })
    })

    const commentators = computed(
      () => props.item?.comments?.map((item) => item?.senderName || '') || []
    )

    const newCommentsCount = computed(
      () =>
        props.item?.comments?.reduce((count, item) => {
          if (!item?.viewed) {
            count++
          }
          return count
        }, 0) ?? 0
    )

    const isOwnerOrManager = computed(() => hasAccess(RoleInProject.MANAGER))

    const isWarehouseman = computed(() => hasAccess(RoleInProject.WAREHOUSEMAN))

    const linkUrl = computed(() =>
      link.value?.url && isLink(link.value.url) ? link.value.url : ''
    )

    const isInvoiceProfitTypeMargin = computed(
      () => props.profitType === InvoiceProfitType.MARGIN
    )

    const isInvoiceProfitTypeCommission = computed(
      () => props.profitType === InvoiceProfitType.COMMISSION
    )

    const productStatusColor = computed(() =>
      props.item?.productStatus === ProductStatus.IN_STOCK
        ? 'bg-green-500'
        : props.item?.productStatus === ProductStatus.IN_PRODUCTION
        ? 'bg-yellow-500'
        : props.item?.productStatus === ProductStatus.IN_PROCESSING
        ? 'bg-pink-500'
        : ''
    )

    const unitsItems = computed(() => {
      const units = [
        'pcs',
        'roll',
        'time',
        'm',
        'l',
        'm3',
        'set',
        'm2',
        'kg',
        'pack',
      ]
      return units.map((el) => ({
        value: el,
        text: t(`unit.${el}`),
      }))
    })

    const hasCustomPurchasePrice = computed(
      () => !props.profitForAll && isNumber(cost.value?.customPurchasePrice)
    )

    const purchasePrice = computed(() => {
      if (props.profitForAll) {
        return cost.value?.purchasePrice
      }
      return isNumber(cost.value?.customPurchasePrice)
        ? cost.value?.customPurchasePrice
        : cost.value?.purchasePrice
    })

    const hasCustomClientPrice = computed(
      () => !props.profitForAll && isNumber(cost.value?.customClientPrice)
    )

    const clientPrice = computed(() => {
      if (props.profitForAll) {
        return cost.value?.clientPrice
      }
      return isNumber(cost.value?.customClientPrice)
        ? cost.value?.customClientPrice
        : cost.value?.clientPrice
    })

    const cost = computed(() => props.item?.cost)

    const store = computed(() => props.item?.store)

    const info = computed(() => props.item?.info)

    const link = computed(() => props.item?.link)

    watch(wordCreateDialog, (val) => {
      if (!val) {
        wordCreateText.value = ''
      }
    })

    watch(wordCreateDialog, (val) => {
      nextTick(() => {
        if (val) {
          wordCreateFormRef.value && wordCreateFormRef.value.focus()
        } else {
          wordCreateFormRef.value && wordCreateFormRef.value.reset()
        }
      })
    })

    watch(wordEditDialog, (val) => {
      nextTick(() => {
        if (val) {
          if (wordEditFormRef.value) {
            wordEditFormRef.value.setValues(props.item?.name)
            wordEditFormRef.value.focus()
          }
        } else {
          wordEditFormRef.value && wordEditFormRef.value.reset()
        }
      })
    })

    function openWordCreateDialog() {
      wordCreateText.value = wordSearch.value || ''
      wordCreateDialog.value = true
    }

    function createOrUpdateProduct(input: ProductInput) {
      if (props.create) {
        emit('create', input)
      } else {
        updateProduct(input)
      }
    }

    async function updateProduct(input: ProductInput) {
      try {
        if (props.item?.id) {
          await updateProductMutate({
            id: props.item.id,
            input: input,
          })
        }
      } catch (error) {
        if (
          error.message &&
          error.message.includes('GraphQL error: MongoError: WriteConflict')
        ) {
          refetchSpec()
        } else {
          throw new Error(error)
        }
      }
    }

    async function refetchSpec() {
      try {
        isDealSyncVar(true)
        await apolloClient.query<GetSpec, GetSpecVariables>({
          query: GET_SPEC,
          variables: {
            id: route.params.specId as string,
          },
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        isDealSyncVar(false)
      }
    }

    return () => (
      <tr>
        <td class="relative p-0">
          <span
            class={[
              'absolute top-0 left-0 w-0.5 h-full',
              productStatusColor.value,
            ]}
          />
        </td>
        <td class="pl-4 text-base text-gray-100">{props.index}</td>
        <td class="text-center pl-1">
          {isOwnerOrManager.value && props.create ? (
            <ProductImage
              caption={info.value?.description}
              upload
              {...{
                onUploadStart: () => emit('create', {}),
              }}
            />
          ) : (
            <ProductImage
              productId={props.item?.id}
              images={info.value?.images}
              upload={isOwnerOrManager.value}
              removable={isOwnerOrManager.value}
              sortable={isOwnerOrManager.value}
              caption={info.value?.description}
            />
          )}
        </td>
        <td class="pr-2.5">
          {/* <!-- TODO: check active style prop --> */}
          {isOwnerOrManager.value ? (
            <Autocomplete
              modelValue={wordItem.value}
              placeholder={
                hasNoTranslation.value
                  ? t('words.noTranslation')
                  : t('shipping.name')
              }
              // lazy={props.create}
              v-model={[wordSearch.value, 'search']}
              items={words.value}
              showArrow={false}
              inputClass={
                hasNoTranslation.value ? 'placeholder-yellow-300' : ''
              }
              // activeStyle={{ width: '180px', zIndex: 10 }}
              // minWidth="180px"
              // maxWidth="180px"
              itemValue="id"
              itemText="text"
              solo
              noFilter
              class="relative"
              {...{
                'onUpdate:modelValue': (val: any) =>
                  createOrUpdateProduct({ name: val }),
              }}
              v-slots={{
                item: ({ item }: any) => (
                  <span class="truncate">{item.text}</span>
                ),
                'prepend-item': () => (
                  <Btn
                    class="inline-flex"
                    {...{
                      onClick: openWordCreateDialog,
                    }}
                  >
                    <Icon class="mr-1">{ziPlusOutline}</Icon>
                    <span>{t('words.addWord')}</span>
                  </Btn>
                ),
                append: ({ focused }: { focused: boolean }) =>
                  focused &&
                  canEdit.value && (
                    <Btn
                      icon
                      mini
                      text
                      class="mr-2.5"
                      {...{
                        onClick: () => {
                          wordEditDialog.value = true
                        },
                      }}
                    >
                      <Icon>{ziEdit}</Icon>
                    </Btn>
                  ),
              }}
            />
          ) : (
            <span class="pl-2.5">{wordItem.value.text}</span>
          )}
          {isOwnerOrManager.value && (
            <Dialog
              v-model={wordCreateDialog.value}
              title={t('words.addWordTitle')}
              icon={ziLanguages}
              maxWidth={720}
            >
              <WordForm
                ref={wordCreateFormRef}
                orgId={route.params.orgId as string}
                loading={createWordLoading.value}
                actionText={t('action.add')}
                // TODO: handle init value in component
                initValue={wordCreateText.value}
                {...{
                  onCancel: () => {
                    wordCreateDialog.value = false
                  },
                  onSubmit: async (input: WordFormSubmitInput) => {
                    const response = await createWordMutate({
                      orgId: route.params.orgId as string,
                      input,
                    })
                    if (response?.data?.createWord?.id) {
                      await createOrUpdateProduct({
                        name: response.data.createWord.id,
                      })
                      wordCreateDialog.value = false
                    }
                  },
                }}
              />
            </Dialog>
          )}
          {isOwnerOrManager.value && canEdit.value && (
            <Dialog
              v-model={wordEditDialog.value}
              title={t('words.editWord')}
              icon={ziLanguages}
              maxWidth={720}
            >
              <WordForm
                ref={wordEditFormRef}
                orgId={route.params.orgId as string}
                item={props.item?.name ? props.item.name : undefined}
                loading={updateWordLoading.value}
                actionText={t('action.apply')}
                {...{
                  onCancel: () => {
                    wordEditDialog.value = false
                  },
                  onSubmit: (input: WordFormSubmitInput) =>
                    updateWordMutate({
                      orgId: route.params.orgId as string,
                      input,
                    }),
                }}
              />
            </Dialog>
          )}
        </td>
        <td class="pr-2.5">
          {isOwnerOrManager.value ? (
            <TextField
              modelValue={props.item?.article}
              placeholder={t('shipping.model')}
              lazy={props.create}
              solo
              {...{
                'onUpdate:modelValue': (val: any) =>
                  createOrUpdateProduct({ article: val }),
              }}
            />
          ) : (
            <span class="pl-2.5">{props.item?.article}</span>
          )}
        </td>
        <td class="text-right">
          {!props.create &&
            (isOwnerOrManager.value ? (
              <TextField
                modelValue={props.item?.qty}
                placeholder={t('placeholder.emptyNumber')}
                lazy
                solo
                number
                {...{
                  'onUpdate:modelValue': (val: any) =>
                    updateProduct({ qty: val }),
                }}
              />
            ) : (
              <span class="pl-2.5">{n(props.item?.qty || 0)}</span>
            ))}
        </td>

        <td>
          {!props.create &&
            (isOwnerOrManager.value ? (
              <Select
                modelValue={props.item?.unit || 'pcs'}
                class="text-gray-100 text-base"
                items={unitsItems.value}
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateProduct({ unit: val }),
                }}
              />
            ) : (
              <span>{t(`unit.${props.item?.unit || 'pcs'}`)}</span>
            ))}
        </td>

        {props.activeTab === 1 ? (
          props.create ? (
            <>
              <td />
              <td />
              <td />
              <td />
            </>
          ) : (
            <>
              {(isInvoiceProfitTypeMargin.value || !props.profitForAll) &&
              isOwnerOrManager.value ? (
                <td class="pl-2.5">
                  <TextField
                    modelValue={purchasePrice.value}
                    placeholder={t('placeholder.emptyNumber')}
                    inputClass={
                      hasCustomPurchasePrice.value ? 'text-blue-900' : ''
                    }
                    lazy
                    solo
                    number
                    numberFormat="currency"
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        if (props.item?.id) {
                          updateProductCostMutate({
                            id: props.item.id,
                            input: { purchasePrice: val },
                          })
                        }
                      },
                    }}
                  />
                </td>
              ) : (
                <td class="text-right px-2.5">
                  {n(cost.value?.purchasePrice || 0, 'fixed')}
                </td>
              )}

              <td class="text-right px-2.5">
                {n(cost.value?.purchaseAmount || 0, 'fixed')}
              </td>

              {(isInvoiceProfitTypeCommission.value || !props.profitForAll) &&
              isOwnerOrManager.value ? (
                <td class="pl-2.5">
                  <TextField
                    modelValue={clientPrice.value}
                    placeholder={t('placeholder.emptyNumber')}
                    inputClass={
                      hasCustomClientPrice.value ? 'text-blue-900' : ''
                    }
                    lazy
                    solo
                    number
                    numberFormat="currency"
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        if (props.item?.id) {
                          updateProductCostMutate({
                            id: props.item.id,
                            input: { clientPrice: val },
                          })
                        }
                      },
                    }}
                  />
                </td>
              ) : (
                <td v-else class="text-right px-2.5">
                  {n(cost.value?.clientPrice || 0, 'fixed')}
                </td>
              )}

              <td class="text-right px-2.5">
                {n(cost.value?.clientAmount || 0, 'fixed')}
              </td>
            </>
          )
        ) : props.activeTab === 2 ? (
          props.create ? (
            <>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
            </>
          ) : (
            <>
              <td class="pl-1">
                <TextField
                  modelValue={store.value?.net}
                  placeholder={t('placeholder.emptyNumber')}
                  solo
                  number
                  {...{
                    'onUpdate:modelValue': (val: any) => {
                      if (props.item?.id) {
                        updateProductStoreMutate({
                          id: props.item.id,
                          input: { net: val },
                        })
                      }
                    },
                  }}
                />
              </td>
              <td>
                <TextField
                  modelValue={store.value?.gross}
                  placeholder={t('placeholder.emptyNumber')}
                  solo
                  number
                  {...{
                    'onUpdate:modelValue': (val: any) => {
                      if (props.item?.id) {
                        updateProductStoreMutate({
                          id: props.item.id,
                          input: { gross: val },
                        })
                      }
                    },
                  }}
                />
              </td>
              <td>
                <div class="flex items-center">
                  <TextField
                    modelValue={store.value?.width}
                    placeholder={t('placeholder.emptyNumber')}
                    solo
                    number
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        if (props.item?.id) {
                          updateProductStoreMutate({
                            id: props.item.id,
                            input: { width: val },
                          })
                        }
                      },
                    }}
                  />
                  <TextField
                    modelValue={store.value?.height}
                    placeholder={t('placeholder.emptyNumber')}
                    solo
                    number
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        if (props.item?.id) {
                          updateProductStoreMutate({
                            id: props.item.id,
                            input: { height: val },
                          })
                        }
                      },
                    }}
                  />
                  <TextField
                    modelValue={store.value?.length}
                    placeholder={t('placeholder.emptyNumber')}
                    solo
                    number
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        if (props.item?.id) {
                          updateProductStoreMutate({
                            id: props.item.id,
                            input: { length: val },
                          })
                        }
                      },
                    }}
                  />
                </div>
              </td>
              <td>
                {(isOwnerOrManager.value || isWarehouseman.value) && (
                  <TextField
                    modelValue={store.value?.pkgQty}
                    placeholder={t('placeholder.emptyNumber')}
                    solo
                    number
                    numberFormat="integer"
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        if (props.item?.id) {
                          updateProductStoreMutate({
                            id: props.item.id,
                            input: { pkgQty: val },
                          })
                        }
                      },
                    }}
                  />
                )}
              </td>
              <td>
                {(isOwnerOrManager.value || isWarehouseman.value) && (
                  <TextField
                    modelValue={store.value?.pkgNo}
                    placeholder={t('placeholder.emptyNumber')}
                    solo
                    number
                    numberFormat="integer"
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        if (props.item?.id) {
                          updateProductStoreMutate({
                            id: props.item.id,
                            input: { pkgNo: val },
                          })
                        }
                      },
                    }}
                  />
                )}
              </td>
              <td class="pl-1">
                {(isOwnerOrManager.value || isWarehouseman.value) && (
                  <div class="h-4 relative">
                    <Switch
                      modelValue={!!store.value?.atWhouse}
                      small
                      class="absolute left-0 top-0"
                      {...{
                        onChange: (val: boolean) => {
                          if (props.item?.id) {
                            updateProductStoreMutate({
                              id: props.item.id,
                              input: { atWhouse: val },
                            })
                          }
                        },
                      }}
                    />
                  </div>
                )}
              </td>
            </>
          )
        ) : props.activeTab === 3 ? (
          props.create ? (
            <>
              <td />
              <td />
            </>
          ) : (
            <>
              <td class="text-left pl-6">
                {info.value?.images && (
                  <div>
                    <ProductImageList
                      productId={props.item?.id as string}
                      images={info.value.images}
                      upload={isOwnerOrManager.value}
                      removable={isOwnerOrManager.value}
                      caption={info.value.description}
                    />
                  </div>
                )}
              </td>
              <td class="text-left pl-2.5">
                {isOwnerOrManager.value || isWarehouseman.value ? (
                  <TextField
                    modelValue={info.value?.description}
                    placeholder={t('placeholder.emptyText')}
                    solo
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        if (props.item?.id) {
                          updateProductInfoMutate({
                            id: props.item.id,
                            input: { description: val },
                          })
                        }
                      },
                    }}
                  />
                ) : (
                  <span class="truncate">{info.value?.description}</span>
                )}
              </td>
            </>
          )
        ) : props.activeTab === 4 ? (
          props.create ? (
            <>
              <td />
              <td />
            </>
          ) : (
            <>
              <td class="pl-6 pr-3">
                {isOwnerOrManager.value && (
                  <div class="opacity-40 pointer-events-none flex items-center text-gray-200 h-8 bg-gray-800 rounded px-2.5">
                    <div class="mr-2.5">
                      <svg
                        width="25"
                        height="21"
                        viewBox="0 0 25 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.5425 7.99658L7.47656 13.0625L8.7998 14.3857L11.6068 11.5787V20.8754H13.4782V11.5787L16.2852 14.3857L17.6084 13.0625L12.5425 7.99658Z"
                          fill="currentColor"
                        />
                        <path
                          d="M20.0255 7.61465C19.9148 3.53146 16.5588 0.243652 12.4494 0.243652C10.5615 0.243652 8.7527 0.94209 7.35606 2.2102C6.15264 3.30286 5.33945 4.73943 5.02103 6.31317C3.88337 6.55781 2.84495 7.14628 2.04152 8.01239C1.06005 9.07064 0.519531 10.4487 0.519531 11.8927C0.519531 15.0399 3.07994 17.6003 6.22713 17.6003C6.23458 17.6003 6.24194 17.6002 6.24733 17.6002H7.20958V15.7288H6.23959L6.22178 15.729C4.10894 15.7261 2.39088 14.0063 2.39088 11.8927C2.39088 9.90689 3.9392 8.22731 5.91583 8.06911L6.69245 8.00695L6.772 7.23197C7.0713 4.31479 9.51208 2.11495 12.4494 2.11495C15.5965 2.11495 18.157 4.67536 18.157 7.82254V9.45998H19.5137C21.242 9.45998 22.6481 10.8661 22.6481 12.5945C22.6481 14.3228 21.242 15.7289 19.5137 15.7289L17.8762 15.7286V17.6001H19.4832C19.4934 17.6002 19.5035 17.6004 19.5137 17.6004C22.2739 17.6004 24.5195 15.3547 24.5195 12.5945C24.5195 10.007 22.5463 7.87171 20.0255 7.61465Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div class="text-[0.8125rem]">{t('shipping.linkFile')}</div>
                  </div>
                )}
              </td>
              <td class="pl-3">
                {isOwnerOrManager.value || isWarehouseman.value ? (
                  <div class="flex items-center relative">
                    <TextField
                      ref={linkInputRef}
                      modelValue={link.value?.url}
                      placeholder={t('placeholder.emptyText')}
                      solo
                      class="flex-grow"
                      {...{
                        onFocus: () => {
                          isLinkUrlFocus.value = true
                        },
                        onBlur: () => {
                          isLinkUrlFocus.value = false
                        },
                        'onUpdate:modelValue': (val: any) => {
                          if (props.item?.id) {
                            updateProductLinkMutate({
                              id: props.item.id,
                              input: { url: val },
                            })
                          }
                        },
                      }}
                    />
                    <a
                      v-show={linkUrl.value && !isLinkUrlFocus.value}
                      href={linkUrl.value}
                      target="_blank"
                      class="inline-flex text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                    >
                      <Icon>{ziOpenInNew}</Icon>
                    </a>
                    {!link.value?.url && !isLinkUrlFocus.value && (
                      <div class="absolute inset-0 flex items-center justify-end">
                        <button
                          class="h-8 w-full flex items-center justify-center rounded bg-gray-800 text-center text-gray-300 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                          {...{
                            onClick: () => {
                              linkInputRef.value?.focus()
                            },
                          }}
                        >
                          <Icon class="mr-2.5">{ziLink}</Icon>
                          <span>{t('shipping.linkAdd')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <span class="truncate">{link.value?.url}</span>
                )}
              </td>
            </>
          )
        ) : props.activeTab === 5 ? (
          props.create ? (
            <>
              <td />
              <td />
              <td />
            </>
          ) : (
            <>
              <td class="px-6">
                {commentators.value.length === 1 ? (
                  <div class="flex items-center">
                    <div class="w-8 h-8 flex items-center flex-shrink-0 mr-2.5">
                      <div class="w-full h-full rounded-full flex items-center justify-center border border-gray-200">
                        <Icon class="text-gray-200">{ziUser}</Icon>
                      </div>
                    </div>
                    <div class="flex-grow text-sm truncate">
                      {commentators.value[0]}
                    </div>
                  </div>
                ) : commentators.value.length > 0 ? (
                  <div class="flex">
                    {/* <!-- TODO: should stacked --> */}
                    {commentators.value.map((item) => (
                      <div title={item}>
                        <div class="w-8 h-8 flex items-center flex-shrink-0 mr-0.5">
                          <div class="w-full h-full rounded-full flex items-center justify-center border border-gray-200">
                            <Icon class="text-gray-200">{ziUser}</Icon>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : undefined}
              </td>
              <td class="px-5 text-sm whitespace-nowrap">
                {props.item?.comments && props.item.comments.length > 0 && (
                  <>
                    <span class="mr-2.5">{t('shipping.chatMessages')}:</span>
                    <span
                      class={[
                        'font-semibold h-5 inline-flex items-center justify-center rounded-[50px] px-1 pt-px',
                        newCommentsCount.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-800 bg-opacity-90',
                      ]}
                      style="min-width: 20px"
                    >
                      {props.item?.comments.length}
                    </span>
                  </>
                )}
              </td>
              <td class="text-center px-5">
                <CommentList
                  items={props.item?.comments || []}
                  productId={props.item?.id}
                  specId={route.params.specId as string}
                  isProduct
                  placement="left-start"
                  class="inline-block"
                  v-slots={{
                    activator: () => (
                      <button class="h-8 w-32 inline-block rounded text-blue-500 border border-gray-400 hover:border-blue-500 focus:border-blue-500 focus:outline-none select-none transition-colors duration-100 ease-out">
                        {t('shipping.chatStart')}
                      </button>
                    ),
                  }}
                />
              </td>
            </>
          )
        ) : undefined}

        {props.activeTab !== 5 && (
          <td>
            {isOwnerOrManager.value && !props.create && (
              <Btn
                mini
                icon
                text
                class="flex justify-end text-gray-200 pr-3 md:pr-3.5 ml-auto"
                {...{
                  onClick: () => {
                    if (props.item?.id) {
                      deleteProductMutate({
                        id: props.item.id,
                      })
                    }
                  },
                }}
              >
                <Icon>{ziCloseDelete}</Icon>
              </Btn>
            )}
          </td>
        )}
      </tr>
    )
  },
})
