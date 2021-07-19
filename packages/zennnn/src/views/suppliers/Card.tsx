import { defineComponent, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Progress } from '@zennnn/core'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_SUPPLIER } from '@/graphql/queries'
import { CREATE_SUPPLIER, UPDATE_SUPPLIER } from '@/graphql/mutations'
import Form from '@/components/supplier/Form'
import { useNotify } from '@/plugins'

import type {
  GetSupplier,
  GetSupplierVariables,
  CreateSupplier,
  CreateSupplierVariables,
  UpdateSupplier,
  UpdateSupplierVariables,
} from '@/graphql/types'

export default defineComponent({
  props: {
    create: Boolean,
  },

  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const notify = useNotify()

    const routeReplaceLoading = ref(false)

    const { loading: getSupplierLoading, result: getSupplierResult } = useQuery<
      GetSupplier,
      GetSupplierVariables
    >(
      GET_SUPPLIER,
      () => ({
        id: route.params.supplierId as string,
      }),
      () => ({
        enabled: !props.create,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      })
    )

    const item = computed(() => getSupplierResult.value?.getSupplier)

    const { mutate: createMutate } = useMutation<
      CreateSupplier,
      CreateSupplierVariables
    >(CREATE_SUPPLIER)

    const { mutate: updateMutate } = useMutation<
      UpdateSupplier,
      UpdateSupplierVariables
    >(UPDATE_SUPPLIER)

    async function onUpdate(input: any) {
      if (props.create) {
        const { data } = await createMutate({
          orgId: route.params.orgId as string,
          input: input,
        })
        if (data?.createSupplier) {
          notify(t('supplier.created'))
          await router.replace({
            name: 'supplier',
            params: {
              orgId: route.params.orgId,
              supplierId: data.createSupplier.id,
            },
          })
        }
      } else if (item.value?.id) {
        await updateMutate({
          id: item.value.id,
          input: input,
        })
      }
    }

    return () => (
      <div class="container relative pt-8 pb-12">
        <Form
          key={route.fullPath}
          orgId={route.params.orgId as string}
          supplierId={route.params.supplierId as string}
          item={item.value || undefined}
          loading={getSupplierLoading.value}
          create={props.create}
          {...{
            onUpdate: onUpdate,
          }}
        />

        {routeReplaceLoading.value && (
          <div class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 backdrop-blur-lg transition-all">
            <Progress class="text-blue-500" size={42} indeterminate />
          </div>
        )}
      </div>
    )
  },
})
