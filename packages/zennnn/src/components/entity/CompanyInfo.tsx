import { defineComponent, ref, reactive, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Switch, TextField, Alert, Radio } from '@zennnn/core'
import Phone from '@/components/Phone'

import type { PropType } from 'vue'
import type {
  GetOrgRequisite_getOrgRequisite,
  PersonInput,
  PhoneInput,
  RequisiteInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

enum OwnerName {
  NAME = 'NAME',
  GIVEN_AND_FAMILY = 'GIVEN_AND_FAMILY',
}

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetOrgRequisite_getOrgRequisite>,
      default: () => ({}),
    },
    loading: Boolean,
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const nameInputRef = ref()
    const givenNameInputRef = ref()
    const ownerNameValue = ref<OwnerName>(
      props.item.companyOwner?.isName
        ? OwnerName.NAME
        : OwnerName.GIVEN_AND_FAMILY
    )
    const isMailingAddressMatch = ref(!!props.item.isMailingAddressMatch)
    const isCompanyNameMatch = ref(!!props.item.isCompanyNameMatch)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: string) =>
        (v && /.+@.+\..+/.test(v)) || t('companyDetail.rule.notificationEmail'),
    })

    const isOwnerName = computed(() => ownerNameValue.value === OwnerName.NAME)

    const companyOwner = computed(() => props.item.companyOwner)

    watch(
      () => companyOwner.value?.isName,
      (val) => {
        ownerNameValue.value = val ? OwnerName.NAME : OwnerName.GIVEN_AND_FAMILY
      }
    )

    watch(ownerNameValue, (val) => {
      updateCompanyOwner({ isName: val === OwnerName.NAME })
    })

    watch(
      () => props.item.isCompanyNameMatch,
      (val) => {
        isCompanyNameMatch.value = !!val
      }
    )

    watch(
      () => props.item.isMailingAddressMatch,
      (val) => {
        isMailingAddressMatch.value = !!val
      }
    )

    function updateData(
      input: {
        [k in keyof RequisiteInput]:
          | boolean
          | EmptyString
          | PersonInput
          | PhoneInput
      }
    ) {
      emit('update', input)
    }

    function updateCompanyOwner(personInput: PersonInput) {
      const value = Object.assign(
        {
          isName: !!companyOwner.value?.isName,
          name: companyOwner.value?.name,
          firstName: companyOwner.value?.firstName,
          lastName: companyOwner.value?.lastName,
        },
        personInput
      )
      const input = { companyOwner: value }
      updateData(input)
    }

    return () => (
      <div class="flex flex-wrap">
        <div class="w-full lg:w-1/2 lg:pr-5">
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
                  debounce={500}
                  stateIcon
                  required
                  class="flex-grow pb-2"
                  onInput={(val: EmptyString) =>
                    updateData({ companyName: val })
                  }
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
              debounce={500}
              stateIcon
              required
              onInput={(val: EmptyString) =>
                updateData({ companyNameLocal: val })
              }
            />
          </div>
          <div class="relative lg:h-56 pt-4 mb-4 lg:pt-9 lg:mb-7">
            <div class="lg:absolute lg:pin-t lg:inset-x">
              <Alert
                close={false}
                color="warn"
                iconClass="items-start"
                maxWidth="none"
              >
                {t('companyDetail.hint.companyNameLocal')}
              </Alert>
            </div>
          </div>
          <div class="flex flex-wrap lg:flex-nowrap pb-2">
            <Phone
              modelValue={props.item.phone}
              label={t('companyDetail.label.phone')}
              loading={props.loading}
              stateIcon
              required
              class="w-full md:w-1/2 lg:w-full lg:max-w-xs flex-shrink-0 pb-2 md:pb-0 md:pr-2.5"
              onChange={(val: PhoneInput) => updateData({ phone: val })}
            />
            <TextField
              modelValue={props.item.phoneOption}
              label={t('companyDetail.label.phoneOption')}
              placeholder={t('companyDetail.placeholder.phoneOption')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              class="w-auto lg:w-full lg:max-w-xs"
              onInput={(val: EmptyString) => updateData({ phoneOption: val })}
            />
          </div>
          <div class="pb-2">
            <Phone
              modelValue={props.item.fax}
              label={t('companyDetail.label.fax')}
              loading={props.loading}
              stateIcon
              stateErrorColor="none"
              required
              class="w-full md:w-1/2 lg:w-full lg:max-w-xs md:pr-2.5"
              onChange={(val: PhoneInput) => updateData({ fax: val })}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.website}
              label={t('companyDetail.label.site')}
              placeholder={t('companyDetail.placeholder.site')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              required
              onInput={(val: EmptyString) => updateData({ website: val })}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.email}
              label={t('companyDetail.label.email')}
              labelHint={t('companyDetail.hint.email')}
              placeholder={t('companyDetail.placeholder.email')}
              loading={props.loading}
              rules={[rules.required, rules.email]}
              debounce={500}
              stateIcon
              stateErrorColor="warn"
              required
              onInput={(val: EmptyString) => updateData({ email: val })}
            />
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2">
            <TextField
              modelValue={props.item.vat}
              label={t('companyDetail.label.vat')}
              placeholder={t('companyDetail.placeholder.vat')}
              loading={props.loading}
              rules={[rules.required]}
              debounce={500}
              stateIcon
              stateErrorColor="warn"
              onInput={(val: EmptyString) => updateData({ vat: val })}
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
              stateIcon
              required
              onInput={(val: EmptyString) => updateData({ legalAddress: val })}
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
              stateIcon
              class="w-48"
              onInput={(val: EmptyString) =>
                updateData({ legalAddressPostcode: val })
              }
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
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              onInput={(val: EmptyString) =>
                updateData({ mailingAddress: val })
              }
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
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="none"
                  class="w-48 pb-2"
                  onInput={(val: EmptyString) =>
                    updateData({ mailingAddressPostcode: val })
                  }
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
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              class="w-1/2 md:w-48 flex-shrink-0 pr-2.5"
              onInput={(val: EmptyString) => updateData({ iec: val })}
            />
            <TextField
              modelValue={props.item.okpo}
              label={t('companyDetail.label.okpo')}
              placeholder={t('companyDetail.placeholder.okpo')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              class="flex-grow"
              onInput={(val: EmptyString) => updateData({ okpo: val })}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.psrn}
              label={t('companyDetail.label.psrn')}
              placeholder={t('companyDetail.placeholder.psrn')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              onInput={(val: EmptyString) => updateData({ psrn: val })}
            />
          </div>
          <div class="flex items-end pb-2">
            <div class="h-10 flex-shrink-0 flex items-center pl-2.5 pr-3">
              <Radio
                v-model={ownerNameValue.value}
                name="owner-name"
                value={OwnerName.GIVEN_AND_FAMILY}
                {...{
                  onChange: () => {
                    nextTick(() => {
                      givenNameInputRef.value?.focus()
                    })
                  },
                }}
              />
            </div>
            <TextField
              ref={givenNameInputRef}
              modelValue={companyOwner.value?.firstName}
              label={t('companyDetail.label.ownerFullName')}
              placeholder={t('companyDetail.placeholder.firstName')}
              loading={props.loading}
              disabled={isOwnerName.value}
              rules={[rules.required]}
              debounce={500}
              stateIcon
              required
              class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
              onInput={(val: EmptyString) =>
                updateCompanyOwner({ firstName: val })
              }
            />
            <TextField
              modelValue={companyOwner.value?.lastName}
              placeholder={t('companyDetail.placeholder.lastName')}
              loading={props.loading}
              disabled={isOwnerName.value}
              rules={[rules.required]}
              debounce={500}
              class="flex-grow"
              stateIcon
              required
              onInput={(val: EmptyString) =>
                updateCompanyOwner({ lastName: val })
              }
            />
          </div>
          <div class="flex items-end pb-2">
            <div class="h-10 flex-shrink-0 flex items-center pl-2.5 pr-3">
              <Radio
                v-model={ownerNameValue.value}
                name="owner-name"
                value={OwnerName.NAME}
                {...{
                  onChange: () => {
                    nextTick(() => {
                      nameInputRef.value?.focus()
                    })
                  },
                }}
              />
            </div>
            <TextField
              ref={nameInputRef}
              modelValue={companyOwner.value?.name}
              label={t('companyDetail.label.ownerFullNameAlt')}
              placeholder={t('companyDetail.placeholder.ownerFullNameAlt')}
              loading={props.loading}
              disabled={!isOwnerName.value}
              rules={[rules.required]}
              debounce={500}
              stateIcon
              required
              class="w-full"
              onInput={(val: EmptyString) => updateCompanyOwner({ name: val })}
            />
          </div>
        </div>
      </div>
    )
  },
})
