import { defineComponent, ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Switch, TextField } from '@zennnn/core'
import Phone from '@/components/Phone'
import Expand from './Expand'

import type { PropType } from 'vue'
import type {
  GetClient_getClient,
  GetSupplier_getSupplier,
  CreateClientInput,
  UpdateClientInput,
  CreateSupplierInput,
  UpdateSupplierInput,
  PersonInput,
  PhoneInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

type Input =
  | CreateClientInput
  | UpdateClientInput
  | CreateSupplierInput
  | UpdateSupplierInput

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetClient_getClient | GetSupplier_getSupplier>,
      default: () => ({}),
    },
    supplier: Boolean,
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

    const isMailingAddressMatch = ref(!!props.item.isMailingAddressMatch)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })

    const companyOwner = computed(() => props.item.companyOwner)

    const titleDesc = computed(() =>
      props.supplier
        ? ` ${t('companyDetail.supplierDetailDesc')}`
        : ` ${t('companyDetail.legalDetailDesc')}`
    )

    watch(
      () => props.item.isMailingAddressMatch,
      (val) => {
        isMailingAddressMatch.value = !!val
      }
    )

    function updateData(
      input: {
        [k in keyof Input]: boolean | EmptyString | PersonInput | PhoneInput
      }
    ) {
      emit('update', input)
    }

    function updateCompanyOwner(personInput: PersonInput) {
      const value = Object.assign(
        {
          firstName: companyOwner.value?.firstName,
          lastName: companyOwner.value?.lastName,
        },
        personInput
      )
      const input = { companyOwner: value }
      updateData(input)
    }

    return () => (
      <Expand
        title={t('companyDetail.legalDetail')}
        description={titleDesc.value}
        hint={t('companyDetail.legalDetailHint')}
        expanded={props.expanded}
      >
        <div class="flex flex-wrap pt-2">
          <div class="w-full lg:w-1/2 lg:pr-5">
            <div class="pb-2">
              <TextField
                modelValue={props.item.vat}
                label={t('companyDetail.label.vat')}
                placeholder={t('companyDetail.placeholder.vat')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ vat: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.legalAddress}
                label={t('companyDetail.label.legalAddress')}
                placeholder={t('companyDetail.placeholder.address')}
                loading={props.loading}
                rules={[rules.required]}
                debounce={500}
                lazy={props.create}
                stateIcon
                {...{
                  'onUpdate:modelValue': (val: EmptyString) => {
                    updateData({ legalAddress: val })
                  },
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.legalAddressPostcode}
                label={t('companyDetail.label.legalAddressPostcode')}
                placeholder={t('companyDetail.placeholder.postcode')}
                loading={props.loading}
                rules={[rules.required]}
                debounce={500}
                lazy={props.create}
                stateIcon
                class="w-48"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) => {
                    updateData({ legalAddressPostcode: val })
                  },
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.mailingAddress}
                label={t('companyDetail.label.mailingAddress')}
                placeholder={t('companyDetail.placeholder.address')}
                loading={props.loading}
                disabled={isMailingAddressMatch.value}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) => {
                    updateData({ mailingAddress: val })
                  },
                }}
              />
            </div>
            <div class="pb-2 lg:pb-1">
              <div class="flex flex-col">
                <label class="label justify-between">
                  <span class="truncate">
                    {t('companyDetail.label.mailingAddressPostcode')}
                  </span>
                  <span class="flex-shrink-0">
                    {t('companyDetail.label.matches')}
                  </span>
                </label>
                <div class="flex justify-between">
                  <TextField
                    modelValue={props.item.mailingAddressPostcode}
                    placeholder={t('companyDetail.placeholder.postcode')}
                    loading={props.loading}
                    disabled={isMailingAddressMatch.value}
                    debounce={500}
                    lazy={props.create}
                    rules={[rules.required]}
                    stateIcon
                    stateErrorColor="none"
                    class="w-48 pb-2"
                    {...{
                      'onUpdate:modelValue': (val: EmptyString) => {
                        updateData({ mailingAddressPostcode: val })
                      },
                    }}
                  />
                  <Switch
                    v-model={isMailingAddressMatch.value}
                    class="flex-shrink-0 ml-2.5"
                    controlClass="h-10"
                    {...{
                      onChange: (val: boolean) => {
                        updateData({ isMailingAddressMatch: val })
                      },
                    }}
                  />
                </div>
              </div>
              <div class="relative lg:pb-20">
                <div class="lg:absolute text-sm text-gray-200 leading-tight pl-2">
                  {t('companyDetail.hint.mailingAddress')}
                </div>
              </div>
            </div>
            <div class="flex items-end pb-2">
              <TextField
                modelValue={props.item.iec}
                label={t('companyDetail.label.iec')}
                placeholder={t('companyDetail.placeholder.iec')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="w-1/2 md:w-48 flex-shrink-0 pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ iec: val }),
                }}
              />
              <TextField
                modelValue={props.item.okpo}
                label={t('companyDetail.label.okpo')}
                placeholder={t('companyDetail.placeholder.okpo')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="flex-grow"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ okpo: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.psrn}
                label={t('companyDetail.label.psrn')}
                placeholder={t('companyDetail.placeholder.psrn')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ psrn: val }),
                }}
              />
            </div>
            <div class="flex items-end pb-2">
              <TextField
                modelValue={companyOwner.value?.firstName}
                label={t('companyDetail.label.ownerFullName')}
                placeholder={t('companyDetail.placeholder.firstName')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateCompanyOwner({ firstName: val }),
                }}
              />
              <TextField
                modelValue={companyOwner.value?.lastName}
                placeholder={t('companyDetail.placeholder.lastName')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="flex-grow"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateCompanyOwner({ lastName: val }),
                }}
              />
            </div>
          </div>
          <div class="w-full lg:w-1/2 lg:pl-5">
            <div class="pb-2">
              <TextField
                modelValue={props.item.bankName}
                label={t('companyDetail.label.bankName')}
                placeholder={t('companyDetail.placeholder.bankName')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ bankName: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.bankAddress}
                label={t('companyDetail.label.bankAddress')}
                placeholder={t('companyDetail.placeholder.bankAddress')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ bankAddress: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.bankAccountNumber}
                label={t('companyDetail.label.bankAccountNumber')}
                placeholder={t('companyDetail.placeholder.bankAccountNumber')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ bankAccountNumber: val }),
                }}
              />
            </div>
            <div class="flex items-end pb-2">
              <TextField
                modelValue={props.item.swift}
                label={t('companyDetail.label.swift')}
                placeholder={t('companyDetail.placeholder.swift')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="w-1/2 md:w-48 flex-shrink-0 pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ swift: val }),
                }}
              />
              <TextField
                modelValue={props.item.bic}
                label={t('companyDetail.label.bic')}
                placeholder={t('companyDetail.placeholder.bic')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="flex-grow"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ bic: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.correspondentBankName}
                label={t('companyDetail.label.correspondentBankName')}
                placeholder={t(
                  'companyDetail.placeholder.correspondentBankName'
                )}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ correspondentBankName: val }),
                }}
              />
            </div>
            <div class="pb-2 lg:pb-1">
              <TextField
                modelValue={props.item.correspondentAccountNumber}
                label={t('companyDetail.label.correspondentAccountNumber')}
                placeholder={t('companyDetail.placeholder.bankAccountNumber')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="pb-2"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ correspondentAccountNumber: val }),
                }}
              />
              <div class="lg:pb-20 mr-10" />
            </div>
            <div class="flex flex-wrap lg:flex-nowrap items-end pb-2">
              <Phone
                modelValue={props.item.phone}
                locale={props.item.locale}
                label={t('companyDetail.label.phone')}
                loading={props.loading}
                lazy={props.create}
                stateIcon
                stateErrorColor="warn"
                class="w-full lg:w-1/2 lg:pr-2"
                {...{
                  'onUpdate:modelValue': (val: PhoneInput) =>
                    updateData({ phone: val }),
                }}
              />
              <Phone
                modelValue={props.item.fax}
                locale={props.item.locale}
                label={t('companyDetail.label.fax')}
                loading={props.loading}
                lazy={props.create}
                stateIcon
                stateErrorColor="none"
                class="w-full lg:w-1/2 lg:pl-2"
                {...{
                  'onUpdate:modelValue': (val: PhoneInput) =>
                    updateData({ fax: val }),
                }}
              />
            </div>
            <div>
              <TextField
                modelValue={props.item.website}
                label={t('companyDetail.label.site')}
                placeholder={t('companyDetail.placeholder.site')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ website: val }),
                }}
              />
            </div>
          </div>
        </div>
      </Expand>
    )
  },
})
