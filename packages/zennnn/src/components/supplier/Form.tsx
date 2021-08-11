import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { GET_ORG_NEXT_SUPPLIER_UID } from '@/graphql/queries'
import LegalInfo from '@/components/entity/LegalInfo'
import LegalDetail from '@/components/entity/LegalDetail'
import ContactList from '@/components/entity/ContactList'
import ExtraInfo from '@/components/entity/ExtraInfo'
import BranchList from '@/components/entity/BranchList'
import ValidationStatus from '@/components/entity/ValidationStatus'

import type { PropType } from 'vue'
import type {
  GetSupplier_getSupplier,
  GetOrgNextSupplierUid,
  GetOrgNextSupplierUidVariables,
} from '@/graphql/types'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetSupplier_getSupplier>,
      default: () => ({}),
    },
    orgId: {
      type: String,
      required: true,
    },
    supplierId: String,
    loading: Boolean,
    create: Boolean,
  },

  emits: ['update'],

  setup(props, { emit, slots }) {
    const { t } = useI18n()

    const { result: uidResult } = useQuery<
      GetOrgNextSupplierUid,
      GetOrgNextSupplierUidVariables
    >(
      GET_ORG_NEXT_SUPPLIER_UID,
      () => ({
        orgId: props.orgId,
      }),
      () => ({
        enabled: props.create,
        fetchPolicy: 'network-only',
      })
    )

    const uid = computed(() => {
      if (props.item.uid) {
        return props.item.uid
      }
      return uidResult.value?.getOrgNextSupplierUid
    })

    function updateValue(input: any) {
      emit('update', input)
    }

    return () => (
      <div>
        <h1 class="text-2xl text-gray-900 dark:text-white font-semibold leading-tight mb-4">
          {props.create ? t('supplier.createTitle') : t('supplier.editTitle')}
        </h1>
        <div class="bg-light-gray-300 dark:bg-gray-800 rounded-md p-2.5 mb-12">
          <ValidationStatus
            requiredFilled={props.item.isRequiredFilled}
            optionalFilled={props.item.isOptionalFilled}
            class="h-11 pr-5 pb-1"
          />
          <div class="bg-light-gray-100 dark:bg-gray-600 rounded-md p-4 sm:p-5">
            <LegalInfo
              loading={props.loading}
              uid={uid.value}
              item={props.item}
              supplier
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-light-gray-400 dark:border-gray-400" />
            <LegalDetail
              loading={props.loading}
              expanded={!props.create}
              item={props.item}
              supplier
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-light-gray-400 dark:border-gray-400" />
            <ContactList
              loading={props.loading}
              expanded={!props.create}
              items={props.item.contacts || []}
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-light-gray-400 dark:border-gray-400" />
            <BranchList
              loading={props.loading}
              emitChanges={props.create}
              supplierId={props.supplierId}
              expanded={!props.create}
              items={props.item.branches || []}
              locale={props.item.locale}
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-light-gray-400 dark:border-gray-400" />
            <div class="flex flex-wrap pb-5">
              <div class="w-full lg:w-1/2 lg:pr-5">
                <ExtraInfo
                  loading={props.loading}
                  expanded={!props.create}
                  item={props.item as any}
                  supplier
                  {...{ onUpdate: updateValue }}
                />
              </div>
            </div>
          </div>
        </div>
        {slots.actions?.()}
      </div>
    )
  },
})
