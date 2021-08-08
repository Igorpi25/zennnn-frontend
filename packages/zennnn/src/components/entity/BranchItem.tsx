import {
  defineComponent,
  ref,
  reactive,
  computed,
  nextTick,
  Transition,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { ziCloseDelete, ziQuestionSign } from '@zennnn/icons'
import { Icon, Tooltip, Select, TextField, Btn } from '@zennnn/core'
import { BranchType, ContactType } from '@/graphql/types'
import Phone from '@/components/Phone'
import ContactItem from './ContactItem'

import type { PropType } from 'vue'
import type {
  GetSupplier_getSupplier_branches,
  SupplierBranchInput,
  PersonInput,
  PhoneInput,
  ContactInput,
} from '@/graphql/types'

type UpdateKeys = keyof SupplierBranchInput
type UpdateValues =
  | string
  | BranchType
  | PersonInput
  | PhoneInput
  | ContactInput
  | null

export default defineComponent({
  props: {
    locale: String as PropType<string | null>,
    loading: Boolean,
    create: Boolean,
    item: {
      type: Object as PropType<GetSupplier_getSupplier_branches>,
      default: () => ({}),
    },
  },

  emits: ['update', 'delete'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const contactCreateRef = ref()
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })

    const contactItems = computed(
      () =>
        props.item.contacts?.map((item) => ({
          contactType: item?.contactType,
          contact: item?.contact,
        })) || []
    )

    const isWarehouse = computed(
      () => props.item.branchType === BranchType.WAREHOUSE
    )

    const branchTypeItems = computed(() =>
      Object.values(BranchType).map((el) => ({
        text: t(`branchType.${el}`),
        value: el,
      }))
    )

    const firstName = computed({
      get: () => props.item.contactPerson?.firstName,
      set: (val) => {
        const person = Object.assign({
          firstName: val,
          lastName: props.item.contactPerson?.lastName,
        })
        updateData('contactPerson', person)
      },
    })

    const lastName = computed({
      get: () => props.item.contactPerson?.lastName,
      set: (val) => {
        const person = Object.assign({
          firstName: props.item.contactPerson?.firstName,
          lastName: val,
        })
        updateData('contactPerson', person)
      },
    })

    function updateData(key: UpdateKeys, value: UpdateValues) {
      emit('update', { [key]: value })
    }

    function addContact(item: ContactInput) {
      const contactType = item.contactType || ContactType.QQ
      const contact = item.contact || null
      emit('update', {
        contacts: [...contactItems.value, { contactType, contact }],
      })
      nextTick(() => {
        contactCreateRef.value?.setValue()
        contactCreateRef.value?.inputRef?.reset()
      })
    }

    function updateContact(i: number, item: ContactInput, value: ContactInput) {
      const updatedItem = Object.assign({}, item, value)
      const items = contactItems.value.slice()
      items.splice(i, 1, updatedItem as any)
      emit('update', { contacts: items })
    }

    function deleteContact(i: number) {
      const items = contactItems.value.slice()
      items.splice(i, 1)
      emit('update', { contacts: items })
    }

    return () => (
      <div>
        <div class="pb-2">
          <label class="label label__content">
            {t('companyDetail.label.branchType')}
          </label>
          <div class="flex justify-end items-center">
            <Transition name="fade-transition">
              {isWarehouse.value && (
                <div class="flex items-center pr-1">
                  <Tooltip
                    placement="top-start"
                    distance="2"
                    skidding="-16"
                    origin="24px 100%"
                    maxWidth="180"
                    v-slots={{
                      activator: () => (
                        <Icon class="text-blue-500 align-middle">
                          {ziQuestionSign}
                        </Icon>
                      ),
                    }}
                  >
                    <span
                      v-html={t('companyDetail.hint.branchDeliveryAddress')}
                    />
                  </Tooltip>
                  <div class="pr-4">
                    <img
                      src={
                        require('@zennnn/icons/colorfull/Shield-yellow.svg')
                          .default
                      }
                      aria-hidden="true"
                    />
                  </div>
                </div>
              )}
            </Transition>
            <Select
              modelValue={props.item.branchType}
              items={branchTypeItems.value}
              placeholder={t('placeholder.notChosen')}
              loading={props.loading}
              {...{
                'onUpdate:modelValue': (val: BranchType) =>
                  updateData('branchType', val),
              }}
            />
            <Btn
              icon
              text
              mini
              class="text-gray-200 ml-1"
              onClick={() => emit('delete', props.item.id)}
            >
              <Icon>{ziCloseDelete}</Icon>
            </Btn>
          </div>
        </div>
        <TextField
          modelValue={props.item.name}
          label={t('companyDetail.label.branchName')}
          placeholder={t('companyDetail.placeholder.branchName')}
          loading={props.loading}
          debounce={500}
          rules={[rules.required]}
          stateIcon
          stateErrorColor="none"
          class="pb-2"
          {...{
            'onUpdate:modelValue': (val: string) => updateData('name', val),
          }}
        />
        <TextField
          modelValue={props.item.address}
          label={t('companyDetail.label.branchAddress')}
          placeholder={t('companyDetail.placeholder.address')}
          loading={props.loading}
          debounce={500}
          rules={[rules.required]}
          stateIcon
          stateErrorColor="none"
          class="pb-2"
          {...{
            'onUpdate:modelValue': (val: string) => updateData('address', val),
          }}
        />
        <div class="flex items-end pb-2">
          <TextField
            v-model={firstName.value}
            label={t('companyDetail.label.contactPerson')}
            placeholder={t('companyDetail.placeholder.firstName')}
            loading={props.loading}
            debounce={500}
            rules={[rules.required]}
            stateIcon
            stateErrorColor="none"
            class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
          />
          <TextField
            v-model={lastName.value}
            placeholder={t('companyDetail.placeholder.lastName')}
            loading={props.loading}
            debounce={500}
            rules={[rules.required]}
            stateIcon
            stateErrorColor="none"
            class="flex-grow"
          />
        </div>
        <Phone
          modelValue={props.item.mobilePhone}
          locale={props.locale}
          label={t('companyDetail.label.mobilePhone')}
          loading={props.loading}
          stateIcon
          stateErrorColor="none"
          required
          class="pb-2"
          {...{
            'onUpdate:modelValue': (val: PhoneInput) =>
              updateData('mobilePhone', val),
          }}
        />
        <Phone
          modelValue={props.item.workPhone}
          locale={props.locale}
          label={t('companyDetail.label.phone')}
          loading={props.loading}
          stateIcon
          stateErrorColor="none"
          required
          {...{
            'onUpdate:modelValue': (val: PhoneInput) =>
              updateData('workPhone', val),
          }}
        />
        <div class="flex flex-wrap -mx-5">
          {contactItems.value.map((item, i) => (
            <div class="w-full pt-11 px-5">
              <ContactItem
                loading={props.loading}
                item={item}
                {...{
                  onUpdate: (val: ContactInput) => updateContact(i, item, val),
                  onDelete: () => deleteContact(i),
                }}
              />
            </div>
          ))}
        </div>
        <ContactItem
          ref={contactCreateRef}
          create
          class="pt-11 pr-8"
          {...{ onUpdate: addContact }}
        />
      </div>
    )
  },
})
