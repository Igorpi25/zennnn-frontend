import { defineComponent, ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziGlobe } from '@zennnn/icons'
import { Switch, TextField, Select, Icon } from '@zennnn/core'
import { LOCALES_LIST } from 'shared/config'
import { getLocaleIcon } from 'shared/components/LocalePicker'
import Phone from '@/components/Phone'

import type { PropType } from 'vue'
import type { Locale } from 'shared/components/LocalePicker'
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
    uid: String as PropType<string | null>,
    item: {
      type: Object as PropType<GetClient_getClient | GetSupplier_getSupplier>,
      default: () => ({}),
    },
    supplier: Boolean,
    loading: Boolean,
    create: Boolean,
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const isCompanyNameMatch = ref(!!props.item.isCompanyNameMatch)
    const rules = reactive({
      email: (v: string) =>
        (v && /.+@.+\..+/.test(v)) || t('companyDetail.rule.notificationEmail'),
    })

    const contactPerson = computed(() => props.item.contactPerson)

    const localeSelectHint = computed(() =>
      props.supplier
        ? t('companyDetail.hint.supplierLocale')
        : t('companyDetail.hint.clientLocale')
    )

    const uidHint = computed(() =>
      props.supplier ? t('companyDetail.hint.usn') : t('companyDetail.hint.ucn')
    )

    const uidPlaceholder = computed(() =>
      props.supplier ? 'Z00001' : 'A00001'
    )

    watch(
      () => props.item.isCompanyNameMatch,
      (val) => {
        isCompanyNameMatch.value = !!val
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
          firstName: contactPerson.value?.firstName,
          lastName: contactPerson.value?.lastName,
        },
        personInput
      )
      const input = { contactPerson: value }
      updateData(input)
    }

    return () => (
      <div class="flex flex-wrap">
        <div class="w-full lg:w-1/2 lg:pr-5">
          <div class="flex items-end pb-2">
            <TextField
              modelValue={contactPerson.value?.firstName}
              label={t('companyDetail.label.contactPerson')}
              placeholder={t('companyDetail.placeholder.firstName')}
              loading={props.loading}
              rules={[
                (v: any) =>
                  !!v || t('companyDetail.rule.contactPersonFirstName'),
              ]}
              hideDetails={false}
              debounce={500}
              lazy={props.create}
              stateIcon
              required
              class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateContactPerson({ firstName: val }),
              }}
            />
            <TextField
              modelValue={contactPerson.value?.lastName}
              placeholder={t('companyDetail.placeholder.lastName')}
              loading={props.loading}
              rules={[
                (v: any) =>
                  !!v || t('companyDetail.rule.contactPersonLastName'),
              ]}
              hideDetails={false}
              debounce={500}
              lazy={props.create}
              stateIcon
              required
              class="flex-grow"
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateContactPerson({ lastName: val }),
              }}
            />
          </div>
          <div class="pb-2">
            <Phone
              modelValue={props.item.mobilePhone}
              locale={props.item.locale}
              label={t('companyDetail.label.mobilePhone')}
              labelHint={t('companyDetail.hint.mobilePhone')}
              errorMessage={t('companyDetail.rule.notificationMobilePhone')}
              loading={props.loading}
              lazy={props.create}
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: PhoneInput) =>
                  updateData({ mobilePhone: val }),
              }}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.email}
              label={t('companyDetail.label.email')}
              labelHint={t('companyDetail.hint.email')}
              placeholder={t('companyDetail.placeholder.email')}
              loading={props.loading}
              rules={[rules.email]}
              hideDetails={false}
              debounce={500}
              lazy={props.create}
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ email: val }),
              }}
            />
          </div>
          <div>
            <Select
              modelValue={props.item.locale}
              items={LOCALES_LIST}
              label={t('companyDetail.label.locale')}
              placeholder={t('companyDetail.placeholder.locale')}
              loading={props.loading}
              rules={[(v: any) => !!v || t('companyDetail.rule.locale')]}
              hideDetails={false}
              stateIcon
              required
              class="pb-2"
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ locale: val }),
              }}
              v-slots={{
                prepend: () =>
                  props.item.locale ? (
                    <img
                      src={
                        require(`@zennnn/icons/flags/${getLocaleIcon(
                          props.item.locale
                        )}.svg`).default
                      }
                      alt={props.item.locale}
                      class="h-6 w-6 rounded-full mx-1"
                    />
                  ) : (
                    <Icon class="mx-1">{ziGlobe}</Icon>
                  ),
                item: ({ item }: { item: Locale }) => (
                  <>
                    <img
                      src={
                        require(`@zennnn/icons/flags/${item.icon}.svg`).default
                      }
                      alt={item.value}
                      class="h-6 w-6 rounded-full mx-2"
                    />
                    <span>{item.text}</span>
                  </>
                ),
              }}
            />
            <div class="text-sm text-gray-200 leading-tight pl-2 pb-2 lg:pb-0">
              {localeSelectHint.value}
            </div>
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2 lg:pb-1">
            <div class="flex flex-col">
              <label class="label label__content justify-between">
                <span class="truncate">
                  {t('companyDetail.label.companyName')}
                </span>
                <span class="flex-shrink-0">
                  {t('companyDetail.label.englishOnly')}
                </span>
              </label>
              <div class="flex">
                <TextField
                  modelValue={props.item.companyName}
                  placeholder={t('companyDetail.placeholder.companyName')}
                  loading={props.loading}
                  rules={[
                    (v: any) => !!v || t('companyDetail.rule.companyName'),
                  ]}
                  hideDetails={false}
                  debounce={500}
                  lazy={props.create}
                  stateIcon
                  required
                  class="flex-grow pb-2"
                  {...{
                    'onUpdate:modelValue': (val: EmptyString) => {
                      updateData({ companyName: val })
                    },
                  }}
                />
                <Switch
                  v-model={isCompanyNameMatch.value}
                  class="flex-shrink-0 ml-2.5"
                  controlClass="h-10"
                  {...{
                    onChange: (val: boolean) => {
                      updateData({ isCompanyNameMatch: val })
                    },
                  }}
                />
              </div>
            </div>
            <div class="relative lg:pb-20">
              <div class="lg:absolute text-sm text-gray-200 leading-tight pl-2">
                {t('companyDetail.hint.companyName')}
              </div>
            </div>
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.companyNameLocal}
              label={t('companyDetail.label.companyNameLocal')}
              placeholder={t('companyDetail.placeholder.companyNameLocal')}
              loading={props.loading}
              disabled={isCompanyNameMatch.value}
              rules={[
                (v: any) => !!v || t('companyDetail.rule.companyNameLocal'),
              ]}
              hideDetails={false}
              debounce={500}
              lazy={props.create}
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ companyNameLocal: val }),
              }}
            />
          </div>
          <div>
            <label class="label label__content">
              {t('companyDetail.label.ucn')}
            </label>
            <div class="h-10 flex items-center text-gray-900 dark:text-white mb-2 px-2">
              {props.item.uid || props.uid || uidPlaceholder.value}
            </div>
            <div class="text-sm text-gray-200 leading-tight pl-2 pb-2 lg:pb-0">
              {uidHint.value}
            </div>
          </div>
        </div>
      </div>
    )
  },
})
