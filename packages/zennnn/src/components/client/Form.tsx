import { defineComponent, Transition, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { useModel } from 'vue-supp'
import { ziStatusPointSm } from '@zennnn/icons'
import { Icon } from '@zennnn/core'
import { GET_ORG_NEXT_CLIENT_UID } from '@/graphql/queries'
import { ClientType } from '@/graphql/types'
import PrivateInfo from '@/components/entity/PrivateInfo'
import PrivateDetail from '@/components/entity/PrivateDetail'
import LegalInfo from '@/components/entity/LegalInfo'
import LegalDetail from '@/components/entity/LegalDetail'
import ContactList from '@/components/entity/ContactList'
import ShippingInfo from '@/components/entity/ShippingInfo'
import ExtraInfo from '@/components/entity/ExtraInfo'
import { replaceAt } from '@/utils/replaceAt'

import type { PropType } from 'vue'
import type {
  GetClient_getClient,
  GetOrgNextClientUid,
  GetOrgNextClientUidVariables,
  GetClientGroup_getClientGroup,
} from '@/graphql/types'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetClient_getClient>,
      default: () => ({}),
    },
    orgId: {
      type: String,
      required: true,
    },
    clientId: String,
    clientType: {
      type: String as PropType<ClientType>,
      default: ClientType.LEGAL,
    },
    clientGroup: Object as PropType<GetClientGroup_getClientGroup | null>,
    loading: Boolean,
    create: Boolean,
  },

  emits: ['update', 'update:clientType'],

  setup(props, { emit, slots }) {
    const { t } = useI18n()

    const clientType = useModel(props, 'clientType')

    const { result: uidResult } = useQuery<
      GetOrgNextClientUid,
      GetOrgNextClientUidVariables
    >(
      GET_ORG_NEXT_CLIENT_UID,
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
      let nextUid = ''
      if (props.clientGroup?.id) {
        nextUid = props.clientGroup.uid || ''
      } else {
        nextUid = uidResult.value?.getOrgNextClientUid || ''
      }
      if (clientType.value === ClientType.OTHER) {
        nextUid = replaceAt(nextUid, 0, 'C')
      } else if (clientType.value === ClientType.PRIVATE) {
        nextUid = replaceAt(nextUid, 0, 'B')
      }
      return nextUid
    })

    const tabs = computed(() => [
      {
        value: ClientType.LEGAL,
        text: t('client.legalPerson'),
      },
      {
        value: ClientType.PRIVATE,
        text: t('client.privatePerson'),
      },
      {
        value: ClientType.OTHER,
        text: t('client.other'),
      },
    ])

    const isLegalType = computed(() => props.clientType === ClientType.LEGAL)

    const isPrivateType = computed(
      () => props.clientType === ClientType.PRIVATE
    )

    const isOtherType = computed(() => props.clientType === ClientType.OTHER)

    function updateValue(input: any) {
      emit('update', input)
    }

    function switchClientType(type: ClientType) {
      clientType.value = type
    }

    return () => (
      <div>
        <h1 class="text-2xl text-white font-semibold leading-tight mb-4">
          {props.create ? t('client.createTitle') : t('client.editTitle')}
        </h1>
        <div class="bg-gray-800 rounded-md p-2.5 mb-12">
          <div class="lg:h-11 flex flex-wrap lg:flex-nowrap">
            <div class="h-11 flex order-last lg:order-none space-x-1 overflow-x-auto scrolling-touch">
              {tabs.value.map((item) => (
                <button
                  aria-selected={clientType.value === item.value}
                  key={item.value}
                  class={[
                    'w-full sm:w-auto flex items-center justify-center rounded-t',
                    'select-none whitespace-nowrap cursor-pointer',
                    'transition-colors duration-100 ease-in px-10',
                    'focus:outline-none focus:ring focus:ring-blue-400 focus:ring-inset with-focus-visible hover:text-gray-900 dark:hover:text-white',
                    'bg-light-gray-100 dark:bg-gray-600',
                    clientType.value === item.value
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-200 dark:text-gray-100 bg-opacity-30 dark:bg-opacity-30',
                  ]}
                  role="tab"
                  tabindex="0"
                  onClick={() => switchClientType(item.value)}
                >
                  {item.text}
                </button>
              ))}
            </div>

            <div class="flex-grow" />

            <div class="w-full lg:w-auto flex items-center justify-end">
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
          </div>
          {isLegalType.value ? (
            <div
              key="legal"
              class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-4 sm:p-5"
            >
              <LegalInfo
                loading={props.loading}
                uid={uid.value}
                item={props.item}
                create={props.create}
                {...{ onUpdate: updateValue }}
              />
              <div class="mt-10 border-t border-gray-400" />
              <LegalDetail
                loading={props.loading}
                expanded={!props.create}
                item={props.item}
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
              <div class="flex flex-wrap pb-5">
                <div class="w-full lg:w-1/2 lg:pr-5">
                  <ShippingInfo
                    loading={props.loading}
                    expanded={!props.create}
                    item={props.item}
                    create={props.create}
                    {...{ onUpdate: updateValue }}
                  />
                </div>
                <div class="w-full lg:w-1/2 lg:pl-5">
                  <ExtraInfo
                    loading={props.loading}
                    expanded={!props.create}
                    item={props.item as any}
                    create={props.create}
                    {...{ onUpdate: updateValue }}
                  />
                </div>
              </div>
            </div>
          ) : isPrivateType.value ? (
            <div
              key="private"
              class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-4 sm:p-5"
            >
              <PrivateInfo
                loading={props.loading}
                uid={uid.value}
                item={props.item}
                create={props.create}
                {...{ onUpdate: updateValue }}
              />
              <div class="mt-10 border-t border-gray-400" />
              <PrivateDetail
                loading={props.loading}
                expanded={!props.create}
                item={props.item}
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
              <div class="flex flex-wrap pb-5">
                <div class="w-full lg:w-1/2 lg:pr-5">
                  <ShippingInfo
                    loading={props.loading}
                    expanded={!props.create}
                    item={props.item}
                    create={props.create}
                    private
                    {...{ onUpdate: updateValue }}
                  />
                </div>
                <div class="w-full lg:w-1/2 lg:pl-5">
                  <ExtraInfo
                    loading={props.loading}
                    expanded={!props.create}
                    item={props.item as any}
                    create={props.create}
                    {...{ onUpdate: updateValue }}
                  />
                </div>
              </div>
            </div>
          ) : isOtherType.value ? (
            <div
              key="other"
              class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-4 sm:p-5"
            >
              <LegalInfo
                loading={props.loading}
                uid={uid.value}
                item={props.item}
                create={props.create}
                {...{ onUpdate: updateValue }}
              />
              <div class="mt-10 border-t border-gray-400" />
              <LegalDetail
                loading={props.loading}
                expanded={!props.create}
                item={props.item}
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
              <div class="flex flex-wrap pb-5">
                <div class="w-full lg:w-1/2 lg:pr-5">
                  <ShippingInfo
                    loading={props.loading}
                    expanded={!props.create}
                    item={props.item}
                    create={props.create}
                    {...{ onUpdate: updateValue }}
                  />
                </div>
                <div class="w-full lg:w-1/2 lg:pl-5">
                  <ExtraInfo
                    loading={props.loading}
                    expanded={!props.create}
                    item={props.item as any}
                    create={props.create}
                    {...{ onUpdate: updateValue }}
                  />
                </div>
              </div>
            </div>
          ) : undefined}
        </div>
        {slots.actions?.()}
      </div>
    )
  },
})
