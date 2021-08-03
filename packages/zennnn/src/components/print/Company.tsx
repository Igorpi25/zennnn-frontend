import { defineComponent, computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { ziPlusOutline, ziStatusPointSm } from '@zennnn/icons'
import { TextField, Icon, Btn, Autocomplete, Select, Modal } from '@zennnn/core'
import { useNotify } from 'shared/composables/notify'
import {
  UPDATE_COMPANY_BANK_DETAIL,
  UPDATE_REQUISITE,
  CREATE_REQUISITE,
} from '@/graphql/mutations'
import Phone from '@/components/Phone'
import CompanyForm from '@/components/company/Form'

import type { PropType } from 'vue'
import type {
  ListOrgRequisites_listOrgRequisites,
  UpdateCompanyBankDetail,
  UpdateCompanyBankDetailVariables,
  UpdateRequisite,
  UpdateRequisiteVariables,
  BankDetailInput,
  RequisiteInput,
  CreateRequisite,
  CreateRequisiteVariables,
  PhoneInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

export default defineComponent({
  props: {
    orgId: {
      type: String,
      required: true,
    },
    companyId: String as PropType<string | null>,
    readonly: Boolean,
    item: {
      type: Object as PropType<ListOrgRequisites_listOrgRequisites | null>,
      default: () => ({}),
    },
    items: {
      type: Array as PropType<ListOrgRequisites_listOrgRequisites[]>,
      default: () => [],
    },
    loading: Boolean,
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t } = useI18n()
    const notify = useNotify()

    const createDialog = ref(false)
    const createInput = ref<RequisiteInput>({})
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: EmptyString) => (v && /.+@.+\..+/.test(v)) || t('rule.email'),
    })

    const bankDetailList = computed(() => props.item?.bankDetails)

    const bankDetailItem = computed(() =>
      bankDetailList.value?.find(
        (el) => el.id === props.item?.defaultBankDetail
      )
    )

    const { mutate: updateCompanyBankDetailMutate } = useMutation<
      UpdateCompanyBankDetail,
      UpdateCompanyBankDetailVariables
    >(UPDATE_COMPANY_BANK_DETAIL)

    const { mutate: updateRequisiteMutate } = useMutation<
      UpdateRequisite,
      UpdateRequisiteVariables
    >(UPDATE_REQUISITE)

    const { mutate: createRequisiteMutate, loading: createRequisiteLoading } =
      useMutation<CreateRequisite, CreateRequisiteVariables>(CREATE_REQUISITE)

    watch(createDialog, (val) => {
      if (val) {
        createInput.value = {}
      }
    })

    function updateData(input: RequisiteInput) {
      if (props.companyId) {
        updateRequisiteMutate({
          id: props.companyId,
          input: input,
        })
      } else {
        // TODO: add locale message
        const message = 'Продавец / Поставщик не установлен.'
        notify.error(message)
      }
    }

    function setDefaultBankDetail(id: string) {
      emit('update', { defaultBankDetail: id })
    }

    function updateBankDetail(input: BankDetailInput) {
      if (props.item?.id && bankDetailItem.value?.id) {
        updateCompanyBankDetailMutate({
          companyId: props.item.id,
          id: bankDetailItem.value.id,
          input,
        })
      }
    }

    return () => (
      <>
        <h5 class="flex-grow text-lg leading-tight space-x-1 mb-3">
          <span class="text-white uppercase font-semibold tracking-widest">
            {t('shipping.supplierTitle')}
          </span>
          <span class="text-gray-200 lowercase">
            {t('shipping.supplierSubtitle')}
          </span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/2 lg:pr-5">
            <div class="pb-2">
              <Autocomplete
                modelValue={props.item}
                label={t('requisite.label.companyName')}
                placeholder={t('shipping.companyNotSetted')}
                items={props.items}
                rules={[rules.required]}
                hideDetails={false}
                itemValue="id"
                itemText="companyName"
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: string) =>
                    emit('update', { requisite: val }),
                }}
                v-slots={{
                  'prepend-item': () => (
                    <Btn
                      link
                      {...{
                        onClick: () => {
                          createDialog.value = true
                        },
                      }}
                    >
                      <Icon class="mr-2">{ziPlusOutline}</Icon>
                      <span>{t('action.create')}</span>
                    </Btn>
                  ),
                  item: ({ item }: any) =>
                    item.companyName ? (
                      <span class="text-white">{item.companyName}</span>
                    ) : (
                      <span class="flex items-center text-gray-200">
                        <span>{t('shipping.clientAddNoData')}</span>
                        <Icon class="text-pink-500">{ziStatusPointSm}</Icon>
                      </span>
                    ),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item?.legalAddress}
                label={t('companyDetail.label.legalAddress')}
                placeholder={t('companyDetail.placeholder.address')}
                loading={props.loading}
                readonly={props.readonly}
                rules={[rules.required]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ legalAddress: val }),
                }}
              />
            </div>
            <div class="flex flex-wrap lg:flex-nowrap pb-2">
              <Phone
                modelValue={props.item?.phone}
                label={t('companyDetail.label.phone')}
                loading={props.loading}
                readonly={props.readonly}
                stateIcon
                required
                class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: PhoneInput) =>
                    updateData({ phone: val }),
                }}
              />
              <TextField
                modelValue={props.item?.phoneOption}
                label={t('companyDetail.label.phoneOption')}
                placeholder={t('companyDetail.placeholder.phoneOption')}
                loading={props.loading}
                readonly={props.readonly}
                debounce={500}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="w-full sm:w-auto lg:w-full max-w-xs"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ phoneOption: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <Phone
                modelValue={props.item?.fax}
                label={t('companyDetail.label.fax')}
                loading={props.loading}
                readonly={props.readonly}
                stateIcon
                stateErrorColor="none"
                required
                class="sm:w-4/6 max-w-xs sm:pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: PhoneInput) =>
                    updateData({ fax: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item?.email}
                label={t('companyDetail.label.email')}
                placeholder={t('companyDetail.placeholder.email')}
                loading={props.loading}
                readonly={props.readonly}
                rules={[rules.required, rules.email]}
                hideDetails={false}
                debounce={500}
                stateIcon
                stateErrorColor="warn"
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ email: val }),
                }}
              />
            </div>
            <div>
              <TextField
                modelValue={props.item?.website}
                label={t('companyDetail.label.site')}
                placeholder={t('companyDetail.placeholder.site')}
                loading={props.loading}
                readonly={props.readonly}
                debounce={500}
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
          <div class="w-full lg:w-1/2 lg:pl-5">
            <div class="pb-2">
              <Select
                modelValue={bankDetailItem.value}
                label={t('companyDetail.label.bankName')}
                placeholder={t('companyDetail.placeholder.bankName')}
                items={bankDetailList.value as any}
                rules={[rules.required]}
                hideDetails={false}
                itemValue="id"
                itemText="bankName"
                stateIcon
                required
                {...{ 'onUpdate:modelValue': setDefaultBankDetail }}
                v-slots={{
                  item: ({ item }: any) =>
                    item.bankName ? (
                      <span class="text-white">{item.bankName}</span>
                    ) : (
                      <span class="flex items-center text-gray-200">
                        <span>{t('shipping.clientAddNoData')}</span>
                        <Icon class="text-pink-500">{ziStatusPointSm}</Icon>
                      </span>
                    ),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={bankDetailItem.value?.bankAddress}
                label={t('companyDetail.label.bankAddress')}
                placeholder={t('companyDetail.placeholder.bankAddress')}
                loading={props.loading}
                readonly={props.readonly || !bankDetailItem.value?.id}
                debounce={500}
                rules={[rules.required]}
                hideDetails={false}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateBankDetail({ bankAddress: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={bankDetailItem.value?.bankAccountNumber}
                label={t('companyDetail.label.bankAccountNumber')}
                placeholder={t('companyDetail.placeholder.bankAccountNumber')}
                loading={props.loading}
                readonly={props.readonly || !bankDetailItem.value?.id}
                debounce={500}
                rules={[rules.required]}
                hideDetails={false}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateBankDetail({ bankAccountNumber: val }),
                }}
              />
            </div>
            <div class="flex items-end pb-2">
              <TextField
                modelValue={bankDetailItem.value?.swift}
                label={t('companyDetail.label.swift')}
                placeholder={t('companyDetail.placeholder.swift')}
                loading={props.loading}
                readonly={props.readonly || !bankDetailItem.value?.id}
                debounce={500}
                rules={[rules.required]}
                hideDetails={false}
                stateIcon
                required
                class="w-1/2 md:w-48 flex-shrink-0 pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateBankDetail({ swift: val }),
                }}
              />
              <TextField
                modelValue={bankDetailItem.value?.bic}
                label={t('companyDetail.label.bic')}
                placeholder={t('companyDetail.placeholder.bic')}
                loading={props.loading}
                readonly={props.readonly || !bankDetailItem.value?.id}
                debounce={500}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="flex-grow"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateBankDetail({ bic: val }),
                }}
              />
            </div>
            <div class="flex pb-2">
              <TextField
                modelValue={props.item?.vat}
                label={t('companyDetail.label.vat')}
                placeholder={t('companyDetail.placeholder.vat')}
                loading={props.loading}
                readonly={props.readonly}
                debounce={500}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="w-7/12 pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ vat: val }),
                }}
              />
              <TextField
                modelValue={props.item?.okpo}
                label={t('companyDetail.label.okpo')}
                placeholder={t('companyDetail.placeholder.okpo')}
                loading={props.loading}
                readonly={props.readonly}
                debounce={500}
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
          </div>
        </div>

        <Modal
          v-model={createDialog.value}
          maxWidth={1024}
          contentClass="text-gray-100"
        >
          <CompanyForm
            orgId={props.orgId}
            create
            {...{
              onUpdate: (input: RequisiteInput) => {
                createInput.value = Object.assign({}, createInput.value, input)
              },
            }}
            v-slots={{
              actions: () => (
                <Btn
                  loading={createRequisiteLoading.value}
                  outlined
                  class="w-40"
                  {...{
                    onClick: async () => {
                      const response = await createRequisiteMutate({
                        orgId: props.orgId,
                        input: createInput.value,
                      })
                      if (response?.data?.createRequisite) {
                        emit('update', {
                          requisite: response.data.createRequisite.id,
                        })
                      }
                      createDialog.value = false
                    },
                  }}
                >
                  {t('action.create')}
                </Btn>
              ),
            }}
          />
        </Modal>
      </>
    )
  },
})
