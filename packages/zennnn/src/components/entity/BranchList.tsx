import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { Btn } from '@zennnn/core'
import { BranchType } from '@/graphql/types'
import { GET_SUPPLIER } from '@/graphql/queries'
import {
  CREATE_SUPPLIER_BRANCH,
  UPDATE_SUPPLIER_BRANCH,
  DELETE_SUPPLIER_BRANCH,
} from '@/graphql/mutations'
import BranchItem from './BranchItem'
import Expand from './Expand'

import type { PropType } from 'vue'
import type {
  GetSupplier_getSupplier_branches,
  GetSupplier,
  GetSupplierVariables,
  CreateSupplierBranch,
  CreateSupplierBranchVariables,
  UpdateSupplierBranch,
  UpdateSupplierBranchVariables,
  DeleteSupplierBranch,
  DeleteSupplierBranchVariables,
  SupplierBranchInput,
} from '@/graphql/types'

export default defineComponent({
  props: {
    emitChanges: Boolean,
    locale: String as PropType<string | null>,
    supplierId: String,
    items: {
      type: Array as PropType<GetSupplier_getSupplier_branches[]>,
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
      CreateSupplierBranch,
      CreateSupplierBranchVariables
    >(CREATE_SUPPLIER_BRANCH, {
      variables: {
        supplierId: props.supplierId as string,
        input: {},
      },
      update: (cache, { data: result }) => {
        const variables = { id: props.supplierId as string }
        const data = cache.readQuery<GetSupplier, GetSupplierVariables>({
          query: GET_SUPPLIER,
          variables,
        })
        if (data?.getSupplier && result?.createSupplierBranch) {
          cache.writeQuery<GetSupplier, GetSupplierVariables>({
            query: GET_SUPPLIER,
            variables,
            data: {
              getSupplier: {
                ...data.getSupplier,
                branches: data.getSupplier.branches
                  ? [
                      ...data.getSupplier.branches,
                      result.createSupplierBranch as GetSupplier_getSupplier_branches,
                    ]
                  : [
                      result.createSupplierBranch as GetSupplier_getSupplier_branches,
                    ],
              },
            },
          })
        }
      },
    })

    const { mutate: updateMutate } = useMutation<
      UpdateSupplierBranch,
      UpdateSupplierBranchVariables
    >(UPDATE_SUPPLIER_BRANCH)

    const { mutate: deleteMutate } = useMutation<
      DeleteSupplierBranch,
      DeleteSupplierBranchVariables
    >(DELETE_SUPPLIER_BRANCH, {
      update: (cache, { data: result }) => {
        const variables = { id: props.supplierId as string }
        const data = cache.readQuery<GetSupplier, GetSupplierVariables>({
          query: GET_SUPPLIER,
          variables,
        })
        if (data?.getSupplier?.branches && result?.deleteSupplierBranch) {
          cache.writeQuery<GetSupplier, GetSupplierVariables>({
            query: GET_SUPPLIER,
            variables,
            data: {
              getSupplier: {
                ...data.getSupplier,
                branches: data.getSupplier.branches.filter(
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
        emit('update', {
          branches: [...props.items, { branchType: BranchType.WAREHOUSE }],
        })
      } else {
        createMutate()
      }
    }

    function updateData(
      i: number,
      item: GetSupplier_getSupplier_branches,
      input: SupplierBranchInput
    ) {
      if (props.emitChanges) {
        const updatedItem = Object.assign({}, item, input)
        const items = props.items.slice()
        items.splice(i, 1, updatedItem)
        emit('update', { branches: items })
      } else {
        updateMutate({
          id: item.id,
          input,
        })
      }
    }

    async function deleteData(i: number, id: string) {
      if (props.emitChanges) {
        const items = props.items.slice()
        items.splice(i, 1)
        emit('update', { branches: items })
      } else {
        try {
          deleteItemId.value = id
          await deleteMutate({ id })
        } catch (error) {
          // eslint-disable-line
        } finally {
          deleteItemId.value = undefined
        }
      }
    }

    return () => (
      <Expand
        title={t('companyDetail.supplierBranchList')}
        expanded={props.expanded}
      >
        <div>
          <div class="grid md:grid-cols-2 gap-x-4 lg:gap-x-10 pt-4">
            {props.items.map((item, i) => (
              <div>
                {i > 0 && (
                  <div
                    class={[
                      'mt-10 mb-8 border-b border-gray-400',
                      { 'md:hidden': i === 1 },
                    ]}
                  />
                )}
                <BranchItem
                  loading={props.loading}
                  item={item}
                  locale={props.locale}
                  {...{
                    onUpdate: (val: any) => updateData(i, item, val),
                    onDelete: () => deleteData(i, item.id),
                  }}
                />
              </div>
            ))}
          </div>
          <div class="grid md:grid-cols-2 gap-x-4 lg:gap-x-10 pt-10">
            <Btn
              loading={createLoading.value}
              block
              outlined
              small
              {...{ onClick: addData }}
            >
              {t('companyDetail.addBranch')}
            </Btn>
          </div>
        </div>
      </Expand>
    )
  },
})
