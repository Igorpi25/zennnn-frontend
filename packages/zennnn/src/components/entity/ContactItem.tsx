import { defineComponent, ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ziCloseDelete,
  ziQq,
  ziTelegram,
  ziWeChat,
  ziWhatsApp,
  ziMessenger,
  ziKakaoTalk,
  ziViber,
  ziSkype,
  ziEmail,
  ziChecked,
} from '@zennnn/icons'
import { Icon, Select, TextField, Btn } from '@zennnn/core'
import { useRender } from 'shared/composables/render'
import { ContactType } from '@/graphql/types'

import type { PropType } from 'vue'
import type { ContactInput } from '@/graphql/types'

const classNames = (...classes: unknown[]) => classes.filter(Boolean).join(' ')

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ContactInput>,
      default: () => ({}),
    },
    debounce: {
      type: Number,
      default: 500,
    },
    create: Boolean,
    loading: Boolean,
  },

  emits: ['update', 'delete'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const inputRef = ref()
    const selectRef = ref()

    const inputValue = ref<string | null | undefined>(props.item.contact)
    const selectValue = ref<ContactType | null | undefined>(
      props.item.contactType
    )

    const isInputFocused = ref(false)

    const items = [
      {
        text: 'QQ',
        value: ContactType.QQ,
        icon: ziQq,
      },
      {
        text: 'Telegram',
        value: ContactType.TELEGRAM,
        icon: ziTelegram,
      },
      {
        text: 'WeChat',
        value: ContactType.WE_CHAT,
        icon: ziWeChat,
      },
      {
        text: 'WhatsApp',
        value: ContactType.WHATSAPP,
        icon: ziWhatsApp,
      },
      {
        text: 'Messenger',
        value: ContactType.MESSENGER,
        icon: ziMessenger,
      },
      {
        text: 'KakaoTalk',
        value: ContactType.KAKAO_TALK,
        icon: ziKakaoTalk,
      },
      {
        text: 'Viber',
        value: ContactType.VIBER,
        icon: ziViber,
      },
      {
        text: 'Skype',
        value: ContactType.SKYPE,
        icon: ziSkype,
      },
      {
        text: 'Email',
        value: ContactType.EMAIL,
        icon: ziEmail,
      },
    ]

    const dependencies = computed(() => [inputRef.value?.rootElement])

    const selectedItem = computed(() =>
      items.find((item) => item.value === selectValue.value)
    )

    const selectedIcon = computed(() => selectedItem.value?.icon || ziQq)

    const selectedPlaceholder = computed(() => selectedItem.value?.text || 'QQ')

    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      contact: (v: ContactInput) => (v && v.contact) || t('rule.required'),
    })

    watch(
      () => props.item,
      (val) => {
        if (!val) return
        setValue(val)
      }
    )

    function closeMenu() {
      if (selectRef.value?.isMenuActive) {
        selectRef.value.closeMenu()
      }
    }

    function setValue(item?: ContactInput) {
      inputValue.value = item?.contact
      selectValue.value = item?.contactType
    }

    function onFocus() {
      closeMenu()
      isInputFocused.value = true
    }

    function onBlur() {
      isInputFocused.value = false
    }

    function emitChange() {
      if (props.create) return

      const contact = inputValue.value
      const contactType = selectValue.value
      if (
        contactType === props.item.contactType &&
        contact === props.item.contact
      ) {
        return
      }

      emit('update', { contact, contactType } as ContactInput)
    }

    function onContactTypeSelect(type: ContactType) {
      selectValue.value = type
      emitChange()
      if (!props.create) {
        inputRef.value.focus()
      }
    }

    useRender(() => (
      <div class="flex items-center">
        <Select
          ref={selectRef}
          modelValue={selectValue.value}
          items={items}
          controlClass={classNames(
            'pl-2 pr-0 bg-light-gray-400 dark:bg-gray-400',
            selectRef.value?.isMenuActive || 'rounded'
          )}
          dependencies={dependencies.value}
          class="flex-grow"
          inputClass="w-0"
          onSelect={onContactTypeSelect}
          v-slots={{
            prepend: () => (
              <Icon class="text-gray-200 dark:text-gray-100 flex-shrink-0">
                {selectedIcon.value}
              </Icon>
            ),
            appendOuter: () => (
              <TextField
                ref={inputRef}
                v-model={inputValue.value}
                loading={props.loading}
                placeholder={selectedPlaceholder.value}
                rules={[rules.required]}
                debounce={props.debounce}
                stateIcon
                stateErrorColor="none"
                class="w-full flex-grow ml-4"
                controlClass={classNames(
                  'rounded-l-none pl-2',
                  selectRef.value?.isMenuActive && 'rounded-br-none'
                )}
                onFocus={onFocus}
                onBlur={onBlur}
                onInput={emitChange}
                onChange={() => {
                  if (props.create) {
                    emitChange()
                  }
                }}
              />
            ),
            item: ({
              item,
              active,
              selected,
            }: {
              item: typeof items[0]
              active: boolean
              selected: boolean
            }) => (
              <>
                <Icon
                  class={[
                    'mx-2',
                    active ? 'text-white' : 'text-gray-200 dark:text-gray-100',
                  ]}
                >
                  {item.icon}
                </Icon>
                <div
                  class={[
                    'w-8 flex items-center',
                    active ? 'text-white' : 'text-gray-200 dark:text-gray-100',
                  ]}
                >
                  {selected && <Icon>{ziChecked}</Icon>}
                </div>
                <span class={['ml-1', { 'text-white': active }]}>
                  {item.text}
                </span>
              </>
            ),
          }}
        />

        {!props.create && (
          <Btn
            icon
            text
            mini
            class="flex-shrink-0 text-gray-200 ml-1"
            onClick={() => emit('delete')}
          >
            <Icon>{ziCloseDelete}</Icon>
          </Btn>
        )}
      </div>
    ))

    return {
      inputRef,
      setValue,
    }
  },
})
