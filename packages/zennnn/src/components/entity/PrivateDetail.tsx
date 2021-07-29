import { defineComponent, ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziCalendar, ziGlobe } from '@zennnn/icons'
import { Icon, Switch, TextField, DatePicker, Autocomplete } from '@zennnn/core'
import { parseDate } from 'shared/utils/date'
import Phone from '@/components/Phone'
import Countries from '@/assets/countries/codes.json'
import Expand from './Expand'

import type { PropType } from 'vue'
import type {
  GetClient_getClient,
  CreateClientInput,
  UpdateClientInput,
  PhoneInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

type Input = CreateClientInput | UpdateClientInput

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetClient_getClient>,
      default: () => ({}),
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
    const { t, te, d } = useI18n()

    const isMailingAddressMatch = ref(!!props.item.isMailingAddressMatch)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })

    const countries = computed(() =>
      Object.entries(Countries).map(([k, v]) => {
        const name = te(`countries.${k}`, 'en') ? t(`countries.${k}`, 'en') : v
        return {
          text: te(`countries.${k}`) ? t(`countries.${k}`) : name,
          value: k,
          name,
        }
      })
    )

    watch(
      () => props.item.isMailingAddressMatch,
      (val) => {
        isMailingAddressMatch.value = !!val
      }
    )

    function updateData(
      input: {
        [k in keyof Input]: boolean | EmptyString | PhoneInput
      }
    ) {
      emit('update', input)
    }

    return () => (
      <Expand
        title={t('companyDetail.privateDetail')}
        description={t('companyDetail.privateDetailDesc')}
        hint={t('companyDetail.privateDetailHint')}
        expanded={props.expanded}
      >
        <div class="flex flex-wrap pt-2">
          <div class="w-full lg:w-1/2 lg:pr-5">
            <div class="pb-2">
              <TextField
                modelValue={props.item.passportId}
                label={t('companyDetail.label.passportId')}
                placeholder={t('companyDetail.placeholder.passportId')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ passportId: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <Autocomplete
                modelValue={props.item.citizenship}
                items={countries.value}
                label={t('companyDetail.label.citizenship')}
                placeholder={t('companyDetail.placeholder.citizenship')}
                loading={props.loading}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ citizenship: val }),
                }}
                v-slots={{
                  prepend: () =>
                    props.item.citizenship ? (
                      <img
                        src={
                          require(`@/assets/img/flags/square/${props.item.citizenship}.svg`)
                            .default
                        }
                        alt={props.item.citizenship}
                        class="h-6 w-6 mx-2"
                      />
                    ) : (
                      <Icon class="mx-2">{ziGlobe}</Icon>
                    ),
                  item: ({ item }: { item: typeof countries.value[0] }) => (
                    <>
                      <img
                        src={
                          require(`@/assets/img/flags/square/${item.value}.svg`)
                            .default
                        }
                        alt={item.value}
                        class="h-6 w-6 ml-1 mr-3"
                      />
                      <span>{item.text}</span>
                    </>
                  ),
                }}
              />
            </div>
            <div class="pb-2">
              <div class="flex">
                <DatePicker
                  modelValue={props.item.issueDate}
                  {...{
                    'onUpdate:modelValue': (val: EmptyString) =>
                      updateData({ issueDate: val }),
                  }}
                  v-slots={{
                    activator: () => (
                      <div class="pr-2.5" style="max-width: 232px">
                        <TextField
                          modelValue={
                            props.item.issueDate
                              ? d(parseDate(props.item.issueDate), 'short')
                              : null
                          }
                          label={t('companyDetail.label.issueDate')}
                          placeholder={t('companyDetail.placeholder.date')}
                          loading={props.loading}
                          rules={[rules.required]}
                          stateIcon
                          stateErrorColor="none"
                          readonly
                          v-slots={{
                            prepend: () => (
                              <Icon small class="text-gray-200 mr-2.5">
                                {ziCalendar}
                              </Icon>
                            ),
                          }}
                        />
                      </div>
                    ),
                  }}
                />
                <DatePicker
                  modelValue={props.item.expireDate}
                  {...{
                    'onUpdate:modelValue': (val: EmptyString) =>
                      updateData({ expireDate: val }),
                  }}
                  v-slots={{
                    activator: () => (
                      <div class="pr-2.5" style="max-width: 232px">
                        <TextField
                          modelValue={
                            props.item.expireDate
                              ? d(parseDate(props.item.expireDate), 'short')
                              : null
                          }
                          label={t('companyDetail.label.expireDate')}
                          placeholder={t('companyDetail.placeholder.date')}
                          loading={props.loading}
                          rules={[rules.required]}
                          stateIcon
                          stateErrorColor="none"
                          readonly
                          v-slots={{
                            prepend: () => (
                              <Icon small class="text-gray-200 mr-2.5">
                                {ziCalendar}
                              </Icon>
                            ),
                          }}
                        />
                      </div>
                    ),
                  }}
                />
              </div>
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.issuedBy}
                label={t('companyDetail.label.issuedBy')}
                placeholder={t('companyDetail.placeholder.issuedBy')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ issuedBy: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item.legalAddress}
                label={t('companyDetail.label.placeOfResidence')}
                placeholder={t('companyDetail.placeholder.address')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
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
                label={t('companyDetail.label.placeOfResidencePostcode')}
                placeholder={t('companyDetail.placeholder.postcode')}
                loading={props.loading}
                debounce={500}
                lazy={props.create}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
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
                label={t('companyDetail.label.privateMailingAddress')}
                placeholder={t('companyDetail.placeholder.address')}
                disabled={isMailingAddressMatch.value}
                loading={props.loading}
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
                <label class="label label__content justify-between">
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
                  {t('companyDetail.hint.privateAddress')}
                </div>
              </div>
            </div>
          </div>
          <div class="w-full lg:w-1/2 lg:pl-5">
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
            <div>
              <div class="flex items-end pb-2">
                <Phone
                  modelValue={props.item.phone}
                  locale={props.item.locale}
                  label={t('companyDetail.label.phone')}
                  loading={props.loading}
                  lazy={props.create}
                  stateIcon
                  stateErrorColor="none"
                  required
                  class="w-1/2 pr-2"
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
                  required
                  class="w-1/2 pl-2"
                  {...{
                    'onUpdate:modelValue': (val: PhoneInput) =>
                      updateData({ fax: val }),
                  }}
                />
              </div>
              <div class="text-sm text-gray-200 leading-tight pl-2.5 pb-2 lg:pb-0">
                {t('companyDetail.hint.phoneAndFax')}
              </div>
            </div>
          </div>
        </div>
      </Expand>
    )
  },
})