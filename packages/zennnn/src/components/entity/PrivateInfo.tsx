import { defineComponent, ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziGlobe, ziCalendar, ziUser } from '@zennnn/icons'
import {
  Switch,
  TextField,
  Select,
  Icon,
  Alert,
  DatePicker,
} from '@zennnn/core'
import { LOCALES_LIST } from 'shared/config'
import { getLocaleIcon } from 'shared/components/LocalePicker'
import { parseDate } from 'shared/utils/date'
import Phone from '@/components/Phone'

import type { PropType } from 'vue'
import type { Locale } from 'shared/components/LocalePicker'
import type {
  GetClient_getClient,
  CreateClientInput,
  UpdateClientInput,
  PersonInput,
  PhoneInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

type Input = CreateClientInput | UpdateClientInput

export default defineComponent({
  props: {
    uid: String as PropType<string | null>,
    item: {
      type: Object as PropType<GetClient_getClient>,
      default: () => ({}),
    },
    loading: Boolean,
    create: Boolean,
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t, d } = useI18n()

    const isPersonMatch = ref(!!props.item.isPersonMatch)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: string) =>
        (v && /.+@.+\..+/.test(v)) || t('companyDetail.rule.notificationEmail'),
    })

    const person = computed(() => props.item.person)

    const contactPerson = computed(() => props.item.contactPerson)

    watch(
      () => props.item.isPersonMatch,
      (val) => {
        isPersonMatch.value = !!val
      }
    )

    function updateData(
      input: {
        [k in keyof Input]: boolean | EmptyString | PersonInput | PhoneInput
      }
    ) {
      emit('update', input)
    }

    function updatePerson(personInput: PersonInput) {
      const value = Object.assign(
        {
          middleName: person.value?.middleName,
        },
        personInput
      )
      const input = { person: value }
      updateData(input)
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
                'onUpdate:modelValue': (val: EmptyString) =>
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
              rules={[rules.required, rules.email]}
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
          <div class="pb-2 lg:pb-1">
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
            <div class="relative lg:pb-20">
              <div class="lg:absolute text-sm text-gray-200 leading-tight pl-2">
                {t('companyDetail.hint.clientLocale')}
              </div>
            </div>
          </div>
          <div class="pb-2 lg:pb-0">
            <Alert
              close={false}
              contentClass="text-pink-500"
              containerClass="bg-pink-500 bg-opacity-10"
              iconClass="text-pink-500 items-start"
              maxWidth="none"
            >
              {t('companyDetail.privacyWarning')}
            </Alert>
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2">
            <TextField
              modelValue={person.value?.firstName}
              label={t('companyDetail.label.givenName')}
              placeholder={t('companyDetail.placeholder.givenName')}
              disabled={isPersonMatch.value}
              loading={props.loading}
              rules={[(v: any) => !!v || t('companyDetail.rule.givenName')]}
              hideDetails={false}
              debounce={500}
              lazy={props.create}
              stateIcon
              required
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updatePerson({ firstName: val }),
              }}
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex flex-col">
              <label class="label justify-between">
                <span class="truncate">
                  {t('companyDetail.label.familyName')}
                </span>
                <span class="flex-shrink-0">
                  {t('companyDetail.label.matches')}
                </span>
              </label>
              <div class="flex">
                <TextField
                  modelValue={person.value?.lastName}
                  placeholder={t('companyDetail.placeholder.familyName')}
                  disabled={isPersonMatch.value}
                  loading={props.loading}
                  rules={[
                    (v: any) => !!v || t('companyDetail.rule.familyName'),
                  ]}
                  hideDetails={false}
                  debounce={500}
                  lazy={props.create}
                  stateIcon
                  required
                  class="flex-grow pb-2"
                  {...{
                    'onUpdate:modelValue': (val: EmptyString) =>
                      updatePerson({ lastName: val }),
                  }}
                />
                <Switch
                  v-model={isPersonMatch.value}
                  class="flex-shrink-0 ml-2.5"
                  controlClass="h-10"
                  {...{
                    onChange: (val: boolean) => {
                      updateData({ isPersonMatch: val })
                    },
                  }}
                />
              </div>
            </div>
            <div class="relative lg:pb-20">
              <div class="lg:absolute text-sm text-gray-200 leading-tight pl-2">
                {t('companyDetail.hint.familyName')}
              </div>
            </div>
          </div>
          <div class="pb-2">
            <TextField
              modelValue={person.value?.middleName}
              label={t('companyDetail.label.middleName')}
              placeholder={t('companyDetail.placeholder.middleName')}
              lazy={props.create}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updatePerson({ middleName: val }),
              }}
            />
          </div>
          <div class="flex items-end pb-2">
            <DatePicker
              modelValue={props.item.birthdate}
              {...{
                'onUpdate:modelValue': (val: EmptyString) =>
                  updateData({ birthdate: val }),
              }}
              v-slots={{
                activator: () => (
                  <div class="pr-4">
                    <TextField
                      modelValue={
                        props.item.birthdate
                          ? d(parseDate(props.item.birthdate), 'short')
                          : null
                      }
                      label={t('companyDetail.label.birthdate')}
                      placeholder={t('companyDetail.placeholder.date')}
                      loading={props.loading}
                      rules={[rules.required]}
                      stateIcon
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
            <div class="w-1/2 pl-4 opacity-40">
              <label class="block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
                {t('companyDetail.label.avatar')}
              </label>
              <div class="h-10 flex justify-start relative pl-12">
                <div class="absolute bottom-0 pl-4">
                  <div class="flex items-center justify-center w-14 h-14 border border-gray-200 text-gray-200 bg-gray-400 rounded-full">
                    <Icon large>{ziUser}</Icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
              {t('companyDetail.label.ucn')}
            </label>
            <div class="h-10 flex items-center text-white mb-2 px-2">
              {props.item.uid || props.uid || 'B00001'}
            </div>
            <div class="text-sm text-gray-200 leading-tight pl-2 pb-2 lg:pb-0">
              {t('companyDetail.hint.ucn')}
            </div>
          </div>
        </div>
      </div>
    )
  },
})
