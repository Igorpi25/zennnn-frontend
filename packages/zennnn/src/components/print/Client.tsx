import { defineComponent, ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziPlusOutline, ziStatusPointSm } from '@zennnn/icons'
import { Icon, TextField, Autocomplete, Btn } from '@zennnn/core'
import { ClientType, PersonInput, PhoneInput } from '@/graphql/types'
import Phone from '@/components/Phone'

import type { PropType } from 'vue'
import type {
  GetClient_getClient,
  SearchClients_searchClients,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

export default defineComponent({
  props: {
    readonly: Boolean,
    item: {
      type: Object as PropType<GetClient_getClient>,
      default: () => ({}),
    },
    items: {
      type: Array as PropType<SearchClients_searchClients[]>,
      default: () => [],
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

    function getClientType(type: ClientType) {
      switch (type) {
        case ClientType.LEGAL:
          return t('shipping.legalPerson')
        case ClientType.PRIVATE:
          return t('shipping.privatePerson')
        case ClientType.OTHER:
          return t('shipping.otherPerson')
      }
    }

    return () => (
      <div class="flex flex-wrap">
        <div class="w-full lg:w-1/2 lg:pr-5">
          <div class="pb-2">
            <Autocomplete
              v-model={[search.value, 'search']}
              modelValue={props.item}
              label={t('clients.companyName')}
              placeholder={t('shipping.clientNotSetted')}
              items={props.items}
              rules={[rules.required]}
              hideDetails={false}
              itemValue="id"
              itemText="fullName"
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: string) =>
                  emit('select-client', val),
              }}
              v-slots={{
                'prepend-item': () => (
                  <Btn
                    link
                    {...{
                      onClick: (e: MouseEvent) => emit('create-client', e),
                    }}
                  >
                    <Icon class="mr-2">{ziPlusOutline}</Icon>
                    <span>{t('shipping.clientAddCreateAndAttach')}</span>
                  </Btn>
                ),
                item: ({ item }: any) =>
                  item.companyName ? (
                    <span class="text-white">
                      <span>{item.companyName}</span>
                      <span class="text-gray-100 bg-gray-400 rounded-lg h-6 leading-6 inline-block ml-2 px-1">
                        {getClientType(item.clientType)}
                      </span>
                    </span>
                  ) : (
                    <span class="flex items-center text-gray-200">
                      <span>{t('shipping.clientAddNoData')}</span>
                      <span class="text-gray-100 bg-gray-400 rounded-lg h-6 leading-6 inline-block ml-2 px-1">
                        {getClientType(item.clientType)}
                      </span>
                      <span class="text-white ml-2">{item.uid}</span>
                      <Icon class="text-pink-500">{ziStatusPointSm}</Icon>
                    </span>
                  ),
              }}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.legalAddress}
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
          <div class="flex items-end pb-2">
            <TextField
              modelValue={contactPerson.value?.firstName}
              label={t('companyDetail.label.contactPerson')}
              placeholder={t('companyDetail.placeholder.firstName')}
              loading={props.loading}
              readonly={props.readonly}
              rules={[rules.required]}
              hideDetails={false}
              debounce={500}
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
              rules={[rules.required]}
              hideDetails={false}
              debounce={500}
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
              modelValue={props.item.phone}
              locale={props.item.locale}
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
              modelValue={props.item.phoneOption}
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
              modelValue={props.item.fax}
              locale={props.item.locale}
              label={t('companyDetail.label.fax')}
              loading={props.loading}
              readonly={props.readonly}
              stateIcon
              stateErrorColor="none"
              required
              class="sm:w-4/6 max-w-xs sm:pr-2.5"
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ fax: val }),
              }}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.email}
              label={t('companyDetail.label.email')}
              placeholder={t('companyDetail.placeholder.email')}
              loading={props.loading}
              readonly={props.readonly}
              rules={[rules.required, rules.email]}
              hideDetails={false}
              debounce={500}
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ email: val }),
              }}
            />
          </div>
        </div>
      </div>
    )
  },
})
