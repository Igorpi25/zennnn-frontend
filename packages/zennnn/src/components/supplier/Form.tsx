import { computed, defineComponent, Transition } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { ziStatusPointSm } from '@zennnn/icons'
import { Icon } from '@zennnn/core'
import { GET_ORG_NEXT_SUPPLIER_UID } from '@/graphql/queries'
import LegalInfo from '@/components/entity/LegalInfo'
import LegalDetail from '@/components/entity/LegalDetail'
import ContactList from '@/components/entity/ContactList'
import ExtraInfo from '@/components/entity/ExtraInfo'
import BranchList from '@/components/entity/BranchList'

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
          <div class="h-11 flex items-center justify-end text-gray-200 dark:text-gray-100">
            <Transition name="slide-x-reverse-transition">
              {!props.item.isRequiredFilled && (
                <div class="flex items-center whitespace-nowrap pr-5 pb-1">
                  <Icon class="text-pink-500">{ziStatusPointSm}</Icon>
                  <span>{t('print.required')}</span>
                </div>
              )}
            </Transition>
            <Transition name="slide-x-reverse-transition">
              {!props.item.isOptionalFilled && (
                <div class="flex items-center whitespace-nowrap pr-5 pb-1">
                  <Icon class="text-yellow-500">{ziStatusPointSm}</Icon>
                  <span>{t('print.warning')}</span>
                </div>
              )}
            </Transition>
          </div>
          <div class="bg-light-gray-100 dark:bg-gray-600 rounded-md p-4 sm:p-5">
            <LegalInfo
              loading={props.loading}
              uid={uid.value}
              item={props.item}
              create={props.create}
              supplier
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-light-gray-400 dark:border-gray-400" />
            <LegalDetail
              loading={props.loading}
              expanded={!props.create}
              item={props.item}
              create={props.create}
              supplier
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-light-gray-400 dark:border-gray-400" />
            <ContactList
              loading={props.loading}
              expanded={!props.create}
              items={props.item.contacts || []}
              create={props.create}
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-light-gray-400 dark:border-gray-400" />
            <BranchList
              loading={props.loading}
              emitChanges={props.create}
              supplierId={props.supplierId}
              expanded={!props.create}
              items={props.item.branches || []}
              create={props.create}
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
                  create={props.create}
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
