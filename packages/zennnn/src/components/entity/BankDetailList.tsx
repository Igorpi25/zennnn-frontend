import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { ziCloseDelete } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'
import { GET_ORG_REQUISITE } from '@/graphql/queries'
import {
  CREATE_COMPANY_BANK_DETAIL,
  UPDATE_COMPANY_BANK_DETAIL,
  DELETE_COMPANY_BANK_DETAIL,
} from '@/graphql/mutations'
import { validateCompanyDetail } from '../../utils/validation'
import BankDetailItem from './BankDetailItem'
import Expand from './Expand'

import type { PropType } from 'vue'
import type {
  GetOrgRequisite_getOrgRequisite_bankDetails,
  BankDetailInput,
  GetOrgRequisite,
  GetOrgRequisiteVariables,
  CreateCompanyBankDetail,
  CreateCompanyBankDetailVariables,
  UpdateCompanyBankDetail,
  UpdateCompanyBankDetailVariables,
  DeleteCompanyBankDetail,
  DeleteCompanyBankDetailVariables,
} from '@/graphql/types'

export default defineComponent({
  props: {
    emitChanges: Boolean,
    locale: String as PropType<string | null>,
    companyId: String,
    defaultBankDetail: String as PropType<string | null>,
    items: {
      type: Array as PropType<GetOrgRequisite_getOrgRequisite_bankDetails[]>,
      default: () => [],
    },
    loading: Boolean,
    create: Boolean,
    expanded: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t } = useI18n()

    // TODO: return id of deleted item
    const deleteItemId = ref<string>()

    const { mutate: createMutate, loading: createLoading } = useMutation<
      CreateCompanyBankDetail,
      CreateCompanyBankDetailVariables
    >(CREATE_COMPANY_BANK_DETAIL, {
      variables: { companyId: props.companyId as string, input: {} },
      update: (cache, { data: result }) => {
        const variables = { id: props.companyId as string }
        const data = cache.readQuery<GetOrgRequisite, GetOrgRequisiteVariables>(
          {
            query: GET_ORG_REQUISITE,
            variables,
          }
        )
        // update validation state
        // should be fixed with subs
        if (data?.getOrgRequisite && result?.createCompanyBankDetail) {
          const v = validateCompanyDetail(data.getOrgRequisite)
          cache.writeQuery<GetOrgRequisite, GetOrgRequisiteVariables>({
            query: GET_ORG_REQUISITE,
            variables,
            data: {
              getOrgRequisite: {
                ...data.getOrgRequisite,
                isRequiredFilled: v.isRequiredFilled,
                isOptionalFilled: v.isOptionalFilled,
                bankDetails: data.getOrgRequisite.bankDetails
                  ? [
                      ...data.getOrgRequisite.bankDetails,
                      result.createCompanyBankDetail,
                    ]
                  : [result.createCompanyBankDetail],
              },
            },
          })
        }
      },
    })

    const { mutate: updateMutate } = useMutation<
      UpdateCompanyBankDetail,
      UpdateCompanyBankDetailVariables
    >(UPDATE_COMPANY_BANK_DETAIL)

    const { mutate: deleteMutate } = useMutation<
      DeleteCompanyBankDetail,
      DeleteCompanyBankDetailVariables
    >(DELETE_COMPANY_BANK_DETAIL, {
      update: (cache, { data: result }) => {
        const variables = { id: props.companyId as string }
        const data = cache.readQuery<GetOrgRequisite, GetOrgRequisiteVariables>(
          {
            query: GET_ORG_REQUISITE,
            variables,
          }
        )
        if (
          data?.getOrgRequisite?.bankDetails &&
          result?.deleteCompanyBankDetail
        ) {
          // update validation state
          // should be fixed with subs
          const v = validateCompanyDetail(data.getOrgRequisite)
          cache.writeQuery<GetOrgRequisite, GetOrgRequisiteVariables>({
            query: GET_ORG_REQUISITE,
            variables,
            data: {
              getOrgRequisite: {
                ...data.getOrgRequisite,
                isRequiredFilled: v.isRequiredFilled,
                isOptionalFilled: v.isOptionalFilled,
                bankDetails: data.getOrgRequisite.bankDetails.filter(
                  (el) => el.id !== deleteItemId.value
                ),
              },
            },
          })
        }
      },
    })

    function addData() {
      if (props.emitChanges) {
        emit('update', { bankDetails: [...props.items, {}] })
      } else {
        createMutate()
      }
    }

    function updateData(
      i: number,
      item: GetOrgRequisite_getOrgRequisite_bankDetails,
      input: BankDetailInput
    ) {
      if (props.emitChanges) {
        const updatedItem = Object.assign({}, item, input)
        const items = props.items.slice()
        items.splice(i, 1, updatedItem)
        emit('update', { bankDetails: items })
      } else if (props.companyId) {
        updateMutate({
          companyId: props.companyId,
          id: item.id,
          input,
        })
      }
    }

    async function deleteData(i: number, id: string) {
      if (props.emitChanges) {
        const items = props.items.slice()
        items.splice(i, 1)
        emit('update', { bankDetails: items })
      } else if (props.companyId) {
        try {
          deleteItemId.value = id
          await deleteMutate({ companyId: props.companyId, id })
        } catch (error) {
          // eslint-disable-line
        } finally {
          deleteItemId.value = undefined
        }
      }
    }

    return () => (
      <Expand title={t('companyDetail.bankDetail')} expanded={props.expanded}>
        <div>
          <div class="flex flex-wrap pt-4">
            {props.items.length > 0 ? (
              props.items.map((item, i) => (
                <div class="w-full relative">
                  {i > 0 && (
                    <>
                      <div class="mt-10 mb-8 border-b border-gray-400" />
                      <div class="absolute top-0 right-0 pt-12">
                        <Btn
                          icon
                          text
                          mini
                          class="text-gray-200"
                          onClick={() => deleteData(i, item.id)}
                        >
                          <Icon>{ziCloseDelete}</Icon>
                        </Btn>
                      </div>
                    </>
                  )}
                  <BankDetailItem
                    loading={props.loading}
                    create={i === props.items.length - 1}
                    createLoading={createLoading.value}
                    item={item}
                    mainBankDetail={Boolean(
                      item.id && item.id === props.defaultBankDetail
                    )}
                    {...{
                      onCreate: addData,
                      onUpdate: (val: any) => updateData(i, item, val),
                      onDelete: () => deleteData(i, item.id),
                      onSetMainBankDetail: (val: string) =>
                        emit('update', { defaultBankDetail: val }),
                    }}
                  />
                </div>
              ))
            ) : (
              <div class="w-full lg:w-1/2 pt-10">
                <Btn
                  loading={createLoading.value}
                  block
                  outlined
                  small
                  onClick={addData}
                >
                  {t('companyDetail.addBankDetail')}
                </Btn>
              </div>
            )}
          </div>
        </div>
      </Expand>
    )
  },
})
