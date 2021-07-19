import { defineComponent, Transition } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziStatusPointSm } from '@zennnn/icons'
import { Icon } from '@zennnn/core'
import CompanyInfo from '@/components/entity/CompanyInfo'
import BankDetailList from '@/components/entity/BankDetailList'
import ContactList from '@/components/entity/ContactList'
import ShippingInfo from '@/components/entity/ShippingInfo'
import ExtraInfo from '@/components/entity/ExtraInfo'

import type { PropType } from 'vue'
import type { GetOrgRequisite_getOrgRequisite } from '@/graphql/types'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetOrgRequisite_getOrgRequisite>,
      default: () => ({}),
    },
    orgId: {
      type: String,
      required: true,
    },
    companyId: String,
    loading: Boolean,
    create: Boolean,
  },

  emits: ['update'],

  setup(props, { emit, slots }) {
    const { t } = useI18n()

    function updateValue(input: any) {
      emit('update', input)
    }

    return () => (
      <div>
        <div class="relative flex flex-wrap pb-4">
          <h1 class="w-full text-2xl text-white font-semibold leading-tight">
            {props.create ? t('supplier.createTitle') : t('supplier.editTitle')}
          </h1>
          {slots.back && (
            <div class="order-first sm:order-none ml-auto sm:absolute sm:bottom-0 sm:right-0 mb-3.5">
              {slots.back?.()}
            </div>
          )}
        </div>
        <div class="bg-gray-800 rounded-md p-2.5 mb-12">
          <div class="h-11 flex items-center justify-end text-gray-100">
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
          <div class="bg-gray-600 rounded-md p-4 sm:p-5">
            <CompanyInfo
              loading={props.loading}
              item={props.item}
              create={props.create}
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-gray-400" />
            <BankDetailList
              loading={props.loading}
              emitChanges={props.create}
              companyId={props.companyId}
              expanded={!props.create}
              defaultBankDetail={props.item.defaultBankDetail}
              items={props.item.bankDetails || []}
              create={props.create}
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-gray-400" />
            <ContactList
              loading={props.loading}
              expanded={!props.create}
              items={props.item.contacts || []}
              create={props.create}
              {...{ onUpdate: updateValue }}
            />
            <div class="mt-10 border-t border-gray-400" />
            <ShippingInfo
              loading={props.loading}
              expanded={!props.create}
              item={props.item}
              create={props.create}
              company
              {...{ onUpdate: updateValue }}
            />
            <div class="flex flex-wrap pb-5">
              <div class="w-full lg:w-1/2 lg:pr-5">
                <ExtraInfo
                  loading={props.loading}
                  expanded={!props.create}
                  item={props.item as any}
                  create={props.create}
                  company
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
