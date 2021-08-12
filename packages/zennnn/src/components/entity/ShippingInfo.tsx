import { defineComponent, ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Alert, Switch, TextField } from '@zennnn/core'
import Phone from '@/components/Phone'
import Expand from './Expand'

import type { PropType } from 'vue'
import type {
  GetClient_getClient,
  GetOrgRequisite_getOrgRequisite,
  CreateClientInput,
  UpdateClientInput,
  RequisiteInput,
  PersonInput,
  PhoneInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

type Input = CreateClientInput | UpdateClientInput | RequisiteInput

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<
        GetClient_getClient | GetOrgRequisite_getOrgRequisite
      >,
      default: () => ({}),
    },
    private: Boolean,
    company: Boolean,
    loading: Boolean,
    expanded: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const isDeliveryAddressMatch = ref(!!props.item.isDeliveryAddressMatch)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })

    const consignee = computed(
      () => props.item.companyNameLocal || props.item.companyName
    )

    const hasStateIcon = computed(() => !(props.private || props.company))

    const importerContactPerson = computed(
      () => props.item.importerContactPerson
    )

    watch(
      () => props.item.isDeliveryAddressMatch,
      (val) => {
        isDeliveryAddressMatch.value = !!val
      }
    )

    function updateData(
      input: {
        [k in keyof Input]: boolean | EmptyString | PersonInput | PhoneInput
      }
    ) {
      emit('update', input)
    }

    function updateContactPerson(personInput: PersonInput) {
      const value = Object.assign(
        {
          firstName: importerContactPerson.value?.firstName,
          lastName: importerContactPerson.value?.lastName,
        },
        personInput
      )
      const input = { importerContactPerson: value }
      updateData(input)
    }

    return () => (
      <Expand title={t('companyDetail.shippingInfo')} expanded={props.expanded}>
        <div class={['pt-4', { 'lg:flex': props.company }]}>
          <div class={{ 'lg:w-1/2 lg:pr-5': props.company }}>
            <div class="pb-2">
              <TextField
                modelValue={consignee.value}
                label={t('companyDetail.label.consignee')}
                placeholder={t('companyDetail.placeholder.consignee')}
                loading={props.loading}
                readonly
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.deliveryAddress}
                label={t('companyDetail.label.deliveryAddress')}
                placeholder={t('companyDetail.placeholder.deliveryAddress')}
                loading={props.loading}
                disabled={isDeliveryAddressMatch.value}
                rules={[rules.required]}
                stateIcon
                stateErrorColor={hasStateIcon.value ? 'warn' : 'none'}
                debounce={500}
                onInput={(val: EmptyString) =>
                  updateData({ deliveryAddress: val })
                }
              />
            </div>
            <div class="pb-2 lg:pb-1">
              <div class="flex flex-col">
                <label class="label label__content justify-between">
                  <span class="truncate">
                    {t('companyDetail.label.deliveryAddressPostcode')}
                  </span>
                  <span class="flex-shrink-0">
                    {t('companyDetail.label.matches')}
                  </span>
                </label>
                <div class="flex justify-between">
                  <TextField
                    modelValue={props.item.deliveryAddressPostcode}
                    placeholder={t('companyDetail.placeholder.postcode')}
                    loading={props.loading}
                    disabled={isDeliveryAddressMatch.value}
                    rules={[rules.required]}
                    stateIcon
                    stateErrorColor={hasStateIcon.value ? 'warn' : 'none'}
                    debounce={500}
                    class="w-48 pb-2"
                    onInput={(val: EmptyString) =>
                      updateData({ deliveryAddressPostcode: val })
                    }
                  />
                  <Switch
                    v-model={isDeliveryAddressMatch.value}
                    class="flex-shrink-0 ml-2.5"
                    controlClass="h-10"
                    onChange={(val: boolean) => {
                      updateData({ isDeliveryAddressMatch: val })
                    }}
                  />
                </div>
              </div>
              <div class="relative lg:pb-20">
                <div class="lg:absolute text-sm text-gray-200 leading-tight pl-2">
                  {t('companyDetail.hint.deliveryAddress')}
                </div>
              </div>
            </div>
          </div>
          <div class={{ 'lg:w-1/2 lg:pl-5': props.company }}>
            <div class="flex items-end pb-2">
              <TextField
                modelValue={importerContactPerson.value?.firstName}
                label={t('companyDetail.label.contactPerson')}
                placeholder={t('companyDetail.label.firstName')}
                loading={props.loading}
                rules={[rules.required]}
                stateIcon
                stateErrorColor={hasStateIcon.value ? 'warn' : 'none'}
                debounce={500}
                onInput={(val: EmptyString) =>
                  updateContactPerson({ firstName: val })
                }
                class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
              />
              <TextField
                modelValue={importerContactPerson.value?.lastName}
                placeholder={t('companyDetail.label.lastName')}
                loading={props.loading}
                rules={[rules.required]}
                stateIcon
                stateErrorColor={hasStateIcon.value ? 'warn' : 'none'}
                debounce={500}
                class="flex-grow"
                onInput={(val: EmptyString) =>
                  updateContactPerson({ lastName: val })
                }
              />
            </div>
            <div>
              <Phone
                modelValue={props.item.importerMobilePhone}
                locale={(props.item as GetClient_getClient).locale}
                label={t('companyDetail.label.mobilePhone')}
                loading={props.loading}
                stateErrorColor={hasStateIcon.value ? 'warn' : 'none'}
                stateIcon
                required
                onChange={(val: PhoneInput) =>
                  updateData({ importerMobilePhone: val })
                }
              />
            </div>
            {props.company && (
              <div class="pt-6 lg:pt-10">
                <Alert
                  modelValue={true}
                  close={false}
                  color="warn"
                  iconClass="items-start"
                  maxWidth="none"
                >
                  {t('companyDetail.hint.companyLocale')}
                </Alert>
              </div>
            )}
          </div>
        </div>
      </Expand>
    )
  },
})
