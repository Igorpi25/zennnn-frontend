import { defineComponent, ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { TextField } from '@zennnn/core'
import { PersonInput, PhoneInput } from '@/graphql/types'
import Phone from '@/components/Phone'

import type { PropType } from 'vue'
import type { GetClient_getClient } from '@/graphql/types'
import type { EmptyString } from '@/types'

export default defineComponent({
  props: {
    readonly: Boolean,
    disabled: Boolean,
    item: {
      type: Object as PropType<GetClient_getClient>,
      default: () => ({}),
    },
    loading: Boolean,
    create: Boolean,
  },

  emits: ['update', 'select-client', 'create-client', 'update:search'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const search = ref()
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: EmptyString) => (v && /.+@.+\..+/.test(v)) || t('rule.email'),
    })

    const contactPerson = computed(() => props.item.contactPerson)

    watch(search, (val) => {
      emit('update:search', val)
    })

    function updateData(
      input: Partial<
        {
          [k in keyof GetClient_getClient]:
            | EmptyString
            | PersonInput
            | PhoneInput
        }
      >
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
          <div class="pb-2">
            <TextField
              modelValue={props.item.importerCompanyName}
              label={t('companyDetail.label.consignee')}
              placeholder={t('companyDetail.placeholder.consignee')}
              loading={props.loading}
              readonly={props.readonly}
              disabled={props.disabled}
              debounce={500}
              lazy={props.create}
              rules={[rules.required]}
              hideDetails={false}
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ importerCompanyName: val }),
              }}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.deliveryAddress}
              label={t('companyDetail.label.legalAddress')}
              placeholder={t('companyDetail.placeholder.address')}
              loading={props.loading}
              readonly={props.readonly}
              disabled={props.disabled}
              rules={[rules.required]}
              hideDetails={false}
              debounce={500}
              lazy={props.create}
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ deliveryAddress: val }),
              }}
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              modelValue={contactPerson.value?.firstName}
              label={t('companyDetail.label.contactPerson')}
              placeholder={t('companyDetail.placeholder.firstName')}
              loading={props.loading}
              readonly={props.readonly}
              disabled={props.disabled}
              rules={[rules.required]}
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
              readonly={props.readonly}
              disabled={props.disabled}
              rules={[rules.required]}
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
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="flex flex-wrap lg:flex-nowrap pb-2">
            <Phone
              modelValue={props.item.importerPhone}
              locale={props.item.locale}
              label={t('companyDetail.label.phone')}
              loading={props.loading}
              readonly={props.readonly}
              disabled={props.disabled}
              lazy={props.create}
              stateIcon
              required
              class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-2.5"
              {...{
                'onUpdate:modelValue': (val: PhoneInput) =>
                  updateData({ importerPhone: val }),
              }}
            />
            {/* <!-- <TextField
              modelValue={props.item.phoneOption}
              label={t('companyDetail.label.phoneOption')}
              placeholder={t('companyDetail.placeholder.phoneOption')}
              loading={props.loading}
              readonly={props.readonly}
              disabled={props.disabled}
              debounce={500}
              lazy={props.create}
              rules={[rules.required]}
              hideDetails={false}
              stateIcon
              stateErrorColor="none"
              class="w-full sm:w-auto lg:w-full max-w-xs"
              {...{ 'onUpdate:modelValue': (val: EmptyString) => updateData({ fax: val }) }}
            /> --> */}
          </div>
          {/* <!-- <div class="pb-2">
            <Phone
              modelValue={props.item.fax}
              locale={props.item.locale}
              label={t('companyDetail.label.fax')}
              loading={props.loading}
              readonly={props.readonly}
              disabled={props.disabled}
              lazy={props.create}
              stateIcon
              stateErrorColor="none"
              required
              class="sm:w-4/6 max-w-xs sm:pr-2.5"
              {...{ 'onUpdate:modelValue': (val: PhoneInput) => updateData({ fax: val }) }}
            />
          </div> --> */}
          <div class="pb-2">
            <TextField
              modelValue={props.item.importerEmail}
              label={t('companyDetail.label.email')}
              placeholder={t('companyDetail.placeholder.email')}
              loading={props.loading}
              readonly={props.readonly}
              disabled={props.disabled}
              rules={[rules.required, rules.email]}
              hideDetails={false}
              debounce={500}
              lazy={props.create}
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ importerEmail: val }),
              }}
            />
          </div>
        </div>
      </div>
    )
  },
})
